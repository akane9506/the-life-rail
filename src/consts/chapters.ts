type TrainParts = "head" | "garden";

type Chapter = {
  title: string;
  cargo: TrainParts;
};

const CHAPTERS: Chapter[] = [
  { title: "0 - Intro", cargo: "head" },
  { title: "1 - Garden", cargo: "garden" },
];

export { CHAPTERS };
export type { TrainParts, Chapter };
