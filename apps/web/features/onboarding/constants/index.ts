// =======================================================
// BEAN — Onboarding Constants & Static Data
// apps/web/app/onboarding/_constants.ts
// =======================================================
import type { Method } from '../types';

export const EXERCISE_OPTIONS = ['Rara vez', '1–2x/semana', '3–4x/semana', '5+x/semana', 'Diario'];

export const VALUES_SUGGESTIONS = [
  'Familia', 'Libertad', 'Impacto', 'Honestidad', 'Creatividad', 'Lealtad',
  'Crecimiento', 'Seguridad', 'Aventura', 'Salud', 'Justicia', 'Comunidad',
];

export const PERSONALITY_OPTIONS = [
  { id: 'explorer',   emoji: '🧭', label: 'Explorador',  desc: 'Me lanzo a lo nuevo con entusiasmo' },
  { id: 'analyst',    emoji: '🔬', label: 'Analítico',   desc: 'Necesito entender antes de actuar' },
  { id: 'empathic',   emoji: '💞', label: 'Empático',    desc: 'Lo que más me importa son las personas' },
  { id: 'pragmatic',  emoji: '⚡', label: 'Pragmático',  desc: 'Me enfoco en resultados concretos' },
];

export const MOTIVATION_OPTIONS = [
  { id: 'achievement',    emoji: '🏆', label: 'Logros',          desc: 'Superar metas y desafíos' },
  { id: 'recognition',    emoji: '👏', label: 'Reconocimiento',  desc: 'Ser valorado por los demás' },
  { id: 'connection',     emoji: '🤝', label: 'Conexión',        desc: 'Construir relaciones profundas' },
  { id: 'autonomy',       emoji: '🕊️', label: 'Autonomía',       desc: 'Tener libertad para decidir' },
];

export const INCOME_OPTIONS = [
  { id: 'none',    label: 'Sin ingresos activos',  score: 1 },
  { id: 'basic',   label: 'Ingresos básicos',       score: 3 },
  { id: 'medium',  label: 'Ingresos medios',        score: 6 },
  { id: 'high',    label: 'Ingresos altos',         score: 8 },
  { id: 'very_high', label: 'Ingresos muy altos',   score: 10 },
];

export const FREE_TIME_OPTIONS = [
  { id: 'none',    label: 'Casi ninguno',     score: 1 },
  { id: 'little',  label: 'Poco (< 3h/sem)',  score: 3 },
  { id: 'some',    label: 'Algo (3–8h/sem)',  score: 6 },
  { id: 'plenty',  label: 'Bastante (> 8h)',  score: 9 },
];

export const PURPOSE_OPTIONS = [
  { id: 'discovering', label: 'Aún descubriéndolo', desc: 'No tengo claro qué quiero hacer' },
  { id: 'some_ideas', label: 'Tengo algunas ideas', desc: 'Sé más o menos lo que me gusta' },
  { id: 'clear', label: 'Claro y definido', desc: 'Tengo un propósito muy claro' },
];

export const KNOWLEDGE_OPTIONS = [
  { id: 'basic', label: 'Aprendiendo lo básico', desc: 'Estoy empezando en mi área' },
  { id: 'experienced', label: 'Tengo experiencia', desc: 'Tengo práctica en mi sector' },
  { id: 'expert', label: 'Nivel experto', desc: 'Soy un referente o especialista' },
];

export const SOCIAL_CAPITAL_OPTIONS = [
  { id: 'small', label: 'Pequeña y cercana', desc: 'Conozco a pocas personas' },
  { id: 'growing', label: 'En crecimiento', desc: 'Estoy expandiendo mis contactos' },
  { id: 'large', label: 'Amplia y sólida', desc: 'Tengo una gran red profesional' },
];

export const RESILIENCE_OPTIONS = [
  { id: 'hard', label: 'Me cuesta adaptarme', desc: 'Los cambios me afectan mucho' },
  { id: 'normal', label: 'Me recupero a mi ritmo', desc: 'Tomo mi tiempo pero avanzo' },
  { id: 'fast', label: 'Me adapto rápido', desc: 'Los retos me hacen más fuerte' },
];

