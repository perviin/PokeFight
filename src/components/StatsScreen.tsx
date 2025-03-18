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
    <div className="min-h-screen bg-gameboy-lightest p-4">
      <div className="max-w-2xl mx-auto bg-gameboy-light p-6 rounded shadow-lg">
        <h2 className="text-2xl font-gameboy text-gameboy-darkest mb-6 text-center">BATTLE STATS</h2>
        
        <div className="mb-8">
          <p className="font-gameboy text-gameboy-darkest mb-4">
            Total Battles: {battleHistory.length}
          </p>
          
          <h3 className="font-gameboy text-gameboy-darkest mb-2">Top Winners:</h3>
          <div className="space-y-2">
            {getWinnerStats().map(([name, wins], index) => (
              <div key={name} className="flex justify-between font-gameboy text-gameboy-darkest">
                <span>{index + 1}. {name}</span>
                <span>{wins} wins</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-gameboy text-gameboy-darkest mb-2">Recent Battles:</h3>
          {battleHistory.slice(-5).reverse().map((record, index) => (
            <div key={index} className="bg-gameboy-dark p-3 rounded">
              <p className="font-gameboy text-gameboy-lightest text-sm">
                {record.winner} defeated {record.loser}
              </p>
              <p className="font-gameboy text-gameboy-lightest text-xs opacity-75">
                {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onReturn}
          className="w-full mt-8 bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 rounded hover:bg-gameboy-darkest"
        >
          RETURN TO TITLE
        </button>
      </div>
    </div>
  );
};