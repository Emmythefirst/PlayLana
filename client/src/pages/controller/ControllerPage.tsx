import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useControllerWS } from "@/lib/useControllerWS";
import { ControllerShell } from "@/components/controller/ControllerShell";

export default function ControllerPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const hasJoined = useRef(false);

  const safeRoomCode = roomCode ?? "";

  const { state, connected, join, sendMove, sendJump, sendTap, sendReady } =
    useControllerWS(safeRoomCode);

  // Redirect if no room code
  useEffect(() => {
    if (!roomCode) navigate("/controller");
  }, [roomCode, navigate]);

  // Join room as soon as WebSocket connects; re-join after any reconnect
  useEffect(() => {
    if (!connected) {
      hasJoined.current = false;
      return;
    }
    if (!hasJoined.current && safeRoomCode) {
      join();
      hasJoined.current = true;
    }
  }, [connected, join, safeRoomCode]);

  // Prevent body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Detect portrait/landscape
  useEffect(() => {
    const handler = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock to landscape when game starts (Android Chrome only)
  useEffect(() => {
  try {
    if (state.currentGame !== "Lobby") {
      screen.orientation?.lock("landscape").catch(() => {});
    } else {
      screen.orientation?.unlock();
    }
  } catch {
    // silently ignore on unsupported browsers
  }
}, [state.currentGame]);

  const handleReady = () => {
    setIsReady(true);
    sendReady();
  };

  // Rotate prompt — show when game is active and phone is portrait
  const showRotatePrompt = state.currentGame !== "Lobby" && isPortrait;

  // Loading — not yet joined
  if (state.playerIndex === null) {
    return (
      <div className="controller-root" style={{ alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid var(--blue)", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {connected ? `Joining room ${safeRoomCode}…` : "Connecting…"}
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {/* Rotate prompt overlay */}
      {showRotatePrompt && (
        <div style={{
          position: "fixed", inset: 0, background: "#0f0f0f",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", zIndex: 100, gap: "1.5rem",
        }}>
          <div style={{ fontSize: "3.5rem", animation: "rotatePulse 1.5s ease-in-out infinite" }}>
            🔄
          </div>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "0.65rem", color: "#fff",
            textAlign: "center", lineHeight: 2.2,
          }}>
            ROTATE YOUR<br />PHONE
          </p>
          <style>{`
            @keyframes rotatePulse {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(90deg); }
            }
          `}</style>
        </div>
      )}

      <ControllerShell
        state={state}
        onMove={sendMove}
        onJump={sendJump}
        onTap={sendTap}
        onReady={handleReady}
        isReady={isReady}
      />
    </>
  );
}