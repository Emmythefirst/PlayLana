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
  const { playerIndex, currentGame, round, winner } = state;
  const myIndex = playerIndex ?? 0;

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
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── Game over banner — auto-dismisses after 3s ── */}
      {showBanner && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          padding: "0.65rem 1rem",
          textAlign: "center",
          background: winner === myIndex ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.85)",
          zIndex: 20,
        }}>
          <span style={{
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.05em",
          }}>
            {winner === myIndex ? "🏆 YOU WON!" : "😔 YOU LOST"}
          </span>
        </div>
      )}

      {/* ── Controller layout — full screen ── */}
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
      return <LobbyController playerIndex={myIndex} onReady={onReady} isReady={isReady} />;
    case "CharacterSelect":
      return <CharacterSelectController playerIndex={myIndex} onMove={onMove} onConfirm={onReady} />;
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