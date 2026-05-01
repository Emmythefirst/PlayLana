import { WebSocketServer, WebSocket } from "ws";
import crypto from "crypto";
import {
  PhoneMessage,
  HostMessage,
} from "./types.js";
import {
  createRoom,
  getRoom,
  deleteRoom,
  getRoomByHost,
  getRoomByPlayer,
  getPlayerIndex,
  playerCount,
  broadcast,
} from "./roomManager.js";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

function send(ws: WebSocket, payload: object): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function generateToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

interface TaggedWS extends WebSocket {
  _role?: "host" | "player";
  _roomCode?: string;
}

wss.on("connection", (rawWs: WebSocket) => {
  const ws = rawWs as TaggedWS;
  console.log("[WS] New connection");

  ws.on("message", (raw) => {
    let msg: PhoneMessage | HostMessage;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      send(ws, { type: "error", message: "Invalid JSON" });
      return;
    }

    if (msg.type === "host") {
      const { roomCode } = msg;
      if (getRoom(roomCode)) {
        send(ws, { type: "error", message: "Room already exists" });
        return;
      }
      createRoom(roomCode, ws);
      ws._role = "host";
      ws._roomCode = roomCode;
      send(ws, { type: "roomCreated", roomCode });
      console.log(`[ROOM] Created: ${roomCode}`);
      return;
    }

    if (msg.type === "join") {
      const { roomCode, sessionToken } = msg;
      const room = getRoom(roomCode);
      if (!room) {
        send(ws, { type: "error", message: "Room not found" });
        return;
      }

      if (sessionToken && room.sessionTokens.has(sessionToken)) {
        const playerIndex = room.sessionTokens.get(sessionToken)!;
        room.players[playerIndex] = ws;
        ws._role = "player";
        ws._roomCode = roomCode;
        send(ws, { type: "joined", playerIndex, sessionToken });
        if (room.host) {
          send(room.host, {
            type: "playerJoined",
            playerIndex,
            playerCount: playerCount(room),
          });
        }
        console.log(`[ROOM] ${roomCode}: Player ${playerIndex} reconnected`);
        return;
      }

      const slot = room.players.indexOf(null);
      if (slot === -1) {
        send(ws, { type: "error", message: "Room full" });
        return;
      }

      const token = generateToken();
      room.players[slot] = ws;
      room.sessionTokens.set(token, slot);
      ws._role = "player";
      ws._roomCode = roomCode;

      const count = playerCount(room);
      send(ws, { type: "joined", playerIndex: slot, sessionToken: token });
      if (room.host) {
        send(room.host, { type: "playerJoined", playerIndex: slot, playerCount: count });
      }
      broadcast(room, { type: "playerJoined", playerCount: count }, ws);
      console.log(`[ROOM] ${roomCode}: Player ${slot} joined (${count}/4)`);
      return;
    }

    if (ws._role === "player") {
      const found = getRoomByPlayer(ws);
      if (!found || !found.room.host) return;

      const { room } = found;
      const playerIndex = getPlayerIndex(room, ws);

      const inputMsg = (() => {
        if (msg.type === "move")
          return { type: "input", inputType: "move", playerIndex, direction: msg.direction };
        if (msg.type === "jump")
          return { type: "input", inputType: "jump", playerIndex };
        if (msg.type === "tap")
          return { type: "input", inputType: "tap", playerIndex };
        if (msg.type === "ready")
          return { type: "input", inputType: "ready", playerIndex };
        return null;
      })();

      if (inputMsg && room.host) send(room.host, inputMsg);
      return;
    }

    if (ws._role === "host") {
      const found = getRoomByHost(ws);
      if (!found) return;
      broadcast(found.room, msg);
      return;
    }

    send(ws, { type: "error", message: "Send 'host' or 'join' first" });
  });

  ws.on("close", () => {
    if (ws._role === "host") {
      const code = ws._roomCode!;
      const room = getRoom(code);
      if (room) {
        broadcast(room, { type: "error", message: "Host disconnected" });
        deleteRoom(code);
        console.log(`[ROOM] ${code}: Host left, room closed`);
      }
      return;
    }

    if (ws._role === "player") {
      const found = getRoomByPlayer(ws);
      if (!found) return;
      const { code, room } = found;
      const playerIndex = getPlayerIndex(room, ws);
      room.players[playerIndex] = null;

      const count = playerCount(room);
      if (room.host) {
        send(room.host, { type: "playerLeft", playerIndex, playerCount: count });
      }
      broadcast(room, { type: "playerLeft", playerIndex }, ws);
      console.log(`[ROOM] ${code}: Player ${playerIndex} disconnected (${count}/4)`);
    }
  });

  ws.on("error", (err) => console.error("[WS] Error:", err.message));
});

console.log(`[PlayLana] WebSocket server running on ws://localhost:${PORT}`);