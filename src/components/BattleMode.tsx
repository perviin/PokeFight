import React from 'react';
import { Pokemon } from '../types';

interface BattleModeProps {
  pokemon: [Pokemon, Pokemon];
  onSelectMode: (mode: 'auto' | 'manual') => void;
  onSelectMoves: () => void; // Pour naviguer vers MoveSelectionScreen
}

export const BattleMode: React.FC<BattleModeProps> = ({ pokemon, onSelectMode, onSelectMoves }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      {/* Top Screen - Affichage des Pokémon */}
      <div className="w-full max-w-2xl ds-screen relative overflow-hidden"
           style={{
             backgroundImage: 'url(./img/fight-background.png)', 
             backgroundColor: '#8BAC0F',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="relative h-full">
          {/* Opponent Pokemon */}
          <div className="absolute right-4 top-12">
            <div className="bg-white/90 p-2 rounded mb-1">
              <p className="font-gameboy text-sm">
                {pokemon[1].frenchName} N.{pokemon[1].level}
              </p>
            </div>
            <img 
              src={pokemon[1].sprites.front_default}
              alt={pokemon[1].frenchName}
              className="w-64 h-64 pixelated"
            />
          </div>

          {/* Player Pokemon */}
          <div className="absolute left-4 bottom-4">
            <div className="bg-white/90 p-2 rounded mb-1">
              <p className="font-gameboy text-sm">
                {pokemon[0].frenchName} N.{pokemon[0].level}
              </p>
            </div>
            <img 
              src={pokemon[0].sprites.back_default}
              alt={pokemon[0].frenchName}
              className="w-64 h-64 pixelated"
            />
          </div>

          {/* Battle Message Box */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
            <p className="font-gameboy text-lg">Choisissez un mode de combat</p>
          </div>
        </div>
      </div>

      {/* Bottom Screen - Options de mode de combat */}
      <div className="w-full max-w-2xl ds-screen bg-gameboy-lightest p-4">
        <div className="h-full flex flex-col justify-center gap-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onSelectMode('auto')}
              className="bg-gameboy-dark text-white font-gameboy py-6 px-4 rounded hover:bg-gameboy-darkest flex flex-col items-center justify-center"
            >
              <span className="text-xl mb-2">AUTOMATIQUE</span>
              <span className="text-sm">Combat géré par l'IA</span>
            </button>
            
            <button
              onClick={() => onSelectMode('manual')}
              className="bg-gameboy-dark text-white font-gameboy py-6 px-4 rounded hover:bg-gameboy-darkest flex flex-col items-center justify-center"
            >
              <span className="text-xl mb-2">MANUEL</span>
              <span className="text-sm">Contrôlez vos attaques</span>
            </button>
          </div>
          
          <div className="mt-6">
            <button
              onClick={onSelectMoves}
              className="bg-gameboy-medium text-gameboy-darkest font-gameboy py-4 px-4 rounded w-full hover:bg-gameboy-dark hover:text-white transition-colors"
            >
              CHOISIR LES ATTAQUES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};