import { useRef } from "react";
import { useHostWS } from "@/lib/useHostWS";
import { LobbyView } from "@/components/screen/LobbyView";

const UNITY_BUILD_URL = "/unity/index.html";

export default function ScreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { hostState, connected, countdown } = useHostWS(iframeRef);

  const { currentGame } = hostState;
  const gameStarted = currentGame !== "Lobby";

  return (
    <div className="screen-root" style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000", position: "relative" }}>

      {/* Lobby — shown until game starts */}
      {!gameStarted && <LobbyView state={hostState} countdown={countdown} />}

      {/* Unity iframe — ALWAYS mounted AND visible so Unity initializes at full
          container size on page load. While the lobby is shown we sit it
          underneath at opacity ~0 with pointer-events off. visibility:hidden /
          display:none would cause Unity's canvas to init at 0×0. */}
      <iframe
        ref={iframeRef}
        src={UNITY_BUILD_URL}
        title="PlayLana Game"
        allow="autoplay; fullscreen"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          opacity: gameStarted ? 1 : 0.001,
          pointerEvents: gameStarted ? "auto" : "none",
          zIndex: gameStarted ? 1 : 0,
        }}
      />

      {/* WS disconnected pill */}
      {!connected && (
        <div style={{ position: "fixed", bottom: 16, right: 16, padding: "0.4rem 0.9rem", borderRadius: 999, background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, zIndex: 100 }}>
          WS disconnected — reconnecting…
        </div>
      )}
    </div>
  );
}