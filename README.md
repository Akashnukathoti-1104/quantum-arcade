# 🎮 NEXUS ARCADE

A futuristic multi-game browser platform featuring Chess, Snake, Memory, and 2048 — with a Node.js/Express backend, Socket.IO multiplayer, and REST API.

![NEXUS ARCADE](https://img.shields.io/badge/Games-4-blueviolet) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🕹️ Games

| Game | Description | Features |
|------|-------------|----------|
| ♟️ **Nexus Chess** | Full chess engine with AI | Minimax AI, multiplayer, move history, 3 themes |
| 🐍 **Quantum Snake** | Classic snake + power-ups | Shield, speed boost, score multiplier |
| 🧠 **Memory Matrix** | Card flip matching game | 3 difficulty levels, timed rounds |
| 🔢 **Nexus 2048** | Slide-to-merge puzzle | High scores, keyboard + touch |

---

## 🏗️ Project Structure

```
nexus-arcade/
├── backend/
│   ├── server.js          # Express + Socket.IO server
│   └── package.json
├── frontend/
│   ├── index.html         # Main hub / game lobby
│   └── games/
│       ├── chess.html
│       ├── snake.html
│       ├── memory.html
│       └── 2048.html
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/nexus-arcade.git
cd nexus-arcade

# 2. Install backend dependencies
cd backend
npm install

# 3. Start the server
npm start
# or for development with auto-reload:
npm run dev

# 4. Open in browser
# http://localhost:3001
```

---

## 🌐 Deployment

### Option A — Render (Free, Recommended)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set these settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Click **Deploy** — your app will be live in ~2 minutes

### Option B — Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option C — Vercel (Static Frontend Only)

```bash
npm install -g vercel
cd frontend
vercel --prod
```
> Note: Vercel for static-only deployment won't include Socket.IO multiplayer.

### Option D — GitHub Pages (Static Only)

1. Go to repo Settings → Pages
2. Set Source: `main` branch, `/frontend` folder
3. Your site is live at `https://YOUR_USERNAME.github.io/nexus-arcade/`

---

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server status |
| `/api/rooms` | POST | Create multiplayer room |
| `/api/rooms/:id` | GET | Get room info |
| `/api/leaderboard` | GET | Top 20 players |
| `/api/leaderboard` | POST | Submit game result |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `create-room` | Client→Server | Create a game room |
| `join-room` | Client→Server | Join existing room |
| `game-move` | Client→Server | Send a move |
| `opponent-move` | Server→Client | Receive opponent move |
| `chat-message` | Both | In-game chat |

---

## 🔧 Environment Variables

Create `.env` in `/backend`:
```
PORT=3001
NODE_ENV=production
```

---

## 📤 GitHub Push Guide

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "feat: initial nexus arcade release"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nexus-arcade.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS, Canvas API
- **Backend:** Node.js, Express.js, Socket.IO
- **Fonts:** Google Fonts (Orbitron, Share Tech Mono, Rajdhani)
- **Deployment:** Render / Railway / Vercel / GitHub Pages

---

## 📄 License

MIT © NEXUS ARCADE
