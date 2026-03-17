'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS, CAT_COLORS } from '../onboarding/constants';
import { DNADiagram } from '../onboarding/components/DNADiagram';

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
  const [pct, setPct] = useState(0);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then((json: { success: boolean; data?: { profile?: { dimensionScores: { dimension: { name: string }; score: number }[] } } }) => {
        if (json.success && json.data?.profile?.dimensionScores) {
          const scoreMap: Record<string, number> = {};
          json.data.profile.dimensionScores.forEach((ds) => {
            scoreMap[ds.dimension.name] = ds.score;
          });
          setScores(scoreMap);
          const filled = ALL_DIMENSIONS.filter(d => (scoreMap[d.key] ?? 0) > 0).length;
          setPct(Math.round((filled / ALL_DIMENSIONS.length) * 100));
        }
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const setScore = (key: string, score: number) => {
    setScores(prev => {
      const newScores = { ...prev, [key]: score };
      const filled = ALL_DIMENSIONS.filter(d => (newScores[d.key] ?? 0) > 0).length;
      setPct(Math.round((filled / ALL_DIMENSIONS.length) * 100));
      return newScores;
    });
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">Mi <span className="font-semibold text-gray-900 italic">ADN Vital</span></h1>
        <p className="mt-1 text-sm text-gray-400 font-medium">
          Tu huella única en las 19 dimensiones BEAN.
          Actualiza tu perfil moviendo los indicadores.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-6 flex items-center gap-8 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Completitud de Perfil</span>
            <span className="text-green-600 font-bold">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-green-500 transition-all duration-700 shadow-sm shadow-green-200"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-3xl font-light text-gray-900 leading-none">{filled}<span className="text-base font-normal text-gray-300 ml-1">/ {ALL_DIMENSIONS.length}</span></p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dimensiones</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8">
            <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-50/20 via-transparent to-transparent pointer-events-none" />
              <DNADiagram scores={scores} />

              <div className="mt-8 space-y-2">
                {CATEGORIES.map(({ cat, label }) => {
                  const colors: Record<string, string> = {
                    identity: 'bg-violet-500',
                    capital: 'bg-blue-500',
                    experience: 'bg-green-500',
                  };
                  const cColor = colors[cat] ?? 'bg-gray-500';
                  const dims = ALL_DIMENSIONS.filter((d: any) => d.cat === cat);
                  const avg = dims.reduce((s: number, d: any) => s + (scores[d.key] ?? 0), 0) / dims.length;
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${cColor}`} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                      </div>
                      <span className={`text-xs font-bold text-gray-900`}>{avg.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`mt-6 w-full rounded-2xl py-4 text-sm font-bold transition-all shadow-xl active:scale-95 ${
                saved
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/10'
              }`}>
              {saving ? 'Guardando…' : saved ? '✓ Perfil Guardado' : 'Guardar ADN'}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          {CATEGORIES.map(({ cat, label }) => {
            const colors: Record<string, { bg: string, text: string, border: string }> = {
              identity: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-100' },
              capital: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-100' },
              experience: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-100' },
            };
            const c = colors[cat] ?? { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-100' };
            const dims = ALL_DIMENSIONS.filter((d: any) => d.cat === cat);
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className={`text-xs font-bold uppercase tracking-widest opacity-30`}>{label}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {dims.map((dim: any) => {
                    const score = scores[dim.key] ?? 0;
                    const hasData = score > 0;
                    return (
                      <div key={dim.key} className={`rounded-2xl border p-4 transition-all ${
                        hasData ? `${c.border} bg-white shadow-sm` : 'border-gray-50 bg-gray-50/50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-base flex-shrink-0">{dim.emoji}</span>
                            <span className={`text-xs font-semibold truncate ${hasData ? 'text-gray-900' : 'text-gray-400'}`}>
                              {dim.label}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold tabular-nums ${hasData ? 'text-gray-900' : 'text-gray-300'}`}>
                            {hasData ? `${score.toFixed(1)}` : '—'}
                          </span>
                        </div>
                        <input
                          type="range" min={0} max={10} step={0.5}
                          value={score}
                          onChange={e => setScore(dim.key, parseFloat(e.target.value))}
                          className={`w-full h-1 cursor-pointer accent-gray-900 opacity-60 hover:opacity-100 transition-opacity`}
                        />
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
