import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  onJump: () => void;
}

const btnBase: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#1e1e1e",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  cursor: "pointer",
  fontSize: "2rem",
  fontWeight: 700,
  transition: "background 0.08s, transform 0.08s",
};

export function HeadSmashController({ onMove, onJump }: Props) {
  const release = () => onMove("none");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        height: "100%",
        padding: "2rem 1.5rem 3rem",
        justifyContent: "flex-end",
      }}
    >
      {/* Jump button — big, prominent, at top of controls area */}
      <button
        onPointerDown={(e) => {
          e.currentTarget.style.background = "rgba(59,130,246,0.4)";
          e.currentTarget.style.transform = "scale(0.96)";
          onJump();
        }}
        onPointerUp={(e) => {
          e.currentTarget.style.background = "rgba(59,130,246,0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onPointerCancel={(e) => {
          e.currentTarget.style.background = "rgba(59,130,246,0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        style={{
          ...btnBase,
          height: 100,
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          background: "rgba(59,130,246,0.15)",
          border: "1px solid var(--blue-border)",
          color: "#3b82f6",
        }}
      >
        JUMP
      </button>

      {/* Left / Right */}
      <div style={{ display: "flex", gap: "1rem", height: 110 }}>
        {(["left", "right"] as const).map((dir) => (
          <button
            key={dir}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.style.background = "#333";
              onMove(dir);
            }}
            onPointerUp={(e) => { e.currentTarget.style.background = "#1e1e1e"; release(); }}
            onPointerCancel={(e) => { e.currentTarget.style.background = "#1e1e1e"; release(); }}
            style={{ ...btnBase, flex: 1 }}
          >
            {dir === "left" ? "←" : "→"}
          </button>
        ))}
      </div>
    </div>
  );
}