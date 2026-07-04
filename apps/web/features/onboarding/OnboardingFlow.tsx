'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MethodPhase, QuizPhase, LLMPhase, CVPhase, CoachPhase, ReviewPhase, IdeaPhase, RoutinePhase, GeneratingScreen, ExpressGoalPhase, ExpressRoutinePhase, ExpressDraftPhase } from './components';
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
  sleepHours: 8, workSchedule: '9-5',
  // ideas
  ideas: [],
  // detalles complementarios
  details: {},
};

export function OnboardingFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('express-goal');
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [goalText, setGoalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [generationStep, setGenerationStep] = useState(0);
  const [draftPlan, setDraftPlan] = useState<any | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auto-fetch existing user session and check for pending onboarding inputs
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(async (session) => {
        if (session && session.user) {
          setIsLoggedIn(true);
          setForm(f => ({
            ...f,
            name: session.user.name || '',
            email: session.user.email || ''
          }));

          // Sync pending onboarding inputs from sessionStorage if it exists
          const pendingRaw = sessionStorage.getItem('pending_onboarding_inputs');
          if (pendingRaw) {
            // Consume it synchronously to prevent React StrictMode double-fire race conditions
            sessionStorage.removeItem('pending_onboarding_inputs');
            
            console.log('[OnboardingFlow] Found pending onboarding inputs, saving to DB...');
            try {
              setPhase('generating');
              setGenerationStep(1); // Saving profile progress step
              
              const pendingData = JSON.parse(pendingRaw);
              // Make sure name/email are synced from auth session
              pendingData.name = session.user.name || pendingData.name || 'Usuario BEAN';
              pendingData.email = session.user.email || pendingData.email;

              const saveRes = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: pendingData.name,
                  email: pendingData.email,
                  sleepHours: pendingData.sleepHours,
                  workSchedule: pendingData.workSchedule,
                  extractedAttributes: pendingData.extractedAttributes || [],
                  extractedInputs: pendingData.extractedInputs || []
                })
              });
              const saveJson = await saveRes.json();
              
              if (saveRes.ok && saveJson.success) {
                sessionStorage.removeItem('pending_onboarding_inputs');
                // Store the goal text to trigger chat drafting on the homepage!
                sessionStorage.setItem('just_onboarded_goal', pendingData.goalText);
                setGenerationStep(5);
                setTimeout(() => {
                  window.location.href = '/home';
                }, 500);
              } else {
                console.error('[OnboardingFlow] Save profile failed:', saveJson.error);
                setError(saveJson.error || 'No se pudo guardar tu perfil. Intenta de nuevo.');
                setPhase('express-goal');
              }
            } catch (err) {
              console.error('[OnboardingFlow] Error processing pending data:', err);
              setError('Ocurrió un error al guardar tu perfil.');
              setPhase('express-goal');
            }
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const submit = useCallback(async () => {
    setError('');
    setPhase('generating');
    setGenerationStep(0);
    try {
      // Create Profile
      setGenerationStep(1);
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setPhase('ideas');
        setError(json.error ?? 'Algo salió mal. Intenta de nuevo.');
        return;
      }

      setGenerationStep(5);
      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    } catch (e: any) {
      console.error(e);
      setPhase('ideas');
      setError('Error de red. Revisa tu conexión.');
    }
  }, [form, router]);

  const handleExpressSubmit = async () => {
    setError('');
    setIsSubmitting(true);
    setPhase('generating');
    setGenerationStep(0);

    try {
      // 1. Extract DNA attributes from goal text using AI (public & fast)
      let extractedAttributes: any[] = [];
      let extractedInputs: any[] = [];
      
      try {
        const extractRes = await fetch('/api/onboarding/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: goalText })
        });
        const extractJson = await extractRes.json();
        if (extractRes.ok && extractJson.success && extractJson.data) {
          extractedAttributes = extractJson.data.attributes || [];
          extractedInputs = extractJson.data.inputs || [];
        }
      } catch (err) {
        console.error('DNA extraction error (non-fatal):', err);
      }

      // 2. Build Onboarding Payload
      const onboardingPayload = {
        name: form.name,
        email: form.email,
        sleepHours: form.sleepHours,
        workSchedule: form.workSchedule,
        extractedAttributes,
        extractedInputs,
        goalText
      };

      // 3. Cache inputs in sessionStorage
      sessionStorage.setItem('pending_onboarding_inputs', JSON.stringify(onboardingPayload));

      if (isLoggedIn) {
        // If already logged in, save profile immediately
        setGenerationStep(1);
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            sleepHours: form.sleepHours,
            workSchedule: form.workSchedule,
            extractedAttributes,
            extractedInputs
          })
        });
        const json = await res.json();
        if (res.ok && json.success) {
          sessionStorage.removeItem('pending_onboarding_inputs');
          sessionStorage.setItem('just_onboarded_goal', goalText);
          setGenerationStep(5);
          setTimeout(() => {
            window.location.href = '/home';
          }, 500);
        } else {
          setError(json.error || 'Error al guardar tu perfil.');
          setPhase('express-routine');
          setIsSubmitting(false);
        }
      } else {
        // Redirect to registration screen
        window.location.href = '/register?callbackUrl=/onboarding';
      }

    } catch (e: any) {
      console.error('Express submission error:', e);
      setPhase('express-routine');
      setError('Ocurrió un error al procesar tu registro. Intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

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
        setForm(f => ({
          ...f,
          values: json.data.attributes?.filter((a: any) => a.dimension === 'values').map((a: any) => a.key) || [],
          interests: json.data.attributes?.filter((a: any) => a.dimension === 'interests').map((a: any) => a.key) || [],
          personality: json.data.attributes?.find((a: any) => a.dimension === 'personality')?.key || '',
          purpose: json.data.purpose || '',
          motivations: json.data.motivations || ''
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

  if (phase === 'generating') return <GeneratingScreen name={form.name} step={generationStep} />;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-transparent text-stone-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-600/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        {error && (phase === 'review' || phase === 'ideas' || phase === 'routine' || phase === 'express-routine') && (
          <div className="mb-4 w-full max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {phase === 'express-goal' && (
          <ExpressGoalPhase
            goalText={goalText}
            onChange={setGoalText}
            onNext={() => setPhase('express-routine')}
            onUseAdvanced={() => setPhase('method')}
          />
        )}

        {phase === 'express-routine' && (
          <ExpressRoutinePhase
            name={form.name}
            email={form.email}
            sleepHours={form.sleepHours}
            workSchedule={form.workSchedule}
            onChange={(data) => setForm(f => ({ ...f, ...data }))}
            onBack={() => setPhase('express-goal')}
            onSubmit={handleExpressSubmit}
            isSubmitting={isSubmitting}
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

        {phase === 'express-draft' && (
          <ExpressDraftPhase
            plan={draftPlan}
            name={form.name}
            onPlant={async () => {
              if (isLoggedIn) {
                setPhase('generating');
                setGenerationStep(4);
                try {
                  const pendingRaw = sessionStorage.getItem('pending_onboarding_data');
                  const payload = pendingRaw ? JSON.parse(pendingRaw) : {
                    name: form.name,
                    email: form.email,
                    sleepHours: form.sleepHours,
                    workSchedule: form.workSchedule,
                    planSummary: draftPlan
                  };

                  const saveRes = await fetch('/api/onboarding/save-onboarding-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  const saveJson = await saveRes.json();
                  if (saveRes.ok && saveJson.success) {
                    sessionStorage.removeItem('pending_onboarding_data');
                    sessionStorage.setItem('just_onboarded', 'true');
                    window.location.href = '/home';
                  } else {
                    setError(saveJson.error || 'No se pudo sembrar el plan. Intenta de nuevo.');
                    setPhase('express-goal');
                  }
                } catch (err) {
                  console.error(err);
                  setError('Error de red. Intenta de nuevo.');
                  setPhase('express-goal');
                }
              } else {
                window.location.href = `/register?callbackUrl=/onboarding`;
              }
            }}
          />
        )}
      </div>
    </main>
  );
}
