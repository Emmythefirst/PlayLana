import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useControllerWS } from "@/lib/useControllerWS";
import { ControllerShell } from "@/components/controller/ControllerShell";

const GAMESHIFT_PROXY = "https://playlana-backend.vercel.app/api/register-wallet";
const PX = "'Press Start 2P', monospace";

async function getOrCreateWallet(email: string): Promise<string> {
  const res = await fetch(GAMESHIFT_PROXY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Wallet error: ${res.status}`);
  const data = await res.json();
  return data.wallet as string;
}

export default function ControllerPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const hasJoined = useRef(false);
  const walletSentRef = useRef(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  const safeRoomCode = roomCode ?? "";
  const emailKey = "playlana_player_email";
  const walletKey = "playlana_player_wallet";

  const { state, connected, join, sendMove, sendJump, sendTap, sendReady, sendWallet } =
    useControllerWS(safeRoomCode);

  useEffect(() => {
    const savedEmail = localStorage.getItem(emailKey);
    if (!savedEmail) setShowEmailModal(true);
  }, []);

  useEffect(() => {
    if (!roomCode) navigate("/controller");
  }, [roomCode, navigate]);

  useEffect(() => {
    if (!connected) { hasJoined.current = false; return; }
    if (!hasJoined.current && safeRoomCode) {
      join();
      hasJoined.current = true;
    }
  }, [connected, join, safeRoomCode]);

  useEffect(() => {
    if (state.playerIndex === null || walletSentRef.current) return;
    const wallet = localStorage.getItem(walletKey);
    if (!wallet) return;
    walletSentRef.current = true;
    sendWallet(wallet);
    console.log(`[Controller] Sent wallet for P${state.playerIndex + 1}`);
  }, [state.playerIndex, sendWallet]);

  useEffect(() => {
    if (!connected) walletSentRef.current = false;
  }, [connected]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    try {
      if (state.currentGame !== "Lobby") {
        screen.orientation?.lock("landscape").catch(() => {});
      } else {
        screen.orientation?.unlock();
      }
    } catch { /* unsupported */ }
  }, [state.currentGame]);

  // ── Shared wallet creation logic ───────────────────────────────────────────
  const submitWithEmail = async (email: string) => {
    setEmailError("");
    setWalletLoading(true);
    try {
      const wallet = await getOrCreateWallet(email);
      localStorage.setItem(emailKey, email);
      localStorage.setItem(walletKey, wallet);
      setShowEmailModal(false);
      if (state.playerIndex !== null && !walletSentRef.current) {
        walletSentRef.current = true;
        sendWallet(wallet);
      }
    } catch {
      setEmailError("Failed to create wallet. Try again.");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleEmailSubmit = () => {
    const email = emailInput.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email");
      return;
    }
    submitWithEmail(email);
  };

  const handleGuestContinue = () => {
    const guestEmail = `guest_${Math.random().toString(36).slice(2, 8)}@playlana.local`;
    submitWithEmail(guestEmail);
  };

  const handleReady = () => {
    setIsReady(true);
    sendReady();
  };

  const showRotatePrompt = state.currentGame !== "Lobby" && isPortrait;

  // ── Email modal ────────────────────────────────────────────────────────────
  if (showEmailModal) {
    return (
      <div style={{
        height: "100vh", width: "100vw", background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem", gap: "2rem",
      }}>
        <style>{`* { box-sizing: border-box; }`}</style>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: PX, fontSize: "1rem", color: "#3b82f6", marginBottom: "1rem" }}>
            🎮
          </div>
          <h2 style={{ fontFamily: PX, fontSize: "0.65rem", color: "#fff", lineHeight: 2, marginBottom: "0.5rem" }}>
            TRACK YOUR STATS
          </h2>
          <p style={{ fontFamily: PX, fontSize: "0.38rem", color: "#555", lineHeight: 2.2 }}>
            Enter your email to save wins,<br />XP and crowns on Solana.
          </p>
        </div>

        <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
            style={{
              width: "100%", padding: "1rem",
              borderRadius: 12,
              border: emailError ? "1px solid #ef4444" : "1px solid #333",
              background: "#111", color: "#fff",
              fontSize: "1rem", outline: "none",
              fontFamily: "system-ui, sans-serif",
            }}
          />
          {emailError && (
            <span style={{ fontFamily: PX, fontSize: "0.38rem", color: "#ef4444" }}>{emailError}</span>
          )}

          <button
            onClick={handleEmailSubmit}
            disabled={walletLoading}
            style={{
              width: "100%", padding: "1rem",
              borderRadius: 12, border: "none",
              background: walletLoading ? "#1a3a6e" : "#3b82f6",
              color: "#fff", fontFamily: PX, fontSize: "0.55rem",
              letterSpacing: "0.08em", cursor: walletLoading ? "default" : "pointer",
            }}
          >
            {walletLoading ? "CREATING WALLET…" : "► CONTINUE"}
          </button>

          <button
            onClick={handleGuestContinue}
            disabled={walletLoading}
            style={{
              width: "100%", padding: "0.85rem",
              borderRadius: 12, border: "1px solid #222",
              background: "transparent", color: "#444",
              fontFamily: PX, fontSize: "0.45rem",
              letterSpacing: "0.06em", cursor: "pointer",
            }}
          >
            CONTINUE AS GUEST
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
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
      {showRotatePrompt && (
        <div style={{
          position: "fixed", inset: 0, background: "#0f0f0f",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", zIndex: 100, gap: "1.5rem",
        }}>
          <div style={{ fontSize: "3.5rem", animation: "rotatePulse 1.5s ease-in-out infinite" }}>🔄</div>
          <p style={{ fontFamily: PX, fontSize: "0.65rem", color: "#fff", textAlign: "center", lineHeight: 2.2 }}>
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