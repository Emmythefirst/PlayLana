import { useState } from "react";
import type { Direction } from "@/types/messages";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];

interface Props {
  playerIndex: number;
  onMove: (dir: Direction) => void;
  onReady: () => void;
  isReady: boolean;
}

export function LobbyController({ playerIndex, onMove, onReady, isReady }: Props) {
  const [colorIndex, setColorIndex] = useState(playerIndex);

  const handleLeft = () => {
    setColorIndex((i) => (i - 1 + COLORS.length) % COLORS.length);
    onMove("left");
  };

  const handleRight = () => {
    setColorIndex((i) => (i + 1) % COLORS.length);
    onMove("right");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "2rem 1.5rem 3rem" }}>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          You are
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
          Player {playerIndex + 1}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Choose your color
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <ArrowButton dir="left" onPress={handleLeft} />
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS[colorIndex], boxShadow: `0 0 24px ${COLORS[colorIndex]}66`, transition: "all 0.2s" }} />
          <ArrowButton dir="right" onPress={handleRight} />
        </div>
      </div>

      <button
        onPointerDown={isReady ? undefined : onReady}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "1.25rem",
          borderRadius: 16,
          border: isReady ? "2px solid #22c55e" : "2px solid var(--blue)",
          background: isReady ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
          color: isReady ? "#22c55e" : "#3b82f6",
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          cursor: isReady ? "default" : "pointer",
          transition: "all 0.2s",
          touchAction: "none",
        }}
      >
        {isReady ? "✓  READY" : "READY UP"}
      </button>
    </div>
  );
}

function ArrowButton({ dir, onPress }: { dir: "left" | "right"; onPress: () => void }) {
  return (
    <button
      onPointerDown={onPress}
      style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        color: "#fff",
        fontSize: "1.4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {dir === "left" ? "←" : "→"}
    </button>
  );
}