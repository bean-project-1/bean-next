'use client';

import { useState } from 'react';
import { OnboardingCard, BeanLogo } from './shared';

interface Props {
  goalText: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onUseAdvanced: () => void;
}

const PRESETS = [
  { label: 'Estudiar programación 💻 y mejorar mi salud 💪', text: 'Quiero estudiar programación de forma constante, aprender nuevas tecnologías y mejorar mi salud física haciendo ejercicio regularmente y comiendo de forma más saludable.' },
  { label: 'Emprender un negocio 🚀 y manejar el estrés 🧘', text: 'Quiero emprender mi propio negocio digital, definir un plan de acción claro para mis primeros clientes y aprender técnicas para manejar el estrés y cuidar mi bienestar mental.' },
  { label: 'Aprender inglés 🇬🇧, ahorrar 💰 y comer más sano 🥦', text: 'Me gustaría mejorar mi nivel de inglés para postular a mejores trabajos, comenzar a ahorrar mensualmente para tener un colchón financiero y llevar una dieta más balanceada y sana.' },
  { label: 'Correr un maratón 🏃 y organizar mi tiempo libre 📅', text: 'Quiero entrenar de forma disciplinada para correr mi primer maratón de 10k o 21k, y aprender a organizar mejor mi tiempo libre para poder compartir más con mi familia.' },
];

export function ExpressGoalPhase({ goalText, onChange, onNext, onUseAdvanced }: Props) {
  const [text, setText] = useState(goalText);

  const handleSelectPreset = (presetText: string) => {
    setText(presetText);
    onChange(presetText);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    onChange(val);
  };

  const handleContinue = () => {
    if (text.trim().length >= 10) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <BeanLogo />

      <div className="mb-8 text-center sm:text-left">
        <span className="text-4xl block mb-3 justify-center sm:justify-start">🌱</span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 leading-tight tracking-tight">
          Diseña tu plan de vida en un minuto
        </h1>
        <p className="mt-2 font-outfit text-sm text-stone-500 font-medium">
          Dinos qué quieres lograr en este momento. La IA de BEAN estructurará tus metas y ADN de inmediato.
        </p>
      </div>

      <OnboardingCard>
        <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">
          Escribe tus metas o selecciona una sugerencia abajo:
        </label>
        
        <textarea
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          autoFocus
          rows={5}
          placeholder="Ej: Quiero aprender desarrollo frontend con React, empezar a ir al gimnasio 3 veces por semana y organizar mi presupuesto mensual para ahorrar..."
          className="w-full rounded-2xl border border-stone-200/60 bg-white/40 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none resize-none transition-all focus:border-emerald-500/60 focus:bg-white/80 focus:ring-1 focus:ring-emerald-500/40 font-medium"
        />
        <p className="mt-1 text-[9px] text-stone-400 text-right font-black uppercase tracking-tight">
          {text.trim().length} / 10 caracteres mínimo
        </p>

        {/* Presets */}
        <div className="mt-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">
            💡 Sugerencias rápidas (Haz clic para seleccionar)
          </p>
          <div className="flex flex-col gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p.text)}
                className={`w-full rounded-xl border p-3 text-left text-xs font-bold transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-50/20 active:scale-[0.99] ${
                  text === p.text 
                    ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 shadow-sm'
                    : 'border-stone-200 bg-white/40 text-stone-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={text.trim().length < 10}
          className="mt-6 w-full rounded-2xl bg-stone-900 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-stone-900/10 transition-all hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/20 hover:-translate-y-px active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          Siguiente: Mi Rutina y Datos →
        </button>

        <div className="mt-5 text-center border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={onUseAdvanced}
            className="text-xs font-black text-stone-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
          >
            ⚙️ Usar métodos avanzados (Quiz, CV)
          </button>
        </div>
      </OnboardingCard>
    </div>
  );
}
