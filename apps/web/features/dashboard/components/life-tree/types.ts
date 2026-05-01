export type Leaf = {
  id: string;
  name: string;
  completed: boolean;
  targetDate?: string;
  dimensions?: string[];
  attributes?: string[];
  description?: string;
  tasks?: any[];
};

export type Branch = {
  id: string;
  goal: string;
  description?: string;
  progress: number;
  leaves: Leaf[];
};

export type TreeData = {
  growthScore: number;
  branches: Branch[];
};
