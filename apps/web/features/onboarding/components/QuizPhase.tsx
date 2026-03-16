// =======================================================
// BEAN — QuizPhase (5-step questionnaire)
// apps/web/app/onboarding/_components/QuizPhase.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { BeanLogo, InputField, TagInput, StepDots, OnboardingCard, BackButton } from './shared';
import { EXERCISE_OPTIONS, SKILL_SUGGESTIONS, INTEREST_SUGGESTIONS, PROFESSION_SUGGESTIONS } from '../constants';
import type { FormData } from '../types';

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onDone: () => void;
  onBack: () => void;
}

export function QuizPhase({ form, setForm, onDone, onBack }: Props) {
  const [step, setStep] = useState(0);

  const STEPS = [
    {
      emoji: '💼', title: 'What do you do?', subtitle: 'Tu rol o profesión actual.',
      isValid: () => form.profession.trim().length > 0,
      content: (
        <div>
          <InputField
            label="Profesión actual"
            value={form.profession}
            onChange={v => setForm(f => ({ ...f, profession: v }))}
            placeholder="Ej. Software Engineer, Diseñador, Emprendedor…"
            autoFocus
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PROFESSION_SUGGESTIONS.slice(0, 6).map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, profession: s }))}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400 hover:border-violet-500/40 hover:text-violet-300 transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      emoji: '🧠', title: 'Tus habilidades', subtitle: 'Agrega tus skills más importantes.',
      isValid: () => form.skills.length > 0,
      content: (
        <TagInput
          tags={form.skills} suggestions={SKILL_SUGGESTIONS}
          onAdd={s => setForm(f => ({ ...f, skills: [...f.skills, s] }))}
          onRemove={s => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))}
          placeholder="Escribe un skill y presiona Enter…"
        />
      ),
    },
    {
      emoji: '❤️', title: 'Tus intereses', subtitle: '¿Qué te apasiona fuera del trabajo?',
      isValid: () => form.interests.length > 0,
      content: (
        <TagInput
          tags={form.interests} suggestions={INTEREST_SUGGESTIONS}
          onAdd={s => setForm(f => ({ ...f, interests: [...f.interests, s] }))}
          onRemove={s => setForm(f => ({ ...f, interests: f.interests.filter(x => x !== s) }))}
          placeholder="Escribe un interés y presiona Enter…"
        />
      ),
    },
    {
      emoji: '🏃', title: 'Nivel de actividad', subtitle: '¿Con qué frecuencia haces ejercicio?',
      isValid: () => form.exerciseFrequency.length > 0,
      content: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EXERCISE_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setForm(f => ({ ...f, exerciseFrequency: opt }))}
              className={`rounded-xl border p-4 text-sm font-medium transition-all ${
                form.exerciseFrequency === opt
                  ? 'border-violet-500 bg-violet-600/25 text-violet-300'
                  : 'border-white/10 bg-white/3 text-neutral-400 hover:text-white'
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      emoji: '😊', title: 'Satisfacción de vida', subtitle: '¿Qué tan satisfecho estás con tu vida hoy?',
      isValid: () => true,
      content: (
        <div>
          <div className="mb-8 flex items-end justify-between">
            <span className="text-xs text-neutral-500">Para nada</span>
            <div className="text-center">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                {form.lifeSatisfaction}
              </span>
              <p className="text-xs text-neutral-500 mt-1">de 10</p>
            </div>
            <span className="text-xs text-neutral-500">Excelente</span>
          </div>
          <input type="range" min={0} max={10} step={1} value={form.lifeSatisfaction}
            onChange={e => setForm(f => ({ ...f, lifeSatisfaction: parseInt(e.target.value, 10) }))}
            className="w-full h-2 appearance-none rounded-full bg-white/10 accent-violet-500 cursor-pointer" />
          <div className="mt-3 flex justify-between text-xs text-neutral-700 select-none">
            {Array.from({ length: 11 }, (_, i) => <span key={i}>{i}</span>)}
          </div>
        </div>
      ),
    },
  ];

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />
      <BackButton onClick={onBack} />
      <StepDots total={STEPS.length} current={step} />

      <OnboardingCard>
        <span className="text-3xl block mb-3">{current.emoji}</span>
        <h1 className="text-2xl font-bold text-white">{current.title}</h1>
        <p className="mt-1.5 mb-6 text-sm text-neutral-400">{current.subtitle}</p>

        <div className="min-h-[130px]">{current.content}</div>

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-sm text-neutral-500 hover:text-white transition-colors">
              ← Atrás
            </button>
          ) : <div />}
          <button
            onClick={isLast ? onDone : () => setStep(s => s + 1)}
            disabled={!current.isValid()}
            className="ml-auto rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? 'Ver mi ADN de vida ✨' : 'Continuar →'}
          </button>
        </div>
      </OnboardingCard>

      <p className="mt-3 text-center text-xs text-neutral-700">
        Paso {step + 1} de {STEPS.length}
      </p>
    </div>
  );
}
