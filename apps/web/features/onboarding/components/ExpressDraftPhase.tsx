// =======================================================
// BEAN — Express Draft Phase (First Goal Review)
// apps/web/features/onboarding/components/ExpressDraftPhase.tsx
// =======================================================
'use client';

import React from 'react';
import { OnboardingCard } from './shared';
import { Sprout, CheckCircle2, Calendar, Target, HelpCircle } from 'lucide-react';

interface Task {
  name: string;
  description?: string;
  isLongTerm?: boolean;
  frequency?: { type: string; value: number };
  estimatedHours?: number;
}

interface Phase {
  phaseNumber: number;
  name: string;
  description?: string;
  milestone?: {
    title: string;
    description?: string;
  };
  tasks?: Task[];
}

interface Plan {
  name: string;
  phases: Phase[];
}

interface Props {
  plan: Plan | null;
  name: string;
  onPlant: () => void;
}

export function ExpressDraftPhase({ plan, name, onPlant }: Props) {
  const firstName = name ? ` ${name.split(' ')[0]}` : '';

  if (!plan) return null;

  return (
    <div className="w-full max-w-2xl animate-fade-in pb-10">
      <div className="mb-6 text-center sm:text-left">
        <span className="text-4xl block mb-2">🎯</span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight tracking-tight">
          Tu plan de metas personalizado, {firstName}
        </h1>
        <p className="mt-2 font-outfit text-sm text-stone-500 font-medium">
          El motor multi-agente de BEAN ha dividido tu meta en una estructura de desarrollo de 3 niveles. Revisa tu plan a continuación:
        </p>
      </div>

      <OnboardingCard>
        {/* Goal Title Header */}
        <div className="mb-6 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meta Principal</p>
              <h3 className="text-base font-extrabold text-stone-900 mt-0.5">{plan.name}</h3>
            </div>
          </div>
        </div>

        {/* Dynamic Timeline of Phases */}
        <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-100 mb-8">
          {plan.phases.map((phase, idx) => (
            <div key={idx} className="relative pl-12">
              {/* Number circle */}
              <div className="absolute left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 border-2 border-white text-xs font-black text-emerald-800 shadow-sm">
                {phase.phaseNumber || idx + 1}
              </div>

              <div>
                <h4 className="font-extrabold text-stone-850 text-sm tracking-tight">{phase.name}</h4>
                {phase.description && (
                  <p className="text-xs text-stone-400 font-medium mt-1 leading-relaxed">{phase.description}</p>
                )}

                {/* Tasks & Habits list inside phase */}
                {phase.tasks && phase.tasks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {phase.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2.5 rounded-xl border border-stone-200/50 bg-white/40 p-2.5">
                        <span className="text-xs mt-0.5" title={task.isLongTerm ? "Hábito" : "Tarea"}>
                          {task.isLongTerm ? '🔁' : '📋'}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-extrabold text-stone-800 leading-tight">{task.name}</p>
                          {task.description && (
                            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {task.isLongTerm && task.frequency && (
                              <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-100">
                                Hábito: {task.frequency.type === 'daily' ? 'Diario' : `${task.frequency.value}x por semana`}
                              </span>
                            )}
                            {task.estimatedHours && (
                              <span className="text-[9px] font-black uppercase bg-stone-50 text-stone-500 px-2 py-0.5 rounded-lg border border-stone-200/50">
                                {task.estimatedHours} horas/semana
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Milestone badge */}
                {phase.milestone && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/20 p-3">
                    <Target className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Hito de validación</p>
                      <p className="text-xs font-extrabold text-stone-800 mt-0.5 leading-snug">{phase.milestone.title}</p>
                      {phase.milestone.description && (
                        <p className="text-[10px] text-stone-500 font-semibold mt-0.5 leading-relaxed">{phase.milestone.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* BEAN Architecture Explainer Card */}
        <div className="mb-6 border-t border-stone-100 pt-5">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> ¿Cómo funciona este plan en BEAN?
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            <div className="rounded-xl border border-stone-200/50 bg-white/40 p-3">
              <p className="text-xs font-extrabold text-stone-800">🌳 Las Ramas</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-1 leading-normal">
                Son las fases lógicas del proyecto. Se verán como ramas principales en tu bosque interactivo.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200/50 bg-white/40 p-3">
              <p className="text-xs font-extrabold text-stone-800">🎯 Los Hitos</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-1 leading-normal">
                Puntos de control clave. Validarán tus avances y certificarán tu progreso en el árbol.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200/50 bg-white/40 p-3">
              <p className="text-xs font-extrabold text-stone-800">📅 La Agenda</p>
              <p className="text-[10px] text-stone-400 font-semibold mt-1 leading-normal">
                Las tareas y hábitos se sincronizan con tu calendario para asignarte horas de enfoque diarias.
              </p>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={onPlant}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-px active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          Sembrar Meta en mi Árbol de Vida 🌳
        </button>
      </OnboardingCard>
    </div>
  );
}
