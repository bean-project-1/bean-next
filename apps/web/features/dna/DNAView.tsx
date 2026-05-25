'use client';

import { useState, useEffect } from 'react';
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
    dbDimensions, loading: profileLoading, error: profileError
  } = useProfile();

  const [identity, setIdentity] = useState<any>(null);
  const [loadingIdentity, setLoadingIdentity] = useState(true);
  const [selectedDimKey, setSelectedDimKey] = useState<string | null>(null);
  const [commitments, setCommitments] = useState<any[]>([]);
  const [loadingCommitments, setLoadingCommitments] = useState(true);

  useEffect(() => {
    fetch('/api/dna/identity')
      .then(r => r.json())
      .then(json => {
        if (json.success) setIdentity(json.identity);
      })
      .finally(() => setLoadingIdentity(false));

    fetch('/api/profile/commitments')
      .then(r => r.json())
      .then(json => {
        if (json.success) setCommitments(json.commitments);
      })
      .finally(() => setLoadingCommitments(false));
  }, []);

  const attributesCount = ALL_DIMENSIONS.reduce((acc, dim) => {
    const dimData = identity?.[dim.key]?.identity;
    acc[dim.key] = (dimData?.assets?.length || 0) + (dimData?.current?.length || 0) + (dimData?.history?.length || 0);
    return acc;
  }, {} as Record<string, number>);

  const filledCount = Object.values(attributesCount).filter(c => c > 0).length;
  const pct = Math.round((filledCount / ALL_DIMENSIONS.length) * 100);

  if (profileLoading || loadingIdentity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Perfil</h2>
        <p className="text-gray-500 mb-6 max-w-xs">{profileError === 'Not authenticated' ? 'Tu sesión ha expirado o no has iniciado sesión.' : profileError}</p>
        <a href="/login" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold">Ir al Login</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 bg-white pb-24 sm:pb-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">Identidad <span className="font-semibold text-gray-900 italic">ADN Vital</span></h1>
        <p className="mt-1 text-sm text-gray-400 font-medium">
          La colección de tus experiencias, activos y compromisos que definen quién eres.
        </p>
      </div>

      <div className="mb-6 sm:mb-8 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Exploración de Identidad</span>
            <span className="text-green-600 font-bold">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-green-500 transition-all duration-700 shadow-sm shadow-green-200"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-3xl font-light text-gray-900 leading-none">{filledCount}<span className="text-base font-normal text-gray-300 ml-1">/ {ALL_DIMENSIONS.length}</span></p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Áreas de Vida</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="sticky top-8">
            <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-50/20 via-transparent to-transparent pointer-events-none" />
              <DNADiagram attributesCount={attributesCount} />

              <div className="mt-8 space-y-2">
                {CATEGORIES.map(({ cat, label }) => {
                  const colors: Record<string, string> = {
                    identity: 'bg-violet-500',
                    capital: 'bg-blue-500',
                    experience: 'bg-green-500',
                  };
                  const cColor = colors[cat] ?? 'bg-gray-500';
                  const dims = ALL_DIMENSIONS.filter((d: any) => d.cat === cat);
                  const catCount = dims.reduce((s: number, d: any) => s + (attributesCount[d.key] ?? 0), 0);
                  
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${cColor}`} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                      </div>
                      <span className={`text-xs font-bold text-gray-900`}>{catCount} hitos</span>
                    </div>
                  );
                })}
              </div>
            </div>
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
                    const dimData = identity?.[dim.key]?.identity;
                    const hasData = (attributesCount[dim.key] || 0) > 0;

                    return (
                      <div key={dim.key} 
                        onClick={() => setSelectedDimKey(dim.key)}
                        className={`group relative rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-md ${
                          hasData ? `${c.border} bg-white shadow-sm` : 'border-gray-50 bg-gray-50/50 opacity-40'
                        }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-base flex-shrink-0">{dim.emoji}</span>
                            <span className={`text-xs font-bold truncate ${hasData ? 'text-gray-900' : 'text-gray-400'}`}>
                              {dim.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Summary Narrative */}
                        {hasData ? (
                          <div className="space-y-1">
                            {dimData?.current?.[0] && (
                              <p className="text-[10px] font-medium text-slate-800 truncate">
                                💼 Actual: {dimData.current[0].title}
                              </p>
                            )}
                            {dimData?.history?.[0] && (
                              <p className="text-[10px] text-slate-400 truncate italic">
                                🎓 Previo: {dimData.history[0].title}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dimData?.assets?.slice(0, 2).map((asset: any, idx: number) => (
                                <span key={idx} className="bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
                                  {asset.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-2">
                            Territorio inexplorado
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Base Commitments Section */}
      <div className="mt-16 pt-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900 tracking-tight">
              Compromisos <span className="font-semibold text-gray-900 italic">Base</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">Tus actividades recurrentes y carga de vida fija.</p>
          </div>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {['work', 'study', 'routine'].map(type => {
            const typeCommitments = commitments.filter(c => c.type === type);
            const icons: any = { work: '💼', study: '📚', routine: '🔄' };
            const labels: any = { work: 'Trabajo', study: 'Estudio', routine: 'Rutinas' };
            
            return (
              <div key={type} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xs">{icons[type]}</span> {labels[type]}
                  </h3>
                  <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">{typeCommitments.length}</span>
                </div>
                <div className="space-y-3">
                  {loadingCommitments ? (
                    [1, 2].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-50 animate-pulse" />)
                  ) : typeCommitments.length > 0 ? (
                    typeCommitments.map((c, idx) => {
                      return (
                        <div key={idx} className="group p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8px] font-black text-violet-500 bg-violet-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">{c.dimension?.label || 'General'}</span>
                            <span className="text-[9px] font-bold text-gray-300">Fijo</span>
                          </div>
                          <h4 className="text-sm font-black text-gray-800 group-hover:text-violet-600 transition-colors">{c.title}</h4>
                          <div className="mt-4 flex items-center justify-between text-[10px] font-bold border-t border-gray-50 pt-3">
                            <span className="text-gray-400 uppercase tracking-tighter">
                              ⏱️ {c.startTime && c.endTime ? `${c.startTime} - ${c.endTime} (${c.hoursPerDay}h)` : `${c.hoursPerDay}h / día`} {c.commuteHours > 0 && <span className="text-emerald-500">(+{c.commuteHours}h traslado)</span>}
                            </span>
                            <span className="text-gray-400 uppercase tracking-tighter">📅 {c.daysOfWeek.length} días</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 rounded-3xl border-2 border-dashed border-gray-50 text-center">
                      <p className="text-[10px] font-bold text-gray-300 italic">Sin {labels[type].toLowerCase()} activos</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Dimension Detail Modal */}
      {selectedDimKey && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedDimKey(null)}>
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90dvh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-8">
              {(() => {
                const dim = ALL_DIMENSIONS.find(d => d.key === selectedDimKey);
                if (!dim) return null;
                const dimData = identity?.[selectedDimKey]?.identity;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-3xl shadow-sm border border-slate-100">
                          {dim.emoji}
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{dim.label}</h2>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">{dim.cat}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedDimKey(null)}
                        className="h-10 w-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors text-slate-300">
                        ✕
                      </button>
                    </div>

                    <div className="space-y-10">
                      {/* Current & Intent */}
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Compromiso Actual</h3>
                          {dimData?.current?.length > 0 ? (
                            <div className="space-y-3">
                              {dimData.current.map((c: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{c.type}</span>
                                  <h4 className="text-sm font-black text-slate-800">{c.title}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                                    {c.startTime && c.endTime ? `${c.startTime} - ${c.endTime} (${c.hoursPerDay}h)` : `${c.hoursPerDay}h / día`} {c.commuteHours > 0 && <span className="text-emerald-500 font-black">(+{c.commuteHours}h)</span>}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-50 text-center">
                              <p className="text-[10px] font-bold text-slate-300 italic">Sin actividad recurrente</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Intención Futura</h3>
                          {dimData?.intent?.length > 0 ? (
                            <div className="space-y-3">
                              {dimData.intent.map((i: any, idx: number) => (
                                <div key={idx} className="p-4 rounded-2xl bg-green-50/30 border border-green-100/50">
                                  <h4 className="text-sm font-black text-green-900">{i.title}</h4>
                                  <div className="mt-2 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${i.progress}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-50 text-center">
                              <p className="text-[10px] font-bold text-slate-300 italic">Sin metas activas</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assets / Skills */}
                      <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Activos & Atributos</h3>
                        <div className="flex flex-wrap gap-2">
                          {dimData?.assets?.length > 0 ? (
                            dimData.assets.map((a: any, idx: number) => (
                              <div key={idx} className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-violet-400" />
                                <span className="text-xs font-bold text-slate-700">{a.name}</span>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{a.level}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No hay atributos definidos.</p>
                          )}
                        </div>
                      </div>

                      {/* History Timeline */}
                      {dimData?.history?.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Historia & Legado</h3>
                          <div className="space-y-6 border-l-2 border-slate-100 ml-2 pl-8">
                            {dimData.history.map((h: any, idx: number) => (
                              <div key={idx} className="relative">
                                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 mb-1 block">
                                  {new Date(h.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase()}
                                </span>
                                <h4 className="text-sm font-black text-slate-800">{h.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1">{h.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-8 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed text-center uppercase tracking-tighter">
                          Esta es la huella de tu identidad en {dim.label}. <br/>
                          Se actualiza automáticamente con tus acciones, logros y compromisos.
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
