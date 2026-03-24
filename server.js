const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── In-Memory Store ───────────────────────────────────────────────
const rooms = {};       // { roomId: { players, gameState, gameType } }
const leaderboard = {}; // { username: { wins, losses, draws } }

// ─── REST Routes ───────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime(), rooms: Object.keys(rooms).length });
});

// Create a game room
app.post('/api/rooms', (req, res) => {
  const { gameType = 'chess', playerName = 'Player' } = req.body;
  const roomId = uuidv4().slice(0, 6).toUpperCase();
  rooms[roomId] = {
    id: roomId,
    gameType,
    players: [{ name: playerName, color: 'white', ready: false }],
    gameState: null,
    created: Date.now()
  };
  res.json({ roomId, room: rooms[roomId] });
});

// Get room info
app.get('/api/rooms/:id', (req, res) => {
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sorted = Object.entries(leaderboard)
    .map(([name, stats]) => ({ name, ...stats, score: stats.wins * 3 + stats.draws }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  res.json(sorted);
});

// Update leaderboard
app.post('/api/leaderboard', (req, res) => {
  const { username, result } = req.body; // result: 'win'|'loss'|'draw'
  if (!leaderboard[username]) leaderboard[username] = { wins: 0, losses: 0, draws: 0 };
  if (result === 'win') leaderboard[username].wins++;
  else if (result === 'loss') leaderboard[username].losses++;
  else leaderboard[username].draws++;
  res.json({ ok: true, stats: leaderboard[username] });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Socket.IO Real-time Multiplayer ───────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, playerName }) => {
    const room = rooms[roomId];
    if (!room) { socket.emit('error', 'Room not found'); return; }
    if (room.players.length >= 2) { socket.emit('error', 'Room is full'); return; }

    room.players.push({ name: playerName, color: 'black', socketId: socket.id, ready: false });
    room.players[0].socketId = socket.id; // update host too

    socket.join(roomId);
    io.to(roomId).emit('room-updated', room);
    console.log(`[Room ${roomId}] ${playerName} joined`);
  });

  socket.on('create-room', ({ gameType, playerName }) => {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    rooms[roomId] = {
      id: roomId, gameType,
      players: [{ name: playerName, color: 'white', socketId: socket.id, ready: false }],
      gameState: null, created: Date.now()
    };
    socket.join(roomId);
    socket.emit('room-created', { roomId, room: rooms[roomId] });
  });

  // Generic game move relay
  socket.on('game-move', ({ roomId, move, gameState }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.gameState = gameState;
    socket.to(roomId).emit('opponent-move', { move, gameState });
  });

  socket.on('game-over', ({ roomId, result, winner }) => {
    io.to(roomId).emit('game-ended', { result, winner });
    delete rooms[roomId];
  });

  socket.on('chat-message', ({ roomId, player, message }) => {
    io.to(roomId).emit('chat-message', { player, message, time: Date.now() });
  });

  socket.on('disconnect', () => {
    // Notify rooms this socket was in
    for (const [id, room] of Object.entries(rooms)) {
      const idx = room.players.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        io.to(id).emit('player-disconnected', { player: room.players[idx].name });
      }
    }
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

// ─── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🎮 NEXUS ARCADE Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO multiplayer active`);
  console.log(`🌐 Open frontend at http://localhost:${PORT}\n`);
});
