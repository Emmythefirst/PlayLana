export type Direction = "up" | "down" | "left" | "right" | "none";

export type GameName =
  | "Lobby"
  | "CrossingRoad"
  | "HeadSmash"
  | "UFOEscape"
  | "FlappyGame";

export type RoundState = "waiting" | "active" | "over";

// ─── Messages phone sends TO server ─────────────────────────────────────────
export type OutboundPhoneMsg =
  | { type: "join"; roomCode: string; sessionToken?: string }
  | { type: "move"; direction: Direction }
  | { type: "jump" }
  | { type: "tap" }
  | { type: "ready" };

// ─── Messages server sends TO phone ─────────────────────────────────────────
export type InboundPhoneMsg =
  | { type: "joined"; playerIndex: number; sessionToken: string }
  | { type: "playerJoined"; playerCount: number }
  | { type: "playerLeft"; playerIndex: number }
  | { type: "gameInfo"; game: GameName }
  | { type: "state"; scores?: number[]; timer?: number; round?: RoundState; alive?: boolean[] }
  | { type: "roundOver"; winner: number }
  | { type: "error"; message: string };

// ─── Messages host screen sends TO server ────────────────────────────────────
export type OutboundHostMsg =
  | { type: "host"; roomCode: string }
  | { type: "gameInfo"; game: GameName }
  | { type: "state"; scores?: number[]; timer?: number; round?: RoundState; alive?: boolean[] }
  | { type: "roundOver"; winner: number };

// ─── Messages server sends TO host screen ────────────────────────────────────
export type InboundHostMsg =
  | { type: "roomCreated"; roomCode: string }
  | { type: "input"; inputType: "move" | "jump" | "tap" | "ready"; playerIndex: number; direction?: Direction }
  | { type: "playerJoined"; playerIndex: number; playerCount: number }
  | { type: "playerLeft"; playerIndex: number; playerCount: number }
  | { type: "error"; message: string };

// ─── Controller state (derived from server messages) ─────────────────────────
export interface ControllerState {
  playerIndex: number | null;
  currentGame: GameName;
  scores: [number, number];
  timer: number | null;
  round: RoundState;
  alive: [boolean, boolean];
  winner: number | null;
}

// ─── Host screen state (derived from server messages + Unity postMessages) ───
export interface PlayerSlot {
  joined: boolean;
  ready: boolean;
}

export interface HostState {
  roomCode: string;
  players: [PlayerSlot, PlayerSlot];
  currentGame: GameName;
  scores: [number, number];
  timer: number | null;
  round: RoundState;
  winner: number | null;
}

// ─── Unity ↔ React postMessage protocol ─────────────────────────────────────
// Unity → React (window.postMessage from Unity iframe)
export type UnityToReact =
  | { type: "gameInfo"; game: GameName }
  | { type: "state"; scores?: number[]; timer?: number; round?: RoundState; alive?: boolean[] }
  | { type: "roundOver"; winner: number };

// React → Unity (postMessage to Unity iframe contentWindow)
export type ReactToUnity =
  | { type: "input"; inputType: "move" | "jump" | "tap" | "ready"; playerIndex: number; direction?: Direction }
  | { type: "startCharacterSelect"; playerCount: number }
  | { type: "reset" };