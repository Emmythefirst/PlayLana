# PlayLana 🎮

> Turn any screen into a party game console. Phones as controllers, real-time WebSocket, Solana on-chain progression.

---

## What Is PlayLana?

PlayLana is a browser-based multiplayer gaming platform. One device (laptop/TV/tablet) runs the **shared game screen**. Players join using their **phones as controllers** — no app downloads, just a browser link or QR code.

**Live URLs:**
https://play-lana.vercel.app

---

## Project Structure

```
PlayLana/
├── client/          # Vite + React + TypeScript  →  Vercel
└── backend/         # Node.js + TypeScript + ws  →  Railway
```

---

## Quick Start (Local Development)

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

**`client/.env.local`**
```
VITE_WS_URL=ws://localhost:8080
VITE_CONTROLLER_URL=http://localhost:5173
```

For phone testing on local network replace with your machine's IP:
```
VITE_WS_URL=ws://192.168.1.XXX:8080
VITE_CONTROLLER_URL=http://192.168.1.XXX:5173
```

---

## Routes

| URL | Device | Description |
|-----|--------|-------------|
| `/` | Any | Landing page |
| `/screen` | Laptop / TV | Host screen — lobby + Unity game |
| `/controller` | Phone | Enter room code manually |
| `/controller/:roomCode` | Phone | Active controller |

---

## Architecture

```
Phone (Controller)
    │
    │  WebSocket (JSON)
    ▼
Backend (Railway)          ←──── WebSocket (JSON) ────── Host Screen (Vercel /screen)
    │                                                           │
    │  relay inputs to host                                     │  postMessage
    │  broadcast state to phones                                ▼
    │                                                     Unity WebGL iframe
    └──────────────────────────────────────────────────────────►│
                                                                │  window.parent.postMessage
                                                                ▼
                                                         React (GameOverlay)
```

---

## WebSocket Message Protocol

### Phone → Server
```json
{ "type": "join",  "roomCode": "ABCD" }
{ "type": "join",  "roomCode": "ABCD", "sessionToken": "..." }
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
{ "type": "state",        "alive": [true, false] }
{ "type": "roundOver",    "winner": 1 }
{ "type": "error",        "message": "Room not found" }
```

### Host Screen → Server
```json
{ "type": "host",      "roomCode": "ABCD" }
{ "type": "gameInfo",  "game": "CrossingRoad" }
{ "type": "state",     "scores": [30, 50], "timer": 45, "round": "active" }
{ "type": "roundOver", "winner": 1 }
```

### Server → Host Screen
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

## Controller Layouts

| Game | Layout | Input Type |
|------|--------|------------|
| Lobby | Color picker + Ready button | Left/Right tap + Ready tap |
| CrossingRoad | Full D-pad | Held directional |
| HeadSmash | Left/Right + Jump | Held left/right + Jump tap |
| UFOEscape | Single big button | Mash tap |
| FlappyGame | Single big button | Tap to flap |

Controller layout switches automatically when Unity broadcasts `gameInfo`.

---

## Unity Integration (For Oghenerukevwe)

### Setup
Drop the Unity WebGL build output into:
```
client/public/unity/
```
React mounts it at `/unity/index.html` inside a full-screen `<iframe>`.

### Unity → React (send game state)
In your Unity `.jslib` file:
```javascript
SendToReact: function(msgPtr) {
  var msg = UTF8ToString(msgPtr);
  window.parent.postMessage(JSON.parse(msg), "*");
}
```

Call from C# like:
```csharp
[DllImport("__Internal")]
private static extern void SendToReact(string msg);

// Examples:
SendToReact("{\"type\":\"gameInfo\",\"game\":\"CrossingRoad\"}");
SendToReact("{\"type\":\"state\",\"scores\":[30,50],\"timer\":45,\"round\":\"active\"}");
SendToReact("{\"type\":\"state\",\"alive\":[true,false]}");
SendToReact("{\"type\":\"roundOver\",\"winner\":1}");
```

### React → Unity (receive player inputs)
In your `.jslib`, listen for postMessages from React:
```javascript
RegisterInputListener: function() {
  window.addEventListener("message", function(event) {
    if (event.data && event.data.type === "input") {
      // Send to Unity C# via SendMessage
      SendMessage("GameManager", "OnInputReceived", JSON.stringify(event.data));
    }
  });
}
```

Input message shape React sends to Unity:
```json
{ "type": "input", "inputType": "move",  "playerIndex": 0, "direction": "up" }
{ "type": "input", "inputType": "move",  "playerIndex": 0, "direction": "none" }
{ "type": "input", "inputType": "jump",  "playerIndex": 1 }
{ "type": "input", "inputType": "tap",   "playerIndex": 0 }
{ "type": "input", "inputType": "ready", "playerIndex": 1 }
```

### Game Flow
1. Unity WebGL loads inside the React iframe
2. React lobby waits for both players to ready up
3. Unity sends `gameInfo` → React hides lobby, shows game overlay, phones switch controller layout
4. Players send inputs → React relays to Unity via postMessage
5. Unity sends `state` updates → React updates score/timer overlay + broadcasts to phones
6. Unity sends `roundOver` → React shows winner announcement + broadcasts to phones
7. On-chain calls (SOAR, NFT) go through your separate backend — not React

### Reset
When React sends `{ "type": "reset" }` to Unity iframe, reset the game state for a new round.

---

## Deployment

### Backend → Railway
- Root directory: `/backend`
- Start command: `npx tsx src/index.ts`
- Environment variable: `PORT=8080`
- Live URL: `wss://playlana-production.up.railway.app`

### Client → Vercel
- Root directory: `client`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  ```
  VITE_WS_URL=wss://playlana-production.up.railway.app
  VITE_CONTROLLER_URL=https://play-lana.vercel.app
  ```

---

## Team

| Role | Name |
|------|------|
| Frontend / Real-time Web | Emmy |
| Game Dev / Solana / Smart Contracts | Oghenerukevwe |

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

*Built for Colosseum Frontier Hackathon 2026*