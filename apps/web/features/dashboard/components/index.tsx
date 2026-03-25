'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS, CAT_COLORS } from '../../onboarding/constants';

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
  const colors: Record<string, string> = {
    identity: 'bg-violet-500',
    capital: 'bg-blue-500',
    experience: 'bg-green-500',
  };
  const bg = colors[cat] ?? 'bg-gray-500';
  return (
    <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${bg} transition-all duration-700`}
        style={{ width: `${(score / 10) * 100}%` }}
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
          fill="none" stroke="#f3f4f6" strokeWidth="1" />
      ))}
      {dims.map((d, i) => {
        const p = point(i, R);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#f3f4f6" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(34,197,94,0.05)" stroke="#22c55e" strokeWidth="2" />
      {dims.map((d, i) => {
        const p = point(i, (d.score / 10) * R);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#22c55e" />;
      })}
      {dims.map((d, i) => {
        const p = point(i, R + 20);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] fill-gray-400 font-bold uppercase tracking-tighter" fontSize="10">{d.label.split(' ')[0]}</text>
        );
      })}
    </svg>
  );
}

// ── Pillar Card ────────────────────────────────────────
export function PillarCard({ cat, dims }: { cat: string; dims: DimScore[] }) {
  const colors: Record<string, { text: string, border: string }> = {
    identity: { text: 'text-violet-600', border: 'border-violet-100' },
    capital: { text: 'text-blue-600', border: 'border-blue-100' },
    experience: { text: 'text-green-600', border: 'border-green-100' },
  };
  const c = colors[cat] ?? { text: 'text-gray-600', border: 'border-gray-100' };
  const avg = dims.length ? dims.reduce((s, d) => s + d.score, 0) / dims.length : 0;
  
  return (
    <div className={`rounded-2xl border ${c.border} bg-white p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-[10px] font-bold uppercase tracking-widest opacity-40`}>{cat}</h3>
        <span className={`text-lg font-bold text-gray-900`}>{avg.toFixed(1)}<span className="text-xs text-gray-300 font-normal ml-1">/10</span></span>
      </div>
      <div className="space-y-4">
        {dims.map(d => (
          <div key={d.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">{d.label}</span>
              <span className={`text-[10px] font-bold ${d.score >= 7 ? 'text-gray-900' : 'text-gray-400'}`}>
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
          <circle cx="65" cy="65" r={R} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle cx="65" cy="65" r={R} fill="none"
            stroke="url(#scoreGrad)" strokeWidth="8"
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round" />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <text x="65" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="32" fontWeight="700" fill="#111827">
            {score}
          </text>
        </svg>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────
export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center ">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">🌱</span>
      </div>
      <h2 className="text-2xl font-light text-gray-900 mb-2">Comienza tu <span className="font-semibold">Crecimiento</span></h2>
      <p className="text-gray-400 text-sm mb-8 max-w-sm font-medium">
        Aún no hemos analizado tu perfil. Completa el onboarding para ver tu árbol de vida.
      </p>
      <a href="/onboarding"
        className="rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-xl hover:bg-black transition-all">
        Comenzar Onboarding
      </a>
    </div>
  );
}
