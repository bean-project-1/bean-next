'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomePhase, MethodPhase, QuizPhase, LLMPhase, CVPhase, CoachPhase, ReviewPhase, GoalPhase, GeneratingScreen } from './components';
import { SKILL_SUGGESTIONS, INTEREST_SUGGESTIONS, PROFESSION_SUGGESTIONS } from './constants';
import type { Phase, FormData, DimExtra } from './types';

const INITIAL_FORM: FormData = {
  name: '', email: '', profession: '',
  skills: [], interests: [], exerciseFrequency: '', lifeSatisfaction: 6, goals: [],
};

export function OnboardingFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('welcome');
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [extras, setExtras] = useState<DimExtra[]>([]);
  const [error, setError] = useState('');

  // Auto-fetch existing user session and skip Welcome phase
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.user) {
          setForm(f => ({
            ...f,
            name: json.data.user.name || '',
            email: json.data.user.email || ''
          }));
          // Jump straight to the method phase if session exists
          setPhase('method');
        }
      })
      .catch(() => {});
  }, []);

  const submit = useCallback(async () => {
    setError('');
    setPhase('generating');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dimensionExtras: extras }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setPhase('review');
        setError(json.error ?? 'Algo salió mal. Intenta de nuevo.');
        return;
      }

      setTimeout(() => router.push('/dashboard'), 2800);
    } catch {
      setPhase('review');
      setError('Error de red. Revisa tu conexión.');
    }
  }, [form, extras, router]);

  const handleLLMDone = (text: string) => {
    const lower = text.toLowerCase();
    const skills = SKILL_SUGGESTIONS.filter(s => lower.includes(s.toLowerCase()));
    const interests = INTEREST_SUGGESTIONS.filter(s => lower.includes(s.toLowerCase()));
    const profession = PROFESSION_SUGGESTIONS.find(p => lower.includes(p.toLowerCase().split(' ')[0]!)) ?? '';
    setForm(f => ({ ...f, profession, skills, interests }));
    setPhase('review');
  };

  if (phase === 'generating') return <GeneratingScreen name={form.name} />;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        {error && phase === 'review' && (
          <div className="mb-4 w-full max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {phase === 'welcome' && (
          <WelcomePhase
            name={form.name} email={form.email}
            onName={v => setForm(f => ({ ...f, name: v }))}
            onEmail={v => setForm(f => ({ ...f, email: v }))}
            onNext={() => setPhase('method')}
          />
        )}

        {phase === 'method' && (
          <MethodPhase name={form.name} onSelect={m => setPhase(m)} />
        )}

        {phase === 'quiz' && (
          <QuizPhase
            form={form} setForm={setForm}
            onDone={() => setPhase('review')}
            onBack={() => setPhase('method')}
          />
        )}

        {phase === 'llm' && (
          <LLMPhase onDone={handleLLMDone} onBack={() => setPhase('method')} />
        )}

        {phase === 'cv' && (
          <CVPhase onDone={() => setPhase('review')} onBack={() => setPhase('method')} />
        )}

        {phase === 'coach' && (
          <CoachPhase
            name={form.name}
            onDone={() => setPhase('review')}
            onBack={() => setPhase('method')}
          />
        )}

        {phase === 'review' && (
          <ReviewPhase
            form={form} extras={extras}
            onExtrasChange={setExtras}
            onSubmit={() => setPhase('goals')}
          />
        )}

        {phase === 'goals' && (
          <GoalPhase 
            goals={form.goals} 
            onChange={(goals) => setForm(f => ({ ...f, goals }))}
            onBack={() => setPhase('review')}
            onSubmit={submit}
          />
        )}
      </div>
    </main>
  );
}
