'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS, CAT_COLORS } from '@/features/onboarding/constants';

// ── Types ──────────────────────────────────────────────
export interface DimScore { key: string; label: string; score: number; cat: string; }
export interface DashboardProfile { userId: string; name?: string; email?: string; }

export const CAT_LABELS: Record<string, string> = {
  identity: '🧭 Identity',
  capital: '💼 Capital',
  experience: '❤️ Experience',
};

// ── Score Bar ──────────────────────────────────────────
export function ScoreBar({ score, cat }: { score: number; cat: string }) {
  const c = CAT_COLORS[cat as keyof typeof CAT_COLORS] ?? CAT_COLORS.identity;
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full ${c.bg} transition-all duration-700`}
        style={{ width: `${(score / 10) * 100}%`, opacity: 0.75 }}
      />
    </div>
  );
}

// ── Radar-like spider chart (SVG) ──────────────────────
export function SpiderChart({ dims }: { dims: DimScore[] }) {
  const N = dims.length;
  if (N === 0) return null;
  const CX = 160; const CY = 160; const R = 120;
  const step = (2 * Math.PI) / N;

  const point = (i: number, r: number) => {
    const angle = i * step - Math.PI / 2;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPath = dims.map((d, i) => {
    const p = point(i, (d.score / 10) * R);
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ') + ' Z';

  return (
    <svg width={320} height={320} viewBox="0 0 320 320" className="overflow-visible mx-auto">
      {gridLevels.map((f, gi) => (
        <polygon key={gi}
          points={dims.map((_, i) => { const p = point(i, f * R); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {dims.map((d, i) => {
        const p = point(i, R);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="1.5" />
      {dims.map((d, i) => {
        const p = point(i, (d.score / 10) * R);
        const c = CAT_COLORS[d.cat as keyof typeof CAT_COLORS] ?? CAT_COLORS.identity;
        return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={c.glow} />;
      })}
      {dims.map((d, i) => {
        const p = point(i, R + 18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="rgba(163,163,163,0.8)">{d.label.split(' ')[0]}</text>
        );
      })}
    </svg>
  );
}

// ── Pillar Card ────────────────────────────────────────
export function PillarCard({ cat, dims }: { cat: string; dims: DimScore[] }) {
  const c = CAT_COLORS[cat as keyof typeof CAT_COLORS] ?? CAT_COLORS.identity;
  const avg = dims.length ? dims.reduce((s, d) => s + d.score, 0) / dims.length : 0;
  return (
    <div className={`rounded-2xl border ${c.border} bg-white/[0.03] p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{CAT_LABELS[cat]}</h3>
        <span className={`text-lg font-bold ${c.text}`}>{avg.toFixed(1)}<span className="text-xs text-neutral-600">/10</span></span>
      </div>
      <div className="space-y-3">
        {dims.map(d => (
          <div key={d.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-neutral-400">{d.label}</span>
              <span className={`text-xs font-semibold ${d.score >= 7 ? c.text : 'text-neutral-500'}`}>
                {d.score > 0 ? d.score.toFixed(1) : '—'}
              </span>
            </div>
            <ScoreBar score={d.score} cat={cat} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Life Score Ring ────────────────────────────────────
export function LifeScoreRing({ score }: { score: number }) {
  const R = 52; const circ = 2 * Math.PI * R;
  const filled = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="65" cy="65" r={R} fill="none"
            stroke="url(#scoreGrad)" strokeWidth="10"
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round" />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <text x="65" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white">
            {score}
          </text>
          <text x="65" y="78" textAnchor="middle" fontSize="10" fill="rgba(163,163,163,0.7)">
            LIFE SCORE
          </text>
        </svg>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────
export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-4">🧬</span>
      <h2 className="text-xl font-bold text-white mb-2">Completa tu onboarding</h2>
      <p className="text-neutral-400 text-sm mb-6 max-w-sm">
        Aún no tenemos tu perfil BEAN. Completa el onboarding para ver tus gráficas.
      </p>
      <a href="/onboarding"
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-px transition-all">
        Comenzar onboarding →
      </a>
    </div>
  );
}
