import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [blink, setBlink] = useState(true);
  const { playSound } = useSound();

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    playSound('select');
    onStart();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-4">
      {/* Top Screen */}
      <div className="w-full max-w-2xl ds-screen bg-[#9BBC0F] flex items-center justify-center relative overflow-hidden">
        {/* CRT Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines"></div>
        
        {/* Title Content */}
        <div className="text-center z-10">
          <h1 className="text-4xl font-gameboy text-[#0F380F] tracking-wider">
            POKEMON
            <br />
            BATTLE
          </h1>
        </div>
      </div>

      {/* Bottom Screen */}
      <div 
        onClick={handleStart}
        className="w-full max-w-2xl ds-screen bg-[#9BBC0F] flex items-center justify-center cursor-pointer"
      >
        <p className={`text-lg font-gameboy text-[#0F380F] ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
          PRESS START
        </p>
      </div>
    </div>
  );
}