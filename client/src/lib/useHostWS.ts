import { useCallback, useEffect, useRef, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type {
  HostState,
  InboundHostMsg,
  OutboundHostMsg,
  ReactToUnity,
  UnityToReact,
} from "@/types/messages";

const COUNTDOWN_SECONDS = 7;

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
  const [countdown, setCountdown] = useState<number | null>(null);
  const registeredRef = useRef(false);
  const startIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsSendRef = useRef<(p: OutboundHostMsg) => void>(() => {});

  const stopRetrying = useCallback(() => {
    if (startIntervalRef.current) {
      clearInterval(startIntervalRef.current);
      startIntervalRef.current = null;
    }
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
  }, []);

  const sendStartToUnity = useCallback(() => {
    stopRetrying();
    stopCountdown();

    const doSend = () => {
      console.log("[React] Sending startCharacterSelect to Unity iframe");
      unityIframeRef.current?.contentWindow?.postMessage(
        { type: "startCharacterSelect", playerCount: 2 },
        "*"
      );
    };

    doSend();
    startIntervalRef.current = setInterval(doSend, 1500);

    setHostState((s) => ({ ...s, currentGame: "CharacterSelect" }));
    wsSendRef.current({ type: "gameInfo", game: "CharacterSelect" });
  }, [unityIframeRef, stopRetrying, stopCountdown]);

  const startCountdown = useCallback(() => {
    // Don't start if already counting down
    if (countdownIntervalRef.current) return;

    setCountdown(COUNTDOWN_SECONDS);

    let remaining = COUNTDOWN_SECONDS;
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownIntervalRef.current!);
        countdownIntervalRef.current = null;
        sendStartToUnity();
      }
    }, 1000);
  }, [sendStartToUnity]);

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

              const bothJoined = players.every((p) => p.joined);
              const bothReady = players.every((p) => p.ready);

              console.log(`[React] Player ${msg.playerIndex} ready. bothJoined: ${bothJoined}, bothReady: ${bothReady}`);

              if (bothJoined && bothReady) {
                console.log("[React] Both players ready — starting 7s countdown");
                setTimeout(() => startCountdown(), 300);
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
    [unityIframeRef, startCountdown]
  );

  const { send, connected } = useWebSocket<InboundHostMsg, OutboundHostMsg>(onServerMessage);

  wsSendRef.current = send;

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

  // Handle postMessages from Unity
  useEffect(() => {
    const handleUnityMessage = (event: MessageEvent) => {
      let raw = event.data;
      if (typeof raw === "string") {
        try { raw = JSON.parse(raw); } catch { return; }
      }
      const msg = raw as UnityToReact;
      if (!msg?.type) return;

      switch (msg.type) {
        case "gameInfo":
          if (msg.game === "CharacterSelect") {
            console.log("[React] Unity confirmed CharacterSelect — stopping retry");
            stopRetrying();
          }
          setHostState((s) => ({
            ...s,
            currentGame: msg.game,
            round: "waiting",
            winner: null,
          }));
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRetrying();
      stopCountdown();
    };
  }, [stopRetrying, stopCountdown]);

  return { hostState, connected, countdown };
}