import { useAuth } from "../context/AuthContext";

const BookingCard = ({ booking, onCancel }) => {
  const { user } = useAuth();

  const isPast = new Date(`${booking.date}T${booking.endTime}`) < new Date();
  const isConfirmed = booking.status === "confirmed";
  const canCancel = isConfirmed && !isPast && (
    booking.bookedBy?._id === user?.id || user?.role === "admin"
  );

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Left color border */}
      <div style={{
        height: "5px",
        background: isConfirmed
          ? isPast ? "#94a3b8" : "#22c55e"
          : "#ef4444"
      }} />

      <div style={{ padding: "16px" }}>
        {/* Room name + Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
            🚪 {booking.roomId?.name}
          </h3>
          <span style={{
            padding: "3px 10px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "700",
            background: isConfirmed
              ? isPast ? "#f1f5f9" : "#dcfce7"
              : "#fee2e2",
            color: isConfirmed
              ? isPast ? "#64748b" : "#15803d"
              : "#dc2626"
          }}>
            {isConfirmed ? (isPast ? "Completed" : "Confirmed") : "Cancelled"}
          </span>
        </div>

        {/* Details */}
        <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>
          📅 {booking.date}
        </p>
        <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>
          ⏰ {booking.startTime} - {booking.endTime}
        </p>
        <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>
          📋 {booking.purpose}
        </p>
        {booking.roomId?.location && (
          <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>
            📍 {booking.roomId.location}
          </p>
        )}
        {user?.role === "admin" && booking.bookedBy?.name && (
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
            👤 Booked by {booking.bookedBy.name}
          </p>
        )}

        {/* Cancel Button */}
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "8px",
              border: "1px solid #ef4444",
              color: "#ef4444",
              background: "white",
              borderRadius: "7px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Cancel Booking
          </button>
        )}

        {isPast && isConfirmed && (
          <p style={{ marginTop: "10px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
            This booking has passed
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
