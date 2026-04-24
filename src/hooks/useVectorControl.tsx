import { useControls } from "leva";

type VectorControlOptions = {
  x?: number;
  y?: number;
  z?: number;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
};

type Vector3Params = {
  x: number;
  y: number;
  z: number;
  value: number;
  min: number;
  max: number;
  step: number;
};

const DEFAULT_OPTIONS: VectorControlOptions = {
  value: 0.0,
  min: -100.0,
  max: 100.0,
  step: 0.01,
};

const useVector3Control = (name: string, options?: VectorControlOptions) => {
  const params = (
    options ? { ...DEFAULT_OPTIONS, ...options } : { ...DEFAULT_OPTIONS }
  ) as Vector3Params;
  const { x, y, z, value, min, max, step } = params;
  const vector3Controls = useControls(name, {
    x: {
      value: x ?? value,
      min,
      max,
      step,
    },
    y: {
      value: y ?? value,
      min,
      max,
      step,
    },
    z: {
      value: z ?? value,
      min,
      max,
      step,
    },
  });
  return vector3Controls;
};

export { useVector3Control };
