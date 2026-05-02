import { useState } from "react";
import type { Direction } from "@/types/messages";

interface Props {
  playerIndex: number;
  onMove: (dir: Direction) => void;
  onConfirm: () => void;
}

export function CharacterSelectController({ playerIndex, onMove, onConfirm }: Props) {
  const colors = ["#3b82f6", "#f59e0b", "#22c55e", "#a855f7"];
  const color = colors[playerIndex] ?? "#3b82f6";
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) return;
    setConfirmed(true);
    navigator.vibrate?.(60);
    onConfirm();
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: "2rem 1.25rem 2.5rem",
      gap: "1.5rem",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.45rem",
          color: "#555",
          letterSpacing: "0.12em",
          marginBottom: "0.5rem",
        }}>
          CHOOSE YOUR CHARACTER
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.6rem",
          color,
        }}>
          Player {playerIndex + 1}
        </div>
      </div>

      {/* Arrow buttons - take most of the space */}
      <div style={{ flex: 1, display: "flex", gap: "1rem", alignItems: "stretch" }}>
        {(["left", "right"] as const).map((dir) => (
          <button
            key={dir}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.style.background = "#252525";
              e.currentTarget.style.transform = "scale(0.96)";
              navigator.vibrate?.(18);
              onMove(dir);
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.background = "#141414";
              e.currentTarget.style.transform = "scale(1)";
              onMove("none");
            }}
            onPointerCancel={(e) => {
              e.currentTarget.style.background = "#141414";
              e.currentTarget.style.transform = "scale(1)";
              onMove("none");
            }}
            style={{
              flex: 1,
              borderRadius: 20,
              border: "2px solid #2a2a2a",
              background: "#141414",
              color: "#888",
              fontSize: "2.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none",
              userSelect: "none",
              cursor: "pointer",
              transition: "background 0.07s, transform 0.07s",
            }}
          >
            {dir === "left" ? "‹" : "›"}
          </button>
        ))}
      </div>

      {/* Confirm */}
      <button
        onPointerDown={handleConfirm}
        style={{
          width: "100%",
          padding: "1.4rem",
          borderRadius: 16,
          border: confirmed ? "2px solid #22c55e" : `2px solid ${color}55`,
          background: confirmed ? "rgba(34,197,94,0.15)" : `${color}18`,
          color: confirmed ? "#22c55e" : color,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          cursor: confirmed ? "default" : "pointer",
          touchAction: "none",
          transition: "all 0.15s",
        }}
      >
        {confirmed ? "✓ CONFIRMED" : "CONFIRM"}
      </button>
    </div>
  );
}