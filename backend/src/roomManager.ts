import { WebSocket } from "ws";
import { Room } from "./types.js";

const rooms = new Map<string, Room>();

export function createRoom(roomCode: string, host: WebSocket): Room {
  const room: Room = {
    host,
    players: [null, null],
    sessionTokens: new Map(),
  };
  rooms.set(roomCode, room);
  return room;
}

export function getRoom(roomCode: string): Room | undefined {
  return rooms.get(roomCode);
}

export function deleteRoom(roomCode: string): void {
  rooms.delete(roomCode);
}

export function getRoomByHost(ws: WebSocket): { code: string; room: Room } | null {
  for (const [code, room] of rooms) {
    if (room.host === ws) return { code, room };
  }
  return null;
}

export function getRoomByPlayer(ws: WebSocket): { code: string; room: Room } | null {
  for (const [code, room] of rooms) {
    if (room.players.includes(ws)) return { code, room };
  }
  return null;
}

export function getPlayerIndex(room: Room, ws: WebSocket): number {
  return room.players.indexOf(ws);
}

export function playerCount(room: Room): number {
  return room.players.filter(Boolean).length;
}

export function broadcast(
  room: Room,
  payload: object,
  exclude?: WebSocket
): void {
  const msg = JSON.stringify(payload);
  for (const player of room.players) {
    if (player && player !== exclude && player.readyState === WebSocket.OPEN) {
      player.send(msg);
    }
  }
}