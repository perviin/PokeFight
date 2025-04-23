import { useCallback } from 'react';
import { Howl } from 'howler';

const sounds = {
  select: new Howl({
    src: ['/music/placeholder.mp3'],
    volume: 0.1
  }),
  battle: new Howl({
    src: ['/music/battle.mp3'],
    volume: 0.1
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