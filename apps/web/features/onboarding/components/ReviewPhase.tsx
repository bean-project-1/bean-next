// =======================================================
// BEAN — ReviewPhase (DNA + Dimension completion)
// apps/web/app/onboarding/_components/ReviewPhase.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { DNADiagram } from './DNADiagram';
import { ALL_DIMENSIONS, CAT_COLORS } from '../constants';
import type { FormData } from '../types';

interface Props {
  form: FormData;
  onFormChange?: (f: Partial<FormData>) => void;
  onSubmit: () => void;
}

const CATEGORIES = [
  { cat: 'identity',   label: 'Identity' },
  { cat: 'capital',    label: 'Human Capital' },
  { cat: 'experience', label: 'Life Experience' },
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
  const pct = Math.round((filled / ALL_DIMENSIONS.length) * 100);

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
    <div className="w-full max-w-5xl">
      {/* ── Header ── */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Tu ADN de vida</h1>
        <p className="mt-2 text-slate-500">
          Así es como BEAN te ve basado en tus respuestas. Revisa tus características.
        </p>
      </div>

      {/* ── Completeness bar ── */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white/[0.03] px-6 py-4 flex items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-900">Dimensiones descubiertas</span>
            <span className="text-sm font-bold text-violet-400">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-2xl font-bold text-slate-900">
            {filled}<span className="text-slate-500 text-base font-normal">/{ALL_DIMENSIONS.length}</span>
          </p>
          <p className="text-xs text-slate-500">Dimensiones</p>
        </div>
      </div>

      {/* ── Main layout: DNA + List ── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── DNA Panel ── */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8">
            <div className="relative rounded-2xl border border-slate-200 bg-white/[0.03] p-6 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 via-blue-600/5 to-emerald-600/5" />
              <DNADiagram attributesCount={attributesCount} />

              {/* Legend */}
              <div className="mt-4 space-y-1.5">
                {CATEGORIES.map(({ cat, label }) => {
                  const c = CAT_COLORS[cat];
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                      <span className="text-xs text-slate-500">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {CATEGORIES.map(({ cat, label }) => {
                const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);
                const catFilled = dims.filter(d => attributesCount[d.key] > 0).length;
                const c = CAT_COLORS[cat];
                return (
                  <div key={cat} className="rounded-xl border border-slate-200 bg-white/[0.03] p-3">
                    <p className={`text-lg font-bold ${c.text}`}>{catFilled}/{dims.length}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Dimension List ── */}
        <div className="flex-1 space-y-6">
          {CATEGORIES.map(({ cat, label }) => {
            const c = CAT_COLORS[cat];
            const dims = ALL_DIMENSIONS.filter(d => d.cat === cat);

            return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                  <h2 className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{label}</h2>
                </div>

                <div className="space-y-3">
                  {dims.map(dim => {
                    const count = attributesCount[dim.key] ?? 0;
                    const hasData = count > 0;
                    const attrs = attributesByDim[dim.key] || [];

                    return (
                      <div key={dim.key} className={`rounded-xl border p-4 transition-all ${
                        hasData ? `${c.border} bg-white shadow-sm` : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}>
                        {/* Row header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{dim.emoji}</span>
                            <span className={`text-sm font-bold ${hasData ? 'text-slate-900' : 'text-slate-500'}`}>
                              {dim.label}
                            </span>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${hasData ? c.text : 'text-slate-400'}`}>
                            {hasData ? `${count} atributos` : 'Sin datos'}
                          </span>
                        </div>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {attrs.map((attr, idx) => (
                            <div key={`${attr.id}-${idx}`} className="group relative flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-100 pr-8 transition-colors hover:border-red-200">
                              {attr.source === 'ai' && <span className="text-[10px] uppercase font-bold text-violet-400">✨ IA</span>}
                              {attr.source === 'user_added' && <span className="text-[10px] uppercase font-bold text-emerald-500">TÚ</span>}
                              <span className="text-xs font-semibold text-slate-700">{attr.name}</span>
                              <button 
                                onClick={() => removeAttr(dim.key, attr.name, attr.source)}
                                className="absolute right-1 p-1 hover:text-red-500 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Eliminar atributo"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          
                          {/* Add manual trait button/input */}
                          {addingDim === dim.key ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={newTrait}
                                onChange={e => setNewTrait(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && submitNewTrait(dim.key)}
                                placeholder="Escribe aquí..."
                                className="rounded-lg border border-violet-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 w-32"
                              />
                              <button onClick={() => submitNewTrait(dim.key)} className="text-xs font-bold text-violet-600 hover:text-violet-800">OK</button>
                              <button onClick={() => { setAddingDim(null); setNewTrait(''); }} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingDim(dim.key)}
                              className="flex items-center gap-1 rounded-lg border border-dashed border-slate-300 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-violet-300 hover:text-violet-600 transition-colors"
                            >
                              + Añadir
                            </button>
                          )}
                        </div>

                        {!hasData && (
                          <p className="text-[10px] text-slate-400 font-medium italic">
                            La IA no encontró datos aquí. ¡Añade los tuyos!
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
          <div className="sticky bottom-6 pt-2">
            <button
              onClick={onSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-2xl shadow-violet-500/30 transition-all hover:-translate-y-0.5 hover:shadow-violet-500/50"
            >
              Generar mi perfil BEAN ✨
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Podrás agregar o modificar tus características más adelante.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
