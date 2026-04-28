import { atom } from "jotai";

const debuggingModeAtom = atom(false);
const orbitControlAtom = atom(false);
const envBgAtom = atom<"light" | "dark">("dark");

export { debuggingModeAtom, orbitControlAtom, envBgAtom };
