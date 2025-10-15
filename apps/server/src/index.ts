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
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL,
  /\.vercel\.app$/,  // Tous les domaines Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (comme curl, Postman)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est autorisée
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return origin === allowed;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    callback(null, isAllowed);
  },
  credentials: true,
}));
app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') return origin === allowed;
        if (allowed instanceof RegExp) return allowed.test(origin);
        return false;
      });
      
      callback(null, isAllowed);
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Initialize game engine (delayed to allow DB connection)
let gameEngine: GameEngine | null = null;

// Start game engine after DB is ready
setTimeout(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    gameEngine = new GameEngine(io);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Server running without game engine');
  }
}, 1000);

// Health check (simple, no DB dependency)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'aviator-server',
  });
});

// Readiness check (with DB)
app.get('/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ready', 
      timestamp: new Date().toISOString(),
      activeConnections: io.engine.clientsCount,
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'not ready',
      error: 'Database connection failed',
    });
  }
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
  if (gameEngine) {
    socket.emit('game:state', gameEngine.getCurrentState());
  }

  // Handle bet placement
  socket.on('bet:place', async (data: { amount: number }) => {
    try {
      if (!gameEngine) {
        throw new Error('Game engine not ready');
      }
      await gameEngine.placeBet(socket.id, data.amount);
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  });

  // Handle cashout
  socket.on('bet:cashout', async () => {
    try {
      if (!gameEngine) {
        throw new Error('Game engine not ready');
      }
      await gameEngine.cashout(socket.id);
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    if (gameEngine) {
      gameEngine.removePlayer(socket.id);
    }
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
