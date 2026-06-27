'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MethodPhase, QuizPhase, LLMPhase, CVPhase, CoachPhase, ReviewPhase, IdeaPhase, RoutinePhase, GeneratingScreen } from './components';
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
  // rutina
  sleepHours: 8, workSchedule: '',
  // ideas
  ideas: [],
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
      // Create Profile
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({ ...form }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setPhase('ideas');
        setError(json.error ?? 'Algo salió mal. Intenta de nuevo.');
        return;
      }

      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    } catch (e: any) {
      console.error(e);
      setPhase('ideas');
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

  const handleCVDone = (resumeText: string, extractedData?: any) => {
    setForm(f => ({
      ...f,
      resumeText,
      profession: extractedData?.profession || f.profession,
      knowledge: extractedData?.knowledge || f.knowledge,
      skills: extractedData?.skills ? Array.from(new Set([...f.skills, ...extractedData.skills])) : f.skills,
      interests: extractedData?.interests ? Array.from(new Set([...f.interests, ...extractedData.interests])) : f.interests,
      values: extractedData?.values ? Array.from(new Set([...f.values, ...extractedData.values])) : f.values,
      personality: extractedData?.personality || f.personality
    }));
    setPhase('review');
  };

  if (phase === 'generating') return <GeneratingScreen name={form.name} />;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-transparent text-stone-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -transtone-x-1/2 rounded-full bg-emerald-600/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        {error && (phase === 'review' || phase === 'ideas' || phase === 'routine') && (
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
          <CVPhase onDone={handleCVDone} onBack={() => setPhase('method')} />
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
            onSubmit={() => setPhase('routine')}
          />
        )}

        {phase === 'routine' && (
          <RoutinePhase
            sleepHours={form.sleepHours}
            workSchedule={form.workSchedule}
            onChange={(data) => setForm(f => ({ ...f, ...data }))}
            onSubmit={() => setPhase('ideas')}
            onBack={() => setPhase('review')}
          />
        )}

        {phase === 'ideas' && (
          <IdeaPhase 
            ideas={form.ideas} 
            onChange={(ideas) => setForm(f => ({ ...f, ideas }))}
            onBack={() => setPhase('routine')}
            onSubmit={submit}
            attributes={form.extractedAttributes}
          />
        )}
      </div>
    </main>
  );
}
