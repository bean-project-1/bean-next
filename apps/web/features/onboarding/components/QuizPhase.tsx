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
  PURPOSE_OPTIONS, KNOWLEDGE_OPTIONS, SOCIAL_CAPITAL_OPTIONS,
  RESILIENCE_OPTIONS, WORK_SATISFACTION_OPTIONS, RELATIONSHIPS_OPTIONS,
  MENTAL_WELLBEING_OPTIONS, PERSONAL_GROWTH_OPTIONS, IMPACT_OPTIONS,
  FINANCIAL_SECURITY_OPTIONS,
} from '../constants';
import type { FormData } from '../types';

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onDone: () => void;
  onBack: () => void;
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
      isValid: () => form.purpose.length > 0,
      content: <ChoiceGrid options={PURPOSE_OPTIONS} selected={form.purpose} onSelect={id => setForm(f => ({ ...f, purpose: id }))} />,
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
      isValid: () => form.knowledge.length > 0,
      content: <ChoiceGrid options={KNOWLEDGE_OPTIONS} selected={form.knowledge} onSelect={id => setForm(f => ({ ...f, knowledge: id }))} />,
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
      isValid: () => form.socialCapital.length > 0,
      content: <ChoiceGrid options={SOCIAL_CAPITAL_OPTIONS} selected={form.socialCapital} onSelect={id => setForm(f => ({ ...f, socialCapital: id }))} />,
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
      isValid: () => form.resilience.length > 0,
      content: <ChoiceGrid options={RESILIENCE_OPTIONS} selected={form.resilience} onSelect={id => setForm(f => ({ ...f, resilience: id }))} />,
    },
    // ── EXPERIENCIA ───────────────────────────────────────────
    {
      cat: 'experience', dimKey: 'work_satisfaction', emoji: '😊', title: 'Satisfacción laboral',
      subtitle: '¿Qué tan satisfecho/a estás con tu trabajo o actividad principal?',
      isValid: () => form.workSatisfaction.length > 0,
      content: <ChoiceGrid options={WORK_SATISFACTION_OPTIONS} selected={form.workSatisfaction} onSelect={id => setForm(f => ({ ...f, workSatisfaction: id }))} />,
    },
    {
      cat: 'experience', dimKey: 'relationships', emoji: '💞', title: 'Tus relaciones',
      subtitle: '¿Cómo calificarías la calidad de tus relaciones personales?',
      isValid: () => form.relationships.length > 0,
      content: <ChoiceGrid options={RELATIONSHIPS_OPTIONS} selected={form.relationships} onSelect={id => setForm(f => ({ ...f, relationships: id }))} />,
    },
    {
      cat: 'experience', dimKey: 'mental_wellbeing', emoji: '🧘', title: 'Bienestar mental',
      subtitle: '¿Cómo está tu paz mental y estado emocional hoy?',
      isValid: () => form.lifeSatisfaction.length > 0,
      content: <ChoiceGrid options={MENTAL_WELLBEING_OPTIONS} selected={form.lifeSatisfaction} onSelect={id => setForm(f => ({ ...f, lifeSatisfaction: id }))} />,
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
      isValid: () => form.personalGrowth.length > 0,
      content: <ChoiceGrid options={PERSONAL_GROWTH_OPTIONS} selected={form.personalGrowth} onSelect={id => setForm(f => ({ ...f, personalGrowth: id }))} />,
    },
    {
      cat: 'experience', dimKey: 'impact', emoji: '🌍', title: 'Tu impacto',
      subtitle: '¿Sientes que tu trabajo o acciones tienen impacto real en otros?',
      isValid: () => form.impact.length > 0,
      content: <ChoiceGrid options={IMPACT_OPTIONS} selected={form.impact} onSelect={id => setForm(f => ({ ...f, impact: id }))} />,
    },
    {
      cat: 'experience', dimKey: 'financial_security', emoji: '🏦', title: 'Seguridad financiera',
      subtitle: '¿Qué tan seguro/a te sientes financieramente hoy?',
      isValid: () => form.financialSecurity.length > 0,
      content: <ChoiceGrid options={FINANCIAL_SECURITY_OPTIONS} selected={form.financialSecurity} onSelect={id => setForm(f => ({ ...f, financialSecurity: id }))} />,
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

        <div className="min-h-[160px]">
          {current.content}
          
          <div className="mt-6 border-t border-slate-100 pt-4 animate-in fade-in duration-300">
            <label className="text-sm font-medium text-slate-500 mb-2 block">¿Quieres detallar tu respuesta? (Opcional)</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
              rows={2}
              placeholder="Escribe más detalles aquí..."
              value={form.details?.[current.dimKey] || ''}
              onChange={e => setForm(f => ({ ...f, details: { ...(f.details || {}), [current.dimKey]: e.target.value } }))}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
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
