import { useCallback, useEffect, useRef } from "react";
import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  onJump: () => void;
}

export function HeadSmashController({ onMove, onJump }: Props) {
  // Track which direction (if any) is currently held. Per-button so a stray
  // release on LEFT can't clear the state when RIGHT is still pressed.
  const activeDir = useRef<Direction | null>(null);

  const press = useCallback((dir: Direction) => {
    if (activeDir.current === dir) return;
    activeDir.current = dir;
    onMove(dir);
  }, [onMove]);

  const release = useCallback((dir: Direction) => {
    if (activeDir.current !== dir) return;
    activeDir.current = null;
    onMove("none");
  }, [onMove]);

  // Failsafe — if this controller unmounts (scene switch, game ends) while a
  // button is still considered pressed, tell Unity to stop moving.
  useEffect(() => {
    return () => {
      if (activeDir.current !== null) {
        activeDir.current = null;
        onMove("none");
      }
    };
  }, [onMove]);

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
            e.currentTarget.setPointerCapture(e.pointerId);
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
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span style={{ fontSize: "2rem", lineHeight: 1 }}>↑</span>
          JUMP
        </button>
      </div>

      {/* RIGHT — left + right round buttons */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 88, height: 88 }} /> {/* spacer for layout symmetry */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <DirBtn label="←" dir="left"  onPress={press} onRelease={release} />
          <DirBtn label="→" dir="right" onPress={press} onRelease={release} />
        </div>
      </div>
    </div>
  );
}

function DirBtn({ label, dir, onPress, onRelease }: {
  label: string;
  dir: Direction;
  onPress: (d: Direction) => void;
  onRelease: (d: Direction) => void;
}) {
  return (
    <button
      onPointerDown={(e) => {
        // Pointer capture guarantees this element receives the matching
        // pointerup/cancel even if the finger slides off the button —
        // without it, sliding off leaves the direction stuck.
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.style.background = "#333";
        e.currentTarget.style.transform = "scale(0.93)";
        onPress(dir);
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.background = "#1c1c1c";
        e.currentTarget.style.transform = "scale(1)";
        onRelease(dir);
      }}
      onPointerCancel={(e) => {
        e.currentTarget.style.background = "#1c1c1c";
        e.currentTarget.style.transform = "scale(1)";
        onRelease(dir);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.background = "#1c1c1c";
        e.currentTarget.style.transform = "scale(1)";
        onRelease(dir);
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
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}
