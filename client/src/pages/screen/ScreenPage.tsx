import { useRef, useState } from "react";
import { useHostWS } from "@/lib/useHostWS";
import { LobbyView } from "@/components/screen/LobbyView";

const UNITY_BUILD_URL = "/unity/index.html";
const PX = "'Press Start 2P', monospace";

export default function ScreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { hostState, connected, countdown } = useHostWS(iframeRef);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const { currentGame } = hostState;
  const gameStarted = currentGame !== "Lobby";

  const handleUnlock = () => {
    // Browser-level unlock: a user-gesture-initiated Audio.play() satisfies the
    // autoplay policy for THIS document.
    try {
      const a = new Audio();
      a.play().catch(() => {});
    } catch { /* noop */ }

    // Tell Unity to resume its AudioContext. The Unity build needs a JSLib
    // handler listening for { type: "unlockAudio" } that calls
    // WEBAudio.audioContext.resume().
    try {
      iframeRef.current?.contentWindow?.postMessage({ type: "unlockAudio" }, "*");
    } catch { /* noop */ }

    setAudioUnlocked(true);
  };

  return (
    <div
      className="screen-root"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        position: "relative",
      }}
    >
      {/* Lobby — shown after audio unlock, until the game starts */}
      {audioUnlocked && !gameStarted && (
        <LobbyView state={hostState} countdown={countdown} />
      )}

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

      {/* Audio-unlock overlay — MUST sit above everything (including the
          iframe) so the first user gesture happens on the parent page.
          Required because browser autoplay policy keeps Unity's AudioContext
          suspended until a user gesture is registered on this document. */}
      {!audioUnlocked && (
        <button
          onClick={handleUnlock}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: PX,
            padding: "2rem",
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              letterSpacing: "0.15em",
              color: "#3b82f6",
            }}
          >
            PLAYLANA
          </div>
          <div
            style={{
              fontSize: "1.25rem",
              letterSpacing: "0.2em",
              color: "#fff",
              animation: "tapPulse 1.4s ease-in-out infinite",
            }}
          >
            TAP TO START
          </div>
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              color: "#555",
              marginTop: "1rem",
            }}
          >
            CLICK ANYWHERE TO ENABLE AUDIO
          </div>
          <style>{`
            @keyframes tapPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.45; }
            }
          `}</style>
        </button>
      )}

      {/* WS disconnected pill */}
      {!connected && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            background: "#ef444422",
            border: "1px solid #ef444455",
            color: "#ef4444",
            fontSize: "0.75rem",
            fontWeight: 600,
            zIndex: 100,
          }}
        >
          WS disconnected — reconnecting…
        </div>
      )}
    </div>
  );
}
