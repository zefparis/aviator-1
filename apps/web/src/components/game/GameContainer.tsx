'use client';

import { useEffect } from 'react';
import { GameCanvas } from './GameCanvas';
import { BetControls } from './BetControls';
import { GameStats } from './GameStats';
import { GameHistory } from './GameHistory';
import { socketService } from '@/lib/socket';
import { useGameStore } from '@/store/gameStore';

export function GameContainer() {
  const {
    setStatus,
    setMultiplier,
    setCrashPoint,
    setRoundId,
    addToHistory,
    reset,
  } = useGameStore();

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();

    // Listen to game events
    socketService.onRoundStart((data) => {
      console.log('Round started:', data);
      setStatus('FLYING');
      setMultiplier(1.0);
      setRoundId(data.id);
      setCrashPoint(null);
    });

    socketService.onRoundUpdate((data) => {
      setMultiplier(data.multiplier);
    });

    socketService.onRoundEnd((data) => {
      console.log('Round ended:', data);
      setStatus('CRASHED');
      setCrashPoint(data.crashPoint || 0);
      
      // Add to history
      addToHistory({
        multiplier: data.crashPoint || 0,
        won: false, // Will be updated by bet result
      });

      // Reset after 3 seconds
      setTimeout(() => {
        reset();
      }, 3000);
    });

    // Cleanup
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [setStatus, setMultiplier, setCrashPoint, setRoundId, addToHistory, reset]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Aviator Game
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Congo Gaming - Jeu de crash en temps réel
        </p>
      </header>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Game Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <GameCanvas />
          <BetControls />
        </div>

        {/* Right Column - Stats & History */}
        <div className="space-y-4">
          <GameStats />
          <GameHistory />
        </div>
      </div>
    </div>
  );
}
