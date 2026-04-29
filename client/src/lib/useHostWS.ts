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

  // Retry interval — keeps sending startCharacterSelect until Unity confirms
  const startIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRetrying = useCallback(() => {
    if (startIntervalRef.current) {
      clearInterval(startIntervalRef.current);
      startIntervalRef.current = null;
    }
  }, []);

  const sendStartToUnity = useCallback(() => {
    // Stop any existing retry loop
    stopRetrying();

    const doSend = () => {
      console.log("[React] Sending startCharacterSelect to Unity iframe");
      console.log("[React] iframe ref:", unityIframeRef.current);
      unityIframeRef.current?.contentWindow?.postMessage(
        { type: "startCharacterSelect", playerCount: 2 },
        "*"
      );
    };

    // Send immediately then retry every 1.5s until Unity responds
    doSend();
    startIntervalRef.current = setInterval(doSend, 1500);
  }, [unityIframeRef, stopRetrying]);

  // ── Handle messages from WS server ────────────────────────────────────────
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
          // Relay all inputs to Unity
          const unityMsg: ReactToUnity = {
            type: "input",
            inputType: msg.inputType,
            playerIndex: msg.playerIndex,
            ...(msg.direction && { direction: msg.direction }),
          };
          unityIframeRef.current?.contentWindow?.postMessage(unityMsg, "*");

          // Track ready state
          if (msg.inputType === "ready") {
            setHostState((s) => {
              const players = [...s.players] as HostState["players"];
              if (players[msg.playerIndex]) {
                players[msg.playerIndex] = { ...players[msg.playerIndex], ready: true };
              }

              // Require BOTH players to be joined AND ready before starting
              const bothJoined = players.every((p) => p.joined);
              const bothReady = players.every((p) => p.ready);

              console.log(`[React] Player ${msg.playerIndex} ready. bothJoined: ${bothJoined}, bothReady: ${bothReady}`);

              if (bothJoined && bothReady) {
                console.log("[React] Both players joined and ready — sending startCharacterSelect");
                setTimeout(() => sendStartToUnity(), 300);
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
    [unityIframeRef, sendStartToUnity]
  );

  const { send, connected } = useWebSocket<InboundHostMsg, OutboundHostMsg>(onServerMessage);

  // Register as host on connect, re-register on reconnect
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

  const resetRound = useCallback(() => {
    setHostState((s) => ({ ...s, round: "waiting", winner: null }));
  }, []);

  // Handle postMessages from Unity
  useEffect(() => {
    const handleUnityMessage = (event: MessageEvent) => {
      // Unity jslib may send a JSON string or a parsed object — handle both
      let raw = event.data;
      if (typeof raw === "string") {
        try { raw = JSON.parse(raw); } catch { return; }
      }
      const msg = raw as UnityToReact;
      if (!msg?.type) return;

      switch (msg.type) {
        case "gameInfo":
          // Unity confirmed character select — stop retrying
          if (msg.game === "CharacterSelect") {
            console.log("[React] Unity confirmed CharacterSelect — stopping retry");
            stopRetrying();
          }
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
  }, [send, stopRetrying]);

  // Cleanup retry interval on unmount
  useEffect(() => {
    return () => stopRetrying();
  }, [stopRetrying]);

  return { hostState, connected, resetRound };
}