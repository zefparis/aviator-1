'use client';

import { useGameStore } from '@/store/gameStore';
import { formatMultiplier } from '@/lib/utils';
import { History } from 'lucide-react';

export function GameHistory() {
  const { history } = useGameStore();

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Historique</h3>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Aucun historique pour le moment</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {history.map((entry, index) => (
            <div
              key={entry.timestamp}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.won
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    entry.won ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  Round #{history.length - index}
                </span>
              </div>
              <span
                className={`font-bold ${
                  entry.won ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatMultiplier(entry.multiplier)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Victoires</p>
            <p className="text-lg font-bold text-green-500">
              {history.filter((h) => h.won).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Défaites</p>
            <p className="text-lg font-bold text-red-500">
              {history.filter((h) => !h.won).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
