import { Server } from 'socket.io';
type GameStatus = 'WAITING' | 'FLYING' | 'CRASHED';
export declare class GameEngine {
    private io;
    private state;
    private bets;
    private roundInterval;
    private updateInterval;
    private readonly ROUND_DURATION;
    private readonly UPDATE_INTERVAL;
    private readonly WAITING_TIME;
    constructor(io: Server);
    private startGameLoop;
    private waitingPhase;
    private flyingPhase;
    private stopRound;
    private crashedPhase;
    placeBet(socketId: string, amount: number): Promise<void>;
    cashout(socketId: string): Promise<void>;
    private checkAutoCashouts;
    private resolvePendingBets;
    removePlayer(socketId: string): void;
    getCurrentState(): {
        status: GameStatus;
        roundId: string | null;
        currentMultiplier: number;
        crashPoint: number | null;
    };
    private broadcast;
    private sleep;
}
export {};
//# sourceMappingURL=GameEngine.d.ts.map