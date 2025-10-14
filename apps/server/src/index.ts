import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameEngine } from './game/GameEngine.js';
import { prisma } from './lib/prisma.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Initialize game engine
const gameEngine = new GameEngine(io);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeConnections: io.engine.clientsCount,
  });
});

// API Routes
app.get('/api/stats', async (req, res) => {
  try {
    const totalRounds = await prisma.gameRound.count();
    const totalBets = await prisma.bet.count();
    const totalUsers = await prisma.user.count();

    res.json({
      totalRounds,
      totalBets,
      totalUsers,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Send current game state
  socket.emit('game:state', gameEngine.getCurrentState());

  // Handle bet placement
  socket.on('bet:place', async (data: { amount: number }) => {
    try {
      await gameEngine.placeBet(socket.id, data.amount);
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  });

  // Handle cashout
  socket.on('bet:cashout', async () => {
    try {
      await gameEngine.cashout(socket.id);
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    gameEngine.removePlayer(socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🎮 Game engine started`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
  await prisma.$disconnect();
  process.exit(0);
});
