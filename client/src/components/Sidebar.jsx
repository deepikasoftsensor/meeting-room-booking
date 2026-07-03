import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "🏠 Dashboard" },
    { to: "/rooms", label: "🚪 Rooms" },
    { to: "/bookings", label: "📅 My Bookings" },
    { to: "/members", label: "👥 Members" },
    { to: "/profile", label: "👤 Profile" },
  ];

  return (
    <div style={{
      width: "256px",
      minWidth: "256px",
      backgroundColor: "#0f172a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      minHeight: "100vh"
    }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "32px" }}>📅 MeetBook</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
              color: isActive ? "white" : "#cbd5e1",
              backgroundColor: isActive ? "#2563eb" : "transparent",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
        <p style={{ fontSize: "12px", color: "white", fontWeight: "600" }}>{user?.name}</p>
        <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px", textTransform: "capitalize" }}>{user?.role}</p>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            padding: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
