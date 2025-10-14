'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { socketService } from '@/lib/socket';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, DollarSign } from 'lucide-react';

export function BetControls() {
  const {
    status,
    balance,
    currentBet,
    hasBet,
    autoCashout,
    setCurrentBet,
    setHasBet,
    setAutoCashout,
  } = useGameStore();

  const [betAmount, setBetAmount] = useState(currentBet);
  const [autoCashoutValue, setAutoCashoutValue] = useState<number | null>(autoCashout);

  const canPlaceBet = status === 'WAITING' && !hasBet && betAmount <= balance;
  const canCashout = status === 'FLYING' && hasBet;

  const handlePlaceBet = () => {
    if (!canPlaceBet) return;

    socketService.placeBet(betAmount);
    setCurrentBet(betAmount);
    setHasBet(true);
    setAutoCashout(autoCashoutValue);
  };

  const handleCashout = () => {
    if (!canCashout) return;

    socketService.cashout();
    setHasBet(false);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(1, Math.min(balance, betAmount + amount));
    setBetAmount(newBet);
  };

  const quickBet = (multiplier: number) => {
    const newBet = Math.max(1, Math.min(balance, betAmount * multiplier));
    setBetAmount(newBet);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bet Amount */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Montant du pari
          </label>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustBet(-10)}
              disabled={hasBet}
              className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                disabled={hasBet}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                min="1"
                max={balance}
              />
            </div>

            <button
              onClick={() => adjustBet(10)}
              disabled={hasBet}
              className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Bet Buttons */}
          <div className="flex gap-2">
            {[0.5, 2, 5].map((multiplier) => (
              <button
                key={multiplier}
                onClick={() => quickBet(multiplier)}
                disabled={hasBet}
                className="flex-1 py-2 px-3 text-sm rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {multiplier === 0.5 ? '½' : `${multiplier}x`}
              </button>
            ))}
            <button
              onClick={() => setBetAmount(balance)}
              disabled={hasBet}
              className="flex-1 py-2 px-3 text-sm rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Max
            </button>
          </div>
        </div>

        {/* Auto Cashout */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Cashout automatique (optionnel)
          </label>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={autoCashoutValue || ''}
              onChange={(e) => setAutoCashoutValue(e.target.value ? Number(e.target.value) : null)}
              placeholder="Ex: 2.00"
              disabled={hasBet}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              min="1.01"
              step="0.01"
            />
            <span className="text-lg font-semibold text-muted-foreground">x</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Le cashout sera automatique si le multiplicateur atteint cette valeur
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: canPlaceBet ? 1.02 : 1 }}
          whileTap={{ scale: canPlaceBet ? 0.98 : 1 }}
          onClick={handlePlaceBet}
          disabled={!canPlaceBet}
          className={`py-4 rounded-xl font-bold text-lg transition-all ${
            canPlaceBet
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/50'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          }`}
        >
          {hasBet ? 'Pari placé' : 'Placer le pari'}
        </motion.button>

        <motion.button
          whileHover={{ scale: canCashout ? 1.02 : 1 }}
          whileTap={{ scale: canCashout ? 0.98 : 1 }}
          onClick={handleCashout}
          disabled={!canCashout}
          className={`py-4 rounded-xl font-bold text-lg transition-all ${
            canCashout
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/50'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          }`}
        >
          Cashout
        </motion.button>
      </div>

      {/* Balance Display */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">Solde disponible</p>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
