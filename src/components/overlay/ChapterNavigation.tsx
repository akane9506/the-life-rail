import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CHAPTERS } from "@/consts/chapters";
import { chapterAtom, setChapterAtom } from "@/atoms/uiAtoms";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

export default function ChapterNavigation() {
  const { t } = useTranslation();
  const reversedChapters = useMemo(() => [...CHAPTERS].reverse(), []);
  const currChapter = useAtomValue(chapterAtom);
  const setCurrChapter = useSetAtom(setChapterAtom);

  const nextChapter = () => {
    setCurrChapter(currChapter + 1);
  };
  const prevChapter = () => {
    setCurrChapter(currChapter - 1);
  };

  const currFocus = reversedChapters.length - currChapter - 1;
  return (
    <div className="w-full max-w-80 bg-white/60 rounded-full h-full shadow flex justify-between items-center px-3">
      <Button
        onClick={nextChapter}
        disabled={currChapter === reversedChapters.length - 1}
      >
        <ChevronLeft className="stroke-primary" size={24} />
      </Button>
      {/* Chapter carousel */}
      <div className="flex-1 overflow-hidden mx-2">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currFocus * 100}%)` }}
        >
          {reversedChapters.map((chapter) => (
            <div key={chapter.cargo} className="min-w-full text-center font-medium">
              {t(`nav.${chapter.cargo}`)}
            </div>
          ))}
        </div>
      </div>
      <Button onClick={prevChapter} disabled={currChapter === 0}>
        <ChevronRight className="stroke-primary" size={24} />
      </Button>
    </div>
  );
}
