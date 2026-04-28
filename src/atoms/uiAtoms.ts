import { CHAPTERS } from "@/consts/chapters";
import { atom } from "jotai";
import { trainFocusAtom } from "./trainAtoms";
import { type Language } from "@/consts/app-config";
import i18n from "@/i18n/config";

const chapterAtom = atom(0);
const languageAtom = atom<Language>("en");

const setChapterAtom = atom(null, (_, set, chapter: number) => {
  const chapterLength = CHAPTERS.length;
  const nextChapter = Math.min(Math.max(chapter, 0), chapterLength - 1);
  set(chapterAtom, nextChapter);
  set(trainFocusAtom, CHAPTERS[nextChapter].cargo);
});

const setLanguageAtom = atom(null, async (_, set, language: Language) => {
  await i18n.changeLanguage(language);
  document.title = i18n.t("loading.title");
  document.documentElement.lang = language;
  set(languageAtom, language);
});

export { chapterAtom, languageAtom, setChapterAtom, setLanguageAtom };
