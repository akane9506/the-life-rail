import * as THREE from "three";

// Animation
const SPEED_FACTOR = 5;
const ANIMATION_TIMESCALE = 2.0;
const DAY_LENGTH = 25;

// Camera
const DEFAULT_FOV = 50;
const CAMERA_Y_SHIFT = 3.0;

type CameraParams = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  shift: {
    x: number;
    y: number;
    z: number;
  };
  fov: number;
};

const PRESET_CAMERA_PARAMS: Record<string, CameraParams> = {
  head: {
    position: { x: 15.1, y: 12.6, z: 12.7 },
    shift: { x: -1, y: 2.6, z: 0 },
    fov: 30,
  },
  horti: {
    position: { x: -12.5, y: 1.1, z: 0.0 },
    shift: { x: 0, y: 3.0, z: 0 },
    fov: 20,
  },
};

// Environment
const DAY_BG = new THREE.Color("#e5dcd5");
const NIGHT_BG = new THREE.Color("#101927");
const DAY_SUN_COLOR = new THREE.Color("#fff5e0");
const DUSK_SUN_COLOR = new THREE.Color("#ff6a00");
const NIGHT_SUN_COLOR = new THREE.Color("#1a1a4a");
const ENV_INTENSITIES = [0.05, 0.8];

export {
  ANIMATION_TIMESCALE,
  CAMERA_Y_SHIFT,
  DAY_BG,
  DAY_LENGTH,
  DAY_SUN_COLOR,
  DEFAULT_FOV,
  DUSK_SUN_COLOR,
  ENV_INTENSITIES,
  NIGHT_BG,
  NIGHT_SUN_COLOR,
  PRESET_CAMERA_PARAMS,
  SPEED_FACTOR,
};
