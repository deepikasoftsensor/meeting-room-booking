import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getBookings } from "../../services/bookingService";
import { getRooms } from "../../services/roomService";
import { getMembers } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("booking:create", () => loadData());
    socket.on("booking:cancel", () => loadData());
    socket.on("room:create", () => loadData());
    socket.on("room:delete", () => loadData());
    return () => {
      socket.off("booking:create");
      socket.off("booking:cancel");
      socket.off("room:create");
      socket.off("room:delete");
    };
  }, [socket]);

  const loadData = async () => {
    try {
      const [roomsRes, bookingsRes, membersRes] = await Promise.all([
        getRooms(),
        getBookings(),
        getMembers(),
      ]);
      setRooms(roomsRes.rooms || []);
      setBookings(bookingsRes.bookings || []);
      setMembers(membersRes.members || []);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const todayBookings = confirmedBookings.filter((b) => b.date === today);
  const availableRooms = rooms.filter((r) => r.isAvailable);

  const statCards = [
    { label: "Total Rooms", value: rooms.length, icon: "🚪", bg: "#dbeafe", color: "#1d4ed8" },
    { label: "Available Rooms", value: availableRooms.length, icon: "✅", bg: "#dcfce7", color: "#15803d" },
    { label: "Total Bookings", value: confirmedBookings.length, icon: "📅", bg: "#fef9c3", color: "#854d0e" },
    { label: "Today's Meetings", value: todayBookings.length, icon: "⏰", bg: "#fae8ff", color: "#7e22ce" },
    { label: "Team Members", value: members.length, icon: "👥", bg: "#ffedd5", color: "#c2410c" },
  ];

  const recentBookings = [...bookings].slice(0, 6);

  return (
    <MainLayout>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b" }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>
          {user?.company?.name} &bull; {user?.role}
        </p>
        {user?.role === "admin" && user?.company?.inviteCode && (
          <div style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid #86efac", padding: "6px 12px", borderRadius: "8px" }}>
            <span style={{ fontSize: "13px", color: "#15803d" }}>Invite Code:</span>
            <span style={{ fontWeight: "bold", letterSpacing: "2px", color: "#15803d" }}>{user.company.inviteCode}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(user.company.inviteCode); toast.success("Copied!"); }}
              style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading dashboard...</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
            {statCards.map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <div style={{ width: "44px", height: "44px", background: card.bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "12px" }}>
                  {card.icon}
                </div>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: card.color }}>{card.value}</p>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", marginBottom: "16px" }}>
              Recent Bookings
            </h2>
            {recentBookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                <p style={{ fontSize: "40px" }}>📅</p>
                <p style={{ fontSize: "16px", fontWeight: "600", marginTop: "8px" }}>No bookings yet</p>
                <p style={{ fontSize: "13px", marginTop: "4px" }}>Go to My Bookings to book a room</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    {["Room", "Booked By", "Date", "Time", "Purpose", "Status"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{b.roomId?.name}</td>
                      <td style={{ padding: "12px", fontSize: "14px", color: "#475569" }}>{b.bookedBy?.name}</td>
                      <td style={{ padding: "12px", fontSize: "14px", color: "#475569" }}>{b.date}</td>
                      <td style={{ padding: "12px", fontSize: "14px", color: "#475569" }}>{b.startTime} - {b.endTime}</td>
                      <td style={{ padding: "12px", fontSize: "14px", color: "#475569" }}>{b.purpose}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                          background: b.status === "confirmed" ? "#dcfce7" : "#fee2e2",
                          color: b.status === "confirmed" ? "#15803d" : "#dc2626"
                        }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Today's Meetings */}
          {todayBookings.length > 0 && (
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginTop: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b", marginBottom: "16px" }}>
                📅 Today's Meetings
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {todayBookings.map((b) => (
                  <div key={b._id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", borderLeft: "4px solid #2563eb" }}>
                    <p style={{ fontWeight: "bold", fontSize: "15px" }}>{b.roomId?.name}</p>
                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{b.startTime} - {b.endTime}</p>
                    <p style={{ fontSize: "13px", color: "#64748b" }}>{b.purpose}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>by {b.bookedBy?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
