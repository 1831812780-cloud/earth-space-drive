import { config } from '../config';
import { vertex, atmosphere } from './shaders';
import { sun } from './Lighting';
const uniforms = { sun: { value: sun }, strength: { value: config.atmosphereStrength } };
export function Atmosphere() {
 return <mesh scale={1.009}><sphereGeometry args={[config.radius, 128, 96]}/><shaderMaterial vertexShader={vertex} fragmentShader={atmosphere} uniforms={uniforms} transparent depthWrite={false}/></mesh>;
}
