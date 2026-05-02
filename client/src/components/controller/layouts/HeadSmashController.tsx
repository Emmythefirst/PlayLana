import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  onJump: () => void;
}

export function HeadSmashController({ onMove, onJump }: Props) {
  const release = () => onMove("none");

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      height: "100%",
      padding: "1.5rem",
      gap: "1.5rem",
      alignItems: "center",
    }}>

      {/* LEFT THUMB — Big circular JUMP */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button
          onPointerDown={(e) => {
            e.currentTarget.style.transform = "scale(0.93)";
            e.currentTarget.style.boxShadow = "0 0 40px rgba(59,130,246,0.8), 0 0 80px rgba(59,130,246,0.4)";
            e.currentTarget.style.background = "rgba(59,130,246,0.5)";
            navigator.vibrate?.(30);
            onJump();
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.3)";
            e.currentTarget.style.background = "rgba(59,130,246,0.15)";
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.3)";
            e.currentTarget.style.background = "rgba(59,130,246,0.15)";
          }}
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "3px solid rgba(59,130,246,0.6)",
            background: "rgba(59,130,246,0.15)",
            color: "#3b82f6",
            fontSize: "0.65rem",
            fontFamily: "'Press Start 2P', monospace",
            fontWeight: 700,
            letterSpacing: "0.1em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            touchAction: "none",
            userSelect: "none",
            cursor: "pointer",
            boxShadow: "0 0 24px rgba(59,130,246,0.3)",
            transition: "transform 0.08s, box-shadow 0.08s, background 0.08s",
          }}
        >
          <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>⬆</span>
          JUMP
        </button>
      </div>

      {/* RIGHT THUMB — Left / Right stacked */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        {(["left", "right"] as const).map((dir) => (
          <button
            key={dir}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "scale(0.95)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              navigator.vibrate?.(20);
              onMove(dir);
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              release();
            }}
            onPointerCancel={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              release();
            }}
            style={{
              width: "100%",
              height: 110,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#1a1a1a",
              color: "#fff",
              fontSize: "2.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none",
              userSelect: "none",
              cursor: "pointer",
              transition: "background 0.08s, transform 0.08s, border-color 0.08s",
            }}
          >
            {dir === "left" ? "←" : "→"}
          </button>
        ))}
      </div>
    </div>
  );
}