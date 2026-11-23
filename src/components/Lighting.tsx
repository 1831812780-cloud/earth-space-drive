import { Vector3 } from 'three';
import { config } from '../config';
// The shaders share one distant sunlight direction in world space.
export const sun = new Vector3(...config.sunDirection).normalize();
