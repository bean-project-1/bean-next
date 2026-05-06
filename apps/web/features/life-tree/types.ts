export type LeafType = 'phase' | 'task' | 'habit' | 'milestone';

export type Leaf = {
  id: string;
  name: string; // matches GoalAction.title
  type: LeafType;
  completed: boolean;
  parentId?: string;
  
  // habits
  frequency?: any;
  streak?: number;
  consistency?: number;

  targetDate?: string;
  dimensions?: string[];
  attributes?: string[];
  description?: string;
  tasks?: any[]; // sub-tasks (Task model)
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
