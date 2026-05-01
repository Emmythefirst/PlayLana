interface Props {
  playerIndex: number;
  onReady: () => void;
  isReady: boolean;
}

const PLAYER_COLORS = ["#3b82f6", "#f59e0b"];
const PLAYER_LABELS = ["P1", "P2"];

export function LobbyController({ playerIndex, onReady, isReady }: Props) {
  const color = PLAYER_COLORS[playerIndex] ?? "#3b82f6";
  const label = PLAYER_LABELS[playerIndex] ?? `P${playerIndex + 1}`;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      padding: "3rem 1.5rem 3rem",
    }}>

      {/* Player label */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "0.75rem",
          color: "#555",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}>
          You are
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#aaa" }}>
          Player {playerIndex + 1}
        </div>
      </div>

      {/* Big glowing player number — Option D */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        {/* Outer glow ring */}
        <div style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: `${color}18`,
          border: `2px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 40px ${color}33, 0 0 80px ${color}18`,
          animation: "pulse 2.5s ease-in-out infinite",
        }}>
          {/* Inner circle */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `${color}22`,
            border: `2px solid ${color}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 20px ${color}44`,
          }}>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "2rem",
              color,
              lineHeight: 1,
            }}>
              {label}
            </span>
          </div>
        </div>

        {/* Status text */}
        <div style={{
          fontSize: "0.75rem",
          color: "#444",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textAlign: "center",
        }}>
          {isReady ? "Waiting for other player..." : "Tap ready when set"}
        </div>
      </div>

      {/* Ready button */}
      <button
        onPointerDown={isReady ? undefined : onReady}
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "1.25rem",
          borderRadius: 16,
          border: isReady ? "2px solid #22c55e" : `2px solid ${color}`,
          background: isReady ? "rgba(34,197,94,0.15)" : `${color}22`,
          color: isReady ? "#22c55e" : color,
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

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}