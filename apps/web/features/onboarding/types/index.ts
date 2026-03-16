export type Method = 'welcome' | 'llm' | 'cv' | 'quiz' | 'coach';
export type Phase = 'welcome' | 'method' | 'quiz' | 'llm' | 'cv' | 'coach' | 'review' | 'generating';

export interface FormData {
  name: string;
  email: string;
  profession: string;
  skills: string[];
  interests: string[];
  exerciseFrequency: string;
  lifeSatisfaction: number;
}

export interface DimExtra {
  key: string;
  label: string;
  score: number;
}
