import { useState, useCallback } from "react";

interface Props {
  onTap: () => void;
  label?: string;
  sublabel?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function TapController({ onTap, label = "TAP", sublabel = "Tap as fast as you can!" }: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
    setPressed(true);
    onTap();
  }, [onTap]);

  const handlePointerUp = useCallback(() => {
    setPressed(false);
  }, []);

  return (
    <div style={{ height: "100%", padding: "1rem", display: "flex" }}>
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes tapPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>

      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 28,
          border: `2px solid ${pressed ? "rgba(59,130,246,0.8)" : "rgba(59,130,246,0.3)"}`,
          background: pressed ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.08)",
          color: "#3b82f6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          touchAction: "none",
          userSelect: "none",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.06s, border-color 0.06s",
          animation: "tapPulse 2s ease-in-out infinite",
        }}
      >
        {/* Ripples */}
        {ripples.map(rp => (
          <span key={rp.id} style={{
            position: "absolute",
            left: rp.x,
            top: rp.y,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.4)",
            transform: "translate(-50%, -50%) scale(0)",
            animation: "ripple 0.6s ease-out forwards",
            pointerEvents: "none",
          }} />
        ))}

        <span style={{ fontSize: "3.5rem", lineHeight: 1 }}>👆</span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "1.4rem",
          letterSpacing: "0.1em",
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.4rem",
          color: "#555",
          letterSpacing: "0.06em",
          lineHeight: 2,
        }}>
          {sublabel}
        </span>
      </button>
    </div>
  );
}