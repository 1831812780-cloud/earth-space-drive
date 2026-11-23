import { useEffect, useRef } from 'react';
import { drive, resetDrive } from '../driving/state';
import { MusicPlayer } from './MusicPlayer';

export function DrivingControls() {
 const wheel = useRef<HTMLDivElement>(null);
 useEffect(() => {
  let frame = 0;
  function animate() {
   if (wheel.current) wheel.current.style.transform = `rotate(${drive.wheel * 12}deg)`;
   frame = requestAnimationFrame(animate);
  }
  animate();
  const keydown = (event: KeyboardEvent) => {
   if ((event.target as HTMLElement).matches('input,textarea,select,[contenteditable=true]')) return;
   const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
   if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
    event.preventDefault(); drive.keys.add(key);
   }
  };
  const keyup = (event: KeyboardEvent) => drive.keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
  const release = () => { drive.keys.clear(); drive.speed = 0; };
  const visibility = () => { if (document.hidden) release(); };
  window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup);
  window.addEventListener('blur', release); document.addEventListener('visibilitychange', visibility);
  return () => {
   cancelAnimationFrame(frame); release();
   window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup);
   window.removeEventListener('blur', release); document.removeEventListener('visibilitychange', visibility);
  };
 }, []);
 return <>
  <img className="cockpit cockpit-base" src={`${import.meta.env.BASE_URL}images/cockpit-base.png`} alt="" draggable={false}/>
  <span className="cabin-beacon" aria-label="每两秒闪烁的驾驶舱指示灯"/>
  <div className="wheel-layer" ref={wheel}><img className="steering-hands" src={`${import.meta.env.BASE_URL}images/steering-hands.png`} alt="" draggable={false}/></div>
  <aside className="drive-controls" aria-label="键盘驾驶与音乐">
   <div className="drive-buttons"><button onClick={resetDrive}>重置视角</button></div>
   <p>↑ / W 前进　↓ / S 后退　← → / A D 转向　M 音乐</p>
   <MusicPlayer/>
  </aside>
 </>;
}
