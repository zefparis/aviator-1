import { create } from 'zustand';

export type GameStatus = 'WAITING' | 'FLYING' | 'CRASHED';

export interface GameState {
  // Game state
  status: GameStatus;
  currentMultiplier: number;
  crashPoint: number | null;
  roundId: string | null;
  
  // User state
  balance: number;
  currentBet: number;
  hasBet: boolean;
  autoCashout: number | null;
  
  // History
  history: Array<{
    multiplier: number;
    timestamp: number;
    won: boolean;
  }>;
  
  // Actions
  setStatus: (status: GameStatus) => void;
  setMultiplier: (multiplier: number) => void;
  setCrashPoint: (crashPoint: number) => void;
  setRoundId: (roundId: string) => void;
  setBalance: (balance: number) => void;
  setCurrentBet: (bet: number) => void;
  setHasBet: (hasBet: boolean) => void;
  setAutoCashout: (multiplier: number | null) => void;
  addToHistory: (entry: { multiplier: number; won: boolean }) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  status: 'WAITING',
  currentMultiplier: 1.0,
  crashPoint: null,
  roundId: null,
  balance: 1000,
  currentBet: 10,
  hasBet: false,
  autoCashout: null,
  history: [],
  
  // Actions
  setStatus: (status) => set({ status }),
  setMultiplier: (currentMultiplier) => set({ currentMultiplier }),
  setCrashPoint: (crashPoint) => set({ crashPoint }),
  setRoundId: (roundId) => set({ roundId }),
  setBalance: (balance) => set({ balance }),
  setCurrentBet: (currentBet) => set({ currentBet }),
  setHasBet: (hasBet) => set({ hasBet }),
  setAutoCashout: (autoCashout) => set({ autoCashout }),
  
  addToHistory: (entry) =>
    set((state) => ({
      history: [
        { ...entry, timestamp: Date.now() },
        ...state.history.slice(0, 49), // Keep last 50
      ],
    })),
  
  reset: () =>
    set({
      status: 'WAITING',
      currentMultiplier: 1.0,
      crashPoint: null,
      hasBet: false,
    }),
}));
