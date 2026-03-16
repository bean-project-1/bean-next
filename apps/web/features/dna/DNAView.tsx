'use client';

import { useState, useEffect } from 'react';
import { DNADiagram } from '../onboarding/components/DNADiagram';
import { ALL_DIMENSIONS, CAT_COLORS } from '@/features/onboarding/constants';

const CATEGORIES = [
  { cat: 'identity',   label: 'Identity'         },
  { cat: 'capital',    label: 'Human Capital'    },
  { cat: 'experience', label: 'Life Experience'  },
] as const;

export function DNAView() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.profile?.dimensionScores) {
          const s: Record<string, number> = {};
          json.data.profile.dimensionScores.forEach((ds: { dimension: { name: string }; score: number }) => {
            s[ds.dimension.name] = ds.score;
          });
          setScores(s);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setScore = (key: string, score: number) => {
    setScores(prev => ({ ...prev, [key]: score }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/profile/dimensions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimensionScores: Object.entries(scores).map(([key, score]) => ({ key, score })),
        }),
      });
      setSaved(true);
    } catch {}
    setSaving(false);
  };

  const filled = ALL_DIMENSIONS.filter(d => (scores[d.key] ?? 0) > 0).length;
  const pct = Math.round((filled / ALL_DIMENSIONS.length) * 100);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Mi ADN de vida</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tu huella única en las 19 dimensiones BEAN.
          Mueve los sliders para actualizar tu perfil en tiempo real.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 flex items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Completitud</span>
            <span className="text-sm font-bold text-violet-400">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-2xl font-bold text-white">{filled}<span className="text-neutral-500 text-base font-normal">/{ALL_DIMENSIONS.length}</span></p>
          <p className="text-xs text-neutral-600">Dimensiones</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8">
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 via-blue-600/5 to-emerald-600/5" />
              <DNADiagram scores={scores} />

              <div className="mt-4 space-y-1.5">
                {CATEGORIES.map(({ cat, label }) => {
                  const c = CAT_COLORS[cat];
                  const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);
                  const avg = dims.reduce((s, d) => s + (scores[d.key] ?? 0), 0) / dims.length;
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                        <span className="text-xs text-neutral-500">{label}</span>
                      </div>
                      <span className={`text-xs font-semibold ${c.text}`}>{avg.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                saved
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:-translate-y-px'
              }`}>
              {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {CATEGORIES.map(({ cat, label }) => {
            const c = CAT_COLORS[cat];
            const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                  <h2 className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{label}</h2>
                </div>
                <div className="space-y-2">
                  {dims.map(dim => {
                    const score = scores[dim.key] ?? 0;
                    const hasData = score > 0;
                    return (
                      <div key={dim.key} className={`rounded-xl border p-4 transition-all ${
                        hasData ? `${c.border} bg-white/[0.04]` : 'border-white/8 bg-white/[0.02]'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{dim.emoji}</span>
                            <span className={`text-sm font-medium ${hasData ? 'text-white' : 'text-neutral-500'}`}>
                              {dim.label}
                            </span>
                          </div>
                          <span className={`text-sm font-bold tabular-nums ${hasData ? c.text : 'text-neutral-700'}`}>
                            {hasData ? `${score.toFixed(1)}/10` : '—'}
                          </span>
                        </div>
                        <input
                          type="range" min={0} max={10} step={0.5}
                          value={score}
                          onChange={e => setScore(dim.key, parseFloat(e.target.value))}
                          className={`w-full h-1.5 cursor-pointer accent-violet-500 transition-opacity ${
                            hasData ? 'opacity-100' : 'opacity-40 hover:opacity-90'
                          }`}
                        />
                        <div className="mt-1.5 flex justify-between text-[9px] text-neutral-700 select-none px-0.5">
                          <span>0</span><span>2.5</span><span>5</span><span>7.5</span><span>10</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