export const WORK_SATISFACTION_OPTIONS = [
  { id: 'change', label: 'Buscando un cambio', desc: 'No estoy feliz actualmente' },
  { id: 'ok', label: 'Satisfecho pero mejorable', desc: 'Me gusta pero quiero más' },
  { id: 'happy', label: 'Muy feliz y pleno', desc: 'Me encanta lo que hago' },
];

export const RELATIONSHIPS_OPTIONS = [
  { id: 'distant', label: 'Distantes o pocas', desc: 'Pocas relaciones profundas' },
  { id: 'good', label: 'Buenas', desc: 'Tengo buenas relaciones' },
  { id: 'deep', label: 'Profundas y ricas', desc: 'Tengo conexiones muy fuertes' },
];

export const MENTAL_WELLBEING_OPTIONS = [
  { id: 'stressed', label: 'Estresado o abrumado', desc: 'Me siento ansioso a menudo' },
  { id: 'balanced', label: 'En equilibrio intermitente', desc: 'Tengo días buenos y malos' },
  { id: 'calm', label: 'En calma y balance', desc: 'Me siento en paz siempre' },
];

export const PERSONAL_GROWTH_OPTIONS = [
  { id: 'stuck', label: 'Me siento estancado', desc: 'No he avanzado mucho últimamente' },
  { id: 'slow', label: 'Avanzo poco a poco', desc: 'Estoy aprendiendo a mi ritmo' },
  { id: 'fast', label: 'En pleno crecimiento', desc: 'Estoy evolucionando rápidamente' },
];

export const IMPACT_OPTIONS = [
  { id: 'none', label: 'No impacto a otros aún', desc: 'Mi trabajo es individual' },
  { id: 'local', label: 'Impacto a mi círculo', desc: 'Ayudo a mi comunidad cercana' },
  { id: 'global', label: 'Impacto a gran escala', desc: 'Cambio muchas vidas' },
];

export const FINANCIAL_SECURITY_OPTIONS = [
  { id: 'surviving', label: 'Sobreviviendo al mes', desc: 'Llego justo a fin de mes' },
  { id: 'stable', label: 'Estable pero sin ahorros', desc: 'Me mantengo pero no ahorro' },
  { id: 'secure', label: 'Tranquilo y asegurado', desc: 'Tengo ahorros y estabilidad' },
];

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
  { key: 'physical_health',      label: 'Physical Health',       cat: 'capital',     emoji: '跑' },
  { key: 'resilience',           label: 'Resilience',            cat: 'capital',     emoji: '🛡️' },
  // Experience
  { key: 'work_satisfaction',    label: 'Work Satisfaction',     cat: 'experience',  emoji: '😊' },
  { key: 'relationships',        label: 'Relationships',         cat: 'experience',  emoji: '💞' },
  { key: 'mental_wellbeing',     label: 'Mental Wellbeing',      cat: 'experience',  emoji: '🧘' },
  { key: 'free_time',            label: 'Free Time',             cat: 'experience',  emoji: '🕐' },
  { key: 'personal_growth',      label: 'Personal Growth',       cat: 'experience',  emoji: '🌱' },
  { key: 'impact',               label: 'Impact',                cat: 'experience',  emoji: '🌍' },
  { key: 'financial_security',   label: 'Financial Security',    cat: 'experience',  emoji: '🏦' },
] as const;

export type DimKey = typeof ALL_DIMENSIONS[number]['key'];

export const CAT_COLORS = {
  identity:   { bg: 'bg-violet-500',  text: 'text-violet-400',  border: 'border-violet-500/50',  glow: '#8b5cf6' },
  capital:    { bg: 'bg-blue-500',    text: 'text-blue-400',    border: 'border-blue-500/50',    glow: '#3b82f6' },
  experience: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/50', glow: '#10b981' },
} as const;

export type Category = keyof typeof CAT_COLORS;
