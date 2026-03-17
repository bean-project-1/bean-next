'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS, CAT_COLORS } from '../onboarding/constants';
import {
  SpiderChart,
  PillarCard,
  LifeScoreRing,
  DashboardEmptyState,
  CAT_LABELS
} from './components';
import type { DimScore, DashboardProfile } from './components';

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
    <div className="min-h-screen px-6 py-8 bg-white">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Hola{profile.name ? `, <span className="font-semibold text-gray-900">${profile.name.split(' ')[0]}</span>` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-400 font-medium">
            {filled}/{ALL_DIMENSIONS.length} dimensiones completadas
          </p>
        </div>
        <a href="/dna"
          className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50">
          🧬 Mi ADN
        </a>
      </div>

      <div className="mb-6 flex gap-1 w-fit rounded-xl border border-gray-100 bg-gray-50 p-1">
        {(['overview', 'dimensions'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'
            }`}>
            {tab === 'overview' ? 'Overview' : 'Dimensiones'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 flex flex-col items-center justify-center gap-4">
              <LifeScoreRing score={lifeScore} />
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">PUNTUACIÓN GLOBAL</p>
                <div className="mt-4 flex gap-6 justify-center">
                  {(['identity', 'capital', 'experience'] as const).map(cat => {
                    const dims = dimScores.filter(d => d.cat === cat);
                    const avg = dims.length ? dims.reduce((s, d) => s + d.score, 0) / dims.length : 0;
                    const c = CAT_COLORS[cat as keyof typeof CAT_COLORS];
                    return (
                      <div key={cat} className="text-center">
                        <p className={`text-xl font-bold ${c.text}`}>{avg.toFixed(1)}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{cat}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest opacity-40">Radar de dimensiones</h2>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{filled} DATA POINTS</span>
              </div>
              {filled > 2
                ? <SpiderChart dims={dimScores.filter(d => d.score > 0)} />
                : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm font-medium">Completa más dimensiones para ver el radar</p>
                    <a href="/dna" className="mt-3 text-xs font-bold text-green-600 hover:text-green-700">
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
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
              <p className="text-gray-400 text-sm font-medium">
                Tienes {ALL_DIMENSIONS.length - filled} dimensiones sin datos.
              </p>
              <a href="/dna" className="mt-2 inline-block text-sm font-bold text-green-600 hover:text-green-700">
                Completar en Mi ADN →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
