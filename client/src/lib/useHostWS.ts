import { useCallback, useEffect, useRef, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type {
  HostState,
  InboundHostMsg,
  OutboundHostMsg,
  ReactToUnity,
  UnityToReact,
} from "@/types/messages";

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

const INITIAL_STATE = (roomCode: string): HostState => ({
  roomCode,
  players: [
    { joined: false, ready: false },
    { joined: false, ready: false },
  ],
  currentGame: "Lobby",
  scores: [0, 0],
  timer: null,
  round: "waiting",
  winner: null,
});

export function useHostWS(unityIframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const roomCode = useRef(generateRoomCode()).current;
  const [hostState, setHostState] = useState<HostState>(INITIAL_STATE(roomCode));
  const registeredRef = useRef(false);

  const onServerMessage = useCallback(
    (msg: InboundHostMsg) => {
      switch (msg.type) {
        case "roomCreated":
          break;

        case "playerJoined":
          setHostState((s) => {
            const players = [...s.players] as HostState["players"];
            players[msg.playerIndex] = { joined: true, ready: false };
            return { ...s, players };
          });
          break;

        case "playerLeft":
          setHostState((s) => {
            const players = [...s.players] as HostState["players"];
            players[msg.playerIndex] = { joined: false, ready: false };
            return { ...s, players };
          });
          break;

        case "input": {
          const unityMsg: ReactToUnity = {
            type: "input",
            inputType: msg.inputType,
            playerIndex: msg.playerIndex,
            ...(msg.direction && { direction: msg.direction }),
          };
          unityIframeRef.current?.contentWindow?.postMessage(unityMsg, "*");

          if (msg.inputType === "ready") {
            setHostState((s) => {
              const players = [...s.players] as HostState["players"];
              if (players[msg.playerIndex]) {
                players[msg.playerIndex] = { ...players[msg.playerIndex], ready: true };
              }
              return { ...s, players };
            });
          }
          break;
        }

        case "error":
          console.error("[Host] Server error:", msg.message);
          break;
      }
    },
    [unityIframeRef]
  );

  const { send, connected } = useWebSocket<InboundHostMsg, OutboundHostMsg>(onServerMessage);

  useEffect(() => {
    if (connected && !registeredRef.current) {
      const t = setTimeout(() => {
        send({ type: "host", roomCode });
        registeredRef.current = true;
      }, 100);
      return () => clearTimeout(t);
    }
    if (!connected) {
      registeredRef.current = false;
    }
  }, [connected, send, roomCode]);

  useEffect(() => {
    const handleUnityMessage = (event: MessageEvent) => {
      const msg = event.data as UnityToReact;
      if (!msg?.type) return;

      switch (msg.type) {
        case "gameInfo":
          setHostState((s) => ({ ...s, currentGame: msg.game }));
          send({ type: "gameInfo", game: msg.game });
          break;

        case "state": {
          const { type: _, ...rest } = msg;
          setHostState((s) => ({
            ...s,
            ...(rest.scores && { scores: rest.scores as [number, number] }),
            ...(rest.timer !== undefined && { timer: rest.timer }),
            ...(rest.round && { round: rest.round }),
          }));
          send({ type: "state", ...rest });
          break;
        }

        case "roundOver":
          setHostState((s) => ({ ...s, winner: msg.winner, round: "over" }));
          send({ type: "roundOver", winner: msg.winner });
          break;
      }
    };

    window.addEventListener("message", handleUnityMessage);
    return () => window.removeEventListener("message", handleUnityMessage);
  }, [send]);

  return { hostState, connected };
}