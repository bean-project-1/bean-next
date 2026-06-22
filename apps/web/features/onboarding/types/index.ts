export type Method = 'llm' | 'cv' | 'quiz' | 'coach';
export type Phase = 'method' | 'quiz' | 'llm' | 'cv' | 'coach' | 'review' | 'ideas' | 'routine' | 'generating';

export interface FormData {
  name: string;
  email: string;
  // ── Identidad ──────────────────────────────────────
  values: string[];          // core values tags
  personality: string;       // explorer | analyst | empathic | pragmatic
  interests: string[];       // passion tags
  purpose: string;           // choice
  motivations: string;       // achievement | recognition | connection | autonomy
  // ── Capital ────────────────────────────────────────
  knowledge: string;         // choice
  skills: string[];          // skill tags
  profession: string;        // career text input
  income: string;            // income level id
  socialCapital: string;     // choice
  exerciseFrequency: string; // physical health choice
  resilience: string;        // choice
  // ── Experiencia ────────────────────────────────────
  workSatisfaction: string;  // choice
  relationships: string;     // choice
  lifeSatisfaction: string;  // choice
  freeTime: string;          // free time id
  personalGrowth: string;    // choice
  impact: string;            // choice
  financialSecurity: string; // choice
  // ── Rutina Base ────────────────────────────────────
  sleepHours: number;
  workSchedule: string;
  // ── Ideas / Semillero ──────────────────────────────
  ideas: { title: string }[];
  // ── Metadatos de Extracción ────────────────────────
  extractedAttributes?: any[];
  extractedInputs?: any[];
  resumeText?: string;
  details: Record<string, string>;
}

export interface DimExtra {
  key: string;
  label: string;
  score: number;
}
