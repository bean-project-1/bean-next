'use client';

import { useState } from 'react';
import { DNADiagram } from './DNADiagram';
import { ALL_DIMENSIONS } from '../constants';
import type { FormData } from '../types';

interface Props {
  form: FormData;
  onFormChange?: (f: Partial<FormData>) => void;
  onSubmit: () => void;
}

const CATEGORIES = [
  { cat: 'identity',   label: 'Mi Esencia (Quién Soy)' },
  { cat: 'capital',    label: 'Mis Recursos (Qué Sé y Hago)' },
  { cat: 'experience', label: 'Mi Estilo de Vida (Cómo Vivo)' },
] as const;

export function ReviewPhase({ form, onFormChange, onSubmit }: Props) {
  const [addingDim, setAddingDim] = useState<string | null>(null);
  const [newTrait, setNewTrait] = useState('');
  
  // Aggregate all attributes by dimension
  const attributesByDim: Record<string, {name: string, source: string, id: string}[]> = {};
  const addAttr = (dim: string, name: string, source: string, id: string) => {
    if (!attributesByDim[dim]) attributesByDim[dim] = [];
    if (!attributesByDim[dim].some(a => a.name === name)) {
      attributesByDim[dim].push({ name, source, id });
    }
  };

  form.skills?.forEach((s, i) => addAttr('skills', s, 'quiz', `skill-${i}`));
  form.interests?.forEach((s, i) => addAttr('interests', s, 'quiz', `interest-${i}`));
  if (form.profession) addAttr('career', form.profession, 'quiz', 'prof');
  
  form.extractedAttributes?.forEach((a: any, i: number) => addAttr(
    a.dimension, 
    a.name, 
    a.category === 'user_added' ? 'user_added' : 'ai', 
    `ea-${i}`
  ));
  
  // Create an attributesCount mapping for the DNA Diagram
  const attributesCount: Record<string, number> = {};
  ALL_DIMENSIONS.forEach(d => {
    attributesCount[d.key] = attributesByDim[d.key]?.length || 0;
  });

  const filled = Object.values(attributesCount).filter(v => v > 0).length;

  const removeAttr = (dim: string, name: string, source: string) => {
    if (source === 'quiz') {
      if (dim === 'skills') onFormChange?.({ skills: form.skills.filter(s => s !== name) });
      if (dim === 'interests') onFormChange?.({ interests: form.interests.filter(s => s !== name) });
      if (dim === 'career') onFormChange?.({ profession: '' });
    } else if (source === 'ai' || source === 'user_added') {
      onFormChange?.({ extractedAttributes: form.extractedAttributes?.filter((a: any) => !(a.dimension === dim && a.name === name)) });
    }
  };

  const submitNewTrait = (dim: string) => {
    if (!newTrait.trim()) return;
    const trait = { dimension: dim, name: newTrait.trim(), category: 'user_added', metadata: {} };
    onFormChange?.({ extractedAttributes: [...(form.extractedAttributes || []), trait] });
    setNewTrait('');
    setAddingDim(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Tu ADN de vida</h1>
        <p className="mt-2 text-stone-500">
          Así es como BEAN te ve basado en tus respuestas. Revisa tus características.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* ── DNA Panel (Left Column) ── */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8 space-y-6 w-full max-w-[280px]">
            {/* Diagrama */}
            <div className="relative rounded-[2rem] border border-stone-100 bg-white p-8 shadow-2xl shadow-stone-200/40 overflow-hidden w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/10 via-transparent to-transparent pointer-events-none" />
              <DNADiagram attributesCount={attributesCount} />

              <div className="mt-8 space-y-2.5">
                {CATEGORIES.map(({ cat, label }) => {
                  const colors: Record<string, string> = {
                    identity: 'bg-violet-500',
                    capital: 'bg-blue-500',
                    experience: 'bg-emerald-500',
                  };
                  const cColor = colors[cat] ?? 'bg-stone-500';
                  const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);
                  const catCount = dims.reduce((s: number, d: any) => s + (attributesCount[d.key] ?? 0), 0);
                  
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${cColor}`} />
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">{label.split(' ')[0]}</span>
                      </div>
                      <span className={`text-xs font-bold text-stone-800`}>{catCount} destellos ✨</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🏆 Logros y Medallas */}
            <div className="p-6 rounded-[2rem] border border-stone-100 bg-white shadow-md shadow-stone-100/50 space-y-4 w-full">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-1.5 border-b border-stone-50 pb-2">
                🏆 Logros del Ser
              </h4>
              
              <div className="space-y-3">
                {/* Primer Destello */}
                <div className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                  filled > 0 
                    ? 'bg-amber-50/40 border-amber-100 text-amber-900 shadow-sm shadow-amber-500/5' 
                    : 'bg-stone-50/50 border-stone-100 text-stone-300 opacity-50'
                }`}>
                  <span className="text-xl">🌟</span>
                  <div>
                    <p className="text-xs font-black">Primer Destello</p>
                    <p className="text-[8px] text-stone-400 font-bold uppercase tracking-tight">
                      {filled > 0 ? '¡Desbloqueado!' : 'Agrega tu primer atributo'}
                    </p>
                  </div>
                </div>

                {/* Brújula Calibrada */}
                {(() => {
                  const hasCareer = (attributesCount['career'] || 0) > 0 || !!form.profession;
                  return (
                    <div className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                      hasCareer 
                        ? 'bg-indigo-50/40 border-indigo-100 text-indigo-900 shadow-sm shadow-indigo-500/5' 
                        : 'bg-stone-50/50 border-stone-100 text-stone-300 opacity-50'
                    }`}>
                      <span className="text-xl">🎯</span>
                      <div>
                        <p className="text-xs font-black">Brújula Calibrada</p>
                        <p className="text-[8px] text-stone-400 font-bold uppercase tracking-tight">
                          {hasCareer ? '¡Desbloqueado!' : 'Optimiza tu CV'}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Mente en Paz */}
                {(() => {
                  const hasWellbeing = ['mental_wellbeing', 'relationships', 'physical_health'].some(k => (attributesCount[k] || 0) > 0);
                  return (
                    <div className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                      hasWellbeing 
                        ? 'bg-violet-50/40 border-violet-100 text-violet-900 shadow-sm shadow-violet-500/5' 
                        : 'bg-stone-50/50 border-stone-100 text-stone-300 opacity-50'
                    }`}>
                      <span className="text-xl">🧘</span>
                      <div>
                        <p className="text-xs font-black">Mente en Paz</p>
                        <p className="text-[8px] text-stone-400 font-bold uppercase tracking-tight">
                          {hasWellbeing ? '¡Desbloqueado!' : 'Salud y bienestar'}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>

        {/* ── Dimension List (Right Column) ── */}
        <div className="flex-1 space-y-8">
          {CATEGORIES.map(({ cat, label }) => {
            const colors: Record<string, { bg: string, text: string, border: string }> = {
              identity: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-100' },
              capital: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-100' },
              experience: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-100' },
            };
            const c = colors[cat] ?? { bg: 'bg-stone-500', text: 'text-stone-600', border: 'border-stone-100' };
            const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);

            return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className={`text-xs font-bold uppercase tracking-widest opacity-30`}>{label}</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {dims.map(dim => {
                    const count = attributesCount[dim.key] ?? 0;
                    const hasData = count > 0;
                    const attrs = attributesByDim[dim.key] || [];

                    return (
                      <div key={dim.key} className={`group relative rounded-[2rem] border p-5 transition-all shadow-sm ${
                        hasData ? `${c.border} bg-white border-stone-150/70` : 'border-dashed border-stone-200/50 bg-stone-50/40 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="text-lg flex-shrink-0">{dim.emoji}</span>
                            <span className={`text-xs font-black truncate ${hasData ? 'text-stone-850' : 'text-stone-400'}`}>
                              {dim.label}
                            </span>
                          </div>
                          {hasData && (
                            <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                              {count} items
                            </span>
                          )}
                        </div>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-2 mt-3">
                          {attrs.map((attr, idx) => (
                            <div key={`${attr.id}-${idx}`} className={`group/chip relative flex items-center gap-1.5 rounded-xl px-2.5 py-1 border transition-colors hover:border-red-200 ${hasData ? 'bg-stone-50 border-stone-100' : ''}`}>
                              {attr.source === 'ai' && <span className="text-[9px] uppercase font-bold text-violet-400">✨</span>}
                              {attr.source === 'user_added' && <span className="text-[9px] uppercase font-bold text-emerald-500">TÚ</span>}
                              <span className="text-[10px] font-semibold text-stone-700">{attr.name}</span>
                              <button 
                                onClick={() => removeAttr(dim.key, attr.name, attr.source)}
                                className="ml-1 text-stone-300 hover:text-red-500 transition-colors"
                                title="Eliminar"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          
                          {/* Add manual trait button/input */}
                          {addingDim === dim.key ? (
                            <div className="flex items-center gap-1.5 mt-1 w-full">
                              <input
                                autoFocus
                                type="text"
                                value={newTrait}
                                onChange={e => setNewTrait(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && submitNewTrait(dim.key)}
                                placeholder="Nuevo..."
                                className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-[10px] text-stone-700 outline-none focus:border-indigo-400 flex-1"
                              />
                              <button onClick={() => submitNewTrait(dim.key)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800">OK</button>
                              <button onClick={() => { setAddingDim(null); setNewTrait(''); }} className="text-[10px] text-stone-400 hover:text-stone-600">✕</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingDim(dim.key)}
                              className="flex items-center gap-1 rounded-xl border border-dashed border-stone-300 px-2.5 py-1 text-[10px] font-medium text-stone-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors mt-1"
                            >
                              + Añadir
                            </button>
                          )}
                        </div>

                        {!hasData && (
                          <p className="text-[9px] text-stone-400 font-medium italic mt-2">
                            Añade tus características.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Submit CTA ── */}
          <div className="sticky bottom-6 pt-4">
            <button
              onClick={onSubmit}
              className="w-full rounded-[2rem] bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:-transtone-y-0.5 hover:shadow-indigo-500/30 hover:bg-indigo-700"
            >
              Confirmar mi ADN y Continuar ✨
            </button>
            <p className="mt-3 text-center text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Podrás agregar o modificar más adelante en tu perfil.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
