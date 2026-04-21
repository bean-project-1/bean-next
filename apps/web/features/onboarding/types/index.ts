export type Method = 'welcome' | 'llm' | 'cv' | 'quiz' | 'coach';
export type Phase = 'welcome' | 'method' | 'quiz' | 'llm' | 'cv' | 'coach' | 'review' | 'goals' | 'generating';

export interface FormData {
  name: string;
  email: string;
  // ── Identidad ──────────────────────────────────────
  values: string[];          // core values tags
  personality: string;       // explorer | analyst | empathic | pragmatic
  interests: string[];       // passion tags
  purpose: number;           // 0-10 slider
  motivations: string;       // achievement | recognition | connection | autonomy
  // ── Capital ────────────────────────────────────────
  knowledge: number;         // 0-10 slider
  skills: string[];          // skill tags
  profession: string;        // career text input
  income: string;            // income level id
  socialCapital: number;     // 0-10 slider
  exerciseFrequency: string; // physical health choice
  resilience: number;        // 0-10 slider
  // ── Experiencia ────────────────────────────────────
  workSatisfaction: number;  // 0-10 slider
  relationships: number;     // 0-10 slider
  lifeSatisfaction: number;  // mental_wellbeing 0-10
  freeTime: string;          // free time id
  personalGrowth: number;    // 0-10 slider
  impact: number;            // 0-10 slider
  financialSecurity: number; // 0-10 slider
  // ── Metas ──────────────────────────────────────────
  goals: { title: string }[];
  extractedAttributes?: any[];
  extractedInputs?: any[];
}

export interface DimExtra {
  key: string;
  label: string;
  score: number;
}
