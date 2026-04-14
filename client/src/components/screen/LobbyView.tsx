import { QRCodeSVG } from "qrcode.react";
import type { HostState } from "@/types/messages";

interface Props {
  state: HostState;
}

const CONTROLLER_URL = import.meta.env.VITE_CONTROLLER_URL ?? window.location.origin;

export function LobbyView({ state }: Props) {
  const { roomCode, players } = state;
  const joinUrl = `${CONTROLLER_URL}/controller/${roomCode}`;
  const allReady = players.every((p) => p.joined && p.ready);
  const anyJoined = players.some((p) => p.joined);

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
        {/* QR */}
        <div style={{ padding: "1.25rem", background: "#fff", borderRadius: 16 }}>
          <QRCodeSVG value={joinUrl} size={180} />
        </div>

        {/* Code */}
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

      {/* Player slots */}
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {players.map((player, i) => (
          <PlayerSlot key={i} index={i} joined={player.joined} ready={player.ready} />
        ))}
      </div>

      {/* Status */}
      <div style={{ textAlign: "center" }}>
        {!anyJoined && (
          <WaitingDots label="Waiting for players" />
        )}
        {anyJoined && !allReady && (
          <WaitingDots label="Waiting for players to ready up" />
        )}
        {allReady && (
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#22c55e" }}>
            ✓ All players ready — starting soon!
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerSlot({ index, joined, ready }: { index: number; joined: boolean; ready: boolean }) {
  const colors = ["#3b82f6", "#f59e0b"];
  const color = colors[index];

  return (
    <div style={{ width: 140, padding: "1.25rem", borderRadius: 16, border: `1px solid ${joined ? color + "55" : "var(--border)"}`, background: joined ? `${color}11` : "var(--bg-card)", textAlign: "center", transition: "all 0.3s" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: joined ? color : "#222", border: `2px solid ${joined ? color : "#333"}`, margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", transition: "all 0.3s" }}>
        {joined ? "🎮" : "?"}
      </div>
      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: joined ? "#fff" : "#444" }}>
        Player {index + 1}
      </div>
      <div style={{ fontSize: "0.7rem", marginTop: "0.3rem", color: ready ? "#22c55e" : joined ? "#666" : "#333" }}>
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