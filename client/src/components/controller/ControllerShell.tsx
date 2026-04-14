import type { ControllerState, Direction, GameName } from "@/types/messages";
import { LobbyController } from "./layouts/LobbyController";
import { DpadController } from "./layouts/DpadController";
import { HeadSmashController } from "./layouts/HeadSmashController";
import { TapController } from "./layouts/TapController";

interface Props {
  state: ControllerState;
  onMove: (dir: Direction) => void;
  onJump: () => void;
  onTap: () => void;
  onReady: () => void;
  isReady: boolean;
}

export function ControllerShell({ state, onMove, onJump, onTap, onReady, isReady }: Props) {
  const { playerIndex, currentGame, scores, timer, round, alive, winner } = state;
  const myIndex = playerIndex ?? 0;

  return (
    <div className="controller-root" style={{ background: "var(--bg)" }}>

      {/* Header: player info + score */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PlayerDot index={myIndex} />
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            P{myIndex + 1}
          </span>
          {alive[myIndex] === false && (
            <span style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 600 }}>DEAD</span>
          )}
        </div>

        {/* Score */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Score value={scores[0]} active={myIndex === 0} />
          <span style={{ color: "#444", fontSize: "0.8rem" }}>vs</span>
          <Score value={scores[1]} active={myIndex === 1} />
        </div>

        {/* Timer */}
        {timer !== null && (
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: timer <= 10 ? "#ef4444" : "#fff", minWidth: 28, textAlign: "right" }}>
            {timer}s
          </div>
        )}
      </div>

      {/* Game over banner */}
      {round === "over" && winner !== null && (
        <div style={{ padding: "0.75rem", textAlign: "center", background: winner === myIndex ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: winner === myIndex ? "#22c55e" : "#ef4444" }}>
            {winner === myIndex ? "🏆 You won!" : "😔 You lost"}
          </span>
        </div>
      )}

      {/* Controller layout — fills remaining space */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <GameLayout
          game={currentGame}
          myIndex={myIndex}
          isReady={isReady}
          onMove={onMove}
          onJump={onJump}
          onTap={onTap}
          onReady={onReady}
        />
      </div>
    </div>
  );
}

function GameLayout({
  game,
  myIndex,
  isReady,
  onMove,
  onJump,
  onTap,
  onReady,
}: {
  game: GameName;
  myIndex: number;
  isReady: boolean;
  onMove: (d: Direction) => void;
  onJump: () => void;
  onTap: () => void;
  onReady: () => void;
}) {
  switch (game) {
    case "Lobby":
      return (
        <LobbyController
          playerIndex={myIndex}
          onMove={onMove}
          onReady={onReady}
          isReady={isReady}
        />
      );
    case "CrossingRoad":
      return <DpadController onMove={onMove} />;
    case "HeadSmash":
      return <HeadSmashController onMove={onMove} onJump={onJump} />;
    case "UFOEscape":
      return <TapController onTap={onTap} label="TAP" sublabel="Tap repeatedly!" />;
    case "FlappyGame":
      return <TapController onTap={onTap} label="FLAP" sublabel="Tap to flap!" />;
    default:
      return null;
  }
}

// ─── Tiny sub-components ─────────────────────────────────────────────────────

function PlayerDot({ index }: { index: number }) {
  const colors = ["#3b82f6", "#f59e0b"];
  return (
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[index] ?? "#888" }} />
  );
}

function Score({ value, active }: { value: number; active: boolean }) {
  return (
    <span style={{ fontSize: "1rem", fontWeight: 700, color: active ? "#fff" : "#555" }}>
      {value}
    </span>
  );
}