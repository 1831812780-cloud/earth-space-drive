export const drive = {
 steering: 0, throttle: 0, wheel: 0, speed: 0,
 handSteering: 0, handThrottle: 0, lastHandAt: 0,
 keys: new Set<string>(), reset: 0,
};
export const drivingConfig = { initialDistance: 5.8, minDistance: 1.65, maxDistance: 12, speed: 0.48, turnRate: 0.22, earthPeriod: 240, moonOrbitPeriod: 600 };
export function stopHands() { drive.handSteering = 0; drive.handThrottle = 0; drive.lastHandAt = 0; }

export function resetDrive() {
 drive.keys.clear(); stopHands();
 drive.speed = 0; drive.wheel = 0; drive.steering = 0; drive.throttle = 0;
 drive.reset++;
}
