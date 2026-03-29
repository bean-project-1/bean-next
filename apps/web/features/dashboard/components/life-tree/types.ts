export type Leaf = {
  id: string;
  name: string;
  completed: boolean;
  targetDate?: string;
  dimensions?: string[];
  attributes?: string[];
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
