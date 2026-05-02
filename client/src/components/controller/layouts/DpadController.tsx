import { useCallback, useRef, useState } from "react";
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
  const leftActive = useRef<Direction | null>(null);
  const rightActive = useRef<Direction | null>(null);

  // Visual state — separate from input logic
  const [leftHighlight, setLeftHighlight] = useState<Direction | null>(null);
  const [rightHighlight, setRightHighlight] = useState<Direction | null>(null);

  const pressLeft = useCallback((dir: Direction) => {
    leftActive.current = dir;
    setLeftHighlight(dir);
    navigator.vibrate?.(18);
    onMove(dir);
  }, [onMove]);

  const releaseLeft = useCallback(() => {
    leftActive.current = null;
    setLeftHighlight(null);
    onMove(rightActive.current ?? "none");
  }, [onMove]);

  const pressRight = useCallback((dir: Direction) => {
    rightActive.current = dir;
    setRightHighlight(dir);
    navigator.vibrate?.(18);
    onMove(dir);
  }, [onMove]);

  const releaseRight = useCallback(() => {
    rightActive.current = null;
    setRightHighlight(null);
    onMove(leftActive.current ?? "none");
  }, [onMove]);

  const ARM = 80;
  const BASE = "#1a1a1a";
  const ACTIVE = "#2e2e2e";
  const BORDER = "#333";
  const ARROW_COLOR = "#555";
  const ARROW_ACTIVE = "#fff";

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      padding: "1rem 1.25rem",
    }}>

      {/* ── LEFT: Cross D-pad ── */}
      <CrossDpad
        ARM={ARM}
        BASE={BASE}
        ACTIVE={ACTIVE}
        BORDER={BORDER}
        ARROW_COLOR={ARROW_COLOR}
        ARROW_ACTIVE={ARROW_ACTIVE}
        highlight={leftHighlight}
        enableUp={enableUp}
        enableDown={enableDown}
        enableLeft={enableLeft}
        enableRight={enableRight}
        onPress={pressLeft}
        onRelease={releaseLeft}
      />

      {/* ── RIGHT: 4 circular buttons ── */}
      <CircleDpad
        BASE={BASE}
        ACTIVE={ACTIVE}
        BORDER={BORDER}
        ARROW_COLOR={ARROW_COLOR}
        ARROW_ACTIVE={ARROW_ACTIVE}
        highlight={rightHighlight}
        enableUp={enableUp}
        enableDown={enableDown}
        enableLeft={enableLeft}
        enableRight={enableRight}
        onPress={pressRight}
        onRelease={releaseRight}
      />
    </div>
  );
}

function CrossDpad({ ARM, BASE, ACTIVE, BORDER, ARROW_COLOR, ARROW_ACTIVE, highlight, enableUp, enableDown, enableLeft, enableRight, onPress, onRelease }: any) {
  const dirs = [
    { dir: "up" as const,    label: "▲", enabled: enableUp,    pos: { left: ARM, top: 0 },       radius: "14px 14px 0 0" },
    { dir: "down" as const,  label: "▼", enabled: enableDown,  pos: { left: ARM, top: ARM * 2 }, radius: "0 0 14px 14px" },
    { dir: "left" as const,  label: "◀", enabled: enableLeft,  pos: { left: 0, top: ARM },        radius: "14px 0 0 14px" },
    { dir: "right" as const, label: "▶", enabled: enableRight, pos: { left: ARM * 2, top: ARM }, radius: "0 14px 14px 0" },
  ];

  return (
    <div style={{ position: "relative", width: ARM * 3, height: ARM * 3, flexShrink: 0 }}>
      {/* SVG cross background */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={ARM * 3} height={ARM * 3}>
        <path
          d={`M${ARM},0 h${ARM} v${ARM} h${ARM} v${ARM} h-${ARM} v${ARM} h-${ARM} v-${ARM} h-${ARM} v-${ARM} h${ARM} Z`}
          fill={BASE}
          stroke={BORDER}
          strokeWidth="2"
        />
        {/* Active arm highlight */}
        {highlight === "up" && <rect x={ARM} y={0} width={ARM} height={ARM} fill={ACTIVE} rx="12" />}
        {highlight === "down" && <rect x={ARM} y={ARM * 2} width={ARM} height={ARM} fill={ACTIVE} rx="12" />}
        {highlight === "left" && <rect x={0} y={ARM} width={ARM} height={ARM} fill={ACTIVE} rx="12" />}
        {highlight === "right" && <rect x={ARM * 2} y={ARM} width={ARM} height={ARM} fill={ACTIVE} rx="12" />}
      </svg>

      {dirs.map(({ dir, label, enabled, pos, radius }) => enabled && (
        <button
          key={dir}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPress(dir); }}
          onPointerUp={() => onRelease()}
          onPointerCancel={() => onRelease()}
          style={{
            position: "absolute",
            ...pos,
            width: ARM,
            height: ARM,
            background: "transparent",
            border: "none",
            borderRadius: radius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "none",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <span style={{
            fontSize: "1.5rem",
            color: highlight === dir ? ARROW_ACTIVE : ARROW_COLOR,
            transition: "color 0.07s",
            pointerEvents: "none",
          }}>
            {label}
          </span>
        </button>
      ))}

      {/* Center nub */}
      <div style={{
        position: "absolute",
        left: ARM, top: ARM,
        width: ARM, height: ARM,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", zIndex: 1,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2a2a2a", border: `2px solid ${BORDER}` }} />
      </div>
    </div>
  );
}

function CircleDpad({ BASE, ACTIVE, BORDER, ARROW_COLOR, ARROW_ACTIVE, highlight, enableUp, enableDown, enableLeft, enableRight, onPress, onRelease }: any) {
  const BTN = 80;
  const GAP = 14;
  const MIDDLE_GAP = 36;

  const BtnCircle = ({ dir, label, enabled }: { dir: "up" | "down" | "left" | "right"; label: string; enabled: boolean }) => {
    if (!enabled) return <div style={{ width: BTN, height: BTN }} />;
    const isActive = highlight === dir;
    return (
      <button
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPress(dir); }}
        onPointerUp={() => onRelease()}
        onPointerCancel={() => onRelease()}
        style={{
          width: BTN, height: BTN,
          borderRadius: "50%",
          border: `2px solid ${isActive ? "#555" : BORDER}`,
          background: isActive ? ACTIVE : BASE,
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.07s, border-color 0.07s",
          flexShrink: 0,
        }}
      >
        <span style={{ color: isActive ? ARROW_ACTIVE : ARROW_COLOR, transition: "color 0.07s" }}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: GAP, flexShrink: 0 }}>
      <BtnCircle dir="up" label="▲" enabled={enableUp} />
      <div style={{ display: "flex", gap: MIDDLE_GAP }}>
        <BtnCircle dir="left" label="◀" enabled={enableLeft} />
        <BtnCircle dir="right" label="▶" enabled={enableRight} />
      </div>
      <BtnCircle dir="down" label="▼" enabled={enableDown} />
    </div>
  );
}