'use client';

import { useGameStore } from '@/store/gameStore';
import { formatCurrency, formatMultiplier } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

export function GameStats() {
  const { balance, currentBet, hasBet, currentMultiplier, status } = useGameStore();

  const potentialWin = hasBet && status === 'FLYING' 
    ? currentBet * currentMultiplier 
    : 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Statistiques</h3>

      {/* Balance */}
      <div className="flex items-center justify-between p-4 bg-background rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solde</p>
            <p className="text-xl font-bold">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      {/* Current Bet */}
      {hasBet && (
        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pari actuel</p>
              <p className="text-xl font-bold">{formatCurrency(currentBet)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Potential Win */}
      {potentialWin > 0 && (
        <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-green-400">Gain potentiel</p>
              <p className="text-xl font-bold text-green-500">
                {formatCurrency(potentialWin)}
              </p>
              <p className="text-xs text-muted-foreground">
                @ {formatMultiplier(currentMultiplier)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
          <p>
            Placez votre pari avant le décollage et encaissez avant le crash pour gagner !
          </p>
        </div>
      </div>
    </div>
  );
}
