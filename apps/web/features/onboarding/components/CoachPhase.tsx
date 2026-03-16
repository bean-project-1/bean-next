// =======================================================
// BEAN — CoachPhase (Conversational interview)
// apps/web/app/onboarding/_components/CoachPhase.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { BeanLogo, BackButton, StepDots, OnboardingCard } from './shared';
import { COACH_QUESTIONS } from '../constants';

interface Props {
  name: string;
  onDone: (answers: string[]) => void;
  onBack: () => void;
}

export function CoachPhase({ name, onDone, onBack }: Props) {
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(COACH_QUESTIONS.length).fill(''));

  const current = COACH_QUESTIONS[qi]!;
  const isLast = qi === COACH_QUESTIONS.length - 1;
  const currentAnswer = answers[qi] ?? '';

  const setAnswer = (val: string) =>
    setAnswers(prev => { const n = [...prev]; n[qi] = val; return n; });

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />
      <BackButton onClick={onBack} />

      {/* Coach header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-xl">🤝</span>
          </div>
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-neutral-950" />
        </div>
        <div>
          <p className="font-semibold text-white">BEAN Coach</p>
          <p className="text-xs text-emerald-400">En línea</p>
        </div>
      </div>

      <StepDots total={COACH_QUESTIONS.length} current={qi} />

      <OnboardingCard>
        {/* Coach speech bubble */}
        <div className="mb-5 rounded-xl rounded-tl-none bg-white/8 px-5 py-4">
          <p className="text-sm text-white leading-relaxed">
            {qi === 0 && name ? `${name.split(' ')[0]}, c` : qi === 0 ? 'C' : ''}
            {qi === 0 ? 'uéntame… ' : ''}{current.q}
          </p>
        </div>

        {/* User response */}
        <textarea
          key={qi}
          value={currentAnswer}
          onChange={e => setAnswer(e.target.value)}
          autoFocus
          rows={4}
          placeholder={current.placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none resize-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
        />

        <div className="mt-4 flex items-center justify-between">
          {qi > 0 ? (
            <button onClick={() => setQi(q => q - 1)} className="text-sm text-neutral-500 hover:text-white transition-colors">
              ← Anterior
            </button>
          ) : <div />}

          <button
            onClick={isLast ? () => onDone(answers) : () => setQi(q => q + 1)}
            disabled={currentAnswer.trim().length < 10}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? 'Ver mi ADN de vida ✨' : 'Siguiente →'}
          </button>
        </div>
      </OnboardingCard>

      <p className="mt-3 text-center text-xs text-neutral-700">
        Pregunta {qi + 1} de {COACH_QUESTIONS.length}
      </p>
    </div>
  );
}
