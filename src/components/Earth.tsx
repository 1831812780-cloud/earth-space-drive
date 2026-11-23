import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Group, MathUtils, type IUniform } from 'three';
import { useEarthTextures } from '../assets/textures';
import { drivingConfig } from '../driving/state';
import { config } from '../config';
import { Clouds } from './Clouds';
import { Atmosphere } from './Atmosphere';
import { sun } from './Lighting';
import { vertex, surface } from './shaders';
import { EarthControls } from './EarthControls';
export function Earth({ cinematic = false }: { cinematic?: boolean }) {
 const textures = useEarthTextures();
 const interaction = useRef<Group>(null); const spin = useRef<Group>(null);
 const uniforms = useMemo<Record<string, IUniform>>(() => textures ? { dayMap: { value: textures.day }, oceanMap: { value: textures.ocean }, sun: { value: sun } } : {} as Record<string, IUniform>, [textures]);
 useFrame((_, dt) => { if (cinematic && spin.current) spin.current.rotation.y += Math.min(dt, 0.05) * Math.PI * 2 / drivingConfig.earthPeriod; });
 return <>{!cinematic && <EarthControls interaction={interaction} spin={spin}/>}<group ref={interaction}><group rotation-z={MathUtils.degToRad(-config.axialTilt)}><group ref={spin} rotation-y={2.5}>
 {textures && <><mesh><sphereGeometry args={[config.radius, 192, 128]}/><shaderMaterial vertexShader={vertex} fragmentShader={surface} uniforms={uniforms}/></mesh><Clouds texture={textures.clouds} cinematic={cinematic}/><Atmosphere/></>}
 </group></group></group></>;
}
