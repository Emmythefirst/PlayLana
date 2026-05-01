import { useEffect, useRef, useState } from "react";
import type { ControllerState, Direction, GameName } from "@/types/messages";
import { LobbyController } from "./layouts/LobbyController";
import { DpadController } from "./layouts/DpadController";
import { HeadSmashController } from "./layouts/HeadSmashController";
import { TapController } from "./layouts/TapController";
import { CharacterSelectController } from "./layouts/CharacterSelectController";

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
  const isLandscape = currentGame !== "Lobby" && currentGame !== "CharacterSelect";

  // Auto-dismiss winner banner after 3 seconds
  const [showBanner, setShowBanner] = useState(false);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (round === "over" && winner !== null) {
      setShowBanner(true);
      clearTimeout(bannerTimer.current);
      bannerTimer.current = setTimeout(() => setShowBanner(false), 3000);
    } else {
      setShowBanner(false);
      clearTimeout(bannerTimer.current);
    }
    return () => clearTimeout(bannerTimer.current);
  }, [round, winner]);

  return (
    <div
      className="controller-root"
      style={{
        background: "var(--bg)",
        flexDirection: isLandscape ? "row" : "column",
      }}
    >
      {/* ── Header / sidebar ── */}
      <div style={{
        display: "flex",
        flexDirection: isLandscape ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isLandscape ? "1rem 0.75rem" : "0.75rem 1.25rem",
        borderRight: isLandscape ? "1px solid var(--border)" : "none",
        borderBottom: isLandscape ? "none" : "1px solid var(--border)",
        flexShrink: 0,
        gap: isLandscape ? "1.5rem" : 0,
        minWidth: isLandscape ? 64 : "auto",
      }}>
        {/* Player badge */}
        <div style={{ display: "flex", flexDirection: isLandscape ? "column" : "row", alignItems: "center", gap: "0.4rem" }}>
          <PlayerDot index={myIndex} />
          <span style={{ fontWeight: 700, fontSize: "0.8rem" }}>P{myIndex + 1}</span>
          {alive[myIndex] === false && (
            <span style={{ fontSize: "0.6rem", color: "#ef4444", fontWeight: 600 }}>DEAD</span>
          )}
        </div>

        {/* Score — hide during lobby and character select */}
        {currentGame !== "Lobby" && currentGame !== "CharacterSelect" && (
          <div style={{ display: "flex", flexDirection: isLandscape ? "column" : "row", gap: isLandscape ? "0.5rem" : "1rem", alignItems: "center" }}>
            <Score value={scores[0]} active={myIndex === 0} />
            <span style={{ color: "#333", fontSize: "0.7rem" }}>vs</span>
            <Score value={scores[1]} active={myIndex === 1} />
          </div>
        )}

        {/* Timer */}
        {timer !== null && currentGame !== "Lobby" && currentGame !== "CharacterSelect" && (
          <div style={{
            fontSize: "0.85rem", fontWeight: 700,
            color: timer <= 10 ? "#ef4444" : "#fff",
            textAlign: "center",
          }}>
            {timer}s
          </div>
        )}
      </div>

      {/* ── Game over banner — auto-dismisses after 3s ── */}
      {showBanner && (
        <div style={{
          padding: "0.6rem 1rem", textAlign: "center",
          background: winner === myIndex ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)",
          borderBottom: "1px solid var(--border)",
          position: isLandscape ? "absolute" : "relative",
          top: isLandscape ? 0 : "auto",
          left: isLandscape ? 64 : "auto",
          right: 0,
          zIndex: 10,
        }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: winner === myIndex ? "#22c55e" : "#ef4444" }}>
            {winner === myIndex ? "🏆 You won!" : "😔 You lost"}
          </span>
        </div>
      )}

      {/* ── Controller layout ── */}
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
  game, myIndex, isReady, onMove, onJump, onTap, onReady,
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
          onReady={onReady}
          isReady={isReady}
        />
      );
    case "CharacterSelect":
      return (
        <CharacterSelectController
          playerIndex={myIndex}
          onMove={onMove}
          onConfirm={onReady}
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

function PlayerDot({ index }: { index: number }) {
  const colors = ["#3b82f6", "#f59e0b"];
  return (
    <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[index] ?? "#888", flexShrink: 0 }} />
  );
}

function Score({ value, active }: { value: number; active: boolean }) {
  return (
    <span style={{ fontSize: "1rem", fontWeight: 700, color: active ? "#fff" : "#555" }}>
      {value}
    </span>
  );
}