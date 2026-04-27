import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
// import { useSetAtom } from "jotai";
// import { trainFocusAtom } from "@/atoms/trainAtoms";
const CHAPTERS = [
  { title: "0 - Intro", cargo: "head" },
  { title: "1 - Garden", cargo: "garden" },
];
export default function Header() {
  const reversedChapters = useMemo(() => [...CHAPTERS].reverse(), []);
  const [currChapter, setCurrChapter] = useState<number>(0);
  // const currentFocus = useSetAtom(trainFocusAtom);

  const nextChapter = () => {
    setCurrChapter((prev) => Math.min(prev + 1, reversedChapters.length - 1));
  };
  const prevChapter = () => {
    setCurrChapter((prev) => Math.max(0, prev - 1));
  };

  const currFocus = reversedChapters.length - currChapter - 1;

  return (
    <div className="w-full flex justify-center items-center h-15 py-2 mt-1 pointer-events-auto">
      <div className="w-full max-w-100 bg-white/60 rounded-full h-full shadow flex justify-between items-center px-3">
        <Button
          onClick={nextChapter}
          disabled={currChapter === reversedChapters.length - 1}
        >
          <ChevronLeft className="stroke-primary" size={24} />
        </Button>

        <div className="flex-1 overflow-hidden mx-2">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currFocus * 100}%)` }}
          >
            {reversedChapters.map((chapter) => (
              <div key={chapter.cargo} className="min-w-full text-center">
                {chapter.title}
              </div>
            ))}
          </div>
        </div>

        <Button onClick={prevChapter} disabled={currChapter === 0}>
          <ChevronRight className="stroke-primary" size={24} />
        </Button>
      </div>
    </div>
  );
}
