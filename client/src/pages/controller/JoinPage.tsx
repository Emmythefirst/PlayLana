import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinPage() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const navigate = useNavigate();

  const handleChar = (i: number, val: string) => {
    const char = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const next = [...code];
    next[i] = char;
    setCode(next);
    setError("");

    if (char && i < 3) {
      inputRefs[i + 1].current?.focus();
    }

    if (next.every(Boolean)) {
      navigate(`/controller/${next.join("")}`);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs[i - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setCode(pasted.split(""));
      navigate(`/controller/${pasted}`);
    }
  };

  return (
    <div
      className="controller-root"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2.5rem",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          Play<span style={{ color: "var(--blue)" }}>Lana</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Enter the room code shown on the host screen
        </p>
      </div>

      {/* Code inputs */}
      <div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          {code.map((char, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              value={char}
              maxLength={1}
              autoComplete="off"
              autoCapitalize="characters"
              inputMode="text"
              onChange={(e) => handleChar(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={() => setError("")}
              style={{
                width: 64,
                height: 72,
                textAlign: "center",
                fontSize: "1.8rem",
                fontWeight: 700,
                fontFamily: "var(--font-pixel)",
                background: char ? "rgba(59,130,246,0.12)" : "var(--bg-card)",
                border: `2px solid ${char ? "rgba(59,130,246,0.4)" : "var(--border)"}`,
                borderRadius: 14,
                color: "#fff",
                outline: "none",
                transition: "all 0.15s",
                caretColor: "transparent",
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: "#ef4444", fontSize: "0.8rem", textAlign: "center", marginTop: "0.75rem" }}>
            {error}
          </p>
        )}
      </div>

      {/* Join button */}
      <button
        onClick={() => {
          const full = code.join("");
          if (full.length < 4) {
            setError("Enter all 4 characters");
            return;
          }
          navigate(`/controller/${full}`);
        }}
        style={{
          width: "100%",
          maxWidth: 300,
          padding: "1rem",
          borderRadius: 14,
          border: "none",
          background: "var(--blue)",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.03em",
          transition: "opacity 0.15s",
          opacity: code.every(Boolean) ? 1 : 0.45,
        }}
      >
        Join Game
      </button>

      <p style={{ color: "#333", fontSize: "0.75rem" }}>
        No download needed · Works in any browser
      </p>
    </div>
  );
}