import { useCallback, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type {
  ControllerState,
  Direction,
  InboundPhoneMsg,
  OutboundPhoneMsg,
} from "@/types/messages";

const DEFAULT_STATE: ControllerState = {
  playerIndex: null,
  currentGame: "Lobby",
  scores: [0, 0],
  timer: null,
  round: "waiting",
  alive: [true, true],
  winner: null,
};

export function useControllerWS(roomCode: string) {
  const [state, setState] = useState<ControllerState>(DEFAULT_STATE);
  const sessionKey = `playlana_session_${roomCode}`;

  const onMessage = useCallback(
    (msg: InboundPhoneMsg) => {
      switch (msg.type) {
        case "joined":
          setState((s) => ({ ...s, playerIndex: msg.playerIndex }));
          localStorage.setItem(sessionKey, msg.sessionToken);
          navigator.vibrate?.(100);
          break;
        case "gameInfo":
          setState((s) => ({ ...s, currentGame: msg.game }));
          navigator.vibrate?.(50);
          break;
        case "state":
          setState((s) => ({
            ...s,
            ...(msg.scores !== undefined && { scores: msg.scores as [number, number] }),
            ...(msg.timer !== undefined && { timer: msg.timer }),
            ...(msg.round !== undefined && { round: msg.round }),
            ...(msg.alive !== undefined && { alive: msg.alive as [boolean, boolean] }),
          }));
          break;
        case "roundOver":
          setState((s) => ({ ...s, winner: msg.winner, round: "over" }));
          navigator.vibrate?.([200, 100, 200]);
          break;
        case "playerJoined":
          navigator.vibrate?.(30);
          break;
        case "playerLeft":
          break;
        case "error":
          console.error("[Controller] Server error:", msg.message);
          break;
      }
    },
    [sessionKey]
  );

  const { send, connected } = useWebSocket<InboundPhoneMsg, OutboundPhoneMsg>(onMessage);

  const join = useCallback(() => {
    const sessionToken = localStorage.getItem(sessionKey) ?? undefined;
    send({ type: "join", roomCode, ...(sessionToken && { sessionToken }) });
  }, [send, roomCode, sessionKey]);

  const sendMove   = useCallback((direction: Direction) => send({ type: "move", direction }), [send]);
  const sendJump   = useCallback(() => send({ type: "jump" }), [send]);
  const sendTap    = useCallback(() => { send({ type: "tap" }); navigator.vibrate?.(15); }, [send]);
  const sendReady  = useCallback(() => send({ type: "ready" }), [send]);
  const sendWallet = useCallback((wallet: string) => send({ type: "wallet", wallet }), [send]);

  return { state, connected, join, sendMove, sendJump, sendTap, sendReady, sendWallet };
}