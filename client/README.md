# PlayLana

Browser-based multiplayer gaming platform. One screen, phones as controllers, Solana on-chain progression.

---

## Project Structure

```
playlana/
├── client/   # Vite + React + TypeScript  →  Vercel
└── server/   # Node.js + TypeScript + ws  →  Railway / Fly.io
```

---

## Quick Start

### 1. Server

```bash
cd server
npm install
npm run dev
# WebSocket server running on ws://localhost:8080
```

### 2. Client

```bash
cd client
npm install
npm run dev
# Vite dev server on http://localhost:5173
```

### 3. Environment variables

**`client/.env.local`**
```
VITE_WS_URL=ws://localhost:8080
VITE_CONTROLLER_URL=http://localhost:5173
```

**`server/.env`** (optional — defaults shown)
```
PORT=8080
```

---

## Routes

| URL | Device | Description |
|-----|--------|-------------|
| `/` | Any | Landing page |
| `/screen` | Laptop / TV | Host screen — shows lobby + Unity game |
| `/controller` | Phone | Enter room code |
| `/controller/:roomCode` | Phone | Active controller |

---

## Unity Integration

Drop Oghenerukevwe's Unity WebGL build into `client/public/unity/`.  
The host screen mounts it at `/unity/index.html` inside an `<iframe>`.

### React → Unity (postMessage into iframe)

```json
{ "type": "input", "inputType": "move", "playerIndex": 0, "direction": "up" }
{ "type": "input", "inputType": "jump", "playerIndex": 1 }
{ "type": "input", "inputType": "tap",  "playerIndex": 0 }
{ "type": "input", "inputType": "ready","playerIndex": 1 }
{ "type": "reset" }
```

### Unity → React (window.parent.postMessage from Unity .jslib)

```json
{ "type": "gameInfo",  "game": "CrossingRoad" }
{ "type": "state",     "scores": [30, 50], "timer": 45, "round": "active" }
{ "type": "state",     "alive": [true, false] }
{ "type": "roundOver", "winner": 1 }
```

Unity .jslib snippet:
```javascript
SendMessageToReact: function(msgPtr) {
  var msg = UTF8ToString(msgPtr);
  window.parent.postMessage(JSON.parse(msg), "*");
}
```

---

## WebSocket Message Protocol

See `client/src/types/messages.ts` for full TypeScript types.

### Phone → Server
```json
{ "type": "join",  "roomCode": "ABCD" }
{ "type": "move",  "direction": "up" }
{ "type": "jump" }
{ "type": "tap"  }
{ "type": "ready"}
```

### Server → Phone
```json
{ "type": "joined",       "playerIndex": 0, "sessionToken": "..." }
{ "type": "playerJoined", "playerCount": 2 }
{ "type": "gameInfo",     "game": "CrossingRoad" }
{ "type": "state",        "scores": [0, 0], "timer": 60, "round": "active" }
{ "type": "roundOver",    "winner": 1 }
```

### Host (React) → Server
```json
{ "type": "host",      "roomCode": "ABCD" }
{ "type": "gameInfo",  "game": "CrossingRoad" }
{ "type": "state",     "scores": [30, 50], "timer": 45, "round": "active" }
{ "type": "roundOver", "winner": 1 }
```

---

## Deployment

**Server → Railway**
- Set `PORT` env var (Railway injects this automatically)
- Start command: `npm start` (runs compiled `dist/index.js`)

**Client → Vercel**  
- Build command: `npm run build`
- Output dir: `dist`
- Set `VITE_WS_URL` to your Railway WebSocket URL (`wss://your-app.railway.app`)
- Set `VITE_CONTROLLER_URL` to your Vercel deployment URL