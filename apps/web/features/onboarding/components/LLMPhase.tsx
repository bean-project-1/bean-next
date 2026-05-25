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
  const [copied, setCopied] = useState(false);

  const llmPrompt = `Genera un perfil estructurado y detallado de mi persona basándote en todo nuestro historial de conversación. Necesito que extraigas y deduzcas mi información en estas tres categorías principales:
1. IDENTIDAD: Mis valores, rasgos de personalidad, intereses y pasatiempos, y motivaciones.
2. CAPITAL HUMANO: Mis conocimientos, habilidades (blandas y técnicas), a qué me dedico profesionalmente, rutinas de salud física y resiliencia.
3. EXPERIENCIA DE VIDA: Satisfacción laboral, calidad de mis relaciones, bienestar mental, y compromisos actuales fijos (ej. horas de trabajo a la semana, rutinas).
Consolida todo en un resumen detallado de al menos 300 palabras.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(llmPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <BeanLogo />
      <BackButton onClick={onBack} />

      <span className="text-3xl block mb-3">🤖</span>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Trae tu perfil de IA</h1>
      <p className="text-sm text-slate-500 mb-6">
        Copia el siguiente mensaje, pégalo en tu LLM favorito (ChatGPT, Claude, etc.) donde ya tengas historial tuyo, y pega la respuesta abajo.
      </p>

      {/* Prompt Box */}
      <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 relative group">
        <p className="text-[13px] text-violet-900 leading-relaxed font-mono whitespace-pre-wrap pr-12">
          {llmPrompt}
        </p>
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300 transition-all shadow-sm"
          title="Copiar prompt"
        >
          {copied ? '✅' : '📋'}
        </button>
      </div>

      <OnboardingCard>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
          rows={8}
          placeholder="Pega aquí la respuesta que te dio ChatGPT o Claude..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-neutral-400 outline-none resize-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
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
