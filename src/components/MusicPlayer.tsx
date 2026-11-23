import { useEffect, useRef } from 'react';
import { resetDrive } from '../driving/state';

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const played = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    const element = audio.current!;
    element.volume = 0.5;
    async function play() {
      started.current = true;
      try {
        if (element.ended) element.currentTime = 0;
        await element.play();
      } catch { started.current = false; }
    }
    const click = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('.drive-controls')) return;
      if (!started.current) void play();
    };
    const key = (event: KeyboardEvent) => {
      if (event.repeat || (event.target as HTMLElement).matches('input,textarea,select,[contenteditable=true]')) return;
      const value = event.key.toLowerCase();
      if (value === 'm') {
        event.preventDefault();
        if (element.paused) void play(); else element.pause();
      } else if (!started.current && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(value)) {
        void play();
      }
    };
    window.addEventListener('pointerdown', click);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('pointerdown', click);
      window.removeEventListener('keydown', key);
      played.current = false;
      element.pause();
    };
  }, []);

  function stopped() {
    if (played.current) { played.current = false; resetDrive(); }
  }
  return <audio hidden ref={audio} src={`${import.meta.env.BASE_URL}audio/space-oddity-mitty-mix.mp3`} preload="metadata"
    aria-label="Space Oddity 背景音乐"
    onPlay={() => { played.current = true; }}
    onPause={() => { if (!audio.current?.ended) stopped(); }}
    onEnded={stopped}
    onError={stopped}/>;
}
