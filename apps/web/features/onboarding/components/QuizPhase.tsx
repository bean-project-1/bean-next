// =======================================================
// BEAN — QuizPhase: DNA-Mapped Questionnaire (19 preguntas)
// apps/web/features/onboarding/components/QuizPhase.tsx
// =======================================================
'use client';

import { useState } from 'react';
import {
  BeanLogo, TagInput, StepDots, OnboardingCard, BackButton, InputField,
} from './shared';
import {
  VALUES_SUGGESTIONS, PERSONALITY_OPTIONS, INTEREST_SUGGESTIONS,
  MOTIVATION_OPTIONS, SKILL_SUGGESTIONS, PROFESSION_SUGGESTIONS,
  INCOME_OPTIONS, EXERCISE_OPTIONS, FREE_TIME_OPTIONS,
} from '../constants';
import type { FormData } from '../types';

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onDone: () => void;
  onBack: () => void;
}

// ── Reusable Slider ───────────────────────────────────────
function ScoreSlider({
  value, onChange, lo = 'Bajo', hi = 'Alto',
}: { value: number; onChange: (v: number) => void; lo?: string; hi?: string }) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <span className="text-xs font-medium text-slate-400">{lo}</span>
        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-400">{hi}</span>
      </div>
      <input
        type="range" min={0} max={10} step={1} value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-violet-600 cursor-pointer"
      />
      <div className="mt-2 flex justify-between text-[10px] text-slate-300 select-none font-bold">
        {Array.from({ length: 11 }, (_, i) => <span key={i}>{i}</span>)}
      </div>
    </div>
  );
}

// ── Choice Grid ───────────────────────────────────────────
type Option = { id: string; emoji?: string; label: string; desc?: string };
function ChoiceGrid({
  options, selected, onSelect, cols = 2,
}: { options: Option[]; selected: string; onSelect: (id: string) => void; cols?: number }) {
  return (
    <div className={`grid gap-3 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            selected === opt.id
              ? 'border-violet-500 bg-violet-50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40'
          }`}
        >
          {opt.emoji && <span className="mb-1 block text-2xl">{opt.emoji}</span>}
          <p className="font-bold text-slate-800 text-sm">{opt.label}</p>
          {opt.desc && <p className="mt-0.5 text-xs text-slate-400">{opt.desc}</p>}
        </button>
      ))}
    </div>
  );
}

