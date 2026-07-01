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

      <div className="mb-8 text-center sm:text-left">
        <h1 className="font-serif text-3xl font-bold text-stone-900 leading-tight tracking-tight">
          {firstName}¿cómo quieres compartir tu información?
        </h1>
        <p className="mt-2 font-outfit text-sm text-stone-500 font-medium">
          Elige la forma que más te acomode. Ambas llevan al mismo resultado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-all duration-200 active:scale-[0.99] ${
              hovered === m.id
                ? 'border-violet-500/50 bg-violet-50/20 shadow-lg shadow-violet-500/5 -translate-y-0.5'
                : 'border-stone-200 bg-white/40'
            }`}
          >
            {/* Badge */}
            <span className={`absolute top-4 right-4 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
              m.id === 'quiz'
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'bg-white border-stone-200 text-stone-500'
            }`}>
              {m.id === 'quiz' ? '★ ' : ''}{m.tag}
            </span>

            <span className="text-3xl">{m.emoji}</span>

            <div>
              <p className="font-extrabold text-stone-900 text-sm tracking-tight">{m.title}</p>
              <p className="mt-1 text-xs text-stone-500 leading-relaxed font-semibold">{m.subtitle}</p>
            </div>

            <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
              hovered === m.id ? 'text-violet-750' : 'text-stone-400'
            }`}>
              Seleccionar →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
