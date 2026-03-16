// =======================================================
// BEAN — Generating Screen
// apps/web/app/onboarding/_components/GeneratingScreen.tsx
// =======================================================
'use client';

import { useState, useEffect } from 'react';

const DIMS = ['Identity', 'Capital', 'Wellbeing', 'Insights', 'Trajectory'];

export function GeneratingScreen({ name }: { name: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a < DIMS.length - 1 ? a + 1 : a)), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Animated logo */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/40">
          <span className="text-3xl font-bold text-white">B</span>
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-bold text-white">
        Construyendo tu perfil BEAN{name ? `, ${name.split(' ')[0]}` : ''}…
      </h2>
      <p className="mb-10 text-sm text-neutral-400">
        Nuestro motor analiza tus 19 dimensiones de vida
      </p>

      {/* Dimension progress */}
      <div className="w-full max-w-xs space-y-3">
        {DIMS.map((d, i) => (
          <div key={d} className="flex items-center gap-3">
            <div className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-300 ${
              i <= active ? 'bg-violet-400' : 'bg-white/20'
            }`} />
            <div className="flex-1 rounded-full bg-white/8 h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
                style={{ width: i < active ? '100%' : i === active ? '65%' : '0%' }}
              />
            </div>
            <span className={`text-xs w-16 text-left transition-colors duration-300 ${
              i <= active ? 'text-violet-300' : 'text-neutral-600'
            }`}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
