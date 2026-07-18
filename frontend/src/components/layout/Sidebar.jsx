import { Link } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Brain, Settings } from "lucide-react";

function Sidebar() {
  return (
    <aside
      style={{
        width: "250px",
        background: "#111827",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>🚀 Astra AI</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/chat"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <MessageSquare size={20} />
          Chat
        </Link>

        <Link
          to="/memory"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Brain size={20} />
          Memory
        </Link>

        <Link
          to="/settings"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;