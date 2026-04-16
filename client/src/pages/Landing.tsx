import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaApple, FaGooglePlay, FaInstagram, FaTelegram, FaDiscord } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const FAQS = [
  { q: "Do I need to download anything?", a: "No downloads required. PlayLana runs entirely in your browser. Just open the link and start playing." },
  { q: "How do I join a game?", a: "The host shares a room code or QR code. Open your phone camera, scan it, and you're in — wallet created automatically." },
  { q: "Can I play with friends?", a: "Yes. Each game supports 2 players using their phones as controllers on a shared screen." },
  { q: "What devices are supported?", a: "Any device with a modern browser. Host screen on a laptop, TV, or projector. Controllers on any smartphone." },
];

const SOCIALS = [
  { icon: <FaInstagram size={15} />, label: "Instagram", href: "#" },
  { icon: <FaTelegram size={15} />, label: "Telegram", href: "#" },
  { icon: <FaDiscord size={15} />, label: "Discord", href: "#" },
  { icon: <FaXTwitter size={15} />, label: "X", href: "#" },
];

const PX = "'Press Start 2P', monospace";

export default function Landing() {
  const [activeTab, setActiveTab] = useState<"PC" | "TV">("PC");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.4rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Logo />
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Games", "FAQs"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "#e5e5e5", fontFamily: PX, fontSize: "0.7rem", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "6rem 2rem 3rem" }}>
        <h1 style={{
          fontFamily: PX,
          fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)",
          lineHeight: 1.7,
          margin: "0 auto 1.75rem",
          maxWidth: 780,
          letterSpacing: "0.02em",
        }}>
          Turn Any{" "}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3em", verticalAlign: "middle" }}>
            <PixelScreenIcon />
          </span>{" "}
          Screen Into
          <br />
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3em", verticalAlign: "middle" }}>
            <PixelControllerIcon />
          </span>{" "}
          a Party Game Console
        </h1>
        <p style={{ color: "#888", fontSize: "1rem", maxWidth: 420, margin: "0 auto 2.5rem", lineHeight: 1.9 }}>
          Play games with friends using your phones as controllers. Just connect and play.
        </p>
        <button onClick={() => navigate("/screen")} style={btnPrimary}>
          Start playing now
        </button>

        {/* Device mockup stack */}
        <div style={{ position: "relative", maxWidth: 600, margin: "4rem auto 0", height: 380 }}>
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "68%", borderRadius: 12, overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.1)", background: "#111", zIndex: 1,
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}>
            <div style={{ height: 22, background: "#0a0a0a", display: "flex", alignItems: "center", paddingLeft: 10, gap: 5, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ height: 200, background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: PX, fontSize: "0.55rem", color: "#222", letterSpacing: "0.1em" }}>GAME SCREEN</span>
            </div>
          </div>
          <div style={{
            position: "absolute", bottom: 0, right: "8%",
            width: "30%", borderRadius: 22, overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.12)", background: "#111", zIndex: 2,
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          }}>
            <div style={{ height: 230, background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: PX, fontSize: "0.35rem", color: "#222" }}>CTRL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Play Together ── */}
      <section style={{ padding: "7rem 3rem 5rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1rem, 2.5vw, 1.6rem)", lineHeight: 1.9, marginBottom: "1rem" }}>
          Play together with Friends on any screen
        </h2>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "3.5rem", lineHeight: 1.9 }}>
          Turn any screen into a gaming console and use your phones as controllers.
        </p>
        <div style={{ maxWidth: 520, margin: "0 auto 1.5rem", borderRadius: 14, overflow: "hidden", border: "2px solid rgba(255,255,255,0.08)", background: "#111", height: 280 }}>
          <div style={{ height: "100%", background: "linear-gradient(135deg, #0d1117, #1a1a2e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: PX, fontSize: "0.55rem", color: "#222" }}>GAME DISPLAY</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", maxWidth: 540, margin: "0 auto" }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 100, borderRadius: 10, background: "#111", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: PX, fontSize: "0.3rem", color: "#222" }}>P{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Phones + Screen = Console ── */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "clamp(0.75rem, 2.5vw, 2rem)",
          flexWrap: "wrap", justifyContent: "center",
          fontFamily: PX,
          fontSize: "clamp(0.9rem, 2.2vw, 1.4rem)",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <PixelPhoneIcon size={22} /> Phones
          </span>
          <span style={{ color: "#444" }}>+</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <PixelMonitorIcon size={22} /> Screen
          </span>
          <span style={{ color: "#444" }}>=</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", color: "#3b82f6" }}>
            <PixelControllerIcon2 size={22} /> Console
          </span>
        </div>
      </section>

      {/* ── Games ── */}
      <section id="games" style={{ padding: "5rem 3rem 6rem" }}>
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1rem, 2.2vw, 1.5rem)", textAlign: "center", marginBottom: "1rem", lineHeight: 1.9 }}>
          Games you can play
        </h2>
        <p style={{ color: "#666", textAlign: "center", fontSize: "0.95rem", marginBottom: "2.5rem", lineHeight: 1.9 }}>
          Fun multiplayer games you can start in seconds.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "3rem" }}>
          {(["PC", "TV"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "0.65rem 2rem", borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: PX, fontSize: "0.65rem",
              background: activeTab === tab ? "#3b82f6" : "#222",
              color: activeTab === tab ? "#fff" : "#666",
              transition: "all 0.15s",
            }}>{tab}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem", maxWidth: 900, margin: "0 auto 3rem" }}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} style={{
              aspectRatio: "4/3", borderRadius: 12, background: "#111",
              border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer",
              transition: "border-color 0.15s, transform 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
            />
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button style={btnPrimary}>Browse games</button>
        </div>
      </section>

      {/* ── App Stores ── */}
      <section style={{ padding: "3rem 2rem 5rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <AppBadge type="apple" />
        <AppBadge type="google" />
      </section>

      {/* ── FAQs ── */}
      <section id="faqs" style={{ padding: "5rem 2rem 7rem", maxWidth: 620, margin: "0 auto" }}>
        <h2 style={{ fontFamily: PX, fontSize: "clamp(1rem, 2.2vw, 1.5rem)", textAlign: "center", marginBottom: "0.75rem", lineHeight: 1.9 }}>FAQs</h2>
        <p style={{ color: "#666", textAlign: "center", fontSize: "0.9rem", marginBottom: "3rem", lineHeight: 1.9 }}>
          You need further assistance? Visit our{" "}
          <a href="#" style={{ color: "#3b82f6" }}>Help section</a>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderRadius: 12, background: "#111", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "1.1rem 1.4rem", background: "transparent", border: "none",
                color: "#e5e5e5", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", textAlign: "left", gap: "1rem",
              }}>
                {faq.q}
                <span style={{ color: "#555", flexShrink: 0, transition: "transform 0.2s", display: "inline-block", transform: openFaq === i ? "rotate(180deg)" : "none" }}>▾</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 1.4rem 1.1rem", color: "#777", fontSize: "0.88rem", lineHeight: 1.9 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem", display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "start" }}>
        <div style={{ flex: "0 0 auto" }}>
          <Logo />
          <p style={{ color: "#333", fontSize: "0.8rem", marginTop: "0.75rem" }}>© 2026 PlayLana. All rights reserved.</p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", flex: 1 }}>
          <FooterCol title="Info" links={["Company"]} />
          <FooterCol title="Support" links={["Help", "Contact Us"]} />
          <div>
            <p style={{ fontFamily: PX, fontSize: "0.65rem", color: "#e5e5e5", marginBottom: "1rem" }}>Socials</p>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {SOCIALS.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "#1e1e1e",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#888", textDecoration: "none",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <img
      src="/playlana-logo.png"
      alt="PlayLana"
      style={{ height: 36, width: "auto", objectFit: "contain" }}
    />
  );
}

