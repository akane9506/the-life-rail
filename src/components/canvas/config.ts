const SPEED_FACTOR = 5;
const ANIMATION_TIMESCALE = 2.0;
const DEFAULT_FOV = 50;
const CAMERA_Y_SHIFT = 3.0;

type CameraParams = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  fov: number;
};

const PRESET_CAMERA_PARAMS: Record<string, CameraParams> = {
  head: {
    position: { x: 15.1, y: 12.6, z: 12.7 },
    fov: 45,
  },
  horti: {
    position: { x: -12.5, y: 0.5, z: 0.0 },
    fov: 20,
  },
};

export {
  SPEED_FACTOR,
  DEFAULT_FOV,
  ANIMATION_TIMESCALE,
  PRESET_CAMERA_PARAMS,
  CAMERA_Y_SHIFT,
};
