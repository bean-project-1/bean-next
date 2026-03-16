'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS, CAT_COLORS } from '@/features/onboarding/constants';
import { 
  SpiderChart, 
  PillarCard, 
  LifeScoreRing, 
  DashboardEmptyState, 
  CAT_LABELS,
  DimScore,
  DashboardProfile 
} from './components';

export function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [dimScores, setDimScores] = useState<DimScore[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions'>('overview');

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const { user } = json.data;
          setProfile({ userId: user.id, name: user.name, email: user.email });

          const dbScores: Record<string, number> = {};
          if (json.data.profile?.dimensionScores) {
            json.data.profile.dimensionScores.forEach((ds: { dimension: { name: string }; score: number }) => {
              dbScores[ds.dimension.name] = ds.score;
            });
          }

          const scores: DimScore[] = ALL_DIMENSIONS.map(d => ({
            key: d.key,
            label: d.label,
            score: dbScores[d.key] ?? 0,
            cat: d.cat,
          }));
          setDimScores(scores);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const byCategory = (['identity', 'capital', 'experience'] as const).map(cat => ({
    cat,
    dims: dimScores.filter(d => d.cat === cat),
  }));

  const filled = dimScores.filter(d => d.score > 0).length;
  const lifeScore = filled > 0
    ? Math.round(dimScores.reduce((s, d) => s + d.score, 0) / ALL_DIMENSIONS.length * 10)
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-sm text-neutral-500">Cargando tu perfil…</p>
        </div>
      </div>
    );
  }

  if (!profile) return <DashboardEmptyState />;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hola{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {filled}/{ALL_DIMENSIONS.length} dimensiones completadas
          </p>
        </div>
        <a href="/dna"
          className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/10 px-4 py-2 text-sm font-medium text-violet-300 transition-all hover:bg-violet-600/20">
          🧬 Ver mi ADN
        </a>
      </div>

      <div className="mb-6 flex gap-1 w-fit rounded-xl border border-white/10 bg-white/5 p-1">
        {(['overview', 'dimensions'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-violet-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'
            }`}>
            {tab === 'overview' ? '📊 Overview' : '🔢 Dimensiones'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col items-center justify-center gap-4">
              <LifeScoreRing score={lifeScore} />
              <div className="text-center">
                <p className="text-sm text-neutral-400">Tu puntuación global de vida</p>
                <div className="mt-3 flex gap-4 justify-center text-xs text-neutral-600">
                  {(['identity', 'capital', 'experience'] as const).map(cat => {
                    const dims = dimScores.filter(d => d.cat === cat);
                    const avg = dims.length ? dims.reduce((s, d) => s + d.score, 0) / dims.length : 0;
                    const c = CAT_COLORS[cat];
                    return (
                      <div key={cat} className="text-center">
                        <p className={`text-base font-bold ${c.text}`}>{avg.toFixed(1)}</p>
                        <p className="text-[10px] text-neutral-600 capitalize">{cat}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Radar de dimensiones</h2>
                <span className="text-xs text-neutral-600">{filled} con datos</span>
              </div>
              {filled > 2
                ? <SpiderChart dims={dimScores.filter(d => d.score > 0)} />
                : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-neutral-500 text-sm">Completa más dimensiones para ver el radar</p>
                    <a href="/dna" className="mt-3 text-xs text-violet-400 hover:text-violet-300">
                      Completar mi ADN →
                    </a>
                  </div>
                )
              }
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {byCategory.map(({ cat, dims }) => (
              <PillarCard key={cat} cat={cat} dims={dims} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dimensions' && (
        <div className="space-y-6">
          {byCategory.map(({ cat, dims }) => <PillarCard key={cat} cat={cat} dims={dims} />)}
          {filled < ALL_DIMENSIONS.length && (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
              <p className="text-neutral-500 text-sm">
                Tienes {ALL_DIMENSIONS.length - filled} dimensiones sin datos.
              </p>
              <a href="/dna" className="mt-2 inline-block text-sm text-violet-400 hover:text-violet-300">
                Completar en Mi ADN →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
