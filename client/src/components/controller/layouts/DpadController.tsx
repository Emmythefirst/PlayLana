import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction } from "@/types/messages";

interface Props {
  onMove: (dir: Direction) => void;
  enableUp?: boolean;
  enableDown?: boolean;
  enableLeft?: boolean;
  enableRight?: boolean;
}

/**
 * Mobile-first single cross D-pad. Supports both tap (single direction event)
 * and hold (direction stays "active" until pointer release / cancel) — Unity
 * receives the "left"/"right"/etc. message on press, and "none" on release.
 */
export function DpadController({
  onMove,
  enableUp = true,
  enableDown = true,
  enableLeft = true,
  enableRight = true,
}: Props) {
  const activeDir = useRef<Direction | null>(null);
  const [highlight, setHighlight] = useState<Direction | null>(null);

  const press = useCallback((dir: Direction) => {
    if (activeDir.current === dir) return;
    activeDir.current = dir;
    setHighlight(dir);
    navigator.vibrate?.(15);
    onMove(dir);
  }, [onMove]);

  const release = useCallback((dir: Direction) => {
    if (activeDir.current !== dir) return;
    activeDir.current = null;
    setHighlight(null);
    onMove("none");
  }, [onMove]);

  // Failsafe — if this controller unmounts mid-press (game ends, scene
  // switch), make sure Unity stops moving the player.
  useEffect(() => {
    return () => {
      if (activeDir.current !== null) {
        activeDir.current = null;
        onMove("none");
      }
    };
  }, [onMove]);

  // Sizes — tuned for thumb reach in landscape
  const ARM = 96;            // each arm of the cross
  const SIZE = ARM * 3;

  const BASE = "#15171a";
  const ACTIVE = "#2563eb";  // blue press highlight
  const BORDER = "#2a2d33";
  const ARROW = "#6b7280";
  const ARROW_ACTIVE = "#ffffff";

  const arms: Array<{ dir: Direction; label: string; enabled: boolean; x: number; y: number; radius: string }> = [
    { dir: "up",    label: "▲", enabled: enableUp,    x: ARM,     y: 0,       radius: "18px 18px 4px 4px" },
    { dir: "down",  label: "▼", enabled: enableDown,  x: ARM,     y: ARM * 2, radius: "4px 4px 18px 18px" },
    { dir: "left",  label: "◀", enabled: enableLeft,  x: 0,       y: ARM,     radius: "18px 4px 4px 18px" },
    { dir: "right", label: "▶", enabled: enableRight, x: ARM * 2, y: ARM,     radius: "4px 18px 18px 4px" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        padding: "1rem",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
        {/* Cross silhouette */}
        <svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <path
            d={`M${ARM},0 h${ARM} v${ARM} h${ARM} v${ARM} h-${ARM} v${ARM} h-${ARM} v-${ARM} h-${ARM} v-${ARM} h${ARM} Z`}
            fill={BASE}
            stroke={BORDER}
            strokeWidth="2"
          />
        </svg>

        {/* Arm buttons */}
        {arms.map(({ dir, label, enabled, x, y, radius }) => {
          if (!enabled) return null;
          const isActive = highlight === dir;
          return (
            <button
              key={dir}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                press(dir);
              }}
              onPointerUp={() => release(dir)}
              onPointerCancel={() => release(dir)}
              onPointerLeave={() => release(dir)}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: ARM,
                height: ARM,
                margin: 0,
                padding: 0,
                background: isActive ? ACTIVE : "transparent",
                border: "none",
                borderRadius: radius,
                color: isActive ? ARROW_ACTIVE : ARROW,
                fontSize: "1.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
                cursor: "pointer",
                transition: "background 0.06s, color 0.06s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span style={{ pointerEvents: "none" }}>{label}</span>
            </button>
          );
        })}

        {/* Center hub (decorative) */}
        <div
          style={{
            position: "absolute",
            left: ARM,
            top: ARM,
            width: ARM,
            height: ARM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#1d2025",
              border: `2px solid ${BORDER}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
