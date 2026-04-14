import { useCallback } from "react";
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
  const press = useCallback((dir: Direction) => () => onMove(dir), [onMove]);
  const release = useCallback(() => onMove("none"), [onMove]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 80px)", gridTemplateRows: "repeat(3, 80px)", gap: 8 }}>
        {/* Up */}
        <div />
        <DpadButton
          label="↑"
          disabled={!enableUp}
          onPress={press("up")}
          onRelease={release}
        />
        <div />

        {/* Left · Center · Right */}
        <DpadButton label="←" disabled={!enableLeft} onPress={press("left")} onRelease={release} />
        <div style={{ borderRadius: 12, background: "#1a1a1a", border: "1px solid var(--border)" }} />
        <DpadButton label="→" disabled={!enableRight} onPress={press("right")} onRelease={release} />

        {/* Down */}
        <div />
        <DpadButton label="↓" disabled={!enableDown} onPress={press("down")} onRelease={release} />
        <div />
      </div>
    </div>
  );
}

function DpadButton({
  label,
  disabled,
  onPress,
  onRelease,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
  onRelease: () => void;
}) {
  if (disabled) return <div />;

  return (
    <button
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPress(); }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#1e1e1e",
        color: "#fff",
        fontSize: "1.6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        transition: "background 0.08s",
        cursor: "pointer",
      }}
      onPointerDownCapture={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#3b82f6";
      }}
      onPointerUpCapture={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#1e1e1e";
      }}
    >
      {label}
    </button>
  );
}