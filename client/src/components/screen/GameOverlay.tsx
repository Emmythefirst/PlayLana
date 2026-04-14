import type { HostState } from "@/types/messages";

interface Props {
  state: HostState;
}

export function GameOverlay({ state }: Props) {
  const { scores, timer, round, players } = state;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.25rem 1.5rem",
      }}
    >
      {/* Top bar: scores + timer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <ScoreCard playerIndex={0} score={scores[0]} name={players[0].joined ? "P1" : "—"} />

        {/* Timer — centre */}
        <div
          style={{
            minWidth: 80,
            textAlign: "center",
            padding: "0.4rem 1.1rem",
            borderRadius: 10,
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
          }}
        >
          {round === "active" && timer !== null ? (
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "1.1rem",
                color: timer <= 10 ? "#ef4444" : "#fff",
              }}
            >
              {timer}
            </span>
          ) : (
            <span style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "0.08em" }}>
              {round === "waiting" ? "WAITING" : "OVER"}
            </span>
          )}
        </div>

        <ScoreCard playerIndex={1} score={scores[1]} name={players[1].joined ? "P2" : "—"} />
      </div>

      {/* Round state banner — bottom */}
      {round === "waiting" && (
        <div style={bannerStyle("#3b82f6")}>GET READY…</div>
      )}
    </div>
  );
}

function ScoreCard({ playerIndex, score, name }: { playerIndex: number; score: number; name: string }) {
  const colors = ["#3b82f6", "#f59e0b"];
  const color = colors[playerIndex];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.45rem 1rem",
        borderRadius: 12,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${color}44`,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#bbb" }}>{name}</span>
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "1rem",
          color: "#fff",
          minWidth: 24,
          textAlign: "right",
        }}
      >
        {score}
      </span>
    </div>
  );
}

const bannerStyle = (color: string): React.CSSProperties => ({
  alignSelf: "center",
  padding: "0.6rem 2rem",
  borderRadius: 12,
  background: `${color}22`,
  border: `1px solid ${color}55`,
  backdropFilter: "blur(6px)",
  fontFamily: "var(--font-pixel)",
  fontSize: "0.75rem",
  color,
  letterSpacing: "0.1em",
});