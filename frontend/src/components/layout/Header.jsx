function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "#1F2937",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        borderBottom: "1px solid #374151",
      }}
    >
      <h2>Astra AI</h2>

      <div>
        <span>🟢 Online</span>
      </div>
    </header>
  );
}

export default Header;