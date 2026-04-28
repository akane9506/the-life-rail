import { envBgAtom } from "@/atoms/canvasAtoms";
import { trainFocusAtom } from "@/atoms/trainAtoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";

const innerHeightToSize = (innerHeight: number): "small" | "base" => {
  if (innerHeight < 1200) return "small";
  return "base";
};

export default function Content() {
  const currentFocus = useAtomValue(trainFocusAtom);
  const [innerSize, setInnerSize] = useState<"small" | "base">(
    innerHeightToSize(window.innerHeight),
  );
  const envBg = useAtomValue(envBgAtom);

  useEffect(() => {
    const updateWindowInnerSize = () => {
      const newHeight = window.innerHeight;
      const newSize = innerHeightToSize(newHeight);
      setInnerSize(newSize);
    };
    window.addEventListener("resize", () => {
      updateWindowInnerSize();
    });
    return window.removeEventListener("resize", () => {
      updateWindowInnerSize();
    });
  }, []);

  return (
    <div className="max-w-240 mx-auto flex justify-center px-3">
      <div
        className="mt-3 text-[15px] shadow-inner max-w-200 rounded-2xl text-left p-4 border border-dashed border-primary/30 transition-all duration-800"
        style={{
          fontSize: innerSize === "small" ? "13px" : "16px",
          color: envBg === "light" ? "var(--color-primary)" : "white",
          opacity: envBg === "light" ? 1.0 : 0.7,
          background:
            envBg === "light" ? "rgba(255 255 255 / 0.4)" : "rgba(1 1 22 / 0.4)",
        }}
      >
        <Trans
          i18nKey={`chapters.${currentFocus}`}
          components={{ subtitle: <p className="font-bold mb-2" /> }}
        />
      </div>
    </div>
  );
}
