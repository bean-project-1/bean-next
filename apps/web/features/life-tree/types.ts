export type LeafType = 'phase' | 'task' | 'habit' | 'milestone';

export type Leaf = {
  id: string;
  originalId?: string; // ID of the parent task if this leaf is a subtask
  name: string; // matches GoalAction.title
  type: LeafType;
  completed: boolean;
  parentId?: string;
  
  // habits
  frequency?: any;
  streak?: number;
  consistency?: number;

  targetDate?: string;
  startDate?: string;
  assignee?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  dimensions?: string[];
  attributes?: string[];
  description?: string;
  notes?: string;
  tasks?: any[]; // sub-tasks (Task model)
  subtaskLeaves?: Leaf[];

  // milestone evaluation metadata (from GoalAction.impact)
  impact?: {
    evaluationType?: 'text' | 'image' | 'document' | 'questionnaire' | 'none';
    evaluationInstructions?: string;
  };
};

export type Branch = {
  id: string;
  goal: string;
  description?: string;
  deadline?: string;
  progress: number;
  status?: string;
  resumeDate?: string;
  leaves: Leaf[];
};

export type TreeData = {
  growthScore: number;
  branches: Branch[];
};
