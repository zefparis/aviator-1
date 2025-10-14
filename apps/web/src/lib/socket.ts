import { io, Socket } from 'socket.io-client';

export interface GameRoundData {
  id: string;
  multiplier: number;
  status: 'WAITING' | 'FLYING' | 'CRASHED';
  crashPoint?: number;
}

export interface BetData {
  userId: string;
  roundId: string;
  amount: number;
  cashoutMultiplier?: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT';
}

class SocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
  }

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to game server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from game server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Game events
  onRoundStart(callback: (data: GameRoundData) => void): void {
    this.socket?.on('round:start', callback);
  }

  onRoundUpdate(callback: (data: GameRoundData) => void): void {
    this.socket?.on('round:update', callback);
  }

  onRoundEnd(callback: (data: GameRoundData) => void): void {
    this.socket?.on('round:end', callback);
  }

  // Bet events
  placeBet(amount: number): void {
    this.socket?.emit('bet:place', { amount });
  }

  cashout(): void {
    this.socket?.emit('bet:cashout');
  }

  onBetPlaced(callback: (data: BetData) => void): void {
    this.socket?.on('bet:placed', callback);
  }

  onBetCashout(callback: (data: BetData) => void): void {
    this.socket?.on('bet:cashout', callback);
  }

  // Cleanup
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
