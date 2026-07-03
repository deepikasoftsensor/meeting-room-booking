import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getBookings, createBooking, cancelBooking } from "../../services/bookingService";
import { getRooms } from "../../services/roomService";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MyBookings = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState("list"); // "list" or "calendar"
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm] = useState({ roomId: "", date: "", startTime: "", endTime: "", purpose: "" });

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("booking:create", () => fetchData());
    socket.on("booking:cancel", () => fetchData());
    return () => { socket.off("booking:create"); socket.off("booking:cancel"); };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [bookingsRes, roomsRes] = await Promise.all([getBookings(), getRooms()]);
      setBookings(bookingsRes.bookings);
      setRooms(roomsRes.rooms);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.startTime >= form.endTime) {
      toast.error("End time must be after start time");
      return;
    }
    try {
      setSubmitting(true);
      await createBooking(form);
      toast.success("Room booked successfully!");
      setShowModal(false);
      setForm({ roomId: "", date: "", startTime: "", endTime: "", purpose: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed"); }
    finally { setSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try { await cancelBooking(id); toast.success("Booking cancelled"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  // Calendar logic
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

  const getBookingsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => b.date === dateStr && b.status === "confirmed");
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <MainLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#1e293b" }}>My Bookings</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            {confirmedBookings.length} confirmed · {cancelledBookings.length} cancelled
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* View Toggle */}
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "3px" }}>
            <button
              onClick={() => setView("list")}
              style={{ padding: "7px 16px", borderRadius: "6px", border: "none", fontWeight: "600", fontSize: "13px", cursor: "pointer", background: view === "list" ? "white" : "transparent", color: view === "list" ? "#1e293b" : "#64748b", boxShadow: view === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              📋 List
            </button>
            <button
              onClick={() => setView("calendar")}
              style={{ padding: "7px 16px", borderRadius: "6px", border: "none", fontWeight: "600", fontSize: "13px", cursor: "pointer", background: view === "calendar" ? "white" : "transparent", color: view === "calendar" ? "#1e293b" : "#64748b", boxShadow: view === "calendar" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              📅 Calendar
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
          >
            + Book a Room
          </button>
        </div>
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
        <>
          {/* LIST VIEW */}
          {view === "list" && (
            bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", background: "white", borderRadius: "12px" }}>
                <p style={{ fontSize: "48px" }}>📅</p>
                <p style={{ fontSize: "18px", fontWeight: "600", marginTop: "12px" }}>No bookings yet</p>
                <p style={{ fontSize: "14px", marginTop: "4px" }}>Click "Book a Room" to get started</p>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Room", "Date", "Time", "Purpose", "Status", "Action"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => {
                      const isPast = new Date(`${b.date}T${b.endTime}`) < new Date();
                      return (
                        <tr key={b._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{b.roomId?.name}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#475569" }}>{b.date}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#475569" }}>{b.startTime} - {b.endTime}</td>
                          <td style={{ padding: "14px 16px", fontSize: "14px", color: "#475569" }}>{b.purpose}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600",
                              background: b.status === "confirmed" ? "#dcfce7" : "#fee2e2",
                              color: b.status === "confirmed" ? "#15803d" : "#dc2626"
                            }}>{b.status}</span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {b.status === "confirmed" && !isPast && (
                              <button
                                onClick={() => handleCancel(b._id)}
                                style={{ color: "#ef4444", background: "none", border: "1px solid #ef4444", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                            )}
                            {isPast && <span style={{ fontSize: "12px", color: "#94a3b8" }}>Past</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* CALENDAR VIEW */}
          {view === "calendar" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>
              {/* Calendar */}
              <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                {/* Month nav */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <button onClick={prevMonth} style={{ background: "#f1f5f9", border: "none", width: "36px", height: "36px", borderRadius: "8px", cursor: "pointer", fontSize: "18px" }}>‹</button>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b" }}>{MONTHS[month]} {year}</h2>
                  <button onClick={nextMonth} style={{ background: "#f1f5f9", border: "none", width: "36px", height: "36px", borderRadius: "8px", cursor: "pointer", fontSize: "18px" }}>›</button>
                </div>
                {/* Day headers */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
                  {DAYS.map((d) => (
                    <div key={d} style={{ textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#94a3b8", padding: "6px 0" }}>{d}</div>
                  ))}
                </div>
                {/* Calendar cells */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const dayBookings = getBookingsForDay(day);
                    const isToday = dateStr === todayStr;
                    const isSelected = selectedDay === day;
                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        style={{
                          padding: "8px 4px", borderRadius: "8px", cursor: "pointer", textAlign: "center", minHeight: "52px",
                          background: isSelected ? "#2563eb" : isToday ? "#eff6ff" : "transparent",
                          border: isToday ? "1px solid #bfdbfe" : "1px solid transparent",
                          transition: "background 0.15s"
                        }}
                      >
                        <p style={{ fontSize: "13px", fontWeight: isToday ? "700" : "500", color: isSelected ? "white" : isToday ? "#2563eb" : "#374151" }}>{day}</p>
                        {dayBookings.length > 0 && (
                          <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                            {dayBookings.slice(0, 2).map((b) => (
                              <div key={b._id} style={{ fontSize: "10px", background: isSelected ? "rgba(255,255,255,0.3)" : "#dbeafe", color: isSelected ? "white" : "#1d4ed8", borderRadius: "3px", padding: "1px 4px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                {b.roomId?.name}
                              </div>
                            ))}
                            {dayBookings.length > 2 && (
                              <p style={{ fontSize: "10px", color: isSelected ? "white" : "#64748b" }}>+{dayBookings.length - 2} more</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected day bookings panel */}
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1e293b", marginBottom: "16px" }}>
                  {selectedDay
                    ? `${MONTHS[month]} ${selectedDay}, ${year}`
                    : "Select a day"}
                </h3>
                {!selectedDay ? (
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>Click on a day to see bookings</p>
                ) : getBookingsForDay(selectedDay).length === 0 ? (
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>No bookings on this day</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {getBookingsForDay(selectedDay).map((b) => (
                      <div key={b._id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", borderLeft: "4px solid #2563eb" }}>
                        <p style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>{b.roomId?.name}</p>
                        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>⏰ {b.startTime} - {b.endTime}</p>
                        <p style={{ fontSize: "13px", color: "#64748b" }}>📋 {b.purpose}</p>
                        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>by {b.bookedBy?.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(selectedDay || today.getDate()).padStart(2,"0")}`;
                    setForm({ roomId: "", date: dateStr, startTime: "", endTime: "", purpose: "" });
                    setShowModal(true);
                  }}
                  style={{ width: "100%", marginTop: "16px", background: "#2563eb", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
                >
                  + Book this day
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Book Room Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "32px", width: "460px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "24px" }}>Book a Room</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Select Room</label>
                <select value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "white", boxSizing: "border-box" }}>
                  <option value="">Choose a room...</option>
                  {rooms.filter((r) => r.isAvailable).map((r) => (
                    <option key={r._id} value={r._id}>{r.name} — {r.location} (Cap: {r.capacity})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required min={todayStr} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Purpose</label>
                <input type="text" placeholder="e.g. Team standup, Client meeting" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", cursor: "pointer", background: "white" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "11px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>{submitting ? "Booking..." : "Book Room"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
export default MyBookings;
