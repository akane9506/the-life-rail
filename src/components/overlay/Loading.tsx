import { useProgress } from "@react-three/drei";
import Button from "../ui/Button";

type LoadingProps = {
  onEnter: () => void;
};

export default function Loading({ onEnter }: LoadingProps) {
  const { progress, errors } = useProgress();
  if (errors.length !== 0) {
    console.error(errors);
  }
  const loadComplete = progress === 100;
  return (
    <div className="absolute z-10 top-0 left-0 w-full h-full bg-white/90 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl tracking-wide">The Life Rail</h1>
      {/* Progress bar */}
      <div className="h-6">
        {!loadComplete && (
          <div className="relative w-60 h-full rounded-full shadow bg-primary/30 overflow-hidden">
            <div
              className="absolute h-full top-0 left-0 rounded-full bg-primary/80"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute flex items-center justify-center left-0 top-0 w-full h-full text-sm text-center text-white">
              <p>{progress.toFixed(0)}%</p>
            </div>
          </div>
        )}
        {loadComplete && (
          <Button
            className="bg-primary/80 not-disabled:hover:bg-primary text-white font-normal px-2 w-40"
            onClick={onEnter}
          >
            Enter
          </Button>
        )}
      </div>
    </div>
  );
}
