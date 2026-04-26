import { useControls } from "leva";

type ScalarControlOptions = {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
};

type ScalarParams = {
  value: number;
  min: number;
  max: number;
  step: number;
};

const DEFAULT_OPTIONS: ScalarControlOptions = {
  value: 0,
  min: 0.0,
  max: 1.0,
  step: 0.01,
};

const useScalarControl = (
  name: string,
  field: string,
  options?: ScalarControlOptions,
) => {
  const params = (
    options ? { ...DEFAULT_OPTIONS, ...options } : { ...DEFAULT_OPTIONS }
  ) as ScalarParams;

  const value = useControls(name, { [field]: params });
  return value[field];
};

export { useScalarControl };
