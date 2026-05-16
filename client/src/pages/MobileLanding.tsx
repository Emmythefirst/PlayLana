import { FaXTwitter, FaYoutube } from "react-icons/fa6";

const PX = "'Press Start 2P', monospace";
const YELLOW = "#f5c518";
const BLUE = "#3b82f6";
const GREEN = "#22c55e";

const YOUTUBE_URL = "https://www.youtube.com/@playlana";
const X_URL = "https://x.com/playlanadotgg?s=20";

export default function MobileLanding() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      fontFamily: PX,
      padding: "2.5rem 1.5rem 3rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "2.25rem",
    }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <img
        src="/playlana-logo.png"
        alt="PlayLana"
        style={{ height: 44, imageRendering: "pixelated" }}
      />

      <div>
        <h1 style={{
          fontFamily: PX,
          fontSize: "1.4rem",
          lineHeight: 1.6,
          letterSpacing: "0.05em",
          marginBottom: "1rem",
        }}>
          PLAY<span style={{ color: YELLOW }}>LANA</span>
        </h1>
        <p style={{
          fontFamily: PX,
          fontSize: "0.5rem",
          color: "#888",
          lineHeight: 2.4,
        }}>
          The on-chain party<br />game arcade.
        </p>
      </div>

      <div style={{ height: 1, width: "60%", background: "#222" }} />

      <div>
        <p style={{
          fontFamily: PX,
          fontSize: "0.6rem",
          color: YELLOW,
          lineHeight: 2.2,
          marginBottom: "1.5rem",
        }}>
          YOU'RE ON A PHONE —<br />THAT'S YOUR CONTROLLER.
        </p>
        <p style={{
          fontFamily: PX,
          fontSize: "0.5rem",
          color: "#bbb",
          lineHeight: 2.4,
          marginBottom: "1.25rem",
        }}>
          To play PlayLana, open<br />this site on:
        </p>
        <ul style={{
          listStyle: "none",
          fontFamily: PX,
          fontSize: "0.5rem",
          color: "#fff",
          lineHeight: 2.4,
          textAlign: "left",
          display: "inline-block",
        }}>
          <li>· A laptop or desktop</li>
          <li>· A Smart TV browser</li>
          <li>· A tablet</li>
        </ul>
      </div>

      <div style={{
        border: `1px solid ${BLUE}44`,
        background: "#040a18",
        padding: "1.25rem 1rem",
        width: "100%",
        maxWidth: 340,
      }}>
        <p style={{
          fontFamily: PX,
          fontSize: "0.45rem",
          color: "#aaa",
          lineHeight: 2.4,
        }}>
          Once the game is running<br />on the big screen, scan the<br />
          <span style={{ color: BLUE }}>QR code</span> with this phone to join.
        </p>
      </div>

      <div style={{ height: 1, width: "60%", background: "#222" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", width: "100%", maxWidth: 280 }}>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
            padding: "0.95rem 1rem",
            background: BLUE,
            color: "#000",
            fontFamily: PX,
            fontSize: "0.5rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          <FaYoutube size={14} /> WATCH THE DEMO
        </a>
        <a
          href={X_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
            padding: "0.95rem 1rem",
            background: "transparent",
            color: "#fff",
            border: "1px solid #444",
            fontFamily: PX,
            fontSize: "0.5rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          <FaXTwitter size={14} /> FOLLOW ON X
        </a>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <span style={{
          fontFamily: PX,
          fontSize: "0.42rem",
          color: GREEN,
          border: `1px solid ${GREEN}55`,
          padding: "0.4rem 0.7rem",
        }}>
          ✓ BUILT ON SOLANA
        </span>
        <span style={{ fontFamily: PX, fontSize: "0.4rem", color: "#444" }}>
          Colosseum Frontier 2026
        </span>
      </div>
    </div>
  );
}
