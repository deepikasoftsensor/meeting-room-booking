import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const Rooms = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const isAdmin = user?.role === "admin";

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ name: "", capacity: "", location: "" });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCapacity, setFilterCapacity] = useState("all");

  useEffect(() => { fetchRooms(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("room:create", ({ room }) => setRooms((prev) => [room, ...prev]));
    socket.on("room:update", ({ room }) => setRooms((prev) => prev.map((r) => r._id === room._id ? room : r)));
    socket.on("room:delete", ({ roomId }) => setRooms((prev) => prev.filter((r) => r._id !== roomId)));
    return () => { socket.off("room:create"); socket.off("room:update"); socket.off("room:delete"); };
  }, [socket]);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.rooms);
    } catch { toast.error("Failed to fetch rooms"); }
    finally { setLoading(false); }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch =
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "available" && room.isAvailable) ||
        (filterStatus === "unavailable" && !room.isAvailable);
      const matchCapacity =
        filterCapacity === "all" ||
        (filterCapacity === "small" && room.capacity <= 5) ||
        (filterCapacity === "medium" && room.capacity > 5 && room.capacity <= 15) ||
        (filterCapacity === "large" && room.capacity > 15);
      return matchSearch && matchStatus && matchCapacity;
    });
  }, [rooms, search, filterStatus, filterCapacity]);

  const openCreate = () => { setEditRoom(null); setForm({ name: "", capacity: "", location: "" }); setShowModal(true); };
  const openEdit = (room) => { setEditRoom(room); setForm({ name: room.name, capacity: room.capacity, location: room.location }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editRoom) { await updateRoom(editRoom._id, form); toast.success("Room updated"); }
      else { await createRoom(form); toast.success("Room created"); }
      setShowModal(false);
      fetchRooms();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    try { await deleteRoom(id); toast.success("Room deleted"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleToggle = async (room) => {
    try { await updateRoom(room._id, { isAvailable: !room.isAvailable }); toast.success("Updated"); }
    catch { toast.error("Failed"); }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#1e293b" }}>Meeting Rooms</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            {filteredRooms.length} of {rooms.length} rooms shown
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
            + Add Room
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div style={{ background: "white", borderRadius: "12px", padding: "16px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="🔍 Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "200px", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none" }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "white", cursor: "pointer" }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <select
          value={filterCapacity}
          onChange={(e) => setFilterCapacity(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "white", cursor: "pointer" }}
        >
          <option value="all">All Capacities</option>
          <option value="small">Small (1-5)</option>
          <option value="medium">Medium (6-15)</option>
          <option value="large">Large (16+)</option>
        </select>
        {(search || filterStatus !== "all" || filterCapacity !== "all") && (
          <button
            onClick={() => { setSearch(""); setFilterStatus("all"); setFilterCapacity("all"); }}
            style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "#f8fafc", cursor: "pointer", color: "#64748b" }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <p style={{ color: "#64748b" }}>Loading rooms...</p>
      ) : filteredRooms.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <p style={{ fontSize: "48px" }}>🚪</p>
          <p style={{ fontSize: "18px", fontWeight: "600", marginTop: "12px" }}>No rooms found</p>
          <p style={{ fontSize: "14px", marginTop: "4px" }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {filteredRooms.map((room) => (
            <div key={room._id} style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div style={{ height: "6px", background: room.isAvailable ? "#22c55e" : "#ef4444" }} />
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1e293b" }}>{room.name}</h3>
                  <span style={{
                    padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700",
                    background: room.isAvailable ? "#dcfce7" : "#fee2e2",
                    color: room.isAvailable ? "#15803d" : "#dc2626"
                  }}>
                    {room.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>📍 {room.location}</p>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>👥 Capacity: {room.capacity}</p>
                {isAdmin && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openEdit(room)} style={{ flex: 1, padding: "7px", border: "1px solid #3b82f6", color: "#3b82f6", background: "white", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleToggle(room)} style={{ flex: 1, padding: "7px", border: "1px solid #f59e0b", color: "#d97706", background: "white", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>{room.isAvailable ? "Disable" : "Enable"}</button>
                    <button onClick={() => handleDelete(room._id)} style={{ flex: 1, padding: "7px", border: "1px solid #ef4444", color: "#ef4444", background: "white", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "32px", width: "440px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "24px" }}>{editRoom ? "Edit Room" : "Create Room"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Room Name</label>
                <input type="text" placeholder="e.g. Conference Room A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Capacity</label>
                <input type="number" placeholder="e.g. 10" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required min="1" style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>Location</label>
                <input type="text" placeholder="e.g. Floor 2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", cursor: "pointer", background: "white" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "11px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>{submitting ? "Saving..." : editRoom ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
export default Rooms;
