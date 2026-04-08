// =======================================================
// BEAN — LLMPhase (Paste LLM profile text)
// apps/web/app/onboarding/_components/LLMPhase.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { BeanLogo, BackButton, OnboardingCard } from './shared';

interface Props {
  onDone: (text: string) => void;
  onBack: () => void;
  loading?: boolean;
}

export function LLMPhase({ onDone, onBack, loading }: Props) {
  const [text, setText] = useState('');

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />
      <BackButton onClick={onBack} />

      <span className="text-3xl block mb-3">🤖</span>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Trae tu perfil de IA</h1>
      <p className="text-sm text-slate-500 mb-6">
        Pide a ChatGPT/Claude:{' '}
        <span className="text-violet-400 italic">"Resúmeme mi perfil en 200 palabras"</span>{' '}
        y pega el resultado aquí.
      </p>

      <OnboardingCard>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
          rows={10}
          placeholder={
            'Pega aquí el resumen de tu LLM…\n\n' +
            'Ejemplo:\nEres un ingeniero de software con 5 años de experiencia, ' +
            'especializado en Python y machine learning. Te interesa el emprendimiento y el fitness…'
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-neutral-600 outline-none resize-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
        />
        <p className="mt-1.5 text-xs text-slate-400">{text.length} caracteres</p>

        <button
          onClick={() => onDone(text)}
          disabled={text.trim().length < 50 || loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Procesando con IA...
            </>
          ) : (
            'Continuar → Ver mi ADN de vida ✨'
          )}
        </button>
      </OnboardingCard>
    </div>
  );
}
