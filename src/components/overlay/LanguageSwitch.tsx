import cn from "@/lib/cn";
import { LANGUAGE_LIST, type Language } from "@/consts/app-config";
import { useAtomValue, useSetAtom } from "jotai";
import { languageAtom, setLanguageAtom } from "@/atoms/uiAtoms";

export default function LanguageSwitch() {
  // const [active, setActive] = useState<number>(0);
  const currLanguage = useAtomValue(languageAtom);
  const setLanguage = useSetAtom(setLanguageAtom);
  const activeIndex = LANGUAGE_LIST.findIndex((lan) => lan.value === currLanguage);
  return (
    <div className="relative flex items-center px-1 h-8 bg-white/50 rounded-full shadow">
      {LANGUAGE_LIST.map((lan, index) => (
        <div
          onClick={() => setLanguage(lan.value as Language)}
          className={cn(
            "z-10 w-20 h-6 text-center leading-6  hover:cursor-pointer",
            index === activeIndex ? "text-white" : "text-primary/80",
          )}
          key={lan.value}
        >
          {lan.label}
        </div>
      ))}
      <div
        className="absolute top-1 w-20 h-6 rounded-full bg-primary/80 transition-normal duration-100"
        style={{ left: `${5 * activeIndex + 0.25}rem` }}
      ></div>
    </div>
  );
}
