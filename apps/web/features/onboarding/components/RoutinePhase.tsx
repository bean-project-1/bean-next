'use client';

import { useState } from 'react';
import { OnboardingCard, PrimaryButton } from './shared';

interface Props {
  sleepHours: number;
  workSchedule: string;
  onChange: (data: { sleepHours: number; workSchedule: string }) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const SCHEDULE_OPTIONS = [
  { id: '9-5', label: 'Horario de Oficina (Ej. 9 a 5)' },
  { id: 'flexible', label: 'Flexible / Freelance' },
  { id: 'study', label: 'Estudiante (Horarios variados)' },
  { id: 'none', label: 'Sin horario fijo actual' },
];

export function RoutinePhase({ sleepHours, workSchedule, onChange, onSubmit, onBack }: Props) {
  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-indigo-100 p-4 shadow-inner">
          <span className="text-3xl">⏱️</span>
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Tu Tiempo Base</h2>
        <p className="mt-3 text-stone-500 font-medium">
          El tiempo es tu recurso más valioso. Definamos tu rutina básica para poder planear mejor.
        </p>
      </div>

      <OnboardingCard>
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-4">
              ¿Cuántas horas intentas dormir cada noche?
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="4" 
                max="12" 
                step="0.5"
                value={sleepHours || 8} 
                onChange={(e) => onChange({ sleepHours: parseFloat(e.target.value), workSchedule })}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <span className="text-xl font-bold text-violet-700 w-16 text-center">
                {sleepHours || 8} h
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-4">
              ¿Cuál describe mejor tu horario principal (trabajo o estudio)?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCHEDULE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ sleepHours, workSchedule: opt.id })}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    workSchedule === opt.id
                      ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-violet-300 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <button
            onClick={onBack}
            className="rounded-xl border border-stone-200 px-6 py-3 text-sm font-bold text-stone-500 hover:bg-stone-50 transition-all"
          >
            ← Atrás
          </button>
          <PrimaryButton
            className="flex-1 py-3 text-lg"
            disabled={!workSchedule}
            onClick={onSubmit}
          >
            Continuar →
          </PrimaryButton>
        </div>
      </OnboardingCard>
    </div>
  );
}
