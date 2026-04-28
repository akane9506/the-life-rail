import * as THREE from "three";

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

type LightParams = {
  shift: THREE.Vector3Like;
  targetShift: THREE.Vector3Like;
  color: string;
  intensity: number;
};

// Animation
const SPEED_FACTOR = 5;
const ANIMATION_TIMESCALE = 2.0;
const DAY_LENGTH = 18;

// Camera
const DEFAULT_FOV = 50;
const PRESET_CAMERA_PARAMS: Record<string, CameraParams> = {
  head: {
    position: { x: 15.1, y: 7.4, z: 12.7 },
    shift: { x: -2.2, y: 2.6, z: 0.6 },
    fov: 30,
  },
  garden: {
    position: { x: -12.5, y: 1.1, z: 0.0 },
    shift: { x: 0, y: 3.0, z: 0 },
    fov: 20,
  },
};

// Stage Lighting
const STAGE_SPOTLIGHT_PARAMS: LightParams = {
  shift: { x: -8, y: 11, z: 0 },
  targetShift: { x: 1, y: 1, z: 0 },
  color: "#fff6e1",
  intensity: 510,
};
const STAGE_AREALIGHT_PARAMS: LightParams = {
  shift: { x: -3, y: 0, z: 0 },
  targetShift: { x: 0, y: 0, z: 0 },
  color: "#7593de",
  intensity: 2.6,
};
const AREALIGHT_DIMENSION = {
  width: 6.0,
  height: 1.5,
};

// Environment
const DAY_BG = new THREE.Color("#e5dcd5");
const DAY_BG_DIM = new THREE.Color("#7c7a71");
const NIGHT_BG = new THREE.Color("#101927");
const DAY_SUN_COLOR = new THREE.Color("#fff5e0");
const DUSK_SUN_COLOR = new THREE.Color("#ff6a00");
const NIGHT_SUN_COLOR = new THREE.Color("#1a1a4a");
const ENV_INTENSITIES = [0.05, 0.8];
const DIM_FACTOR = 0.4;

export {
  ANIMATION_TIMESCALE,
  AREALIGHT_DIMENSION,
  DAY_BG,
  DAY_BG_DIM,
  DAY_LENGTH,
  DAY_SUN_COLOR,
  DEFAULT_FOV,
  DUSK_SUN_COLOR,
  DIM_FACTOR,
  ENV_INTENSITIES,
  NIGHT_BG,
  NIGHT_SUN_COLOR,
  PRESET_CAMERA_PARAMS,
  SPEED_FACTOR,
  STAGE_SPOTLIGHT_PARAMS,
  STAGE_AREALIGHT_PARAMS,
};
