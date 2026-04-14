import { useEffect, useRef, useCallback, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080";

export type MessageHandler<T> = (msg: T) => void;

export function useWebSocket<TIn, TOut>(onMessage: MessageHandler<TIn>) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const unmounted = useRef(false);

  onMessageRef.current = onMessage;

  useEffect(() => {
    unmounted.current = false;

    function connect() {
      if (unmounted.current) return;

      // Close any existing connection before opening a new one
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (unmounted.current) return;
        setConnected(true);
        console.log("[WS] Connected");
      };

      ws.onclose = () => {
        if (unmounted.current) return;
        setConnected(false);
        console.log("[WS] Disconnected — reconnecting in 2s…");
        reconnectTimer.current = setTimeout(connect, 2000);
      };

      ws.onerror = (e) => console.error("[WS] Error", e);

      ws.onmessage = (event) => {
        if (unmounted.current) return;
        try {
          const msg = JSON.parse(event.data as string) as TIn;
          onMessageRef.current(msg);
        } catch {
          console.error("[WS] Bad JSON", event.data);
        }
      };
    }

    connect();

    return () => {
      unmounted.current = true;
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // runs once on mount only

  const send = useCallback((payload: TOut) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { send, connected };
}