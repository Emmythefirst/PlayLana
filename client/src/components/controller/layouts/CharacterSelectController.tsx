import type { Direction } from "@/types/messages";

interface Props {
  playerIndex: number;
  onMove: (dir: Direction) => void;
  onConfirm: () => void;
}

export function CharacterSelectController({ playerIndex, onMove, onConfirm }: Props) {
  const colors = ["#3b82f6", "#f59e0b"];
  const color = colors[playerIndex] ?? "#3b82f6";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      padding: "2rem 1.5rem 3rem",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Choose your character
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color }}>
          Player {playerIndex + 1}
        </div>
      </div>

      {/* Left / Right arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <button
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            e.currentTarget.style.background = "#333";
            onMove("left");
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.background = "#1e1e1e";
            onMove("none");
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.background = "#1e1e1e";
            onMove("none");
          }}
          style={arrowBtn}
        >
          ←
        </button>

        {/* Character preview indicator */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 16,
          background: `${color}22`,
          border: `2px solid ${color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
        }}>
          🎮
        </div>

        <button
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            e.currentTarget.style.background = "#333";
            onMove("right");
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.background = "#1e1e1e";
            onMove("none");
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.background = "#1e1e1e";
            onMove("none");
          }}
          style={arrowBtn}
        >
          →
        </button>
      </div>

      {/* Confirm button */}
      <button
        onPointerDown={onConfirm}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "1.25rem",
          borderRadius: 16,
          border: `2px solid ${color}`,
          background: `${color}22`,
          color,
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          cursor: "pointer",
          touchAction: "none",
          transition: "all 0.15s",
        }}
        onPointerEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${color}44`;
        }}
        onPointerLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${color}22`;
        }}
      >
        CONFIRM
      </button>
    </div>
  );
}

const arrowBtn: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#1e1e1e",
  color: "#fff",
  fontSize: "1.8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  touchAction: "none",
  userSelect: "none",
  cursor: "pointer",
  transition: "background 0.08s",
};