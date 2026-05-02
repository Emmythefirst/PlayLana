import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";

const PX = "'Press Start 2P', monospace";
const YELLOW = "#f5c518";
const BLUE = "#3b82f6";
const GREEN = "#22c55e";
const BG = "#000000";
const CARD_BG = "#0a0a0a";

const TICKER_ITEMS = [
  "2-4 PLAYERS","~10 MIN","FIRST TO 5 CROWNS",
  "PHONE = CONTROLLER","NOW PLAYING: CROWN ROYALE",
  "FREE · NO DOWNLOAD","BUILT ON SOLANA","4 MINI-GAMES",
];

const MINI_GAMES = [
  { name: "CROSSING ROAD", color: GREEN, active: true },
  { name: "UFO ESCAPE", color: GREEN, active: false },
  { name: "FLAPPY", color: GREEN, active: false },
  { name: "HEAD SMASH", color: GREEN, active: false },
];

const SOCIALS = [
  { icon: <FaXTwitter size={14} />, label: "X", href: "#" },
  { icon: <FaDiscord size={14} />, label: "Discord", href: "#" },
  { icon: <FaGithub size={14} />, label: "GitHub", href: "#" },
];

// ── Pixel art SVG components ─────────────────────────────────────────────────

// Hero illustration — TV with crown + two phones, empty screen for screenshot
function PixelHeroIllustration() {
  return (
    <svg viewBox="0 0 200 160" style={{ width: "100%", maxWidth: 520, imageRendering: "pixelated" }}>
      {/* ── Crown above TV ── */}
      <rect x="84" y="4" width="4" height="8" fill={YELLOW} />
      <rect x="96" y="2" width="4" height="10" fill={YELLOW} />
      <rect x="108" y="4" width="4" height="8" fill={YELLOW} />
      <rect x="82" y="12" width="32" height="6" fill={YELLOW} />
      <rect x="80" y="18" width="36" height="4" fill={YELLOW} />

      {/* ── TV / Monitor body ── */}
      <rect x="36" y="28" width="124" height="86" fill={BLUE} />
      <rect x="40" y="32" width="116" height="78" fill="#0a0a14" />

      {/* TV screen — empty dark area for screenshot overlay */}
      <rect x="44" y="36" width="108" height="70" fill="#050510" id="tv-screen" />

      {/* Scan line effect */}
      <rect x="44" y="56" width="108" height="1" fill={BLUE} opacity="0.15" />
      <rect x="44" y="76" width="108" height="1" fill={BLUE} opacity="0.15" />
      <rect x="44" y="96" width="108" height="1" fill={BLUE} opacity="0.15" />

      {/* TV stand */}
      <rect x="90" y="114" width="16" height="8" fill={BLUE} />
      <rect x="76" y="122" width="44" height="6" fill={BLUE} />

      {/* TV pixel corner accents */}
      <rect x="36" y="28" width="6" height="6" fill={YELLOW} />
      <rect x="154" y="28" width="6" height="6" fill={YELLOW} />
      <rect x="36" y="108" width="6" height="6" fill={YELLOW} />
      <rect x="154" y="108" width="6" height="6" fill={YELLOW} />

      {/* ── Phone left ── */}
      <rect x="6" y="60" width="26" height="46" fill={BLUE} />
      <rect x="10" y="64" width="18" height="34" fill="#050510" />
      {/* Phone screen content dots */}
      <rect x="12" y="68" width="4" height="4" fill={GREEN} />
      <rect x="18" y="68" width="4" height="4" fill={GREEN} />
      <rect x="12" y="76" width="10" height="2" fill={BLUE} opacity="0.6" />
      <rect x="12" y="80" width="8" height="2" fill={BLUE} opacity="0.4" />
      {/* D-pad */}
      <rect x="13" y="86" width="4" height="8" fill={YELLOW} />
      <rect x="11" y="88" width="8" height="4" fill={YELLOW} />
      <rect x="22" y="90" width="4" height="4" fill={YELLOW} />
      {/* Phone button */}
      <rect x="14" y="100" width="8" height="2" fill="#333" />

      {/* ── Phone right ── */}
      <rect x="164" y="60" width="26" height="46" fill={BLUE} />
      <rect x="168" y="64" width="18" height="34" fill="#050510" />
      {/* Phone screen content */}
      <rect x="170" y="68" width="4" height="4" fill={GREEN} />
      <rect x="176" y="68" width="4" height="4" fill={GREEN} />
      <rect x="170" y="76" width="10" height="2" fill={BLUE} opacity="0.6" />
      <rect x="170" y="80" width="8" height="2" fill={BLUE} opacity="0.4" />
      {/* D-pad */}
      <rect x="171" y="86" width="4" height="8" fill={YELLOW} />
      <rect x="169" y="88" width="8" height="4" fill={YELLOW} />
      <rect x="178" y="90" width="4" height="4" fill={YELLOW} />
      <rect x="172" y="100" width="8" height="2" fill="#333" />

      {/* ── Pixel dots scattered ── */}
      <rect x="2" y="30" width="3" height="3" fill={YELLOW} opacity="0.6" />
      <rect x="16" y="42" width="2" height="2" fill={BLUE} opacity="0.5" />
      <rect x="178" y="26" width="3" height="3" fill={YELLOW} opacity="0.6" />
      <rect x="190" y="44" width="2" height="2" fill={GREEN} opacity="0.5" />
      <rect x="4" y="120" width="2" height="2" fill={GREEN} opacity="0.4" />
      <rect x="188" y="118" width="3" height="3" fill={BLUE} opacity="0.4" />

      {/* ── Connection lines phone to TV ── */}
      <rect x="32" y="82" width="12" height="2" fill={BLUE} opacity="0.4" />
      <rect x="152" y="82" width="12" height="2" fill={BLUE} opacity="0.4" />
    </svg>
  );
}

