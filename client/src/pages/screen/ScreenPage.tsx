import { useRef } from "react";
import { useHostWS } from "@/lib/useHostWS";
import { LobbyView } from "@/components/screen/LobbyView";
import { GameOverlay } from "@/components/screen/GameOverlay";
import { WinnerAnnouncement } from "@/components/screen/WinnerAnnouncement";

// Unity WebGL build is served from /unity/index.html in the public folder.
// Oghenerukevwe: drop the Unity WebGL build output into client/public/unity/
const UNITY_BUILD_URL = "/unity/index.html";

export default function ScreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { hostState, connected, resetRound } = useHostWS(iframeRef);

  const { currentGame, round, winner, scores } = hostState;
  const gameStarted = currentGame !== "Lobby";

  return (
  <div className="screen-root" style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", position: "relative" }}>

    {/* Lobby — shown until game starts */}
    {!gameStarted && <LobbyView state={hostState} />}

    {/* Unity iframe — ALWAYS mounted so it can receive startCharacterSelect */}
    <iframe
      ref={iframeRef}
      src={UNITY_BUILD_URL}
      title="PlayLana Game"
      allow="autoplay; fullscreen"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        display: gameStarted ? "block" : "none",
      }}
    />

    {/* Overlays */}
    {gameStarted && <GameOverlay state={hostState} />}
    {round === "over" && winner !== null && (
      <WinnerAnnouncement
        winner={winner}
        scores={scores}
        onDismiss={() => {
          iframeRef.current?.contentWindow?.postMessage({ type: "reset" }, "*");
          resetRound();
        }}
      />
    )}

    {!connected && (
      <div style={{ position: "fixed", bottom: 16, right: 16, padding: "0.4rem 0.9rem", borderRadius: 999, background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, zIndex: 100 }}>
        WS disconnected — reconnecting…
      </div>
    )}
  </div>
  );
}