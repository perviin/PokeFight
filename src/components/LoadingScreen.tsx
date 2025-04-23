import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      {/* Top Screen */}
      <div className="w-full max-w-2xl ds-screen bg-gameboy-light flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokeball"
            className="w-24 h-24 mx-auto pixelated animate-spin"
          />
        </div>
      </div>

      {/* Bottom Screen */}
      <div className="w-full max-w-2xl ds-screen bg-gameboy-lightest flex items-center justify-center">
        <p className="font-gameboy text-gameboy-darkest">Chargement...</p>
      </div>
    </div>
  );
};