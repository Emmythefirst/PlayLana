interface Props {
  onTap: () => void;
  label?: string;
  sublabel?: string;
}

export function TapController({ onTap, label = "TAP", sublabel = "Tap as fast as you can!" }: Props) {
  return (
    <div style={{ height: "100%", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <button
        onPointerDown={(e) => {
          e.currentTarget.style.background = "rgba(59,130,246,0.25)";
          e.currentTarget.style.transform = "scale(0.97)";
          onTap();
        }}
        onPointerUp={(e) => {
          e.currentTarget.style.background = "rgba(59,130,246,0.08)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onPointerCancel={(e) => {
          e.currentTarget.style.background = "rgba(59,130,246,0.08)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 24,
          border: "2px solid rgba(59,130,246,0.3)",
          background: "rgba(59,130,246,0.08)",
          color: "#3b82f6",
          fontSize: "2.5rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          cursor: "pointer",
          transition: "background 0.06s, transform 0.06s",
        }}
      >
        <span style={{ fontSize: "3rem" }}>👆</span>
        <span>{label}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#666", letterSpacing: "0.04em" }}>
          {sublabel}
        </span>
      </button>
    </div>
  );
}