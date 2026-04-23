# PlayLana 🎮

> Turn any screen into a party game console. Phones as controllers, real-time WebSocket, Solana on-chain progression.

---

## What Is PlayLana?

PlayLana is a browser-based multiplayer gaming platform. One device (laptop, TV, or tablet) runs the **shared game screen**. Players join using their **phones as controllers** — no app downloads required, just a browser link or QR code.

**Live URL:**
https://play-lana.vercel.app

---

## Project Structure

```
PlayLana/
├── client/       # Vite + React + TypeScript  →  Vercel
└── backend/      # Node.js + TypeScript + ws  →  Railway
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
3. Each phone becomes a controller — layout switches automatically based on the active game
4. The game runs on the shared screen, inputs from phones are relayed in real-time via WebSocket
5. Game results are recorded on-chain via Solana

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

### Backend → Railway
- Root directory: `/backend`
- Start command: `npx tsx src/index.ts`
- Environment variable: `PORT=8080`

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

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite |
| Real-time | Raw WebSockets (`ws` library) |
| Game Engine | Unity WebGL |
| Blockchain | Solana, Anchor, SOAR Leaderboard |
| Wallet | GameShift embedded wallets |
| On-chain data | Helius DAS API + Webhooks |
| Frontend hosting | Vercel |
| Backend hosting | Railway |

---

## License

MIT

---

*Built for Colosseum Frontier Hackathon 2026*