function PixelMonitor() {
  return (
    <svg width="72" height="72" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="1" width="14" height="10" fill={BLUE} />
      <rect x="2" y="2" width="12" height="8" fill="#000" />
      <rect x="3" y="3" width="4" height="2" fill={YELLOW} />
      <rect x="8" y="3" width="4" height="1" fill={BLUE} opacity="0.5" />
      <rect x="8" y="5" width="3" height="1" fill={BLUE} opacity="0.5" />
      <rect x="6" y="12" width="4" height="1" fill={BLUE} />
      <rect x="5" y="13" width="6" height="1" fill={BLUE} />
    </svg>
  );
}

function PixelPhone() {
  return (
    <svg width="72" height="72" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="1" width="7" height="12" fill={GREEN} />
      <rect x="4" y="2" width="5" height="8" fill="#000" />
      <rect x="5" y="10" width="3" height="1" fill="#000" />
      <rect x="4" y="3" width="1" height="1" fill={GREEN} />
      <rect x="6" y="3" width="1" height="1" fill={GREEN} />
      <rect x="5" y="4" width="1" height="1" fill={GREEN} />
      <rect x="7" y="4" width="1" height="1" fill={GREEN} />
      <rect x="4" y="5" width="1" height="1" fill={GREEN} />
      <rect x="6" y="6" width="1" height="1" fill={GREEN} />
      <rect x="11" y="4" width="3" height="1" fill={YELLOW} />
      <rect x="11" y="5" width="1" height="3" fill={YELLOW} />
      <rect x="13" y="5" width="1" height="3" fill={YELLOW} />
      <rect x="11" y="7" width="3" height="1" fill={YELLOW} />
    </svg>
  );
}

function PixelCrown({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="9" width="14" height="4" fill={YELLOW} />
      <rect x="1" y="5" width="2" height="4" fill={YELLOW} />
      <rect x="7" y="3" width="2" height="6" fill={YELLOW} />
      <rect x="13" y="5" width="2" height="4" fill={YELLOW} />
      <rect x="2" y="8" width="1" height="1" fill="#000" />
      <rect x="8" y="8" width="1" height="1" fill="#000" />
      <rect x="13" y="8" width="1" height="1" fill="#000" />
      <rect x="2" y="13" width="12" height="1" fill={YELLOW} />
    </svg>
  );
}

