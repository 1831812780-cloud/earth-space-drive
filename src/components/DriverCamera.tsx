import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { drive, drivingConfig as cfg } from '../driving/state';
export function DriverCamera() {
 const { camera } = useThree();
 const motion=useRef({distance:cfg.initialDistance,azimuth:0,elevation:0.04,reset:drive.reset});
 useFrame((_,delta)=>{
  const dt=Math.min(delta,0.05), m=motion.current;
  if(m.reset!==drive.reset) {m.distance=cfg.initialDistance;m.azimuth=0;m.reset=drive.reset;drive.speed=0;drive.wheel=0;}
  const keyTurn=Number(drive.keys.has('ArrowRight')||drive.keys.has('d'))-Number(drive.keys.has('ArrowLeft')||drive.keys.has('a'));
  const keyMove=Number(drive.keys.has('ArrowUp')||drive.keys.has('w'))-Number(drive.keys.has('ArrowDown')||drive.keys.has('s'));
  drive.steering=keyTurn;
  drive.throttle=keyMove;
  drive.wheel+=(drive.steering-drive.wheel)*(1-Math.exp(-dt*7));
  drive.speed+=(drive.throttle*cfg.speed-drive.speed)*(1-Math.exp(-dt*(drive.throttle?2.5:6)));
  m.distance=Math.max(cfg.minDistance,Math.min(cfg.maxDistance,m.distance-drive.speed*dt));
  // Steering changes the approach bearing, including while hovering.
  m.azimuth+=drive.wheel*cfg.turnRate*dt;
  camera.position.set(Math.sin(m.azimuth)*m.distance, m.distance*m.elevation, Math.cos(m.azimuth)*m.distance);
  camera.lookAt(0,0.12,0);
  camera.rotateZ(-drive.wheel*0.012);
 });
 return null;
}
