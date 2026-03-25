export type Leaf = {
  id: string;
  name: string;
  completed: boolean;
};

export type Branch = {
  id: string;
  goal: string;
  progress: number;
  leaves: Leaf[];
};

export type TreeData = {
  growthScore: number;
  branches: Branch[];
};
