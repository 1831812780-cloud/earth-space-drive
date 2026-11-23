import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, SRGBColorSpace, Texture, TextureLoader } from 'three';
import { config } from '../config';
import { sun } from './Lighting';
import { vertex } from './shaders';

const fragment = /* glsl */`
 uniform sampler2D moonMap; uniform vec3 sun;
 varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
 void main() {
  vec3 albedo = texture2D(moonMap, vUv).rgb;
  float incidence = dot(normalize(vNormal), sun);
  float day = smoothstep(-0.015, 0.035, incidence);
  gl_FragColor = vec4(albedo * (0.004 + 1.25 * max(incidence, 0.0)) * day, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }
`;

/** Circular visual orbit; its angular period preserves the sidereal time ratio. */
export function Moon({ rotationPeriod = config.rotationPeriod, orbitPeriod }: { rotationPeriod?: number; orbitPeriod?: number }) {
 const orbit = useRef<Group>(null);
 const [texture, setTexture] = useState<Texture>();
 const gl = useThree(s => s.gl);
 const angle = useRef(config.moon.initialAngle);
 const uniforms = useMemo(() => ({ moonMap: { value: texture }, sun: { value: sun } }), [texture]);
 useEffect(() => {
  let cancelled = false;
  const map = new TextureLoader().load(`${import.meta.env.BASE_URL}textures/moon-2k.jpg`, loaded => {
   loaded.colorSpace = SRGBColorSpace;
   loaded.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
   if (!cancelled) setTexture(loaded);
  }, undefined, () => console.error('Moon texture could not be loaded.'));
  return () => { cancelled = true; map.dispose(); };
 }, [gl]);
 useFrame((_, delta) => {
  // Same time dilation as Earth's nominal 45-second sidereal rotation.
  angle.current += Math.min(delta, 0.05) * Math.PI * 2 / (orbitPeriod ?? rotationPeriod * config.moon.periodRatio);
  if (orbit.current) orbit.current.rotation.y = angle.current;
 });
 return <group rotation-x={config.moon.orbitInclination * Math.PI / 180}>
  <group ref={orbit} rotation-y={config.moon.initialAngle}>
   {texture && <mesh position-x={config.moon.orbitRadius * config.radius} rotation-y={Math.PI / 2}>
    <sphereGeometry args={[config.radius * config.moon.radiusRatio, 96, 64]}/>
    <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms}/>
   </mesh>}
  </group>
 </group>;
}
