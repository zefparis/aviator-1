import { Server, Socket } from 'socket.io';
import { prisma } from '../lib/prisma.js';
import { generateSeed, calculateCrashPoint, calculateMultiplier } from '../lib/utils.js';

type GameStatus = 'WAITING' | 'FLYING' | 'CRASHED';

interface PlayerBet {
  socketId: string;
  amount: number;
  placedAt: number;
  autoCashout?: number;
}

interface GameState {
  status: GameStatus;
  roundId: string | null;
  currentMultiplier: number;
  crashPoint: number | null;
  startTime: number | null;
}

export class GameEngine {
  private io: Server;
  private state: GameState;
  private bets: Map<string, PlayerBet>;
  private roundInterval: NodeJS.Timeout | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  // Configuration
  private readonly ROUND_DURATION = parseInt(process.env.GAME_ROUND_DURATION || '30000');
  private readonly UPDATE_INTERVAL = parseInt(process.env.GAME_UPDATE_INTERVAL || '100');
  private readonly WAITING_TIME = 5000; // 5 seconds between rounds

  constructor(io: Server) {
    this.io = io;
    this.state = {
      status: 'WAITING',
      roundId: null,
      currentMultiplier: 1.0,
      crashPoint: null,
      startTime: null,
    };
    this.bets = new Map();

    // Start game loop (non-blocking)
    this.startGameLoop().catch(console.error);
  }

  private async startGameLoop() {
    console.log('🎮 Game loop started');
    
    while (true) {
      // Waiting phase
      await this.waitingPhase();
      
      // Flying phase
      await this.flyingPhase();
      
      // Crashed phase
      await this.crashedPhase();
    }
  }

  private async waitingPhase() {
    this.state.status = 'WAITING';
    this.state.currentMultiplier = 1.0;
    this.state.crashPoint = null;
    this.bets.clear();

    console.log('⏳ Waiting for next round...');
    this.broadcast('round:waiting', { waitTime: this.WAITING_TIME });

    await this.sleep(this.WAITING_TIME);
  }

  private async flyingPhase() {
    // Generate new round
    const seed = generateSeed();
    const crashPoint = calculateCrashPoint(seed);

    // Create round in database
    const round = await prisma.gameRound.create({
      data: {
        seed,
        crashPoint,
        status: 'FLYING',
        multiplier: 1.0,
      },
    });

    this.state.status = 'FLYING';
    this.state.roundId = round.id;
    this.state.crashPoint = crashPoint;
    this.state.startTime = Date.now();
    this.state.currentMultiplier = 1.0;

    console.log(`🚀 Round ${round.id} started - Crash point: ${crashPoint.toFixed(2)}x`);

    this.broadcast('round:start', {
      id: round.id,
      multiplier: 1.0,
      status: 'FLYING',
    });

    // Update loop
    this.updateInterval = setInterval(() => {
      const elapsed = Date.now() - this.state.startTime!;
      this.state.currentMultiplier = calculateMultiplier(elapsed);

      // Check for crash
      if (this.state.currentMultiplier >= this.state.crashPoint!) {
        this.stopRound();
        return;
      }

      // Check auto cashouts
      this.checkAutoCashouts();

      // Broadcast update
      this.broadcast('round:update', {
        id: this.state.roundId,
        multiplier: this.state.currentMultiplier,
        status: 'FLYING',
      });
    }, this.UPDATE_INTERVAL);

    // Wait for crash or max duration
    await this.sleep(this.ROUND_DURATION);
    
    if (this.state.status === 'FLYING') {
      this.stopRound();
    }
  }

  private stopRound() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.state.status = 'CRASHED';
    this.state.currentMultiplier = this.state.crashPoint!;
  }

  private async crashedPhase() {
    console.log(`💥 Round crashed at ${this.state.crashPoint!.toFixed(2)}x`);

    // Update round in database
    if (this.state.roundId) {
      await prisma.gameRound.update({
        where: { id: this.state.roundId },
        data: {
          status: 'CRASHED',
          multiplier: this.state.crashPoint!,
          endTime: new Date(),
        },
      });

      // Resolve all pending bets as lost
      await this.resolvePendingBets();
    }

    this.broadcast('round:end', {
      id: this.state.roundId,
      multiplier: this.state.currentMultiplier,
      crashPoint: this.state.crashPoint,
      status: 'CRASHED',
    });

    await this.sleep(3000); // Show crash for 3 seconds
  }

  public async placeBet(socketId: string, amount: number) {
    if (this.state.status !== 'WAITING') {
      throw new Error('Cannot place bet - round already started');
    }

    if (amount < 1 || amount > 10000) {
      throw new Error('Invalid bet amount');
    }

    if (this.bets.has(socketId)) {
      throw new Error('Bet already placed for this round');
    }

    // Store bet
    this.bets.set(socketId, {
      socketId,
      amount,
      placedAt: Date.now(),
    });

    console.log(`💰 Bet placed: ${socketId} - $${amount}`);

    this.io.to(socketId).emit('bet:placed', {
      amount,
      roundId: this.state.roundId,
      status: 'PENDING',
    });
  }

  public async cashout(socketId: string) {
    if (this.state.status !== 'FLYING') {
      throw new Error('Cannot cashout - round not active');
    }

    const bet = this.bets.get(socketId);
    if (!bet) {
      throw new Error('No active bet found');
    }

    const winAmount = bet.amount * this.state.currentMultiplier;

    // Save bet to database
    if (this.state.roundId) {
      await prisma.bet.create({
        data: {
          userId: null, // Anonymous bet
          roundId: this.state.roundId,
          amount: bet.amount,
          cashoutMultiplier: this.state.currentMultiplier,
          cashoutTime: new Date(),
          status: 'CASHED_OUT',
          winAmount,
        },
      });
    }

    // Remove bet
    this.bets.delete(socketId);

    console.log(`💵 Cashout: ${socketId} - $${winAmount.toFixed(2)} @ ${this.state.currentMultiplier.toFixed(2)}x`);

    this.io.to(socketId).emit('bet:cashout', {
      amount: bet.amount,
      multiplier: this.state.currentMultiplier,
      winAmount,
      status: 'CASHED_OUT',
    });
  }

  private checkAutoCashouts() {
    for (const [socketId, bet] of this.bets.entries()) {
      if (bet.autoCashout && this.state.currentMultiplier >= bet.autoCashout) {
        this.cashout(socketId).catch(console.error);
      }
    }
  }

  private async resolvePendingBets() {
    for (const [socketId, bet] of this.bets.entries()) {
      if (this.state.roundId) {
        await prisma.bet.create({
          data: {
            userId: null, // Anonymous bet
            roundId: this.state.roundId,
            amount: bet.amount,
            status: 'LOST',
            winAmount: 0,
          },
        });
      }

      this.io.to(socketId).emit('bet:lost', {
        amount: bet.amount,
        crashPoint: this.state.crashPoint,
      });
    }

    this.bets.clear();
  }

  public removePlayer(socketId: string) {
    this.bets.delete(socketId);
  }

  public getCurrentState() {
    return {
      status: this.state.status,
      roundId: this.state.roundId,
      currentMultiplier: this.state.currentMultiplier,
      crashPoint: this.state.status === 'CRASHED' ? this.state.crashPoint : null,
    };
  }

  private broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
