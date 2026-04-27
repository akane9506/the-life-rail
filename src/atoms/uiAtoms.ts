import { CHAPTERS } from "@/consts/chapters";
import { atom } from "jotai";
import { trainFocusAtom } from "./trainAtoms";

const chapterAtom = atom(0);

const setChapterAtom = atom(null, (_, set, chapter: number) => {
  const chapterLength = CHAPTERS.length;
  const nextChapter = Math.min(Math.max(chapter, 0), chapterLength - 1);
  set(chapterAtom, nextChapter);
  set(trainFocusAtom, CHAPTERS[nextChapter].cargo);
});

export { chapterAtom, setChapterAtom };
