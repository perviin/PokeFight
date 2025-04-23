import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { Pokemon } from '../types';
import { ChevronLeft, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import { LoadingScreen } from './LoadingScreen';

interface SelectionScreenProps {
  onPokemonSelected: (pokemon: Pokemon | null ) => void;
  selectedPokemon: [Pokemon | null, Pokemon | null];
  currentPokemonIndex: number;
  onSetCurrentPokemonIndex?: (index: number) => void; // Ajouter cette prop
  onShowStats: () => void; 
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ 
  onPokemonSelected, 
  selectedPokemon,
  currentPokemonIndex,
  onSetCurrentPokemonIndex, // Recevoir la prop
  onShowStats
}) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [level, setLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { playSound } = useSound();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNavigation('prev');
      } else if (e.key === 'ArrowRight') {
        handleNavigation('next');
      } else if (e.key === 'Enter' && filteredList.length > 0) {
        handlePokemonSelect();
      } else if (e.key === 'Backspace' && currentPokemonIndex === 1) {
        handleBackToPlayer1();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, filteredList, currentPokemonIndex]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon: { url: string; name: string }) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();

            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = await speciesResponse.json();
            const frenchName = speciesData.names.find((n: any) => n.language.name === 'fr')?.name || pokemonData.name;

            const selectedMoves = await Promise.all(
              pokemonData.moves
                .filter((move: any) => move.version_group_details[0]?.level_learned_at <= level)
                .slice(0, 4)
                .map(async (move: any) => {
                  const moveResponse = await fetch(move.move.url);
                  const moveData = await moveResponse.json();
                  const frenchMoveName = moveData.names.find((n: any) => n.language.name === 'fr')?.name || moveData.name;

                  return {
                    name: move.move.name,
                    frenchName: frenchMoveName,
                    power: moveData.power || 50,
                    accuracy: moveData.accuracy || 100,
                    type: moveData.type.name,
                    levelLearned: move.version_group_details[0]?.level_learned_at || 1
                  };
                })
            );

            return {
              ...pokemonData,
              frenchName,
              level: 5,
              selectedMoves
            };
          })
        );

        setPokemonList(detailedPokemon);
        setFilteredList(detailedPokemon);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setIsLoading(false);
      }
    };
    
    fetchPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon => 
      pokemon.frenchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
    setCurrentIndex(0);
  }, [searchTerm, pokemonList]);

  const handlePokemonSelect = () => {
    if (filteredList.length === 0) return;
    playSound('select');
    const selectedPokemon = {
      ...filteredList[currentIndex],
      level,
      selectedMoves: filteredList[currentIndex].selectedMoves
    };
    onPokemonSelected(selectedPokemon);
  };

  const handleBackToPlayer1 = () => {
    playSound('select');
    // Mettre à jour l'index pour revenir au joueur 1
    if (onSetCurrentPokemonIndex) {
      onSetCurrentPokemonIndex(0);
    }
    onPokemonSelected(null);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (filteredList.length === 0) return;
    playSound('select');
    setCurrentIndex(prev => {
      if (direction === 'prev') return prev === 0 ? filteredList.length - 1 : prev - 1;
      return prev === filteredList.length - 1 ? 0 : prev + 1;
    });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
    setLevel(newLevel);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const currentPokemon = filteredList[currentIndex];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      {/* Top Screen */}
      <div className="w-full max-w-2xl ds-screen bg-gameboy-light p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => handleNavigation('prev')}
            className={`p-2 ${!filteredList.length && 'opacity-50 cursor-not-allowed'}`}
            disabled={!filteredList.length}
          >
            <ChevronLeft className="w-6 h-6 text-gameboy-darkest" />
          </button>
          
          <div className="text-center flex-1">
            {filteredList.length > 0 ? (
              <img 
                src={currentPokemon.sprites.front_default} 
                alt={currentPokemon.frenchName}
                className="w-48 h-48 mx-auto pixelated"
              />
            ) : (
              <div className="w-48 h-48 mx-auto flex items-center justify-center">
                <p className="font-gameboy text-gameboy-darkest">Pokémon non existant</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => handleNavigation('next')}
            className={`p-2 ${!filteredList.length && 'opacity-50 cursor-not-allowed'}`}
            disabled={!filteredList.length}
          >
            <ChevronRight className="w-6 h-6 text-gameboy-darkest" />
          </button>
        </div>

        <div className="flex justify-center gap-8">
          {[0, 1].map((index) => (
            <div 
              key={index}
              className={`border-4 p-2 rounded ${
                currentPokemonIndex === index 
                  ? 'border-gameboy-dark bg-gameboy-lightest' 
                  : 'border-transparent'
              }`}
            >
              {selectedPokemon[index] ? (
                <div className="text-center">
                  <img 
                    src={selectedPokemon[index]!.sprites.front_default}
                    alt={selectedPokemon[index]!.frenchName}
                    className="w-24 h-24 pixelated"
                  />
                  <p className="font-gameboy text-sm">{selectedPokemon[index]!.frenchName}</p>
                </div>
              ) : (
                <div className="w-24 h-24 flex items-center justify-center">
                  <p className="font-gameboy text-sm">Joueur {index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Screen - Controls */}
      <div className="w-full max-w-2xl ds-screen bg-gameboy-lightest p-4">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un Pokémon..."
              className="w-full p-2 font-gameboy text-sm rounded border-2 border-gameboy-dark"
            />
            <Search className="absolute right-2 top-2 text-gameboy-dark w-5 h-5" />
          </div>
        </div>

        {filteredList.length > 0 ? (
          <>
            <div className="text-center mb-6">
              <img 
                src={currentPokemon.sprites.front_default} 
                alt={currentPokemon.frenchName}
                className="w-32 h-32 mx-auto pixelated"
              />
              <h3 className="font-gameboy text-gameboy-darkest uppercase mb-2">
                {currentPokemon.frenchName} N.{level}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm font-gameboy">
                {currentPokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="text-gameboy-darkest">
                    {stat.stat.name}: {stat.base_stat}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="font-gameboy text-sm text-gameboy-darkest">Niveau:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={level}
                onChange={handleLevelChange}
                className="w-20 p-2 font-gameboy text-sm rounded border-2 border-gameboy-dark"
              />
            </div>

            <div className="flex gap-4">
              {currentPokemonIndex === 1 && (
                <button
                  onClick={handleBackToPlayer1}
                  className="flex-1 bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 rounded hover:bg-gameboy-darkest flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  RETOUR
                </button>
              )}
              <button
                onClick={handlePokemonSelect}
                className="flex-1 bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 rounded hover:bg-gameboy-darkest"
              >
                SÉLECTIONNER
              </button>
            </div>

            <div className='flex gap-7 mt-3'>
              <button 
                onClick={onShowStats}
                className="flex-1 bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 rounded hover:bg-gameboy-darkest flex items-center justify-center gap-2"
              >
                VOIR LES STATISTIQUES
              </button>
            </div>
          </>
        ) : (
          <div className="text-center font-gameboy text-gameboy-darkest">
            Pokémon non existant
          </div>
        )}
      </div>
    </div>
  );
};