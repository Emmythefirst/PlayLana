import { useState } from "react";

interface Props {
  onTap: () => void;
  label?: string;
  sublabel?: string;
}

export function TapController({ onTap, label = "TAP", sublabel = "Tap as fast as you can!" }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <div style={{ height: "100%", padding: "1.25rem", display: "flex" }}>
      <button
        onPointerDown={() => {
          setPressed(true);
          navigator.vibrate?.(15);
          onTap();
        }}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 24,
          border: `2px solid ${pressed ? "#5a9af5" : "#2a4a7f"}`,
          background: pressed ? "#1a3a6e" : "#0d1f3c",
          color: "#3b82f6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          touchAction: "none",
          userSelect: "none",
          cursor: "pointer",
          transition: "background 0.06s, border-color 0.06s",
        }}
      >
        <span style={{ fontSize: "4rem", lineHeight: 1 }}>👆</span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "2rem",
          color: "#3b82f6",
          letterSpacing: "0.1em",
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.4rem",
          color: "#445",
          letterSpacing: "0.08em",
        }}>
          {sublabel}
        </span>
      </button>
    </div>
  );
}