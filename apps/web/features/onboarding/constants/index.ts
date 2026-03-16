// =======================================================
// BEAN — Onboarding Constants & Static Data
// apps/web/app/onboarding/_constants.ts
// =======================================================
import type { Method } from '../types';

export const EXERCISE_OPTIONS = ['Rarely', '1–2x/week', '3–4x/week', '5+x/week', 'Daily'];

export const SKILL_SUGGESTIONS = [
  'JavaScript', 'Python', 'Design', 'Sales', 'Writing', 'Leadership',
  'Marketing', 'Data Analysis',
];

export const INTEREST_SUGGESTIONS = [
  'Technology', 'Travel', 'Music', 'Reading', 'Fitness', 'Cooking',
  'Photography', 'Entrepreneurship',
];

export const PROFESSION_SUGGESTIONS = [
  'Software Engineer', 'Product Manager', 'Designer', 'Data Scientist',
  'Entrepreneur', 'Marketing Manager',
];

export const COACH_QUESTIONS = [
  { id: 'goals',     q: '¿Qué estás tratando de lograr en los próximos 12 meses?',   placeholder: 'Cuéntame sobre tus metas…' },
  { id: 'strengths', q: '¿Qué parte de tu vida sientes que está funcionando mejor?',  placeholder: 'Puede ser trabajo, salud, relaciones…' },
  { id: 'improve',   q: '¿Qué dimensión de tu vida quisieras mejorar primero?',       placeholder: 'Salud, carrera, relaciones, finanzas…' },
  { id: 'blockers',  q: '¿Qué te ha impedido llegar al nivel que deseas?',            placeholder: 'Sé honesto, este espacio es tuyo…' },
];

export const METHODS: { id: Method; emoji: string; title: string; subtitle: string; tag: string }[] = [
  { id: 'llm',   emoji: '🤖', title: 'Trae tu perfil de IA',  subtitle: 'Pega el resumen de ChatGPT, Claude o Gemini',     tag: 'Más rápido'  },
  { id: 'cv',    emoji: '📄', title: 'Importa tu CV',          subtitle: 'Sube tu currículum en PDF o Word',                 tag: 'Profesional' },
  { id: 'quiz',  emoji: '🎮', title: 'Quiz interactivo',       subtitle: 'Responde preguntas cortas para armar tu perfil',   tag: 'Recomendado' },
  { id: 'coach', emoji: '🎙️', title: 'Entrevista con BEAN',    subtitle: 'Nuestro coach te hace preguntas abiertas',         tag: 'Más profundo'},
];

export const ALL_DIMENSIONS = [
  // Identity
  { key: 'values',               label: 'Core Values',           cat: 'identity',    emoji: '⭐' },
  { key: 'personality',          label: 'Personality',           cat: 'identity',    emoji: '🌀' },
  { key: 'interests',            label: 'Interests',             cat: 'identity',    emoji: '❤️' },
  { key: 'purpose',              label: 'Purpose',               cat: 'identity',    emoji: '🧭' },
  { key: 'motivations',          label: 'Motivations',           cat: 'identity',    emoji: '🔥' },
  // Capital
  { key: 'knowledge',            label: 'Knowledge',             cat: 'capital',     emoji: '📚' },
  { key: 'skills',               label: 'Skills',                cat: 'capital',     emoji: '🧠' },
  { key: 'career',               label: 'Career',                cat: 'capital',     emoji: '💼' },
  { key: 'income',               label: 'Income',                cat: 'capital',     emoji: '💰' },
  { key: 'social_capital',       label: 'Social Capital',        cat: 'capital',     emoji: '🤝' },
  { key: 'physical_health',      label: 'Physical Health',       cat: 'capital',     emoji: '🏃' },
  { key: 'emotional_resilience', label: 'Emotional Resilience',  cat: 'capital',     emoji: '🛡️' },
  // Experience
  { key: 'job_satisfaction',     label: 'Job Satisfaction',      cat: 'experience',  emoji: '😊' },
  { key: 'relationships',        label: 'Relationships',         cat: 'experience',  emoji: '💞' },
  { key: 'mental_wellbeing',     label: 'Mental Wellbeing',      cat: 'experience',  emoji: '🧘' },
  { key: 'free_time',            label: 'Free Time',             cat: 'experience',  emoji: '🕐' },
  { key: 'personal_growth',      label: 'Personal Growth',       cat: 'experience',  emoji: '🌱' },
  { key: 'social_impact',        label: 'Social Impact',         cat: 'experience',  emoji: '🌍' },
  { key: 'financial_stability',  label: 'Financial Stability',   cat: 'experience',  emoji: '🏦' },
] as const;

export type DimKey = typeof ALL_DIMENSIONS[number]['key'];

export const CAT_COLORS = {
  identity:   { bg: 'bg-violet-500',  text: 'text-violet-400',  border: 'border-violet-500/50',  glow: '#8b5cf6' },
  capital:    { bg: 'bg-blue-500',    text: 'text-blue-400',    border: 'border-blue-500/50',    glow: '#3b82f6' },
  experience: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/50', glow: '#10b981' },
} as const;

export type Category = keyof typeof CAT_COLORS;
