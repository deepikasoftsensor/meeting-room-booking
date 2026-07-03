import { useAuth } from "../context/AuthContext";

const RoomCard = ({ room, onEdit, onDelete, onToggle, onBook }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top color strip */}
      <div style={{
        height: "6px",
        background: room.isAvailable ? "#22c55e" : "#ef4444"
      }} />

      <div style={{ padding: "18px", flex: 1 }}>
        {/* Title + Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
            {room.name}
          </h3>
          <span style={{
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "700",
            background: room.isAvailable ? "#dcfce7" : "#fee2e2",
            color: room.isAvailable ? "#15803d" : "#dc2626",
            whiteSpace: "nowrap"
          }}>
            {room.isAvailable ? "✅ Available" : "❌ Unavailable"}
          </span>
        </div>

        {/* Info */}
        <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0" }}>
          📍 {room.location}
        </p>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0" }}>
          👥 Capacity: {room.capacity} people
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
          {/* Book button for members */}
          {!isAdmin && room.isAvailable && onBook && (
            <button
              onClick={() => onBook(room)}
              style={{
                flex: 1,
                padding: "8px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Book Now
            </button>
          )}

          {/* Admin buttons */}
          {isAdmin && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(room)}
                  style={{
                    flex: 1,
                    padding: "7px",
                    border: "1px solid #3b82f6",
                    color: "#3b82f6",
                    background: "white",
                    borderRadius: "7px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>
              )}
              {onToggle && (
                <button
                  onClick={() => onToggle(room)}
                  style={{
                    flex: 1,
                    padding: "7px",
                    border: "1px solid #f59e0b",
                    color: "#d97706",
                    background: "white",
                    borderRadius: "7px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {room.isAvailable ? "Disable" : "Enable"}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(room._id)}
                  style={{
                    flex: 1,
                    padding: "7px",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    background: "white",
                    borderRadius: "7px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
