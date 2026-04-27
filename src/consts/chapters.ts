type TrainParts = "head" | "garden";

type Chapter = {
  title: string;
  cargo: TrainParts;
};

export type { TrainParts, Chapter };
