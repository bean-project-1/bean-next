'use client';

import { useState } from 'react';
import { OnboardingCard, PrimaryButton } from './shared';

interface Props {
  goals: { title: string }[];
  onChange: (goals: { title: string }[]) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function GoalPhase({ goals, onChange, onSubmit, onBack }: Props) {
  const [currentGoal, setCurrentGoal] = useState('');

  const addGoal = () => {
    if (currentGoal.trim() && goals.length < 3) {
      onChange([...goals, { title: currentGoal.trim() }]);
      setCurrentGoal('');
    }
  };

  const removeGoal = (index: number) => {
    onChange(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-fuchsia-100 p-4 shadow-inner">
          <span className="text-3xl">🌿</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tus Ramas de Crecimiento</h2>
        <p className="mt-3 text-slate-500 font-medium">
          El ADN marca tu estado actual. Ahora, define de 1 a 3 metas principales (tus ramas) para empezar a crecer.
        </p>
      </div>

      <OnboardingCard>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-500 uppercase tracking-wide">
              ¿Qué quieres lograr próximamente?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentGoal}
                onChange={e => setCurrentGoal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGoal();
                  }
                }}
                placeholder="Ej. Aprender React, Mejorar mi salud cardiovascular..."
                disabled={goals.length >= 3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={addGoal}
                disabled={!currentGoal.trim() || goals.length >= 3}
                className="rounded-xl bg-slate-100 px-5 font-bold text-violet-600 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                title="Agregar Meta"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400 font-medium">
              Puedes agregar hasta {3 - goals.length} metas más.
            </p>
          </div>

          {goals.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {goals.map((goal, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-200 text-xs font-bold text-violet-700">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-semibold">{goal.title}</span>
                  </div>
                  <button
                    onClick={() => removeGoal(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-3 pt-6">
            <button
              onClick={onBack}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
            >
              Atrás
            </button>
            <PrimaryButton
              className="flex-1 py-3 text-lg"
              disabled={goals.length === 0}
              onClick={onSubmit}
            >
              Comenzar mi viaje →
            </PrimaryButton>
          </div>
        </div>
      </OnboardingCard>
    </div>
  );
}