function PixelAvatar() {
  return (
    <svg width="72" height="72" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="5" y="1" width="6" height="6" fill={BLUE} />
      <rect x="6" y="3" width="1" height="1" fill="#fff" />
      <rect x="9" y="3" width="1" height="1" fill="#fff" />
      <rect x="6" y="5" width="4" height="1" fill="#fff" />
      <rect x="4" y="7" width="8" height="6" fill={BLUE} />
      <rect x="3" y="8" width="2" height="4" fill={BLUE} />
      <rect x="11" y="8" width="2" height="4" fill={BLUE} />
      <rect x="4" y="13" width="3" height="2" fill={BLUE} />
      <rect x="9" y="13" width="3" height="2" fill={BLUE} />
    </svg>
  );
}

function PixelTrophy() {
  return (
    <svg width="72" height="72" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="1" width="8" height="8" fill={YELLOW} />
      <rect x="2" y="2" width="2" height="4" fill={YELLOW} />
      <rect x="12" y="2" width="2" height="4" fill={YELLOW} />
      <rect x="5" y="2" width="6" height="6" fill="#b8860b" />
      <rect x="6" y="3" width="4" height="1" fill={YELLOW} />
      <rect x="6" y="5" width="4" height="1" fill={YELLOW} />
      <rect x="6" y="9" width="4" height="3" fill={YELLOW} />
      <rect x="4" y="12" width="8" height="2" fill={YELLOW} />
      <rect x="3" y="14" width="10" height="1" fill={YELLOW} />
    </svg>
  );
}

function PixelChart() {
  return (
    <svg width="72" height="72" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="11" width="3" height="4" fill={BLUE} />
      <rect x="6" y="7" width="3" height="8" fill={YELLOW} />
      <rect x="10" y="4" width="3" height="11" fill={GREEN} />
      <rect x="1" y="15" width="14" height="1" fill="#555" />
    </svg>
  );
}

function BlinkCursor({ color = "#fff" }: { color?: string }) {
  return (
    <span style={{
      display: "inline-block", width: 12, height: "1em",
      background: color, marginLeft: 6, verticalAlign: "middle",
      animation: "blink 1s step-end infinite",
    }} />
  );
}

function PixelBlink({ color = GREEN }: { color?: string }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8,
      background: color, marginRight: 6, flexShrink: 0,
      animation: "blink 0.8s step-end infinite",
    }} />
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <span style={{ color: YELLOW, fontFamily: PX, fontSize: "0.6rem", letterSpacing: "0.15em" }}>
        — [ {text} ]
      </span>
    </div>
  );
}

