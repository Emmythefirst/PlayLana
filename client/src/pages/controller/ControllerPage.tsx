import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useControllerWS } from "@/lib/useControllerWS";
import { ControllerShell } from "@/components/controller/ControllerShell";

export default function ControllerPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  if (!roomCode) {
    navigate("/controller");
    return null;
  }

  const { state, connected, join, sendMove, sendJump, sendTap, sendReady } =
    useControllerWS(roomCode);

  // Join room as soon as WebSocket connects
  useEffect(() => {
    if (connected) join();
  }, [connected]);

  // Prevent body scroll on mobile while controller is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleReady = () => {
    setIsReady(true);
    sendReady();
  };

  // Not yet assigned a player slot
  if (state.playerIndex === null) {
    return (
      <div
        className="controller-root"
        style={{ alignItems: "center", justifyContent: "center", gap: "1rem" }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid var(--blue)",
            borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {connected ? `Joining room ${roomCode}…` : "Connecting…"}
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Room error (full / not found)
  if (state.playerIndex === null && !connected) {
    return (
      <div
        className="controller-root"
        style={{ alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem" }}
      >
        <p style={{ color: "#ef4444", fontWeight: 600 }}>
          Couldn't join room. The room may be full or no longer active.
        </p>
        <button
          onClick={() => navigate("/controller")}
          style={{ padding: "0.7rem 1.5rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", color: "#fff", cursor: "pointer" }}
        >
          Try another room
        </button>
      </div>
    );
  }

  return (
    <ControllerShell
      state={state}
      onMove={sendMove}
      onJump={sendJump}
      onTap={sendTap}
      onReady={handleReady}
      isReady={isReady}
    />
  );
}