'use client';

import { useState } from 'react';
import { ALL_DIMENSIONS } from '../onboarding/constants';
import { DNADiagram } from '../onboarding/components/DNADiagram';
import { useProfile } from '../../hooks/useProfile';

const CATEGORIES = [
  { cat: 'identity',   label: 'Identity'         },
  { cat: 'capital',    label: 'Human Capital'    },
  { cat: 'experience', label: 'Life Experience'  },
] as const;

export function DNAView() {
  const {
    scores, setScores, attributes, dbDimensions, loading, saving, saved, error, pct, filledCount,
    updateScores, addAttribute
  } = useProfile();

  const [selectedDimKey, setSelectedDimKey] = useState<string | null>(null);
  const [newAttrName, setNewAttrName] = useState('');
  const [addingAttr, setAddingAttr] = useState(false);

  const handleLocalScoreChange = (key: string, score: number) => {
    setScores(prev => ({ ...prev, [key]: score }));
  };

  const handleSave = async () => {
    await updateScores(scores);
  };

  const handleAddAttributeLocal = async (dimKey: string) => {
    if (!newAttrName.trim()) return;
    const dimDb = dbDimensions.find(d => d.name === dimKey);
    if (!dimDb) {
      alert('Error: No se encontró el ID de la dimensión');
      return;
    }

    setAddingAttr(true);
    const res = await addAttribute(dimDb.id, newAttrName, 'other');
    if (res.success) {
      setNewAttrName('');
    } else {
      alert('Error: ' + res.error);
    }
    setAddingAttr(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Perfil</h2>
        <p className="text-gray-500 mb-6 max-w-xs">{error === 'Not authenticated' ? 'Tu sesión ha expirado o no has iniciado sesión.' : error}</p>
        <a href="/login" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold">Ir al Login</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">Mi <span className="font-semibold text-gray-900 italic">ADN Vital</span></h1>
        <p className="mt-1 text-sm text-gray-400 font-medium">
          Tu huella única en las 19 dimensiones BEAN.
          Actualiza tu perfil moviendo los indicadores.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-6 flex items-center gap-8 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Completitud de Perfil</span>
            <span className="text-green-600 font-bold">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-green-500 transition-all duration-700 shadow-sm shadow-green-200"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-3xl font-light text-gray-900 leading-none">{filledCount}<span className="text-base font-normal text-gray-300 ml-1">/ {ALL_DIMENSIONS.length}</span></p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dimensiones</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8">
            <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-50/20 via-transparent to-transparent pointer-events-none" />
              <DNADiagram scores={scores} />

              <div className="mt-8 space-y-2">
                {CATEGORIES.map(({ cat, label }) => {
                  const colors: Record<string, string> = {
                    identity: 'bg-violet-500',
                    capital: 'bg-blue-500',
                    experience: 'bg-green-500',
                  };
                  const cColor = colors[cat] ?? 'bg-gray-500';
                  const dims = ALL_DIMENSIONS.filter((d: any) => d.cat === cat);
                  const avg = dims.reduce((s: number, d: any) => s + (scores[d.key] ?? 0), 0) / dims.length;
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${cColor}`} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                      </div>
                      <span className={`text-xs font-bold text-gray-900`}>{avg.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`mt-6 w-full rounded-2xl py-4 text-sm font-bold transition-all shadow-xl active:scale-95 ${
                saved
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/10'
              }`}>
              {saving ? 'Guardando…' : saved ? '✓ Perfil Guardado' : 'Guardar ADN'}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          {CATEGORIES.map(({ cat, label }) => {
            const colors: Record<string, { bg: string, text: string, border: string }> = {
              identity: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-100' },
              capital: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-100' },
              experience: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-100' },
            };
            const c = colors[cat] ?? { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-100' };
            const dims = ALL_DIMENSIONS.filter((d: any) => d.cat === cat);
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className={`text-xs font-bold uppercase tracking-widest opacity-30`}>{label}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {dims.map((dim: any) => {
                    const score = scores[dim.key] ?? 0;
                    const hasData = score > 0;
                    const dimAttributes = attributes.filter(a => 
                      a.dimension?.name === dim.key || a.dimensionId === dim.id
                    );

                    return (
                      <div key={dim.key} 
                        onClick={() => setSelectedDimKey(dim.key)}
                        className={`group relative rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-md ${
                          hasData ? `${c.border} bg-white` : 'border-gray-50 bg-gray-50/50'
                        }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-base flex-shrink-0">{dim.emoji}</span>
                            <span className={`text-xs font-semibold truncate ${hasData ? 'text-gray-900' : 'text-gray-400'}`}>
                              {dim.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Attributes Chips (Mini list) */}
                        {dimAttributes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {dimAttributes.slice(0, 3).map((attr, idx) => (
                              <span key={idx} className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                attr.category === 'skill' ? 'bg-blue-50 text-blue-600' : 
                                attr.category === 'interest' ? 'bg-orange-50 text-orange-600' :
                                attr.category === 'value' ? 'bg-violet-50 text-violet-600' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {attr.name}
                              </span>
                            ))}
                            {dimAttributes.length > 3 && (
                              <span className="text-[8px] font-bold text-gray-300">+{dimAttributes.length - 3}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Autopercepción</span>
                          <span className="text-[10px] font-bold text-gray-900">{Math.round(score)}%</span>
                        </div>
                        <input
                          type="range" min={0} max={100} step={1}
                          value={score}
                          onClick={(e) => e.stopPropagation()}
                          onChange={e => handleLocalScoreChange(dim.key, parseFloat(e.target.value))}
                          className={`w-full h-1 cursor-pointer accent-gray-900 opacity-60 hover:opacity-100 transition-opacity`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimension Detail Modal */}
      {selectedDimKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedDimKey(null)}>
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="p-8">
              {(() => {
                const dim = ALL_DIMENSIONS.find(d => d.key === selectedDimKey);
                const score = scores[selectedDimKey] ?? 0;
                const dimAttributes = attributes.filter(a => a.dimension?.name === selectedDimKey);
                if (!dim) return null;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-sm border border-gray-100">
                          {dim.emoji}
                        </div>
                        <div>
                          <h2 className="text-3xl font-light text-gray-900 tracking-tight leading-none">{dim.label}</h2>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{dim.cat}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-200" />
                             <span className="text-xs font-bold text-gray-900">Score: {Math.round(score)}%</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedDimKey(null)}
                        className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400">
                        ✕
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Atributos & Evidencia</h3>
                        {dimAttributes.length > 0 ? (
                          <div className="grid gap-3">
                            {dimAttributes.map((attr, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/30 group hover:border-gray-100 hover:bg-white transition-all shadow-sm hover:shadow-md">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-semibold text-gray-900">{attr.name}</span>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{attr.category}</span>
                                </div>
                                {attr.metadata && (
                                  <div className="text-right">
                                    {Object.entries(attr.metadata).map(([k, v]) => (
                                      <div key={k} className="text-[10px] font-medium text-gray-500">
                                        <span className="capitalize">{k}:</span> <span className="text-gray-900 font-bold">{String(v)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-sm text-gray-400 font-medium italic">No hay atributos definidos.</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Agregar Nuevo Atributo</h4>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Ej: Liderazgo, Python, Mindfulness..." 
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                            value={newAttrName}
                            onChange={e => setNewAttrName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddAttributeLocal(selectedDimKey)}
                          />
                          <button 
                            onClick={() => handleAddAttributeLocal(selectedDimKey)}
                            disabled={addingAttr || !newAttrName}
                            className="px-6 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold hover:bg-black disabled:opacity-50 transition-all uppercase tracking-widest">
                            {addingAttr ? '...' : 'Agregar'}
                          </button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                          Estos atributos influyen en tu puntuación de {dim.label}. Puedes editarlos desde el coach o agregando nueva evidencia de vida.
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
