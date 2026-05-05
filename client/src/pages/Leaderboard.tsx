import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PX = "'Press Start 2P', monospace";
const YELLOW = "#f5c518";
const BLUE = "#3b82f6";
const GREEN = "#22c55e";
const BG = "#000000";
const API = "https://playlana-backend.vercel.app/api/leaderboard";
const SOAR_KEY = "DCbKV9Mgbr3pQcMa3Mse8E8AokWugkPKnYrUomxSM8jk";

interface Entry {
  rank: number;
  wallet: string;
  score: string;
  timestamp?: string;
}

function truncateWallet(w: string) {
  if (!w || w.length < 8) return w;
  return `${w.slice(0, 4)}...${w.slice(-4)}`;
}

function RankBadge({ rank }: { rank: number }) {
  const color = rank === 1 ? YELLOW : rank === 2 ? "#aaa" : rank === 3 ? "#cd7f32" : "#444";
  return (
    <span style={{ fontFamily: PX, fontSize: "0.55rem", color, minWidth: 28, display: "inline-block" }}>
      {rank === 1 ? "♛" : rank === 2 ? "♛" : rank === 3 ? "♛" : `#${rank}`}
    </span>
  );
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const filtered = (data.entries || [])
        .filter((e: any) => e.wallet && e.wallet !== "null" && Number(e.score) > 0)
        .slice(0, 50);
      setEntries(filtered);
      setLastUpdated(new Date());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    const onFocus = () => fetchLeaderboard();
    document.addEventListener("visibilitychange", onFocus);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", onFocus); };
  }, [fetchLeaderboard]);

  const visible = showAll ? entries : entries.slice(0, 10);

  return (
    <div style={{ background: BG, color: "#fff", fontFamily: PX, minHeight: "100vh", padding: "0 0 4rem" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;background:#000}
        ::-webkit-scrollbar-thumb{background:#333}
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 3rem", borderBottom: "1px solid #111",
        position: "sticky", top: 0, background: BG, zIndex: 50,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{ fontFamily: PX, fontSize: "0.5rem", color: "#888", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.08em" }}
        >
          ← PLAYLANA
        </button>
        <span style={{ fontFamily: PX, fontSize: "0.5rem", color: YELLOW, letterSpacing: "0.1em" }}>
          LEADERBOARD
        </span>
        <span style={{ fontFamily: PX, fontSize: "0.4rem", color: "#333" }}>
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ""}
        </span>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: PX, fontSize: "0.6rem", color: YELLOW, letterSpacing: "0.15em", marginBottom: "1rem" }}>
            — [ CROWN ROYALE CHAMPIONS ]
          </div>
          <h1 style={{ fontFamily: PX, fontSize: "clamp(1rem, 3vw, 1.8rem)", lineHeight: 1.8, marginBottom: "1rem" }}>
            Global <span style={{ color: YELLOW }}>Rankings</span>
          </h1>
          <p style={{ fontFamily: PX, fontSize: "0.4rem", color: "#444", lineHeight: 2.4, marginBottom: "1.5rem" }}>
            Live on Solana · Verified on-chain · Powered by SOAR
          </p>

          {/* SOAR callout */}
          <div style={{
            border: `1px solid ${BLUE}44`, background: "#010108",
            padding: "1rem 1.25rem", display: "inline-flex", alignItems: "center", gap: "0.75rem",
          }}>
            <span style={{ fontFamily: PX, fontSize: "0.58rem", color: "#555", lineHeight: 2 }}>
              SOAR LEADERBOARD:
            </span>
            <a
              href={`https://explorer.solana.com/address/${SOAR_KEY}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: PX, fontSize: "0.58rem", color: BLUE, letterSpacing: "0.05em" }}
            >
              {truncateWallet(SOAR_KEY)}
            </a>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div style={{ width: 24, height: 24, border: `2px solid ${BLUE}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ fontFamily: PX, fontSize: "0.55rem", color: "#444" }}>Loading...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", border: "1px solid #222" }}>
            <p style={{ fontFamily: PX, fontSize: "0.55rem", color: "#ef4444" }}>Failed to load leaderboard</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", border: `1px solid ${BLUE}22` }}>
            <p style={{ fontFamily: PX, fontSize: "0.55rem", color: "#444", lineHeight: 2.5 }}>
              No champions yet.<br />Be the first to earn a crown.
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "60px 1fr 80px 120px",
              padding: "0.75rem 1.25rem", borderBottom: `1px solid ${BLUE}33`, marginBottom: "0.25rem",
            }}>
              {["RANK", "WALLET", "CROWNS", "TIME"].map(h => (
                <span key={h} style={{ fontFamily: PX, fontSize: "0.58rem", color: "#444", letterSpacing: "0.1em" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {visible.map((entry, i) => {
              const isTop3 = entry.rank <= 3;
              const rowColor = entry.rank === 1 ? YELLOW : entry.rank === 2 ? "#aaa" : entry.rank === 3 ? "#cd7f32" : "#fff";
              return (
                <div
                  key={entry.wallet + entry.rank}
                  style={{
                    display: "grid", gridTemplateColumns: "60px 1fr 80px 120px",
                    padding: "0.9rem 1.25rem",
                    background: isTop3 ? `${rowColor}08` : i % 2 === 0 ? "#050505" : "#000",
                    borderLeft: isTop3 ? `2px solid ${rowColor}` : "2px solid transparent",
                    marginBottom: "2px",
                    alignItems: "center",
                  }}
                >
                  <RankBadge rank={entry.rank} />
                  <a
                    href={`https://explorer.solana.com/address/${entry.wallet}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: PX, fontSize: "0.55rem", color: isTop3 ? rowColor : "#888", letterSpacing: "0.05em" }}
                  >
                    {truncateWallet(entry.wallet)}
                  </a>
                  <span style={{ fontFamily: PX, fontSize: "0.5rem", color: isTop3 ? rowColor : "#fff" }}>
                    ♛ {entry.score}
                  </span>
                  <span style={{ fontFamily: PX, fontSize: "0.45rem", color: "#333" }}>
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : "—"}
                  </span>
                </div>
              );
            })}

            {/* Show more / less */}
            {entries.length > 10 && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    fontFamily: PX, fontSize: "0.55rem", color: BLUE,
                    background: "none", border: `1px solid ${BLUE}44`,
                    padding: "0.75rem 1.5rem", cursor: "pointer", letterSpacing: "0.08em",
                  }}
                >
                  {showAll ? "▲ SHOW LESS" : `▼ SHOW ALL ${entries.length}`}
                </button>
              </div>
            )}

            {/* Refresh indicator */}
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <span style={{ fontFamily: PX, fontSize: "0.45rem", color: "#333" }}>
                <span style={{ display: "inline-block", width: 6, height: 6, background: GREEN, borderRadius: "50%", animation: "blink 2s step-end infinite", marginRight: 6, verticalAlign: "middle" }} />
                Auto-refreshes every 10s
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}