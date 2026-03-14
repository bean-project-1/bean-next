// =======================================================
// BEAN — Onboarding Page
// apps/web/app/onboarding/page.tsx
// Collects initial user data to build the first BEAN profile
// =======================================================
'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingData } from '@bean/types';

const EXERCISE_OPTIONS = ['Rarely', '1–2x/week', '3–4x/week', '5+x/week', 'Daily'];
const SKILL_SUGGESTIONS = [
  'JavaScript', 'Python', 'Design', 'Sales', 'Writing', 'Leadership',
  'Marketing', 'Data Analysis', 'Public Speaking', 'Project Management',
];
const INTEREST_SUGGESTIONS = [
  'Technology', 'Travel', 'Music', 'Reading', 'Fitness', 'Cooking',
  'Photography', 'Gaming', 'Entrepreneurship', 'Art',
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? 'w-8 bg-violet-500' : i === current ? 'w-8 bg-violet-400' : 'w-4 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function TagInput({
  tags,
  suggestions,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  suggestions: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  const handleAdd = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-violet-600/20 px-3 py-1 text-sm text-violet-300"
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
              className="ml-1 text-violet-400 hover:text-white"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              handleAdd(input);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions
          .filter((s) => !tags.includes(s))
          .slice(0, 6)
          .map((s) => (
            <button
              key={s}
              onClick={() => handleAdd(s)}
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-neutral-400 transition hover:border-violet-500/40 hover:text-violet-300"
            >
              + {s}
            </button>
          ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<OnboardingData>({
    profession: '',
    skills: [],
    interests: [],
    exerciseFrequency: '',
    lifeSatisfaction: 5,
  });

  const steps = [
    {
      title: 'What do you do?',
      subtitle: 'Tell us about your professional role.',
      content: (
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-300">
            Current profession or role
          </label>
          <input
            type="text"
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
            placeholder="e.g. Software Engineer, Product Designer, Entrepreneur..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>
      ),
      isValid: () => form.profession.trim().length > 0,
    },
    {
      title: 'Your skills',
      subtitle: 'What are you good at? Add your top skills.',
      content: (
        <TagInput
          tags={form.skills}
          suggestions={SKILL_SUGGESTIONS}
          onAdd={(s) => setForm({ ...form, skills: [...form.skills, s] })}
          onRemove={(s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) })}
          placeholder="Type a skill and press Enter..."
        />
      ),
      isValid: () => form.skills.length > 0,
    },
    {
      title: 'Your interests',
      subtitle: "What excites you outside of work?",
      content: (
        <TagInput
          tags={form.interests}
          suggestions={INTEREST_SUGGESTIONS}
          onAdd={(s) => setForm({ ...form, interests: [...form.interests, s] })}
          onRemove={(s) =>
            setForm({ ...form, interests: form.interests.filter((x) => x !== s) })
          }
          placeholder="Type an interest and press Enter..."
        />
      ),
      isValid: () => form.interests.length > 0,
    },
    {
      title: 'Activity level',
      subtitle: 'How often do you exercise?',
      content: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EXERCISE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setForm({ ...form, exerciseFrequency: opt })}
              className={`rounded-xl border p-4 text-sm font-medium transition-all ${
                form.exerciseFrequency === opt
                  ? 'border-violet-500 bg-violet-600/20 text-violet-300'
                  : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      isValid: () => form.exerciseFrequency.length > 0,
    },
    {
      title: 'Life satisfaction',
      subtitle: 'How satisfied are you with your life right now?',
      content: (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-neutral-500">Not at all</span>
            <span className="text-4xl font-bold text-violet-400">{form.lifeSatisfaction}/10</span>
            <span className="text-neutral-500">Thriving</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={form.lifeSatisfaction}
            onChange={(e) =>
              setForm({ ...form, lifeSatisfaction: parseInt(e.target.value, 10) })
            }
            className="w-full accent-violet-500"
          />
          <div className="mt-4 flex justify-between text-xs text-neutral-600">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      ),
      isValid: () => true,
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = async () => {
    if (!isLastStep) {
      setStep((s) => s + 1);
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Onboarding submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <span className="text-sm font-bold text-white">B</span>
          </div>
          <span className="text-lg font-bold text-white">BEAN</span>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step + 1} total={steps.length} />
          <p className="mt-3 text-xs text-neutral-500">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <h1 className="mb-1 text-2xl font-bold text-white">{currentStep?.title}</h1>
          <p className="mb-8 text-neutral-400">{currentStep?.subtitle}</p>

          {currentStep?.content}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-sm text-neutral-400 transition hover:text-white"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={!currentStep?.isValid() || isSubmitting}
              className="ml-auto rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Analyzing...' : isLastStep ? 'Generate my profile →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
