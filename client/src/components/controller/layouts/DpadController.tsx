import { useCallback, useState } from "react";
import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  enableUp?: boolean;
  enableDown?: boolean;
  enableLeft?: boolean;
  enableRight?: boolean;
}

export function DpadController({
  onMove,
  enableUp = true,
  enableDown = true,
  enableLeft = true,
  enableRight = true,
}: Props) {
  const [active, setActive] = useState<Direction | null>(null);

  const press = useCallback((dir: Direction) => {
    setActive(dir);
    navigator.vibrate?.(18);
    onMove(dir);
  }, [onMove]);

  const release = useCallback(() => {
    setActive(null);
    onMove("none");
  }, [onMove]);

  const ARM = 90;   // arm length
  const THICK = 90; // arm thickness
  const GAP = 0;

  const armStyle = (dir: Direction, isActive: boolean): React.CSSProperties => ({
    width: dir === "left" || dir === "right" ? ARM : THICK,
    height: dir === "up" || dir === "down" ? ARM : THICK,
    background: isActive ? "#2a2a2a" : "#1a1a1a",
    border: `2px solid ${isActive ? "#555" : "#2a2a2a"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none",
    cursor: "pointer",
    userSelect: "none",
    transition: "background 0.06s, border-color 0.06s",
    borderRadius: dir === "up" ? "12px 12px 0 0"
      : dir === "down" ? "0 0 12px 12px"
      : dir === "left" ? "12px 0 0 12px"
      : "0 12px 12px 0",
  });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "1rem",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: GAP }}>

        {/* Up */}
        {enableUp && (
          <button
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("up"); }}
            onPointerUp={release} onPointerCancel={release}
            style={armStyle("up", active === "up")}
          >
            <span style={{ fontSize: "1.8rem", color: active === "up" ? "#fff" : "#555" }}>▲</span>
          </button>
        )}

        {/* Middle row: left + center + right */}
        <div style={{ display: "flex", alignItems: "center", gap: GAP }}>
          {enableLeft && (
            <button
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("left"); }}
              onPointerUp={release} onPointerCancel={release}
              style={armStyle("left", active === "left")}
            >
              <span style={{ fontSize: "1.8rem", color: active === "left" ? "#fff" : "#555" }}>◀</span>
            </button>
          )}

          {/* Center nub */}
          <div style={{
            width: THICK,
            height: THICK,
            background: "#111",
            border: "2px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#222", border: "2px solid #333" }} />
          </div>

          {enableRight && (
            <button
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("right"); }}
              onPointerUp={release} onPointerCancel={release}
              style={armStyle("right", active === "right")}
            >
              <span style={{ fontSize: "1.8rem", color: active === "right" ? "#fff" : "#555" }}>▶</span>
            </button>
          )}
        </div>

        {/* Down */}
        {enableDown && (
          <button
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press("down"); }}
            onPointerUp={release} onPointerCancel={release}
            style={armStyle("down", active === "down")}
          >
            <span style={{ fontSize: "1.8rem", color: active === "down" ? "#fff" : "#555" }}>▼</span>
          </button>
        )}
      </div>
    </div>
  );
}