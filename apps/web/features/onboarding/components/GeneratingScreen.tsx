// =======================================================
// BEAN — Generating Screen
// apps/web/features/onboarding/components/GeneratingScreen.tsx
// =======================================================
'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  'Analizando metas y ADN con IA...',
  'Configurando perfil de energía...',
  'Iniciando motor multi-agente...',
  'Agente 1: Analizando viabilidad...',
  'Agente 2: Estructurando fases...',
  'Agente 3: Desglosando subtareas...'
];

interface Props {
  name: string;
  step: number;
}

export function GeneratingScreen({ name, step }: Props) {
  const [active, setActive] = useState(0);

  // Sync state with parent step
  useEffect(() => {
    if (step > active) {
      setActive(step);
    }
  }, [step, active]);

  // For the final API call (creating the goal), animate sub-agent steps sequentially
  useEffect(() => {
    if (active >= 2 && active < STEPS.length - 1) {
      const interval = setInterval(() => {
        setActive(a => {
          if (a < STEPS.length - 1) {
            return a + 1;
          }
          clearInterval(interval);
          return a;
        });
      }, 3500); // 3.5 seconds per sub-agent step to match actual model generation latency
      return () => clearInterval(interval);
    }
  }, [active]);

  const firstName = name ? `, ${name.split(' ')[0]}` : '';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center animate-fade-in bg-stone-50/10">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-600/20 blur-3xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-2xl shadow-emerald-500/40">
            <span className="text-3xl font-black text-white">B</span>
          </div>
        </div>

        <h2 className="mb-2 font-serif text-3xl font-bold text-stone-900 leading-tight tracking-tight">
          Sembrando tu bosque{firstName}…
        </h2>
        <p className="mb-10 text-sm font-outfit text-stone-500 font-medium max-w-sm">
          Estamos procesando tus datos de vida para sembrar tus primeras metas y estructurar tu ADN.
        </p>

        {/* Custom Progress Bar */}
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-stone-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase tracking-widest text-stone-400">
            <span>Progreso</span>
            <span>{Math.round((active / (STEPS.length - 1)) * 100)}%</span>
          </div>
          
          <div className="w-full rounded-full bg-stone-100 h-2.5 overflow-hidden shadow-inner border border-stone-200/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <p className="text-xs font-bold text-emerald-800 bg-emerald-50/50 border border-emerald-100 px-4 py-2 rounded-xl text-center min-h-[36px] flex items-center justify-center">
            {STEPS[active]}
          </p>
        </div>
      </div>
    </div>
  );
}
