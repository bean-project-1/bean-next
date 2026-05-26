'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MethodPhase, QuizPhase, LLMPhase, CVPhase, CoachPhase, ReviewPhase, GoalPhase, GeneratingScreen } from './components';
import { SKILL_SUGGESTIONS, INTEREST_SUGGESTIONS, PROFESSION_SUGGESTIONS } from './constants';
import type { Phase, FormData } from './types';

const INITIAL_FORM: FormData = {
  name: '', email: '',
  // identidad
  values: [], personality: '', interests: [], purpose: '', motivations: '',
  // capital
  knowledge: '', skills: [], profession: '', income: '', socialCapital: '',
  exerciseFrequency: '', resilience: '',
  // experiencia
  workSatisfaction: '', relationships: '', lifeSatisfaction: '',
  freeTime: '', personalGrowth: '', impact: '', financialSecurity: '',
  // metas
  goals: [],
  // detalles complementarios
  details: {},
};

export function OnboardingFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('method');
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [error, setError] = useState('');

  // Auto-fetch existing user session and skip Welcome phase
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => {
        if (session && session.user) {
          setForm(f => ({
            ...f,
            name: session.user.name || '',
            email: session.user.email || ''
          }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const submit = useCallback(async () => {
    setError('');
    setPhase('generating');
    try {
      // 1. Create Profile (save all goals EXCEPT the first one as empty goals)
      const profileGoals = form.goals.length > 1 ? form.goals.slice(1) : [];
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({ ...form, goals: profileGoals }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setPhase('review');
        setError(json.error ?? 'Algo salió mal. Intenta de nuevo.');
        return;
      }

      // 2. Generate the full tree plan for the FIRST goal using the AI Agent
      if (form.goals.length > 0) {
        const firstGoalText = form.goals[0].title;
        const generateRes = await fetch('/api/ai/goal-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            finalGoalInput: firstGoalText,
            chatHistory: [],
            userEmail: form.email // So the backend finds the newly created user
          })
        });
        
        if (!generateRes.ok) {
          console.warn("Failed to generate goal tree during onboarding, but profile was created.");
        }
      }

      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    } catch (e: any) {
      console.error(e);
      setPhase('review');
      setError('Error de red. Revisa tu conexión.');
    }
  }, [form, router]);

  const [isExtracting, setIsExtracting] = useState(false);

  const handleLLMDone = async (text: string) => {
    setIsExtracting(true);
    try {
      const res = await fetch('/api/onboarding/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      
      if (json.success && json.data) {
        const { attributes = [], inputs = [] } = json.data;
        
        // Map extracted attributes back to form fields for visual review
        const extractedSkills = attributes.filter((a: any) => a.dimension === 'skills').map((a: any) => a.name);
        const extractedInterests = attributes.filter((a: any) => a.dimension === 'interests').map((a: any) => a.name);
        const extractedProfession = attributes.find((a: any) => a.dimension === 'career' || a.category === 'profession')?.name || '';

        setForm(f => ({ 
          ...f, 
          profession: extractedProfession || f.profession, 
          skills: Array.from(new Set([...f.skills, ...extractedSkills])), 
          interests: Array.from(new Set([...f.interests, ...extractedInterests])),
          extractedAttributes: attributes,
          extractedInputs: inputs
        }));
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
      setPhase('review');
    }
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
          <LLMPhase onDone={handleLLMDone} onBack={() => setPhase('method')} loading={isExtracting} />
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
            form={form}
            onFormChange={(f) => setForm(prev => ({ ...prev, ...f }))}
            onSubmit={() => setPhase('goals')}
          />
        )}

        {phase === 'goals' && (
          <GoalPhase 
            goals={form.goals} 
            onChange={(goals) => setForm(f => ({ ...f, goals }))}
            onBack={() => setPhase('review')}
            onSubmit={submit}
            attributes={form.extractedAttributes}
          />
        )}
      </div>
    </main>
  );
}
