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
  const { playerIndex, currentGame } = state;
  const myIndex = playerIndex ?? 0;

  return (
    <div
      className="controller-root"
      style={{
        background: "var(--bg)",
        flexDirection: "column",
        position: "relative",
      }}
    >
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