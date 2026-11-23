import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { config } from '../config';
import { Moon } from './Moon';
import { Earth } from './Earth';
import { drivingConfig } from '../driving/state';
import { DriverCamera } from './DriverCamera';
export function Scene({ cinematic = false }: { cinematic?: boolean }) {
 return <Canvas camera={{ position: [0,0,cinematic ? drivingConfig.initialDistance : config.cameraDistance], fov: cinematic ? 50 : 34, near: 0.1, far: 100 }} dpr={[1,config.maxDpr]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.setClearColor('#000000'); gl.outputColorSpace=SRGBColorSpace; gl.toneMapping=ACESFilmicToneMapping; gl.toneMappingExposure=1; }}><Earth cinematic={cinematic}/><Moon rotationPeriod={cinematic ? drivingConfig.earthPeriod : config.rotationPeriod} orbitPeriod={cinematic ? drivingConfig.moonOrbitPeriod : undefined}/>{cinematic && <DriverCamera/>}</Canvas>;
}
