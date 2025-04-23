import { useState, useEffect } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { BattleScreen } from './components/BattleScreen';
import { StatsScreen } from './components/StatsScreen';
import { GameState, Pokemon, BattleRecord } from './types';
import { MoveSelectionScreen } from './components/MoveSelectionScreen';

const STORAGE_KEY = 'pokemon-battle-history';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    return {
      screen: 'title',
      selectedPokemon: [null, null],
      battleHistory: savedHistory ? JSON.parse(savedHistory) : [],
      currentPokemonIndex: 0
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState.battleHistory));
  }, [gameState.battleHistory]);

  const handleStartGame = () => {
    setGameState(prev => ({ ...prev, screen: 'selection' }));
  };

  const handleReturnToSelection = () => {
    setGameState(prev => ({ ...prev, screen: 'selection' }));
  }

  const handlePokemonSelected = (pokemon: Pokemon | null) => {
    setGameState(prev => {
      const newSelectedPokemon = [...prev.selectedPokemon] as [Pokemon | null, Pokemon | null];
      newSelectedPokemon[prev.currentPokemonIndex] = pokemon;
  
      if (prev.currentPokemonIndex === 0) {
        return {
          ...prev,
          selectedPokemon: newSelectedPokemon,
          currentPokemonIndex: 1
        };
      } else {
        return {
          ...prev,
          selectedPokemon: newSelectedPokemon,
          screen: 'battle',
          currentPokemonIndex: 0
        };
      }
    });
  };  

  const handleBattleEnd = (record: BattleRecord) => {
    setGameState(prev => ({
      ...prev,
      screen: 'selection',
      selectedPokemon: [null, null],
      currentPokemonIndex: 0,
      battleHistory: [...prev.battleHistory, record]
    }));
  };

  const handleReturnToTitle = () => {
    setGameState(prev => ({
      ...prev,
      screen: 'title',
      selectedPokemon: [null, null],
      currentPokemonIndex: 0
    }));
  };

  const handleShowStats = () => {
    setGameState(prev => ({
     ...prev,
     screen: 'stats', 
    }))
  }

  return (
    <div className="min-h-screen">
      {gameState.screen === 'title' && (
        <TitleScreen onStart={handleStartGame} />
      )}
      {gameState.screen === 'selection' && (
        <SelectionScreen 
          onPokemonSelected={handlePokemonSelected}
          selectedPokemon={gameState.selectedPokemon}
          currentPokemonIndex={gameState.currentPokemonIndex}
          onShowStats={handleShowStats}
        />
      )}
      {gameState.screen === 'battle' && gameState.selectedPokemon[0] && gameState.selectedPokemon[1] && (
        <BattleScreen 
          pokemon={gameState.selectedPokemon as [Pokemon, Pokemon]} 
          onBattleEnd={handleBattleEnd}
        />
      )}
      {gameState.screen === 'stats' && (
        <StatsScreen 
          battleHistory={gameState.battleHistory}
          onReturn={handleReturnToSelection}
        />
      )}
    </div>
  );
}

export default App;