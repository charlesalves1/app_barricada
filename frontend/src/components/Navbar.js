import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "70px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 9999,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color:
            location.pathname === "/"
              ? "#1976d2"
              : "#666",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "24px" }}>
          🗺️
        </div>

        <div>Mapa</div>
      </Link>

      <Link
        to="/admin"
        style={{
          textDecoration: "none",
          color:
            location.pathname ===
            "/admin"
              ? "#1976d2"
              : "#666",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "24px" }}>
          ⚙️
        </div>

        <div>Admin</div>
      </Link>
    </div>
  );
}

export default Navbar;