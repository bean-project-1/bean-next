// =======================================================
// BEAN — ReviewPhase (DNA + Dimension completion)
// apps/web/app/onboarding/_components/ReviewPhase.tsx
// =======================================================
'use client';

import { DNADiagram } from './DNADiagram';
import { ALL_DIMENSIONS, CAT_COLORS } from '../constants';
import type { FormData, DimExtra } from '../types';

interface Props {
  form: FormData;
  extras: DimExtra[];
  onExtrasChange: (ex: DimExtra[]) => void;
  onSubmit: () => void;
}

// Dimensions pre-filled from the quiz form
const FORM_DERIVED: Record<string, (f: FormData) => number> = {
  career:          f => f.profession ? 7 : 0,
  skills:          f => Math.min(10, f.skills.length ? 5 + f.skills.length * 0.5 : 0),
  interests:       f => Math.min(10, f.interests.length ? 5 + f.interests.length * 0.5 : 0),
  physical_health: f => {
    const map: Record<string, number> = { Rarely: 2, '1–2x/week': 5, '3–4x/week': 7, '5+x/week': 9, Daily: 10 };
    return f.exerciseFrequency ? (map[f.exerciseFrequency] ?? 0) : 0;
  },
  mental_wellbeing: f => f.lifeSatisfaction ?? 0,
};

const CATEGORIES = [
  { cat: 'identity',   label: 'Identity' },
  { cat: 'capital',    label: 'Human Capital' },
  { cat: 'experience', label: 'Life Experience' },
] as const;

export function ReviewPhase({ form, extras, onExtrasChange, onSubmit }: Props) {
  // Build score map
  const scores: Record<string, number> = {};
  Object.entries(FORM_DERIVED).forEach(([key, fn]) => {
    const v = fn(form);
    if (v > 0) scores[key] = v;
  });
  extras.forEach(e => { scores[e.key] = e.score; });

  const setScore = (key: string, score: number) => {
    const dim = ALL_DIMENSIONS.find(d => d.key === key);
    const rest = extras.filter(e => e.key !== key);
    onExtrasChange([...rest, { key, score, label: dim?.label ?? key }]);
  };

  const filled = ALL_DIMENSIONS.filter(d => (scores[d.key] ?? 0) > 0).length;
  const pct = Math.round((filled / ALL_DIMENSIONS.length) * 100);

  return (
    <div className="w-full max-w-5xl">
      {/* ── Header ── */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Tu ADN de vida</h1>
        <p className="mt-2 text-neutral-400">
          Así es como BEAN te ve. Completa las dimensiones que faltan para un perfil más preciso.
        </p>
      </div>

      {/* ── Completeness bar ── */}
      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 flex items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Completitud del perfil</span>
            <span className="text-sm font-bold text-violet-400">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-2xl font-bold text-white">
            {filled}<span className="text-neutral-500 text-base font-normal">/{ALL_DIMENSIONS.length}</span>
          </p>
          <p className="text-xs text-neutral-500">Dimensiones</p>
        </div>
      </div>

      {/* ── Main layout: DNA + List ── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── DNA Panel ── */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 via-blue-600/5 to-emerald-600/5" />
              <DNADiagram scores={scores} />

              {/* Legend */}
              <div className="mt-4 space-y-1.5">
                {CATEGORIES.map(({ cat, label }) => {
                  const c = CAT_COLORS[cat];
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                      <span className="text-xs text-neutral-500">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category averages */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {CATEGORIES.map(({ cat, label }) => {
                const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);
                const avg = dims.reduce((s, d) => s + (scores[d.key] ?? 0), 0) / dims.length;
                const c = CAT_COLORS[cat];
                return (
                  <div key={cat} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className={`text-lg font-bold ${c.text}`}>{avg.toFixed(1)}</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Dimension List ── */}
        <div className="flex-1 space-y-6">
          {CATEGORIES.map(({ cat, label }) => {
            const c = CAT_COLORS[cat];
            const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);

            return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                  <h2 className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{label}</h2>
                </div>

                <div className="space-y-2">
                  {dims.map(dim => {
                    const score = scores[dim.key] ?? 0;
                    const hasData = score > 0;
                    const isFromForm = dim.key in FORM_DERIVED && hasData && !extras.find(e => e.key === dim.key);
                    const extra = extras.find(e => e.key === dim.key);

                    return (
                      <div key={dim.key} className={`rounded-xl border p-4 transition-all ${
                        hasData ? `${c.border} bg-white/[0.04]` : 'border-white/8 bg-white/[0.02]'
                      }`}>
                        {/* Row header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{dim.emoji}</span>
                            <span className={`text-sm font-medium ${hasData ? 'text-white' : 'text-neutral-500'}`}>
                              {dim.label}
                            </span>
                            {isFromForm && (
                              <span className="text-[10px] rounded-full bg-white/10 px-2 py-0.5 text-neutral-500">
                                del quiz
                              </span>
                            )}
                          </div>
                          <span className={`text-sm font-bold ${hasData ? c.text : 'text-neutral-700'}`}>
                            {hasData ? `${score.toFixed(1)}/10` : '—'}
                          </span>
                        </div>

                        {/* Progress / Slider */}
                        {isFromForm ? (
                          /* From quiz — show read-only bar */
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full rounded-full ${c.bg} transition-all duration-500`}
                              style={{ width: `${(score / 10) * 100}%`, opacity: 0.6 }} />
                          </div>
                        ) : hasData ? (
                          /* Extra — editable slider */
                          <input type="range" min={1} max={10} step={0.5}
                            value={extra?.score ?? score}
                            onChange={e => setScore(dim.key, parseFloat(e.target.value))}
                            className="w-full h-1.5 accent-violet-500 cursor-pointer" />
                        ) : (
                          /* Empty — optional fill-in */
                          <div>
                            <p className="text-xs text-neutral-600 mb-2">
                              ¿Cómo calificarías esta dimensión? <span className="text-neutral-700">(opcional)</span>
                            </p>
                            <input type="range" min={1} max={10} step={0.5}
                              defaultValue={5}
                              onChange={e => setScore(dim.key, parseFloat(e.target.value))}
                              className="w-full h-1.5 accent-violet-500 cursor-pointer opacity-40 hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Submit CTA ── */}
          <div className="sticky bottom-6 pt-2">
            <button
              onClick={onSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-2xl shadow-violet-500/30 transition-all hover:-translate-y-0.5 hover:shadow-violet-500/50"
            >
              Generar mi perfil BEAN ✨
            </button>
            <p className="mt-2 text-center text-xs text-neutral-600">
              Puedes completar más dimensiones en cualquier momento desde tu perfil.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
