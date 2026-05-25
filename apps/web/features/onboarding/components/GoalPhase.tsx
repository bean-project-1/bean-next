'use client';

import { useState } from 'react';
import { OnboardingCard, PrimaryButton } from './shared';

interface Props {
  goals: { title: string }[];
  onChange: (goals: { title: string }[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  attributes?: { dimension: string; name: string }[];
}

export function GoalPhase({ goals, onChange, onSubmit, onBack, attributes }: Props) {
  const [text, setText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [showGoals, setShowGoals] = useState(goals.length > 0);
  const [error, setError] = useState('');

  // Count top dimension to make the coach message personal
  const getTopDimension = () => {
    if (!attributes || attributes.length === 0) return null;
    const counts: Record<string, number> = {};
    attributes.forEach(a => {
      counts[a.dimension] = (counts[a.dimension] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  };

  const topDim = getTopDimension();
  const coachMessage = topDim 
    ? `¡Impresionante ADN! Tienes un perfil muy interesante, especialmente en lo relacionado con tu "${topDim}". Basándonos en tu situación actual, ¿cuáles son las principales metas o áreas en las que te quieres enfocar próximamente?`
    : `¡He revisado tu perfil! Para empezar a crear tu plan personalizado, ¿cuáles son las principales metas u objetivos que quieres lograr próximamente?`;

  const handleExtract = async () => {
    if (text.trim().length < 10) return;
    setIsExtracting(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding/extract-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, attributes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onChange(data.goals || []);
      setShowGoals(true);
    } catch (e: any) {
      console.error(e);
      setError('Hubo un problema procesando tus metas. Intenta de nuevo.');
    } finally {
      setIsExtracting(false);
    }
  };

  const addManualGoal = () => {
    onChange([...goals, { title: 'Nueva meta' }]);
  };

  const updateGoal = (idx: number, title: string) => {
    const newGoals = [...goals];
    newGoals[idx] = { title };
    onChange(newGoals);
  };

  const removeGoal = (idx: number) => {
    onChange(goals.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-indigo-100 p-4 shadow-inner">
          <span className="text-3xl">🎯</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tus Ramas de Crecimiento</h2>
        <p className="mt-3 text-slate-500 font-medium">
          Dile al Coach hacia dónde quieres ir.
        </p>
      </div>

      <OnboardingCard>
        {/* Coach speech bubble */}
        <div className="mb-6 flex items-start gap-4">
          <div className="relative flex-shrink-0 mt-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <span className="text-lg">🤝</span>
            </div>
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex-1 rounded-xl rounded-tl-none bg-slate-50 border border-slate-100 px-5 py-4">
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {coachMessage}
            </p>
          </div>
        </div>

        {!showGoals ? (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
              rows={4}
              placeholder="Ej: Quiero volverme un desarrollador senior en los próximos 6 meses y de paso mejorar mi salud yendo al gimnasio..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-neutral-400 outline-none resize-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={onBack}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={handleExtract}
                disabled={text.trim().length < 10 || isExtracting}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExtracting ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> Procesando...</>
                ) : 'Definir Metas →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2 border-t border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-700 mb-3">Estas son las metas extraídas. Puedes editarlas o añadir más:</p>
              
              <div className="space-y-3">
                {goals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={goal.title}
                      onChange={e => updateGoal(idx, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-violet-500"
                    />
                    <button
                      onClick={() => removeGoal(idx)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {goals.length < 3 && (
                <button
                  onClick={addManualGoal}
                  className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700"
                >
                  + Añadir otra meta
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowGoals(false)}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Reescribir al Coach
              </button>
              <PrimaryButton
                className="flex-1 py-3 text-lg"
                disabled={goals.length === 0 || goals.some(g => !g.title.trim())}
                onClick={onSubmit}
              >
                Comenzar mi viaje ✨
              </PrimaryButton>
            </div>
          </div>
        )}
      </OnboardingCard>
    </div>
  );
}
