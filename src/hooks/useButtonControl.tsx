import { button, useControls } from "leva";

type ButtonControl = {
  name: string;
  fn: () => void;
};

type ButtonControls = ButtonControl[];

const useButtonControl = (name: string, controls: ButtonControls) => {
  const buttonInputs = controls.reduce(
    (acc, curr) => {
      acc[curr.name] = button(curr.fn);
      return acc;
    },
    {} as Record<string, ReturnType<typeof button>>,
  );
  return useControls(name, buttonInputs);
};

export { useButtonControl };
