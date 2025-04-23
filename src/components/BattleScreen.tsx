import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { Pokemon, BattleRecord, Move, TYPE_EFFECTIVENESS } from '../types';

interface BattleScreenProps {
  pokemon: [Pokemon, Pokemon];
  onBattleEnd: (record: BattleRecord) => void;
}

interface BattleState {
  hp: [number, number];
  currentTurn: number;
  logs: string[];
  winner: Pokemon | null;
  isPlayerTurn: boolean;
  animation: {
    type: 'attack' | 'damage' | 'none';
    target: number;
  };
  battleMessage: string;
  isAutoBattle: boolean; // Nouveau état pour l'automatisation
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ pokemon, onBattleEnd }) => {
  const [battleState, setBattleState] = useState<BattleState>({
    hp: [100, 100],
    currentTurn: 0,
    logs: [],
    winner: null,
    isPlayerTurn: true,
    animation: {
      type: 'none',
      target: 0
    },
    battleMessage: `Que doit faire ${pokemon[0].frenchName} ?`,
    isAutoBattle: false // Initialement désactivé
  });
  const [showEntrance, setShowEntrance] = useState(true);
  const [pokemonVisible, setPokemonVisible] = useState<[boolean, boolean]>([false, false]);
  const { playSound, stopSound } = useSound();

  useEffect(() => {
    playSound('battle');
    return () => stopSound('battle');
  }, []);

  useEffect(() => {
    if (showEntrance) {
      // Player Pokemon entrance
      setTimeout(() => {
        setPokemonVisible([true, false]);
        setTimeout(() => {
          // Opponent Pokemon entrance
          setPokemonVisible([true, true]);
          setTimeout(() => {
            setShowEntrance(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }, [showEntrance]);

  useEffect(() => {
    // Gestion du tour automatique de l'adversaire
    if (!battleState.isPlayerTurn && !battleState.winner) {
      const timer = setTimeout(() => {
        const aiMove = pokemon[1].selectedMoves[Math.floor(Math.random() * pokemon[1].selectedMoves.length)];
        handleMoveSelect(aiMove, 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [battleState.isPlayerTurn]);

  // Nouvel effet pour l'automatisation du combat du joueur
  useEffect(() => {
    if (battleState.isAutoBattle && battleState.isPlayerTurn && !battleState.winner && !showEntrance) {
      const timer = setTimeout(() => {
        // Sélection aléatoire d'un mouvement pour le joueur
        const playerMove = pokemon[0].selectedMoves[Math.floor(Math.random() * pokemon[0].selectedMoves.length)];
        handleMoveSelect(playerMove, 0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [battleState.isPlayerTurn, battleState.isAutoBattle, battleState.winner, showEntrance]);

  const calculateTypeEffectiveness = (moveType: string, defenderTypes: string[]): number => {
    let effectiveness = 1;
    defenderTypes.forEach(defenderType => {
      if (TYPE_EFFECTIVENESS[moveType]?.[defenderType]) {
        effectiveness *= TYPE_EFFECTIVENESS[moveType][defenderType];
      }
    });
    return effectiveness;
  };

  const getEffectivenessMessage = (effectiveness: number): string => {
    if (effectiveness > 1) return "C'est super efficace !";
    if (effectiveness < 1) return "Ce n'est pas très efficace...";
    return "";
  };

  const calculateDamage = (move: Move, attacker: Pokemon, defender: Pokemon) => {
    const attack = attacker.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
    const defense = defender.stats.find(s => s.stat.name === 'defense')?.base_stat || 1;
    const specialAttack = attacker.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
    const specialDefense = defender.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 1;
    
    // Use special stats for special moves (you can expand this list)
    const isSpecialMove = ['psychic', 'fire', 'water', 'grass', 'electric', 'ice', 'dragon'].includes(move.type);
    
    const attackStat = isSpecialMove ? specialAttack : attack;
    const defenseStat = isSpecialMove ? specialDefense : defense;
    
    const levelModifier = 1 + attacker.level / 50;
    const effectiveness = calculateTypeEffectiveness(
      move.type,
      defender.types.map(t => t.type.name)
    );
    
    // Critical hit chance (6.25%)
    const isCritical = Math.random() < 0.0625;
    const criticalMultiplier = isCritical ? 1.5 : 1;
    
    // Random factor between 0.85 and 1.0
    const randomFactor = 0.85 + (Math.random() * 0.15);
    
    const baseDamage = Math.floor(
      (((2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat) / 50 + 2) * 
      effectiveness * 
      criticalMultiplier * 
      randomFactor
    );
    
    return {
      damage: Math.max(1, baseDamage),
      isCritical,
      effectiveness
    };
  };

  const handleMoveSelect = (move: Move, playerIndex: number) => {
    if (battleState.winner) return;
    if (playerIndex === 0 && !battleState.isPlayerTurn) return;
    if (playerIndex === 1 && battleState.isPlayerTurn) return;
    
    playSound('select');
    const attacker = pokemon[playerIndex];
    const defender = pokemon[playerIndex === 0 ? 1 : 0];
    const targetIndex = playerIndex === 0 ? 1 : 0;

    setBattleState(prev => ({
      ...prev,
      animation: {
        type: 'attack',
        target: targetIndex
      },
      battleMessage: `${attacker.frenchName} utilise ${move.frenchName}!`
    }));

    setTimeout(() => {
      const { damage, isCritical, effectiveness } = calculateDamage(move, attacker, defender);
      const effectivenessMessage = getEffectivenessMessage(effectiveness);
      const criticalMessage = isCritical ? "Coup critique !" : "";

      setBattleState(prev => {
        const newHp = [...prev.hp];
        newHp[targetIndex] = Math.max(0, newHp[targetIndex] - damage);

        const moveMessage = `${attacker.frenchName} utilise ${move.frenchName}!`;
        const damageMessage = `${damage} dégâts!`;
        const newLogs = [
          ...prev.logs,
          moveMessage,
          damageMessage,
          ...(effectivenessMessage ? [effectivenessMessage] : []),
          ...(criticalMessage ? [criticalMessage] : [])
        ].slice(-5);

        let winner = null;
        if (newHp[targetIndex] <= 0) {
          winner = attacker;
        }

        return {
          ...prev,
          hp: newHp as [number, number],
          animation: {
            type: 'damage',
            target: targetIndex
          },
          logs: newLogs,
          battleMessage: criticalMessage || effectivenessMessage || `${damage} dégâts!`,
          winner
        };
      });

      setTimeout(() => {
        setBattleState(prev => {
          if (prev.winner) {
            return {
              ...prev,
              animation: {
                type: 'none',
                target: 0
              },
              battleMessage: `${prev.winner.frenchName} GAGNE !`
            };
          }

          return {
            ...prev,
            isPlayerTurn: !prev.isPlayerTurn,
            animation: {
              type: 'none',
              target: 0
            },
            battleMessage: !prev.isPlayerTurn ? `Que doit faire ${pokemon[0].frenchName} ?` : `Au tour de ${pokemon[1].frenchName}!`
          };
        });
      }, 500);
    }, 500);
  };

  // Fonction pour activer/désactiver l'automatisation
  const toggleAutoBattle = () => {
    setBattleState(prev => ({
      ...prev,
      isAutoBattle: !prev.isAutoBattle
    }));
  };

  const getAnimationClass = (pokemonIndex: number) => {
    const { animation } = battleState;
    if (animation.type === 'attack' && animation.target !== pokemonIndex) {
      return 'animate-attack';
    }
    if (animation.type === 'damage' && animation.target === pokemonIndex) {
      return 'animate-damage';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      {/* Top Screen */}
      <div className="w-full max-w-2xl ds-screen relative overflow-hidden"
           style={{
             backgroundImage: 'url(./img/fight-background.png)',
             backgroundColor: '#8BAC0F',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="relative h-full">
          {/* Opponent Pokemon */}
          {showEntrance ? (
            <div className="absolute right-4 top-12">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Pokeball"
                className={`w-12 h-12 pixelated ${pokemonVisible[1] ? 'hidden' : 'animate-throw-pokeball'}`}
              />
              {pokemonVisible[1] && (
                <div className={`animate-pokemon-enter`}>
                  <div className="bg-white/90 p-2 rounded mb-1">
                    <p className="font-gameboy text-sm">
                      {pokemon[1].frenchName} N.{pokemon[1].level}
                    </p>
                    <div className="w-64 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${battleState.hp[1]}%` }}
                      />
                    </div>
                  </div>
                  <img 
                    src={pokemon[1].sprites.front_default}
                    alt={pokemon[1].frenchName}
                    className="w-64 h-64 pixelated"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={`absolute right-4 top-12 ${getAnimationClass(1)} ${
              battleState.winner === pokemon[0] ? 'animate-faint' : ''
            }`}>
              <div className="bg-white/90 p-2 rounded mb-1">
                <p className="font-gameboy text-sm">
                  {pokemon[1].frenchName} N.{pokemon[1].level}
                </p>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${battleState.hp[1]}%` }}
                  />
                </div>
              </div>
              <img 
                src={pokemon[1].sprites.front_default}
                alt={pokemon[1].frenchName}
                className="w-64 h-64 pixelated"
              />
            </div>
          )}

          {/* Player Pokemon */}
          {showEntrance ? (
            <div className="absolute left-4 bottom-4">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Pokeball"
                className={`w-12 h-12 pixelated ${pokemonVisible[0] ? 'hidden' : 'animate-throw-pokeball'}`}
              />
              {pokemonVisible[0] && (
                <div className={`animate-pokemon-enter`}>
                  <div className="bg-white/90 p-2 rounded mb-1">
                    <p className="font-gameboy text-sm">
                      {pokemon[0].frenchName} N.{pokemon[0].level}
                    </p>
                    <div className="w-64 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${battleState.hp[0]}%` }}
                      />
                    </div>
                  </div>
                  <img 
                    src={pokemon[0].sprites.back_default}
                    alt={pokemon[0].frenchName}
                    className="w-64 h-64 pixelated"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={`absolute left-4 bottom-4 ${getAnimationClass(0)} ${
              battleState.winner === pokemon[1] ? 'animate-faint' : ''
            }`}>
              <div className="bg-white/90 p-2 rounded mb-1">
                <p className="font-gameboy text-sm">
                  {pokemon[0].frenchName} N.{pokemon[0].level}
                </p>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${battleState.hp[0]}%` }}
                  />
                </div>
              </div>
              <img 
                src={pokemon[0].sprites.back_default}
                alt={pokemon[0].frenchName}
                className="w-64 h-64 pixelated"
              />
            </div>
          )}

          {/* Battle Message Box */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
            <p className="font-gameboy text-lg">{battleState.battleMessage}</p>
          </div>

          {/* Bouton d'automatisation dans le top screen */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={toggleAutoBattle}
              className={`px-3 py-1 rounded font-gameboy text-sm ${
                battleState.isAutoBattle ? 'bg-red-600 text-white' : 'bg-white text-black'
              }`}
            >
              {battleState.isAutoBattle ? 'Auto: ON' : 'Auto: OFF'}
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Screen */}
      <div className="w-full max-w-2xl ds-screen bg-gameboy-lightest p-4">
        {/* Bouton d'automatisation */}
        {/* {!battleState.winner && !showEntrance && (
          <div className="text-center mb-4">
            <button
              onClick={toggleAutoBattle}
              className={`font-gameboy py-2 px-4 rounded ${
                battleState.isAutoBattle 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {battleState.isAutoBattle ? 'DÉSACTIVER AUTO' : 'ACTIVER AUTO'}
            </button>
          </div>
        )} */}

        {battleState.isPlayerTurn && !battleState.winner && !battleState.isAutoBattle && (
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-2 gap-2 flex-1">
              {pokemon[0].selectedMoves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => handleMoveSelect(move, 0)}
                  className="bg-gameboy-dark text-white font-gameboy py-2 px-4 rounded hover:bg-gameboy-darkest"
                >
                  {move.frenchName}
                </button>
              ))}
            </div>
          </div>
        )}

        {battleState.isPlayerTurn && !battleState.winner && battleState.isAutoBattle && (
          <div className="text-center">
            <p className="font-gameboy text-gameboy-dark mb-4">Combat automatique en cours...</p>
            <div className="animate-pulse h-4 w-1/2 mx-auto bg-gameboy-dark rounded"></div>
          </div>
        )}

        {battleState.winner && (
          <div className="text-center mt-8">
            <button 
              onClick={() => onBattleEnd({
                winner: battleState.winner!.frenchName,
                loser: pokemon.find(p => p !== battleState.winner)!.frenchName,
                date: new Date().toISOString()
              })}
              className="bg-gameboy-dark text-gameboy-lightest font-gameboy py-2 px-4 rounded hover:bg-gameboy-darkest"
            >
              RETOUR À LA SÉLECTION
            </button>
          </div>
        )}
      </div>
    </div>
  );
};