import { useEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Quaternion, Vector3, Raycaster, Sphere, Vector2 } from 'three';
import { config } from '../config';
export function EarthControls({ interaction, spin }: { interaction: RefObject<Group | null>; spin: RefObject<Group | null> }) {
 const { gl, camera, size } = useThree();
 const state = useRef({ pointers: new Map<number, Vector2>(), velocity: new Vector2(), auto: 1, target: config.cameraDistance, pinch: 0 });
 const qx = useMemoQuaternion(); const qy = useMemoQuaternion();
 useEffect(() => {
  const el = gl.domElement; const s = state.current;
  const ray = new Raycaster(); const sphere = new Sphere(new Vector3(), config.radius * config.cloudHeight);
  const down = (e: PointerEvent) => {
   const rect = el.getBoundingClientRect();
   ray.setFromCamera(new Vector2((e.clientX-rect.left)/rect.width*2-1, -(e.clientY-rect.top)/rect.height*2+1), camera);
   if (!s.pointers.size && !ray.ray.intersectsSphere(sphere)) return;
   el.setPointerCapture(e.pointerId); s.pointers.set(e.pointerId, new Vector2(e.clientX,e.clientY));
   s.velocity.set(0,0); s.auto = 0; s.pinch = 0; el.style.cursor = 'grabbing';
  };
  let last = performance.now();
  const move = (e: PointerEvent) => {
   const p = s.pointers.get(e.pointerId); if (!p) return;
   const dx = e.clientX-p.x, dy = e.clientY-p.y; p.set(e.clientX,e.clientY);
   if (s.pointers.size === 2) {
    const [a,b] = [...s.pointers.values()]; const distance = a.distanceTo(b);
    if (s.pinch) s.target *= s.pinch / Math.max(1,distance);
    s.target = Math.max(config.minDistance,Math.min(config.maxDistance,s.target)); s.pinch = distance; s.velocity.set(0,0);
   } else {
    const now = performance.now(); const dt = Math.max(1/120, Math.min((now-last)/1000,0.05)); last=now;
    const scale = config.dragSensitivity * Math.min(1, size.width/600);
    if (interaction.current) {
     qx.setFromAxisAngle(new Vector3(1,0,0), dy*scale); qy.setFromAxisAngle(new Vector3(0,1,0), dx*scale);
     interaction.current.quaternion.premultiply(qx).premultiply(qy);
    }
    s.velocity.set(dx*scale/dt,dy*scale/dt).clampLength(0,5);
   }
  };
  const up = (e: PointerEvent) => {
   s.pointers.delete(e.pointerId); s.pinch = 0;
   if (performance.now()-last > 120 || e.type === 'pointercancel') s.velocity.set(0,0);
   if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
   if (!s.pointers.size) el.style.cursor='grab';
  };
  const wheel = (e: WheelEvent) => { e.preventDefault(); s.target = Math.max(config.minDistance, Math.min(config.maxDistance,s.target*Math.exp(e.deltaY*0.001))); };
  el.addEventListener('pointerdown',down); el.addEventListener('pointermove',move); el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up); el.addEventListener('wheel',wheel,{passive:false});
  return () => { s.pointers.clear(); el.removeEventListener('pointerdown',down); el.removeEventListener('pointermove',move); el.removeEventListener('pointerup',up); el.removeEventListener('pointercancel',up); el.removeEventListener('wheel',wheel); };
 }, [gl,camera,size.width,interaction,qx,qy]);
 useFrame((_, delta) => {
  const dt = Math.min(delta,0.05); const s = state.current;
  if (!s.pointers.size) {
   const decay = Math.exp(-config.inertiaDecay*dt);
   if (interaction.current) {
    qx.setFromAxisAngle(new Vector3(1,0,0),s.velocity.y*(1-decay)/config.inertiaDecay);
    qy.setFromAxisAngle(new Vector3(0,1,0),s.velocity.x*(1-decay)/config.inertiaDecay);
    interaction.current.quaternion.premultiply(qx).premultiply(qy);
   }
   s.velocity.multiplyScalar(decay);
   s.auto += (1-s.auto)*(1-Math.exp(-dt/config.autoResume));
  }
  if (spin.current) spin.current.rotation.y += dt * Math.PI*2/config.rotationPeriod * s.auto;
  // Keep the complete sphere visible in portrait view without changing its proportions.
  const aspect = size.width / size.height;
  const portrait = Math.max(1, 0.84/aspect);
  camera.position.z += (s.target*portrait-camera.position.z)*(1-Math.exp(-dt*10));
 });
 return null;
}
function useMemoQuaternion() { return useRef(new Quaternion()).current; }