const CATEGORY_HEADERS = {
  identity: { label: '🌟 Identidad', color: 'text-violet-600', bg: 'bg-violet-50' },
  capital:  { label: '💼 Capital',   color: 'text-blue-600',   bg: 'bg-blue-50'   },
  experience:{ label: '🌍 Experiencia', color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

export function QuizPhase({ form, setForm, onDone, onBack }: Props) {
  const [step, setStep] = useState(0);

  type Cat = 'identity' | 'capital' | 'experience';
  type Step = {
    cat: Cat;
    dimKey: string;
    emoji: string;
    title: string;
    subtitle: string;
    isValid: () => boolean;
    content: React.ReactNode;
  };

  const STEPS: Step[] = [
    // ── IDENTIDAD ────────────────────────────────────────────
    {
      cat: 'identity', dimKey: 'values', emoji: '⭐', title: 'Tus valores',
      subtitle: 'Elige 3 valores que definen cómo vives y decides.',
      isValid: () => form.values.length >= 1,
      content: (
        <TagInput
          tags={form.values} suggestions={VALUES_SUGGESTIONS}
          onAdd={s => setForm(f => ({ ...f, values: [...f.values, s] }))}
          onRemove={s => setForm(f => ({ ...f, values: f.values.filter(x => x !== s) }))}
          placeholder="Escribe un valor y pulsa Enter…"
        />
      ),
    },
    {
      cat: 'identity', dimKey: 'personality', emoji: '🌀', title: 'Tu personalidad',
      subtitle: '¿Cómo te describes mejor al enfrentate a algo nuevo?',
      isValid: () => form.personality.length > 0,
      content: (
        <ChoiceGrid
          options={PERSONALITY_OPTIONS}
          selected={form.personality}
          onSelect={id => setForm(f => ({ ...f, personality: id }))}
        />
      ),
    },
    {
      cat: 'identity', dimKey: 'interests', emoji: '❤️', title: 'Tus intereses',
      subtitle: '¿Qué te apasiona explorar fuera del trabajo?',
      isValid: () => form.interests.length >= 1,
      content: (
        <TagInput
          tags={form.interests} suggestions={INTEREST_SUGGESTIONS}
          onAdd={s => setForm(f => ({ ...f, interests: [...f.interests, s] }))}
          onRemove={s => setForm(f => ({ ...f, interests: f.interests.filter(x => x !== s) }))}
          placeholder="Escribe un interés y pulsa Enter…"
        />
      ),
    },
    {
      cat: 'identity', dimKey: 'purpose', emoji: '🧭', title: 'Tu propósito',
      subtitle: '¿Qué tan claro tienes tu propósito de vida hoy?',
      isValid: () => true,
      content: <ScoreSlider value={form.purpose} onChange={v => setForm(f => ({ ...f, purpose: v }))} lo="Nada claro" hi="Muy claro" />,
    },
    {
      cat: 'identity', dimKey: 'motivations', emoji: '🔥', title: 'Tu motivación',
      subtitle: '¿Qué te impulsa más en el día a día?',
      isValid: () => form.motivations.length > 0,
      content: (
        <ChoiceGrid
          options={MOTIVATION_OPTIONS}
          selected={form.motivations}
          onSelect={id => setForm(f => ({ ...f, motivations: id }))}
        />
      ),
    },
    // ── CAPITAL ──────────────────────────────────────────────
    {
      cat: 'capital', dimKey: 'knowledge', emoji: '📚', title: 'Tu conocimiento',
      subtitle: '¿Cómo valoras tu nivel de formación en tu área?',
      isValid: () => true,
      content: <ScoreSlider value={form.knowledge} onChange={v => setForm(f => ({ ...f, knowledge: v }))} lo="Básico" hi="Experto" />,
    },
    {
      cat: 'capital', dimKey: 'skills', emoji: '🧠', title: 'Tus habilidades',
      subtitle: 'Agrega tus skills más importantes (técnicos o blandos).',
      isValid: () => form.skills.length >= 1,
      content: (
        <TagInput
          tags={form.skills} suggestions={SKILL_SUGGESTIONS}
          onAdd={s => setForm(f => ({ ...f, skills: [...f.skills, s] }))}
          onRemove={s => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))}
          placeholder="Escribe un skill y pulsa Enter…"
        />
      ),
    },
    {
      cat: 'capital', dimKey: 'career', emoji: '💼', title: 'Tu carrera',
      subtitle: '¿Cuál es tu rol o profesión actual?',
      isValid: () => form.profession.trim().length > 0,
      content: (
        <div>
          <InputField label="Rol / Profesión" value={form.profession}
            onChange={v => setForm(f => ({ ...f, profession: v }))}
            placeholder="Ej. Software Engineer, Diseñador, Emprendedor…"
            autoFocus
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PROFESSION_SUGGESTIONS.slice(0, 6).map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, profession: s }))}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      cat: 'capital', dimKey: 'income', emoji: '💰', title: 'Tus ingresos',
      subtitle: '¿Cómo describirías tu nivel de ingresos actual?',
      isValid: () => form.income.length > 0,
      content: (
        <ChoiceGrid
          options={INCOME_OPTIONS}
          selected={form.income}
          onSelect={id => setForm(f => ({ ...f, income: id }))}
          cols={1}
        />
      ),
    },
    {
      cat: 'capital', dimKey: 'social_capital', emoji: '🤝', title: 'Tu red de contactos',
      subtitle: '¿Qué tan amplia y sólida es tu red profesional?',
      isValid: () => true,
      content: <ScoreSlider value={form.socialCapital} onChange={v => setForm(f => ({ ...f, socialCapital: v }))} lo="Pequeña" hi="Muy amplia" />,
    },
    {
      cat: 'capital', dimKey: 'physical_health', emoji: '🏃', title: 'Salud física',
      subtitle: '¿Con qué frecuencia haces ejercicio o actividad física?',
      isValid: () => form.exerciseFrequency.length > 0,
      content: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EXERCISE_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setForm(f => ({ ...f, exerciseFrequency: opt }))}
              className={`rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
                form.exerciseFrequency === opt
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600'
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      cat: 'capital', dimKey: 'resilience', emoji: '🛡️', title: 'Tu resiliencia',
      subtitle: '¿Cómo te recuperas después de un momento difícil?',
      isValid: () => true,
      content: <ScoreSlider value={form.resilience} onChange={v => setForm(f => ({ ...f, resilience: v }))} lo="Me cuesta mucho" hi="Me recupero rápido" />,
    },
    // ── EXPERIENCIA ───────────────────────────────────────────
    {
      cat: 'experience', dimKey: 'work_satisfaction', emoji: '😊', title: 'Satisfacción laboral',
      subtitle: '¿Qué tan satisfecho/a estás con tu trabajo o actividad principal?',
      isValid: () => true,
      content: <ScoreSlider value={form.workSatisfaction} onChange={v => setForm(f => ({ ...f, workSatisfaction: v }))} lo="Nada" hi="Muy satisfecho" />,
    },
    {
      cat: 'experience', dimKey: 'relationships', emoji: '💞', title: 'Tus relaciones',
      subtitle: '¿Cómo calificarías la calidad de tus relaciones personales?',
      isValid: () => true,
      content: <ScoreSlider value={form.relationships} onChange={v => setForm(f => ({ ...f, relationships: v }))} lo="Distantes" hi="Profundas y ricas" />,
    },
    {
      cat: 'experience', dimKey: 'mental_wellbeing', emoji: '🧘', title: 'Bienestar mental',
      subtitle: '¿Cómo está tu paz mental y estado emocional hoy?',
      isValid: () => true,
      content: <ScoreSlider value={form.lifeSatisfaction} onChange={v => setForm(f => ({ ...f, lifeSatisfaction: v }))} lo="Estresado" hi="En calma" />,
    },
    {
      cat: 'experience', dimKey: 'free_time', emoji: '🕐', title: 'Tiempo libre',
      subtitle: '¿Cuánto tiempo libre de calidad tienes a la semana?',
      isValid: () => form.freeTime.length > 0,
      content: (
        <ChoiceGrid
          options={FREE_TIME_OPTIONS}
          selected={form.freeTime}
          onSelect={id => setForm(f => ({ ...f, freeTime: id }))}
          cols={1}
        />
      ),
    },
    {
      cat: 'experience', dimKey: 'personal_growth', emoji: '🌱', title: 'Crecimiento personal',
      subtitle: '¿Sientes que estás creciendo y avanzando como persona este año?',
      isValid: () => true,
      content: <ScoreSlider value={form.personalGrowth} onChange={v => setForm(f => ({ ...f, personalGrowth: v }))} lo="Estancado" hi="Creciendo mucho" />,
    },
    {
      cat: 'experience', dimKey: 'impact', emoji: '🌍', title: 'Tu impacto',
      subtitle: '¿Sientes que tu trabajo o acciones tienen impacto real en otros?',
      isValid: () => true,
      content: <ScoreSlider value={form.impact} onChange={v => setForm(f => ({ ...f, impact: v }))} lo="Ninguno" hi="Mucho impacto" />,
    },
    {
      cat: 'experience', dimKey: 'financial_security', emoji: '🏦', title: 'Seguridad financiera',
      subtitle: '¿Qué tan seguro/a te sientes financieramente hoy?',
      isValid: () => true,
      content: <ScoreSlider value={form.financialSecurity} onChange={v => setForm(f => ({ ...f, financialSecurity: v }))} lo="Inseguro" hi="Muy seguro" />,
    },
  ];

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;
  const catHeader = CATEGORY_HEADERS[current.cat];

  // Show category transition header when first step of a new category
  const prevCat = step > 0 ? STEPS[step - 1]!.cat : null;
  const newCategory = step === 0 || prevCat !== current.cat;

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />
      <BackButton onClick={step === 0 ? onBack : () => setStep(s => s - 1)} label={step === 0 ? '← Volver al método' : '← Pregunta anterior'} />
      <StepDots total={STEPS.length} current={step} />

      {/* Category badge */}
      {newCategory && (
        <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${catHeader.bg} ${catHeader.color}`}>
          {catHeader.label}
        </div>
      )}

      <OnboardingCard>
        <span className="text-3xl block mb-3">{current.emoji}</span>
        <h1 className="text-2xl font-bold text-slate-900">{current.title}</h1>
        <p className="mt-1.5 mb-6 text-sm text-slate-500">{current.subtitle}</p>

        <div className="min-h-[160px]">{current.content}</div>

        <div className="mt-8 flex items-center justify-between">
          <div />
          <button
            onClick={isLast ? onDone : () => setStep(s => s + 1)}
            disabled={!current.isValid()}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? 'Ver mi ADN de vida ✨' : 'Continuar →'}
          </button>
        </div>
      </OnboardingCard>

      <p className="mt-3 text-center text-xs text-slate-400">
        Pregunta {step + 1} de {STEPS.length}
      </p>
    </div>
  );
}
