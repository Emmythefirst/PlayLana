import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  onJump: () => void;
}

function RoundBtn({ label, onPress, onRelease }: {
  label: string;
  onPress: () => void;
  onRelease?: () => void;
  color?: string;
}) {
  return (
    <button
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.style.background = "#333";
        e.currentTarget.style.transform = "scale(0.93)";
        onPress();
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.background = "#1c1c1c";
        e.currentTarget.style.transform = "scale(1)";
        onRelease?.();
      }}
      onPointerCancel={(e) => {
        e.currentTarget.style.background = "#1c1c1c";
        e.currentTarget.style.transform = "scale(1)";
        onRelease?.();
      }}
      style={{
        width: 88,
        height: 88,
        borderRadius: "50%",
        border: "2px solid #333",
        background: "#1c1c1c",
        color: "#fff",
        fontSize: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
        cursor: "pointer",
        transition: "background 0.07s, transform 0.07s",
      }}
    >
      {label}
    </button>
  );
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
      justifyContent: "space-between",
    }}>

      {/* LEFT — big circular JUMP */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button
          onPointerDown={(e) => {
            e.currentTarget.style.background = "#1a3a6e";
            e.currentTarget.style.transform = "scale(0.94)";
            navigator.vibrate?.(30);
            onJump();
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.background = "#162040";
            e.currentTarget.style.transform = "scale(1)";
          }}
          onPointerCancel={(e) => {
            e.currentTarget.style.background = "#162040";
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "3px solid #3b82f6",
            background: "#162040",
            color: "#3b82f6",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            touchAction: "none",
            userSelect: "none",
            cursor: "pointer",
            transition: "background 0.07s, transform 0.07s",
          }}
        >
          <span style={{ fontSize: "2rem", lineHeight: 1 }}>↑</span>
          JUMP
        </button>
      </div>

      {/* RIGHT — 3 round buttons: up top, left+right bottom */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        {/* Up button — not used in HeadSmash but kept for layout symmetry */}
        <div style={{ width: 88, height: 88 }} /> {/* spacer */}

        {/* Left + Right */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <RoundBtn label="←" onPress={() => onMove("left")} onRelease={release} />
          <RoundBtn label="→" onPress={() => onMove("right")} onRelease={release} />
        </div>
      </div>
    </div>
  );
}