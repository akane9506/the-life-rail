import { atom } from "jotai";
import type { TrainParts } from "@/consts/chapters";

const trainFocusAtom = atom<TrainParts>("head");

export { trainFocusAtom };
