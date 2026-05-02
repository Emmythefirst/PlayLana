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
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      padding: "2.5rem 2rem 3rem",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.45rem",
          color: "#555",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}>
          Choose your character
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.6rem",
          fontWeight: 700,
          color,
        }}>
          Player {playerIndex + 1}
        </div>
      </div>

      {/* Arrow buttons — big, side by side */}
      <div style={{ display: "flex", gap: "2rem", width: "100%" }}>
        {(["left", "right"] as const).map((dir) => (
          <button
            key={dir}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.style.transform = "scale(0.93)";
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = `0 0 24px ${color}55`;
              e.currentTarget.style.borderColor = `${color}88`;
              navigator.vibrate?.(20);
              onMove(dir);
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#1a1a1a";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              onMove("none");
            }}
            onPointerCancel={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "#1a1a1a";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              onMove("none");
            }}
            style={{
              flex: 1,
              height: 140,
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#1a1a1a",
              color: "#fff",
              fontSize: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none",
              userSelect: "none",
              cursor: "pointer",
              transition: "transform 0.08s, background 0.08s, box-shadow 0.08s, border-color 0.08s",
            }}
          >
            {dir === "left" ? "‹" : "›"}
          </button>
        ))}
      </div>

      {/* Confirm button */}
      <button
        onPointerDown={handleConfirm}
        style={{
          width: "100%",
          padding: "1.4rem",
          borderRadius: 20,
          border: confirmed ? "2px solid #22c55e" : `2px solid ${color}`,
          background: confirmed ? "rgba(34,197,94,0.15)" : `${color}22`,
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