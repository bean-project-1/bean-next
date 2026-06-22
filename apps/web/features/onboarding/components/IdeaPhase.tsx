'use client';

import { useState } from 'react';
import { OnboardingCard, PrimaryButton } from './shared';

interface Props {
  ideas: { title: string }[];
  onChange: (ideas: { title: string }[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  attributes?: { dimension: string; name: string }[];
}

export function IdeaPhase({ ideas, onChange, onSubmit, onBack, attributes }: Props) {
  const [text, setText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [showIdeas, setShowIdeas] = useState(ideas.length > 0);
  const [error, setError] = useState('');

  const getTopDimension = () => {
    if (!attributes || attributes.length === 0) return null;
    const counts: Record<string, number> = {};
    attributes.forEach(a => {
      counts[a.dimension] = (counts[a.dimension] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  };

  const topDim = getTopDimension();
  const coachMessage = topDim 
    ? `¡Impresionante! Basándonos en tu situación actual (especialmente tu perfil de "${topDim}"), ¿tienes algunas ideas o proyectos en mente que te gustaría sembrar en tu bosque? No tienen que ser metas formales, pueden ser deseos o curiosidades.`
    : `¡He revisado tu perfil! Para empezar a nutrir tu bosque, cuéntame algunas ideas, pasatiempos o proyectos que te gustaría explorar. Puedes ser tan vago o específico como quieras.`;

  const handleExtract = async () => {
    if (text.trim().length < 10) return;
    setIsExtracting(true);
    setError('');

    try {
      // Re-using extract-goals but conceptually they are ideas now
      const res = await fetch('/api/onboarding/extract-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, attributes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onChange(data.goals || []); // Data returns goals but we map to ideas state
      setShowIdeas(true);
    } catch (e: any) {
      console.error(e);
      setError('Hubo un problema procesando tus ideas. Intenta de nuevo.');
    } finally {
      setIsExtracting(false);
    }
  };

  const addManualIdea = () => {
    onChange([...ideas, { title: 'Nueva idea' }]);
  };

  const updateIdea = (idx: number, title: string) => {
    const newIdeas = [...ideas];
    newIdeas[idx] = { title };
    onChange(newIdeas);
  };

  const removeIdea = (idx: number) => {
    onChange(ideas.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-emerald-100 p-4 shadow-inner">
          <span className="text-3xl">🌱</span>
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Semillero de Ideas</h2>
        <p className="mt-3 text-stone-500 font-medium">
          Dinos qué te gustaría explorar. Lo guardaremos en tu incubadora de ideas.
        </p>
      </div>

      <OnboardingCard>
        <div className="mb-6 flex items-start gap-4">
          <div className="relative flex-shrink-0 mt-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <span className="text-lg">🤝</span>
            </div>
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex-1 rounded-xl rounded-tl-none bg-stone-50 border border-stone-100 px-5 py-4">
            <p className="text-sm text-stone-800 leading-relaxed font-medium">
              {coachMessage}
            </p>
          </div>
        </div>

        {!showIdeas ? (
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
              rows={4}
              placeholder="Ej: Quiero aprender a tocar guitarra, quizás emprender algún día, y mejorar mi nivel de inglés..."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-neutral-400 outline-none resize-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={onBack}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={handleExtract}
                disabled={text.trim().length < 10 || isExtracting}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-transtone-y-px disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExtracting ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> Pensando...</>
                ) : 'Extraer Semillas →'}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 text-center">
              <button 
                onClick={onSubmit}
                className="text-sm text-stone-400 hover:text-stone-600"
              >
                Saltar por ahora (Añadir ideas luego)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2 border-t border-stone-100">
            <div>
              <p className="text-sm font-bold text-stone-700 mb-3">Estas semillas se guardarán en tu incubadora:</p>
              
              <div className="space-y-3">
                {ideas.map((idea, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      🌱
                    </span>
                    <input
                      type="text"
                      value={idea.title}
                      onChange={e => updateIdea(idx, e.target.value)}
                      className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition-all focus:border-violet-500"
                    />
                    <button
                      onClick={() => removeIdea(idx)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {ideas.length < 5 && (
                <button
                  onClick={addManualIdea}
                  className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700"
                >
                  + Añadir otra idea
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowIdeas(false)}
                className="rounded-xl border border-stone-200 px-6 py-3 text-sm font-bold text-stone-500 hover:bg-stone-50 transition-all"
              >
                Reescribir
              </button>
              <PrimaryButton
                className="flex-1 py-3 text-lg"
                disabled={ideas.some(i => !i.title.trim())}
                onClick={onSubmit}
              >
                Entrar al Bosque ✨
              </PrimaryButton>
            </div>
          </div>
        )}
      </OnboardingCard>
    </div>
  );
}
