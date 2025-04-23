import React from 'react';
import { BattleRecord } from '../types';

interface StatsScreenProps {
  battleHistory: BattleRecord[];
  onReturn: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ battleHistory, onReturn }) => {
  const getWinnerStats = () => {
    const stats = new Map<string, number>();
    battleHistory.forEach(record => {
      stats.set(record.winner, (stats.get(record.winner) || 0) + 1);
    });
    return Array.from(stats.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-black flex-col flex items-center justify-center gap-4">
      <div className="w-full max-w-2xl ds-screen bg-gameboy-light p-4"
           style={{
             backgroundColor: '#8BAC0F',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <h2 className="text-2xl font-gameboy text-gameboy-darkest mb-6 text-center">BATTLE STATS</h2>
        
        <div className="mb-8">
          <p className="font-gameboy text-gameboy-darkest mb-4">
            Nombre de Combats: {battleHistory.length}
          </p>
          
          <h3 className="font-gameboy text-gameboy-darkest mb-2">Top des Gagnants:</h3>
          <div className="space-y-2">
            {getWinnerStats().map(([name, wins], index) => (
              <div key={name} className="flex justify-between font-gameboy text-gameboy-darkest">
                <span>{index + 1}. {name}</span>
                <span>{wins} Gagné</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-gameboy text-gameboy-darkest mb-2">Combat récents:</h3>
          {battleHistory.slice(-3).reverse().map((record, index) => (
            <div key={index} className="bg-gameboy-dark p-3 rounded">
              <p className="font-gameboy text-gameboy-lightest text-sm">
                {record.winner} a battu {record.loser}
              </p>
              <p className="font-gameboy text-gameboy-lightest text-xs opacity-75">
                {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl ds-screen bg-gameboy-lightest flex items-center justify-center">
        <button
          onClick={onReturn}
          className="bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 px-4 rounded hover:bg-gameboy-darkest"
        >
          RETOUR A LA SELECTION
        </button>
        </div>
        
      </div>

  );
};