import { Vector3 } from 'three';
import { config } from '../config';
// A single distant sun shared by all layers, in world space.
export const sun = new Vector3(...config.sunDirection).normalize();
