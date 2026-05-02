import { useCallback, useState } from "react";
import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  enableUp?: boolean;
  enableDown?: boolean;
  enableLeft?: boolean;
  enableRight?: boolean;
}

type ActiveDir = Direction | null;

export function DpadController({
  onMove,
  enableUp = true,
  enableDown = true,
  enableLeft = true,
  enableRight = true,
}: Props) {
  const [active, setActive] = useState<ActiveDir>(null);

  const press = useCallback((dir: Direction) => {
    setActive(dir);
    navigator.vibrate?.(20);
    onMove(dir);
  }, [onMove]);

  const release = useCallback(() => {
    setActive(null);
    onMove("none");
  }, [onMove]);

  const SIZE = 300;
  const CENTER = SIZE / 2;
  const INNER_R = 58;
  const ARROW_OFFSET = 94;

  const dirs: { dir: Direction; label: string; x: number; y: number; enabled: boolean }[] = [
    { dir: "up",    label: "▲", x: CENTER,                y: CENTER - ARROW_OFFSET, enabled: enableUp },
    { dir: "down",  label: "▼", x: CENTER,                y: CENTER + ARROW_OFFSET, enabled: enableDown },
    { dir: "left",  label: "◀", x: CENTER - ARROW_OFFSET, y: CENTER,               enabled: enableLeft },
    { dir: "right", label: "▶", x: CENTER + ARROW_OFFSET, y: CENTER,               enabled: enableRight },
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "1rem",
    }}>
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>

        {/* Outer dark circle */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, #2e2e2e 0%, #1a1a1a 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.05)",
        }} />

        {/* Active glow */}
        {active && (
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow: "inset 0 0 40px rgba(59,130,246,0.2)",
            pointerEvents: "none",
            zIndex: 1,
          }} />
        )}

        {/* Direction hit zones */}
        {dirs.map(({ dir, x, y, label, enabled }) => {
          if (!enabled) return null;
          const isActive = active === dir;
          return (
            <button
              key={dir}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                press(dir);
              }}
              onPointerUp={release}
              onPointerCancel={release}
              style={{
                position: "absolute",
                left: x - 56,
                top: y - 56,
                width: 112,
                height: 112,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <span style={{
                fontSize: 24,
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.3)",
                transform: isActive ? "scale(1.4)" : "scale(1)",
                transition: "color 0.07s, transform 0.07s",
                display: "block",
                lineHeight: 1,
              }}>
                {label}
              </span>
            </button>
          );
        })}

        {/* Center white circle */}
        <div style={{
          position: "absolute",
          left: CENTER - INNER_R,
          top: CENTER - INNER_R,
          width: INNER_R * 2,
          height: INNER_R * 2,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: active
            ? "0 0 20px rgba(255,255,255,0.5)"
            : "0 3px 10px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.08s",
          zIndex: 3,
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}