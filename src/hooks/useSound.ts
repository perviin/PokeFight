import { useCallback } from 'react';
import { Howl } from 'howler';

const sounds = {
  select: new Howl({
    src: ['https://raw.githubusercontent.com/poke-sounds/select.mp3'],
    volume: 0.5
  }),
  battle: new Howl({
    src: ['https://raw.githubusercontent.com/poke-sounds/battle.mp3'],
    volume: 0.3,
    loop: true
  })
};

export const useSound = () => {
  const playSound = useCallback((soundName: keyof typeof sounds) => {
    sounds[soundName].play();
  }, []);

  const stopSound = useCallback((soundName: keyof typeof sounds) => {
    sounds[soundName].stop();
  }, []);

  return { playSound, stopSound };
};