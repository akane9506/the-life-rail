import { atom } from "jotai";

type TrainParts = "head" | "horti";

const trainFocusAtom = atom<TrainParts>("head");

export { trainFocusAtom };
export type { TrainParts };
