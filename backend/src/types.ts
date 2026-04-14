// ─── Directions ─────────────────────────────────────────────────────────────
export type Direction = "up" | "down" | "left" | "right" | "none";

export type GameName =
  | "Lobby"
  | "CrossingRoad"
  | "HeadSmash"
  | "UFOEscape"
  | "FlappyGame";

export type RoundState = "waiting" | "active" | "over";

// ─── Phone → Server ──────────────────────────────────────────────────────────
export type PhoneMessage =
  | { type: "join"; roomCode: string; sessionToken?: string }
  | { type: "move"; direction: Direction }
  | { type: "jump" }
  | { type: "tap" }
  | { type: "ready" };

// ─── Host (React screen) → Server ───────────────────────────────────────────
export type HostMessage =
  | { type: "host"; roomCode: string }
  | { type: "gameInfo"; game: GameName }
  | { type: "state"; scores?: number[]; timer?: number; round?: RoundState; alive?: boolean[] }
  | { type: "roundOver"; winner: number };

// ─── Server → Phone ──────────────────────────────────────────────────────────
export type ServerToPhone =
  | { type: "joined"; playerIndex: number; sessionToken: string }
  | { type: "playerJoined"; playerCount: number }
  | { type: "playerLeft"; playerIndex: number }
  | { type: "gameInfo"; game: GameName }
  | { type: "state"; scores?: number[]; timer?: number; round?: RoundState; alive?: boolean[] }
  | { type: "roundOver"; winner: number }
  | { type: "error"; message: string };

// ─── Server → Host ───────────────────────────────────────────────────────────
export type ServerToHost =
  | { type: "roomCreated"; roomCode: string }
  | { type: "input"; playerIndex: number; direction?: Direction; inputType: "move" | "jump" | "tap" | "ready" }
  | { type: "playerJoined"; playerIndex: number; playerCount: number }
  | { type: "playerLeft"; playerIndex: number; playerCount: number }
  | { type: "error"; message: string };

// ─── Room state ───────────────────────────────────────────────────────────────
export interface Room {
  host: import("ws").WebSocket | null;
  players: Array<import("ws").WebSocket | null>;
  sessionTokens: Map<string, number>; // token → playerIndex
}