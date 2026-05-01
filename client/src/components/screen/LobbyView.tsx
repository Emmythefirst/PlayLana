import { QRCodeSVG } from "qrcode.react";
import type { HostState } from "@/types/messages";

interface Props {
  state: HostState;
  countdown: number | null;
}

const CONTROLLER_URL = import.meta.env.VITE_CONTROLLER_URL ?? window.location.origin;

// 4 player colors
const PLAYER_COLORS = ["#3b82f6", "#f59e0b", "#22c55e", "#a855f7"];

export function LobbyView({ state, countdown }: Props) {
  const { roomCode, players } = state;
  const joinUrl = `${CONTROLLER_URL}/controller/${roomCode}`;
  const joinedPlayers = players.filter((p) => p.joined);
  const allJoinedReady = joinedPlayers.length >= 2 && joinedPlayers.every((p) => p.ready);
  const anyJoined = joinedPlayers.length > 0;
  const isCountingDown = countdown !== null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", gap: "3rem" }}>

      {/* Brand */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
          Play<span style={{ color: "var(--blue)" }}>Lana</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Scan the QR code or enter the room code on your phone
        </p>
      </div>

      {/* Room code + QR */}
      <div style={{ display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ padding: "1.25rem", background: "#fff", borderRadius: 16 }}>
          <QRCodeSVG value={joinUrl} size={180} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Room Code
          </div>
          <div style={{ fontFamily: "var(--font-pixel)", fontSize: "clamp(2rem, 6vw, 4rem)", color: "var(--blue)", letterSpacing: "0.1em", lineHeight: 1 }}>
            {roomCode}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#444", marginTop: "0.75rem" }}>
            {joinUrl}
          </div>
        </div>
      </div>

      {/* Player slots — all 4 */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        {players.map((player, i) => (
          <PlayerSlot key={i} index={i} joined={player.joined} ready={player.ready} />
        ))}
      </div>

      {/* Status / Countdown */}
      <div style={{ textAlign: "center", minHeight: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {isCountingDown ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.1)",
              border: `3px solid ${countdown! <= 3 ? "#ef4444" : "var(--blue)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 24px ${countdown! <= 3 ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
              transition: "all 0.3s",
            }}>
              <span style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "1.8rem",
                color: countdown! <= 3 ? "#ef4444" : "var(--blue)",
                transition: "color 0.3s",
              }}>
                {countdown}
              </span>
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Starting in {countdown} second{countdown !== 1 ? "s" : ""}…
            </div>
          </div>
        ) : !anyJoined ? (
          <WaitingDots label="Waiting for players" />
        ) : !allJoinedReady ? (
          <WaitingDots label="Waiting for players to ready up" />
        ) : (
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#22c55e" }}>
            ✓ All players ready — starting soon!
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerSlot({ index, joined, ready }: { index: number; joined: boolean; ready: boolean }) {
  const color = PLAYER_COLORS[index];

  return (
    <div style={{ width: 130, padding: "1.1rem", borderRadius: 16, border: `1px solid ${joined ? color + "55" : "var(--border)"}`, background: joined ? `${color}11` : "var(--bg-card)", textAlign: "center", transition: "all 0.3s" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: joined ? color : "#222", border: `2px solid ${joined ? color : "#333"}`, margin: "0 auto 0.7rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", transition: "all 0.3s" }}>
        {joined ? "🎮" : "?"}
      </div>
      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: joined ? "#fff" : "#444" }}>
        Player {index + 1}
      </div>
      <div style={{ fontSize: "0.68rem", marginTop: "0.3rem", color: ready ? "#22c55e" : joined ? "#666" : "#333" }}>
        {ready ? "✓ Ready" : joined ? "Joined" : "Waiting..."}
      </div>
    </div>
  );
}

function WaitingDots({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
      <span>{label}</span>
      <span style={{ display: "inline-flex", gap: "3px" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#555", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
        ))}
      </span>
    </div>
  );
}