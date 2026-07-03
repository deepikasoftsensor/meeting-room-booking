import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/rooms", label: "Rooms" },
  { path: "/bookings", label: "My Bookings" },
  { path: "/members", label: "Members" },
  { path: "/profile", label: "Profile" },
];

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>

      {/* Sidebar */}
      <div style={{
        width: "256px",
        minWidth: "256px",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 100,
        overflowY: "auto"
      }}>
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}> MeetBook</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            {user?.company?.name || "Company"}
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#2563eb" : "transparent",
                  color: isActive ? "white" : "#cbd5e1",
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px", marginTop: "16px" }}>
          <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "2px" }}>Logged in as</p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>{user?.name}</p>
          <p style={{ fontSize: "12px", color: "#64748b", textTransform: "capitalize", marginBottom: "12px" }}>{user?.role}</p>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "8px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content - offset by sidebar width */}
      <div style={{ marginLeft: "256px", flex: 1, padding: "32px", minHeight: "100vh" }}>
        {children}
      </div>

    </div>
  );
};

export default MainLayout;