function PixelButton({ children, onClick, primary = true, outline = false }: {
  children: React.ReactNode; onClick?: () => void; primary?: boolean; outline?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: PX, fontSize: "0.65rem",
        padding: "0.9rem 1.75rem",
        background: outline ? "transparent" : (primary ? (hovered ? YELLOW : BLUE) : "transparent"),
        color: outline ? (hovered ? YELLOW : "#fff") : (primary ? "#000" : "#fff"),
        border: outline ? `2px solid ${hovered ? YELLOW : "#555"}` : "none",
        cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.1s",
      }}
    >
      {primary && !outline && "► "}{children}
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const tickerText = (TICKER_ITEMS.map(t => `· ${t}   `).join("") + "   ").repeat(3);

  return (
    <div style={{ background: BG, color: "#fff", fontFamily: PX, minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        ::-webkit-scrollbar{width:4px;background:#000}
        ::-webkit-scrollbar-thumb{background:#333}
        img{image-rendering:pixelated;image-rendering:crisp-edges}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 3rem", borderBottom: `1px solid #111`,
        position: "sticky", top: 0, background: BG, zIndex: 50,
      }}>
        <img src="/playlana-logo.png" alt="PlayLana" style={{ height: 36 }} />
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {[["How it works","#how-it-works"],["The Game","#the-game"],["Why on-chain","#why-on-chain"]].map(([l,h]) => (
            <a key={l} href={h} style={{ fontFamily: PX, fontSize: "0.5rem", color: "#888", letterSpacing: "0.08em" }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "4rem", padding: "6rem 3rem 4rem",
        alignItems: "center", maxWidth: 1200, margin: "0 auto",
      }}>
        <div>
          <h1 style={{ fontFamily: PX, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", lineHeight: 1.7, marginBottom: "2rem" }}>
            One<br />screen.<br /><span style={{ color: YELLOW }}>Every<br />phone.</span>
          </h1>
          <p style={{ fontFamily: PX, fontSize: "0.55rem", color: "#666", lineHeight: 2.6, marginBottom: "2.5rem", maxWidth: 400 }}>
            Shared-screen multiplayer party games.<br />
            Your phone is the controller, and your<br />
            character lives forever — wins, XP, and<br />
            crowns follow you across every game.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <PixelButton onClick={() => navigate("/screen")}>PLAY CROWN ROYALE</PixelButton>
            <PixelButton primary={false} outline>HOW IT WORKS</PixelButton>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: PX, fontSize: "0.45rem", color: GREEN, border: `1px solid ${GREEN}44`, padding: "0.3rem 0.6rem" }}>
              ✓ BUILT ON SOLANA
            </span>
            <span style={{ fontFamily: PX, fontSize: "0.45rem", color: "#444" }}>Free · No download</span>
          </div>
        </div>

        {/* Hero illustration — pixel art TV with empty screen */}
        <div style={{ animation: "float 3s ease-in-out infinite", position: "relative" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
            <PixelHeroIllustration />
            {/* Game screenshot overlay on TV screen */}
            <img
              src="/hero-game.png"
              alt="Game on screen"
              style={{
                position: "absolute",
                top: "22.5%", left: "22%",
                width: "54%", height: "43.75%",
                objectFit: "cover",
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: BLUE, padding: "0.8rem 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "ticker 35s linear infinite", fontFamily: PX, fontSize: "0.55rem", color: "#fff", letterSpacing: "0.1em" }}>
          {tickerText}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "7rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel text="HOW IT WORKS" />
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1.1rem, 2.5vw, 2rem)", lineHeight: 1.9, marginBottom: "3.5rem" }}>
          Three steps to the <span style={{ color: YELLOW }}>crown</span><BlinkCursor color={YELLOW} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            { num: "01", icon: <PixelMonitor />, title: "OPEN THE GAME", desc: "Load PlayLana on a TV, laptop, or any browser big enough to share." },
            { num: "02", icon: <PixelPhone />, title: "SCAN THE QR", desc: "Point your phone at the screen. You're in — your phone is now the controller." },
            { num: "03", icon: <PixelCrown size={72} />, title: "WINS FOLLOW YOU", desc: "Crowns, XP, and high scores stay yours — across every game, forever." },
          ].map((step) => (
            <div key={step.num} style={{ border: `1px solid ${BLUE}`, background: CARD_BG, padding: "2rem", position: "relative" }}>
              <div style={{ fontFamily: PX, fontSize: "0.6rem", color: BLUE, marginBottom: "1.5rem" }}>{step.num}</div>
              <div style={{ marginBottom: "1.25rem" }}>{step.icon}</div>
              <div style={{ fontFamily: PX, fontSize: "0.6rem", color: "#fff", marginBottom: "1rem", lineHeight: 1.9 }}>{step.title}</div>
              <p style={{ fontFamily: PX, fontSize: "0.45rem", color: "#555", lineHeight: 2.4 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE GAME ── */}
      <section id="the-game" style={{ padding: "6rem 3rem", background: "#030303", borderTop: `1px solid #111`, borderBottom: `1px solid #111` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionLabel text="NOW PLAYING" />
          <h2 style={{ fontFamily: PX, fontSize: "clamp(1.1rem, 2.5vw, 2rem)", lineHeight: 1.9, marginBottom: "3.5rem" }}>
            The Game: <span style={{ color: YELLOW }}>Crown Royale</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            {/* Game screenshot — no border, pixelated */}
            <div style={{ aspectRatio: "16/10", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <img
                src="/game-screenshot.png"
                alt="Crown Royale gameplay"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).nextElementSibling?.removeAttribute("style");
                }}
              />
              <span style={{ fontFamily: PX, fontSize: "0.45rem", color: "#222", position: "absolute", display: "none" }}>
                [ GAMEPLAY SCREENSHOT ]
              </span>
            </div>

            <div>
              {/* Larger crown icon */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <PixelCrown size={40} />
                <span style={{ fontFamily: PX, fontSize: "0.55rem", color: "#888" }}>Crown Royale</span>
              </div>
              <p style={{ fontFamily: PX, fontSize: "0.5rem", color: "#888", lineHeight: 2.6, marginBottom: "2rem" }}>
                First to 5 crowns wins the match.
              </p>
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ fontFamily: PX, fontSize: "0.5rem", color: "#444", marginBottom: "0.85rem", letterSpacing: "0.1em" }}>· MINI-GAMES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {MINI_GAMES.map((g) => (
                    <div key={g.name} style={{ display: "flex", alignItems: "center", border: `1px solid ${g.color}55`, padding: "0.4rem 0.8rem", background: `${g.color}11` }}>
                      {g.active && <PixelBlink color={g.color} />}
                      <span style={{ fontFamily: PX, fontSize: "0.45rem", color: g.color, letterSpacing: "0.08em" }}>{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {["2-4 PLAYERS","~10 MIN","1 WINNER"].map(s => (
                  <span key={s} style={{ fontFamily: PX, fontSize: "0.45rem", color: "#fff", border: "1px solid #333", padding: "0.4rem 0.75rem", background: "#111" }}>{s}</span>
                ))}
              </div>
              <PixelButton onClick={() => navigate("/screen")}>PLAY NOW</PixelButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY ON-CHAIN ── */}
      <section id="why-on-chain" style={{ padding: "7rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel text="WHY IT MATTERS" />
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1.1rem, 2.5vw, 2rem)", lineHeight: 1.9, marginBottom: "3.5rem" }}>
          Your character. <span style={{ color: YELLOW }}>Forever.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            { icon: <PixelAvatar />, title: "YOUR CHARACTER IS YOURS", desc: "One identity, one name, one look — across every game on PlayLana." },
            { icon: <PixelTrophy />, title: "YOUR WINS ARE FOREVER", desc: "XP, achievements, and high scores never reset. Save state is saved for real." },
            { icon: <PixelChart />, title: "REAL LEADERBOARDS", desc: "Global rankings, anyone can verify. No fake numbers, no resets." },
          ].map((card) => (
            <div key={card.title} style={{ border: `1px solid ${BLUE}`, background: CARD_BG, padding: "2rem", position: "relative" }}>
              <div style={{ marginBottom: "1.25rem" }}>{card.icon}</div>
              <div style={{ fontFamily: PX, fontSize: "0.55rem", color: YELLOW, marginBottom: "0.9rem", lineHeight: 1.9 }}>{card.title}</div>
              <p style={{ fontFamily: PX, fontSize: "0.45rem", color: "#555", lineHeight: 2.4 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ margin: "0 3rem 6rem", border: `2px solid ${BLUE}44`, background: "#010108", padding: "5rem 3rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1.2rem, 3vw, 2.2rem)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
          Grab a phone.
        </h2>
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1.2rem, 3vw, 2.2rem)", lineHeight: 1.8, marginBottom: "2rem", color: YELLOW }}>
          Grab the crown.
        </h2>
        <p style={{ fontFamily: PX, fontSize: "0.45rem", color: "#444", marginBottom: "2.5rem", lineHeight: 2.2 }}>
          2-4 players · ~10 minutes · One screen · Every phone.
        </p>
        <PixelButton onClick={() => navigate("/screen")}>PLAY NOW</PixelButton>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid #111`, padding: "1.5rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <img src="/playlana-logo.png" alt="PlayLana" style={{ height: 36 }} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {SOCIALS.map(({ icon, label, href }) => (
              <a key={label} href={href} title={label} style={{
                width: 34, height: 34, border: `1px solid ${BLUE}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#888", transition: "color 0.15s, border-color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor=BLUE; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="#888"; (e.currentTarget as HTMLAnchorElement).style.borderColor=`${BLUE}66`; }}
              >{icon}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ fontFamily: PX, fontSize: "0.45rem", color: GREEN, border: `1px solid ${GREEN}55`, padding: "0.35rem 0.65rem" }}>✓ BUILT ON SOLANA</span>
            <span style={{ fontFamily: PX, fontSize: "0.45rem", color: YELLOW, border: `1px solid ${YELLOW}55`, padding: "0.35rem 0.65rem" }}>⚡ MAGICBLOCK</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <span style={{ fontFamily: PX, fontSize: "0.45rem", color: "#333" }}>
            © 2026 PlayLana · Press START to play<BlinkCursor color="#555" />
          </span>
        </div>
      </footer>
    </div>
  );
}