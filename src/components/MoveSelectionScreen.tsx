import React, { useEffect, useState } from 'react';
import { Pokemon, Move } from '../types';

interface MoveSelectionScreenProps {
  pokemon: Pokemon;
  onMovesSelected: (moves: Move[]) => void;
}

const FRENCH_MOVES: { [key: string]: string } = {
  tackle: 'Charge',
  scratch: 'Griffe',
  ember: 'Flammèche',
  'water-gun': 'Pistolet à O',
  thundershock: 'Éclair',
  'vine-whip': 'Fouet Lianes',
  growl: 'Rugissement',
  'tail-whip': 'Mimi-Queue',
  'quick-attack': 'Vive-Attaque',
  // Add more moves...
};

export const MoveSelectionScreen: React.FC<MoveSelectionScreenProps> = ({ pokemon, onMovesSelected }) => {
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<Move[]>([]);

  useEffect(() => {
    const fetchMoveDetails = async () => {
      const moves = await Promise.all(
        pokemon.moves
          .filter(moveEntry => {
            const levelLearned = moveEntry.version_group_details[0]?.level_learned_at || 0;
            return levelLearned <= pokemon.level;
          })
          .map(async moveEntry => {
            const response = await fetch(moveEntry.move.url);
            const moveData = await response.json();
            return {
              name: moveData.name,
              frenchName: FRENCH_MOVES[moveData.name] || moveData.name,
              power: moveData.power || 0,
              accuracy: moveData.accuracy || 100,
              type: moveData.type.name,
              levelLearned: moveEntry.version_group_details[0]?.level_learned_at || 0
            };
          })
      );
      setAvailableMoves(moves);
    };

    fetchMoveDetails();
  }, [pokemon]);

  const handleMoveSelect = (move: Move) => {
    if (selectedMoves.includes(move)) {
      setSelectedMoves(prev => prev.filter(m => m !== move));
    } else if (selectedMoves.length < 4) {
      setSelectedMoves(prev => [...prev, move]);
    }
  };

  const handleConfirm = () => {
    if (selectedMoves.length === 4) {
      onMovesSelected(selectedMoves);
    }
  };

  return (
    <div className="min-h-screen bg-gameboy-lightest p-4">
      <div className="max-w-2xl mx-auto bg-gameboy-light p-6 rounded shadow-lg">
        <h2 className="text-2xl font-gameboy text-gameboy-darkest mb-6 text-center">
          Attaques disponibles pour {pokemon.frenchName} N.{pokemon.level}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {availableMoves.map((move) => (
            <button
              key={move.name}
              onClick={() => handleMoveSelect(move)}
              className={`p-4 rounded font-gameboy text-sm ${
                selectedMoves.includes(move)
                  ? 'bg-gameboy-dark text-white'
                  : 'bg-white text-gameboy-darkest'
              }`}
            >
              <div>{move.frenchName}</div>
              <div className="text-xs mt-1">
                Puissance: {move.power || '-'} | Précision: {move.accuracy}%
              </div>
              <div className="text-xs">Niveau: {move.levelLearned}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={selectedMoves.length !== 4}
          className="w-full bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 rounded hover:bg-gameboy-darkest disabled:opacity-50"
        >
          {selectedMoves.length === 4 ? 'CONFIRMER' : `Sélectionnez ${4 - selectedMoves.length} attaques de plus`}
        </button>
      </div>
    </div>
  );
};