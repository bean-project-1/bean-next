'use client';

import { useState } from 'react';
import { OnboardingCard, BeanLogo, BackButton, InputField } from './shared';

interface Props {
  name: string;
  email: string;
  sleepHours: number;
  workSchedule: string;
  onChange: (data: { name?: string; email?: string; sleepHours?: number; workSchedule?: string }) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const WORK_OPTIONS = [
  { id: '9-5', label: 'Trabajo tiempo completo (9:00 - 17:00)', desc: '8 horas al día, lunes a viernes' },
  { id: 'study', label: 'Estudio de tiempo completo', desc: '6 horas al día, lunes a viernes' },
  { id: 'part-time', label: 'Trabajo parcial / Freelance', desc: '4 horas al día, flexible' },
  { id: 'none', label: 'Horario libre / Sin compromisos fijos', desc: 'Gestiono mi tiempo por completo' },
];

export function ExpressRoutinePhase({ name, email, sleepHours, workSchedule, onChange, onBack, onSubmit, isSubmitting }: Props) {
  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [sleep, setSleep] = useState(sleepHours);
  const [work, setWork] = useState(workSchedule || '9-5');

  const handleNameChange = (val: string) => {
    setUserName(val);
    onChange({ name: val });
  };

  const handleEmailChange = (val: string) => {
    setUserEmail(val);
    onChange({ email: val });
  };

  const handleSleepChange = (val: number) => {
    setSleep(val);
    onChange({ sleepHours: val });
  };

  const handleWorkSelect = (id: string) => {
    setWork(id);
    onChange({ workSchedule: id });
  };

  const canSubmit = userName.trim().length > 0 && userEmail.trim().length > 0 && !isSubmitting;

  return (
    <div className="w-full max-w-xl animate-fade-in">
      <BeanLogo />
      <BackButton onClick={onBack} />

      <div className="mb-8 text-center sm:text-left">
        <span className="text-4xl block mb-3">📅</span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight tracking-tight">
          Tu rutina y energía base
        </h1>
        <p className="mt-2 font-outfit text-sm text-stone-500 font-medium">
          Dinos cómo organizas tus días básicos para que la IA calcule tu disponibilidad de tiempo y evite el burnout.
        </p>
      </div>

      <OnboardingCard>
        {/* Account Details if not auto-filled */}
        <div className="space-y-4 mb-6">
          <InputField
            label="Tu nombre"
            value={userName}
            onChange={handleNameChange}
            placeholder="Ej. Juan Pérez"
            disabled={isSubmitting}
          />
          <InputField
            label="Tu correo electrónico"
            value={userEmail}
            onChange={handleEmailChange}
            placeholder="Ej. juan@example.com"
            disabled={!!email || isSubmitting} // Disable if pre-filled from auth session
          />
        </div>

        {/* Sleep Hours Slider */}
        <div className="mb-6 border-t border-stone-100 pt-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              💤 Horas de sueño al día
            </label>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">{sleep} horas</span>
          </div>
          <input
            type="range"
            min={4}
            max={12}
            step={0.5}
            value={sleep}
            onChange={e => handleSleepChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            disabled={isSubmitting}
          />
          <span className="flex justify-between text-[9px] font-black text-stone-400 mt-1.5 uppercase tracking-wider">
            <span>Menos descanso</span>
            <span>Ideal</span>
            <span>Más descanso</span>
          </span>
        </div>

        {/* Work / Study commitments */}
        <div className="mb-6 border-t border-stone-100 pt-5">
          <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">
            💼 Compromisos fijos principales
          </label>
          <div className="flex flex-col gap-2">
            {WORK_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleWorkSelect(opt.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-50/20 active:scale-[0.99] ${
                  work === opt.id
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
                    : 'border-stone-200 bg-white/40 text-stone-700'
                }`}
                disabled={isSubmitting}
              >
                <p className="font-extrabold text-stone-850 text-xs tracking-tight">{opt.label}</p>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full rounded-2xl bg-stone-900 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-stone-900/10 transition-all hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/20 hover:-translate-y-px active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Sembrando tu Bosque...
            </>
          ) : (
            'Crear mi Bosque y Plan de Vida ✨'
          )}
        </button>
      </OnboardingCard>
    </div>
  );
}
