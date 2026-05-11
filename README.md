# PlayLana 

> Turn any screen into a party game console. Phones as controllers, real-time WebSocket, Solana on-chain progression.

** Live demo:** https://play-lana.vercel.app

---

## What Is PlayLana?

PlayLana is a browser-based multiplayer gaming platform. One device (laptop, TV, or tablet) runs the **shared game screen**. Players join using their **phones as controllers** — no app downloads required, just a browser link or QR code.

Our flagship title is **Crown Royale**, a four-game gauntlet built in Unity (Crossing Road, UFO Escape, Flappy Game, Head Smash). First to win five rounds wins the crown. Every match is permanently recorded on Solana — player wallets, characters, stats, and the leaderboard live on-chain via [SOAR](https://github.com/magicblock-labs/soar).

We're building for the **3.4 billion smartphone users without a gaming console** — the global majority who grew up watching party games like Mario Party from the outside because $500 of hardware was out of reach. The phone in their pocket is enough.

Built for the **Colosseum Frontier Hackathon 2026** in the **Consumer Apps** category.

---

##  All Repos

PlayLana spans four codebases. This repo is the entry point.

| Repo | What's in it |
|---|---|
| **PlayLana** *(this repo)* | React host screen + phone controller app, WebSocket relay server |
| **[playlana-backend](https://github.com/shrooms08/playlana-backend)** | Serverless API on Vercel — match submission, GameShift wallet creation, SOAR leaderboard, player profiles |
| **[playlana-core](https://github.com/shrooms08/playlana-core)** | Anchor program (Rust) — match recording, player profiles, character registry. Deployed on Solana devnet. |
| **[crown-royale](https://github.com/shrooms08/crown-royale)** | Unity WebGL game — 4 mini-games, character select, in-game state broadcasts to phone controllers |

---

##  Live on Solana Devnet

| What | Address |
|---|---|
| **Anchor Program** | [`EQ2tfEf3XJbiCX7bsubCJUJLPBmkhWFiRXq7pjJQ59WV`](https://explorer.solana.com/address/EQ2tfEf3XJbiCX7bsubCJUJLPBmkhWFiRXq7pjJQ59WV?cluster=devnet) |
| **SOAR Game Account** | [`Fme5dPRpRU3ssTweihPJYKM5npqQJuXPdwhqEkiLWPzL`](https://explorer.solana.com/address/Fme5dPRpRU3ssTweihPJYKM5npqQJuXPdwhqEkiLWPzL?cluster=devnet) |
| **SOAR Leaderboard** *— "Crown Royale: Total Crowns Earned"* | [`DCbKV9Mgbr3pQcMa3Mse8E8AokWugkPKnYrUomxSM8jk`](https://explorer.solana.com/address/DCbKV9Mgbr3pQcMa3Mse8E8AokWugkPKnYrUomxSM8jk?cluster=devnet) |
| **Example Match** *— real GameShift wallets, real on-chain result* | [`J4zD1wmcCz4gZBn6yBhHkPytEGFydqQXoVEQJf52o2fh`](https://explorer.solana.com/address/J4zD1wmcCz4gZBn6yBhHkPytEGFydqQXoVEQJf52o2fh?cluster=devnet) |

---

## Project Structure

```
PlayLana/                 # this repo
├── client/               # Vite + React + TypeScript  →  Vercel
└── backend/              # Node.js + TypeScript + ws  →  Railway (WebSocket relay)

playlana-backend/         # separate repo
└── ...                   # Vercel serverless API: match submission, GameShift, SOAR

playlana-core/            # separate repo
└── programs/playlana/    # Anchor program (Rust)

crown-royale/             # separate repo
└── Assets/               # Unity WebGL game
```

---

## Quick Start

### Prerequisites
- Node.js v20 or v22
- npm

### 1. Clone the repo
```bash
git clone https://github.com/Emmythefirst/PlayLana.git
cd PlayLana
```

### 2. Run the backend
```bash
cd backend
npm install
npm run dev
# WebSocket server running on ws://localhost:8080
```

### 3. Run the client
```bash
cd client
npm install
npx vite --host
# Vite dev server on http://localhost:5173
# Network: http://YOUR_LOCAL_IP:5173
```

### 4. Environment variables

Create `client/.env.local`:
```
VITE_WS_URL=ws://localhost:8080
VITE_CONTROLLER_URL=http://localhost:5173
```

For phone testing on a local network, replace with your machine's IP:
```
VITE_WS_URL=ws://192.168.1.XXX:8080
VITE_CONTROLLER_URL=http://192.168.1.XXX:5173
```

---

## How It Works

1. Host opens `/screen` on a laptop or TV — a room code and QR code are generated
2. Players scan the QR code or visit `/controller` and enter the room code on their phones
3. Players sign in with their email — a Solana wallet is created in the background via GameShift, no seed phrase
4. Each phone becomes a controller — layout switches automatically based on the active game
5. The game runs on the shared screen, inputs from phones are relayed in real-time via WebSocket
6. Game results are recorded on-chain via the Anchor program; the leaderboard updates via SOAR

---

## Routes

| URL | Device | Description |
|-----|--------|-------------|
| `/` | Any | Landing page |
| `/screen` | Laptop / TV | Host screen — lobby + game |
| `/controller` | Phone | Enter room code manually |
| `/controller/:roomCode` | Phone | Active controller |

---

## Controller Layouts

| Game | Layout | Input Type |
|------|--------|------------|
| Lobby | Color picker + Ready button | Left/Right tap + Ready tap |
| CrossingRoad | Full D-pad | Held directional |
| HeadSmash | Left/Right + Jump | Held left/right + Jump tap |
| UFOEscape | Single big button | Mash tap |
| FlappyGame | Single big button | Tap to flap |

---

## WebSocket Message Protocol

### Phone → Server
```json
{ "type": "join",  "roomCode": "ABCD" }
{ "type": "move",  "direction": "up" }
{ "type": "move",  "direction": "none" }
{ "type": "jump" }
{ "type": "tap"  }
{ "type": "ready"}
```

### Server → Phone
```json
{ "type": "joined",       "playerIndex": 0, "sessionToken": "..." }
{ "type": "playerJoined", "playerCount": 2 }
{ "type": "playerLeft",   "playerIndex": 0 }
{ "type": "gameInfo",     "game": "CrossingRoad" }
{ "type": "state",        "scores": [0, 0], "timer": 60, "round": "active" }
{ "type": "roundOver",    "winner": 1 }
```

### Host → Server
```json
{ "type": "host",      "roomCode": "ABCD" }
{ "type": "gameInfo",  "game": "CrossingRoad" }
{ "type": "state",     "scores": [30, 50], "timer": 45, "round": "active" }
{ "type": "roundOver", "winner": 1 }
```

### Server → Host
```json
{ "type": "roomCreated",  "roomCode": "ABCD" }
{ "type": "playerJoined", "playerIndex": 0, "playerCount": 1 }
{ "type": "playerLeft",   "playerIndex": 0, "playerCount": 0 }
{ "type": "input",        "inputType": "move", "playerIndex": 0, "direction": "up" }
{ "type": "input",        "inputType": "jump", "playerIndex": 1 }
{ "type": "input",        "inputType": "tap",  "playerIndex": 0 }
{ "type": "input",        "inputType": "ready","playerIndex": 0 }
```

---

## Deployment

### WebSocket Relay → Railway
- Root directory: `/backend` (in this repo)
- Start command: `npx tsx src/index.ts`
- Environment variable: `PORT=8080`
- Live URL: `wss://playlana-production.up.railway.app`

### Client → Vercel
- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  ```
  VITE_WS_URL=wss://playlana-production.up.railway.app
  VITE_CONTROLLER_URL=https://play-lana.vercel.app
  ```

### Match Submission API → Vercel (separate repo)
Deployed from [playlana-backend](https://github.com/shrooms08/playlana-backend) at `https://playlana-backend.vercel.app`.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| Real-time | Raw WebSockets (`ws` library) |
| Game Engine | Unity WebGL |
| Blockchain | Solana, Anchor, [SOAR](https://github.com/magicblock-labs/soar) |
| Wallet | [GameShift](https://gameshift.dev) embedded wallets |
| API | Node.js, TypeScript, Vercel serverless |
| RPC | Helius |
| Frontend hosting | Vercel |
| WebSocket hosting | Railway |
| Built with | [Claude Code](https://www.anthropic.com/claude-code) |

---

## Team — Breeklayer

- **Oghenerukevwe** ([@shrooms08](https://github.com/shrooms08)) — Tech lead, game design, on-chain architecture. Previously: WHOT Arena, Scotland Yard On-Chain.
- **Emmy** ([@Emmythefirst](https://github.com/Emmythefirst)) — Real-time web, phone controllers, host screen, WebSocket relay, embedded wallet integration.
- **Oghenevwegba** — Brand, 20 playable characters, in-game art.

---

## License

MIT

---

*Built for Colosseum Frontier Hackathon 2026 · Consumer Apps track*
