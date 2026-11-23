export const config = {
  moon: {
    radiusRatio: 1737.4 / 6371,
    periodRatio: 27.3217 / 0.99726968,
    orbitRadius: 2.6, // Compressed for composition; physical mean distance is ~60.34 Earth radii.
    orbitInclination: 5.145,
    initialAngle: -0.15,
  },
  radius: 1, axialTilt: 23.44, rotationPeriod: 45,
  dragSensitivity: 0.005, inertiaDecay: 3.2, autoResume: 1.8,
  cameraDistance: 11.8, minDistance: 11.8, maxDistance: 17,
  sunDirection: [-3, 2, 5] as [number, number, number],
  cloudOpacity: 0.83, cloudHeight: 1.004, cloudDrift: 0.012,
  atmosphereStrength: 0.16, maxDpr: 1.75,
};
