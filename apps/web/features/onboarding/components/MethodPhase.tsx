// =======================================================
// BEAN — MethodPhase (Selection cards)
// apps/web/app/onboarding/_components/MethodPhase.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { BeanLogo } from './shared';
import { METHODS } from '../constants';
import type { Method } from '../types';

interface Props {
  name: string;
  onSelect: (m: Method) => void;
}

export function MethodPhase({ name, onSelect }: Props) {
  const [hovered, setHovered] = useState<Method | null>(null);
  const firstName = name ? `${name.split(' ')[0]}, ` : '';

  return (
    <div className="w-full max-w-2xl">
      <BeanLogo />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">
          {firstName}¿cómo quieres compartir tu información?
        </h1>
        <p className="mt-2 text-slate-500">
          Elige la forma que más te acomode. Todas llevan al mismo resultado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-all duration-200 ${
              hovered === m.id
                ? 'border-violet-500/50 bg-violet-600/10 shadow-lg shadow-violet-500/10 -translate-y-0.5'
                : 'border-slate-200 bg-white/[0.03]'
            }`}
          >
            {/* Badge */}
            <span className={`absolute top-4 right-4 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
              m.id === 'quiz'
                ? 'bg-violet-600/20 border-violet-500/30 text-violet-400'
                : 'bg-white border-slate-200 text-slate-500'
            }`}>
              {m.id === 'quiz' ? '★ ' : ''}{m.tag}
            </span>

            <span className="text-3xl">{m.emoji}</span>

            <div>
              <p className="font-semibold text-slate-900">{m.title}</p>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">{m.subtitle}</p>
            </div>

            <span className={`text-xs font-medium transition-colors ${
              hovered === m.id ? 'text-violet-400' : 'text-slate-400'
            }`}>
              Seleccionar →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