// ─── Footer column ────────────────────────────────────────────────────────────

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p style={{ fontFamily: PX, fontSize: "0.65rem", color: "#e5e5e5", marginBottom: "1rem" }}>{title}</p>
      {links.map(l => (
        <a key={l} href="#" style={{ display: "block", color: "#555", fontSize: "0.85rem", marginBottom: "0.5rem", textDecoration: "none" }}>{l}</a>
      ))}
    </div>
  );
}

// ─── App store badges ─────────────────────────────────────────────────────────

function AppBadge({ type }: { type: "apple" | "google" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.85rem",
      background: "#111", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14, padding: "0.9rem 1.75rem", cursor: "pointer",
      transition: "border-color 0.15s",
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"}
    >
      {type === "apple"
        ? <FaApple size={26} color="#fff" />
        : <FaGooglePlay size={24} color="#fff" />
      }
      <div>
        <div style={{ fontSize: "0.65rem", color: "#666", marginBottom: 3 }}>
          {type === "apple" ? "Download on the" : "GET IT ON"}
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
          {type === "apple" ? "App Store" : "Google Play"}
        </div>
      </div>
    </div>
  );
}

// ─── Pixel icons ──────────────────────────────────────────────────────────────

function PixelScreenIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" style={{ verticalAlign: "middle", display: "inline-block" }}>
      <rect x="2" y="4" width="24" height="16" rx="2" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="14" y1="20" x2="14" y2="25" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="9" y1="25" x2="19" y2="25" stroke="#3b82f6" strokeWidth="1.5" />
    </svg>
  );
}

function PixelControllerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" style={{ verticalAlign: "middle", display: "inline-block" }}>
      <rect x="2" y="8" width="24" height="12" rx="6" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="8" y1="14" x2="12" y2="14" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="10" y1="12" x2="10" y2="16" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="20" cy="12" r="1.2" fill="#3b82f6" />
      <circle cx="18" cy="16" r="1.2" fill="#3b82f6" />
    </svg>
  );
}

function PixelPhoneIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ verticalAlign: "middle", flexShrink: 0 }}>
      <rect x="4" y="1" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="15" r="0.8" fill="currentColor" />
    </svg>
  );
}

function PixelMonitorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ verticalAlign: "middle", flexShrink: 0 }}>
      <rect x="1" y="2" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="13" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PixelControllerIcon2({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ verticalAlign: "middle", flexShrink: 0 }}>
      <rect x="1" y="5" width="16" height="8" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.5" y1="7.5" x2="6.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="8" r="0.8" fill="currentColor" />
      <circle cx="11.5" cy="10" r="0.8" fill="currentColor" />
    </svg>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const btnPrimary: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "0.9rem 2.25rem",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: "0.75rem",
  cursor: "pointer",
  letterSpacing: "0.04em",
  transition: "opacity 0.15s",
};