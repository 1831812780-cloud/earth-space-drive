import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Texture } from 'three';
import { config } from '../config';
import { vertex, clouds } from './shaders';
import { sun } from './Lighting';
export function Clouds({ texture, cinematic = false }: { texture: Texture; cinematic?: boolean }) {
 const ref = useRef<Mesh>(null);
 const uniforms = useMemo(() => ({ cloudMap: { value: texture }, sun: { value: sun }, opacity: { value: config.cloudOpacity } }), [texture]);
 useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += Math.min(dt, 0.05) * (cinematic ? 0.000005 : config.cloudDrift); });
 return <mesh ref={ref} scale={config.cloudHeight}><sphereGeometry args={[config.radius, 128, 96]}/><shaderMaterial vertexShader={vertex} fragmentShader={clouds} uniforms={uniforms} transparent depthWrite={false}/></mesh>;
}
