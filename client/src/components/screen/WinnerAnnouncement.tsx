import { useEffect, useState } from "react";

interface Props {
  winner: number; // 0 or 1
  scores: [number, number];
  onDismiss?: () => void;
}

export function WinnerAnnouncement({ winner, scores, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount with slight delay so transition plays
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const playerColors = ["#3b82f6", "#f59e0b"];
  const color = playerColors[winner];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "3rem 4rem",
          borderRadius: 24,
          background: "rgba(20,20,20,0.9)",
          border: `1px solid ${color}44`,
          transform: visible ? "scale(1)" : "scale(0.88)",
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          maxWidth: 480,
          width: "90%",
        }}
      >
        {/* Trophy */}
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏆</div>

        {/* Winner label */}
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.7rem",
            color: "#666",
            letterSpacing: "0.12em",
            marginBottom: "0.75rem",
          }}
        >
          WINNER
        </div>

        <div
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 700,
            color,
            marginBottom: "0.5rem",
          }}
        >
          Player {winner + 1}
        </div>

        {/* Score summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            margin: "1.5rem 0",
            padding: "1rem",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {scores.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#555",
                  letterSpacing: "0.08em",
                  marginBottom: "0.4rem",
                }}
              >
                P{i + 1}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "1.5rem",
                  color: i === winner ? color : "#444",
                }}
              >
                {s}
              </div>
            </div>
          ))}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              marginTop: "0.5rem",
              padding: "0.7rem 2.5rem",
              borderRadius: 10,
              border: `1px solid ${color}44`,
              background: `${color}18`,
              color,
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}