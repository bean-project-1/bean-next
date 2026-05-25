'use client';

import { useState, useEffect, useRef } from 'react';
import { PermanentAIChat } from './PermanentAIChat';

interface LifePath {
  id?: string;
  title: string;
  emoji: string;
  alignment: number;
  tagline: string;
  description?: string;
  dimensionName?: string;
  reasons: string[];
  starterQuestion: string;
}

interface UserAttribute {
  name: string;
  category: string;
  dimension?: { label: string };
}

// ── Gradient palettes per card index ─────────────────────
const CARD_GRADIENTS = [
  {
    from: 'from-violet-500', to: 'to-indigo-600',
    light: 'bg-violet-50', text: 'text-violet-700',
    border: 'border-violet-200', bar: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700',
    glow: 'shadow-violet-200',
  },
  {
    from: 'from-emerald-500', to: 'to-teal-600',
    light: 'bg-emerald-50', text: 'text-emerald-700',
    border: 'border-emerald-200', bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    glow: 'shadow-emerald-200',
  },
  {
    from: 'from-orange-500', to: 'to-rose-500',
    light: 'bg-orange-50', text: 'text-orange-700',
    border: 'border-orange-200', bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700',
    glow: 'shadow-orange-200',
  },
];

// ─────────────────────────────────────────────────────────
// PathCard (carousel mini card)
// ─────────────────────────────────────────────────────────
function PathCard({
  path, index, onExplore, active
}: { path: LifePath; index: number; onExplore: (path: LifePath, idx: number) => void; active: boolean }) {
  const g = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <div
      className={`relative shrink-0 w-72 sm:w-80 h-[280px] rounded-[32px] overflow-hidden border transition-all duration-500 cursor-pointer select-none
        ${active ? `${g.border} shadow-2xl shadow-${g.glow} -translate-y-2` : 'border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1'}
        bg-white group`}
      onClick={() => onExplore(path, index)}
    >
      {/* Top Gradient Bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${g.from} ${g.to}`} />
      
      {/* Dimension Badge */}
      {path.dimensionName && (
        <div className="absolute top-5 right-5 z-10">
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter ${g.badge} backdrop-blur-md bg-opacity-90 shadow-sm`}>
            {path.dimensionName}
          </span>
        </div>
      )}

      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
            {path.emoji}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-slate-900 text-base leading-tight line-clamp-2">{path.title}</h3>
            <p className="text-[12px] font-medium text-slate-400 mt-0.5 truncate">{path.tagline}</p>
          </div>
        </div>

        {/* Description */}
        {path.description && (
          <p className="text-[12px] text-slate-500 line-clamp-3 mb-auto leading-relaxed font-medium">
            {path.description}
          </p>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ADN Match</span>
            <span className={`text-sm font-black ${g.text}`}>{path.alignment}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
            <div className={`h-full rounded-full ${g.bar} transition-all duration-1000 ease-out`} style={{ width: `${path.alignment}%` }} />
          </div>
        </div>

        <div className={`mt-4 pt-4 border-t border-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
           <span className={`text-[11px] font-bold ${g.text} flex items-center gap-1`}>
             Ver detalles <span className="text-base">→</span>
           </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PathDetailPanel (slide-in detail + dedicated chat)
// ─────────────────────────────────────────────────────────
function PathDetailPanel({
  path, index, onClose, onBranchCreated, onReplace
}: { 
  path: LifePath; 
  index: number; 
  onClose: () => void; 
  onBranchCreated: () => void;
  onReplace: (path: LifePath) => void;
}) {
  const g = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  // Use a path-specific chat context so each path has its own conversation
  const chatContext = `path_${path.title.toLowerCase().replace(/\s+/g, '_').slice(0, 30)}`;
  const starterMsg = `Quiero explorar el camino de vida: "${path.title}". ${path.starterQuestion}`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col sm:flex-row animate-in fade-in duration-200">
      {/* Backdrop (click to close on desktop) */}
      <div className="hidden sm:block absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — full-screen on mobile, slide-in from right on sm+ */}
      <div className="relative w-full sm:ml-auto sm:w-[480px] lg:w-[560px] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right-16 duration-300">

        {/* Header gradient band */}
        <div className={`h-1 w-full bg-gradient-to-r ${g.from} ${g.to} shrink-0`} />

        {/* Top bar */}
        <div className="shrink-0 px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-base shrink-0`}>
              {path.emoji}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-slate-900 truncate">{path.title}</h2>
              <p className="text-[10px] text-slate-400 truncate">{path.tagline}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {path.dimensionName && (
              <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${g.badge}`}>
                {path.dimensionName}
              </span>
            )}
            <span className={`text-[9px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600`}>
              {path.alignment}% alineado
            </span>
          </div>
        </div>

        {/* Path detail summary */}
        <div className="shrink-0 overflow-y-auto max-h-[40vh] p-4 bg-slate-50/50">
          {path.description && (
            <div className="mb-4">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{path.description}"
              </p>
            </div>
          )}

          <div className={`rounded-2xl ${g.light} border ${g.border} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${g.text}`}>Por qué este camino te va</p>
              <button 
                onClick={() => onReplace(path)}
                className="text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                ↻ Reemplazar idea
              </button>
            </div>
            <div className="space-y-2">
              {path.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-sm ${g.text} shrink-0 mt-px`}>✓</span>
                  <span className="text-xs text-slate-700 leading-relaxed">{r}</span>
                </div>
              ))}
            </div>

            {/* Alignment bar */}
            <div className="mt-3 pt-3 border-t border-white/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Alineación con tu ADN</span>
                <span className={`text-xs font-bold ${g.text}`}>{path.alignment}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/70 overflow-hidden">
                <div className={`h-full rounded-full ${g.bar} transition-all duration-1000`} style={{ width: `${path.alignment}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chat label */}
        <div className="shrink-0 px-5 pt-4 pb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coach — Exploración de este camino</p>
        </div>

        {/* Dedicated chat for this path */}
        <div className="flex-1 overflow-hidden">
          <PermanentAIChat
            context={chatContext}
            placeholder={`Pregunta sobre "${path.title}"...`}
            emptyStateMessage={`Exploremos juntos el camino de ${path.title} ✨`}
            initialMessage={starterMsg}
            onBranchCreated={onBranchCreated}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PathsCarousel
// ─────────────────────────────────────────────────────────
function PathsCarousel({ paths, onExplore, activePath }: {
  paths: LifePath[];
  onExplore: (path: LifePath, idx: number) => void;
  activePath: string | null;
}) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-6 overflow-x-auto pb-10 px-5 sm:px-8 snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {paths.map((path, i) => (
          <div key={i} className="snap-center first:pl-0 last:pr-20">
            <PathCard path={path} index={i} onExplore={onExplore} active={activePath === path.title} />
          </div>
        ))}
      </div>
      
      {/* Fade Edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// InsightsView (main)
// ─────────────────────────────────────────────────────────
export function InsightsView() {
  const [paths, setPaths] = useState<LifePath[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);
  const [pathsError, setPathsError] = useState(false);
  const [attributes, setAttributes] = useState<UserAttribute[]>([]);
  const [userName, setUserName] = useState('');
  const [branchCreated, setBranchCreated] = useState(false);
  // selectedPath = the path card that was clicked → opens detail panel
  const [selectedPath, setSelectedPath] = useState<{ path: LifePath; index: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/ai/insights/paths').then(r => r.json())
    ]).then(([profileJson, pathsJson]) => {
      if (profileJson.success) {
        setUserName(profileJson.data.user.name?.split(' ')[0] ?? '');
        setAttributes(profileJson.data.user.attributes || []);
      }
      if (pathsJson.success && pathsJson.paths?.length) {
        setPaths(pathsJson.paths);
      } else {
        setPathsError(true);
      }
    }).catch(() => setPathsError(true))
      .finally(() => setPathsLoading(false));
  }, []);

  const handleReplacePath = async (pathToReplace: LifePath) => {
    if (!pathToReplace.id) return;
    
    // Optimistic loading or just blocking interaction
    setPathsLoading(true);
    try {
      const res = await fetch('/api/ai/insights/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replaceId: pathToReplace.id })
      });
      const data = await res.json();
      if (data.success && data.path) {
        // Update the paths list, replacing the old one with the new one
        setPaths(prev => prev.map(p => p.id === pathToReplace.id ? data.path : p));
        setSelectedPath(null); // Close panel to refresh view
      }
    } catch (err) {
      console.error('Failed to replace path:', err);
    } finally {
      setPathsLoading(false);
    }
  };

  const handleRegeneratePaths = () => {
    setPathsLoading(true);
    setPathsError(false);
    fetch('/api/ai/insights/paths?regenerate=true').then(r => r.json())
      .then(d => { if (d.success && d.paths?.length) setPaths(d.paths); else setPathsError(true); })
      .catch(() => setPathsError(true))
      .finally(() => setPathsLoading(false));
  };

  const handleExplorePath = (path: LifePath, index: number) => {
    setSelectedPath({ path, index });
  };

  const attrSlice = (cat: string) => attributes.filter(a => a.category === cat).slice(0, 5);
  const skills = attrSlice('skill');
  const interests = attrSlice('interest');
  const values = attrSlice('value');

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24 sm:pb-0">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="shrink-0 px-5 sm:px-8 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💡</span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Insights{userName ? ` de ${userName}` : ''}
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Caminos de vida alineados con tu ADN.
            </p>
          </div>
          <a href="/home" className="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-4">
            🌳 Mi Árbol
          </a>
        </div>

        {/* DNA chips */}
        {attributes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((a, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">{a.name}</span>
            ))}
            {interests.map((a, i) => (
              <span key={i} className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">{a.name}</span>
            ))}
            {values.map((a, i) => (
              <span key={i} className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">{a.name}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Paths Carousel ──────────────────────────────── */}
      <div className="py-8 border-b border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-8 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">Caminos de Vida Sugeridos</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Proyecciones de IA basadas en tu ADN único</p>
          </div>
          {!pathsLoading && paths.length > 0 && (
            <button 
              onClick={handleRegeneratePaths} 
              className="text-xs font-bold text-violet-500 hover:text-violet-700 bg-violet-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 active:scale-95"
            >
              ↻ Regenerar todo
            </button>
          )}
        </div>

        {pathsLoading && (
          <div className="px-5 sm:px-8 flex gap-6 overflow-hidden">
            {[0, 1, 2].map(i => (
              <div key={i} className="shrink-0 w-72 sm:w-80 h-[280px] rounded-[32px] bg-slate-50 animate-pulse border border-slate-100" />
            ))}
          </div>
        )}

        {!pathsLoading && pathsError && (
          <div className="mx-5 sm:mx-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-2xl">🌱</div>
            <p className="text-slate-500 text-sm font-bold mb-4">
              {attributes.length === 0
                ? 'Agrega características en tu ADN para ver caminos sugeridos'
                : 'No pudimos proyectar caminos en este momento.'}
            </p>
            {attributes.length === 0 ? (
              <a href="/dna" className="inline-flex text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-2xl transition-all shadow-md active:scale-95">
                🧬 Completar mi ADN →
              </a>
            ) : (
              <button onClick={handleRegeneratePaths} className="inline-flex text-sm font-bold text-violet-600 bg-white border border-violet-200 px-6 py-3 rounded-2xl transition-all shadow-sm active:scale-95">
                ↻ Reintentar Proyección
              </button>
            )}
          </div>
        )}

        {!pathsLoading && !pathsError && paths.length > 0 && (
          <PathsCarousel
            paths={paths}
            onExplore={handleExplorePath}
            activePath={selectedPath?.path.title ?? null}
          />
        )}
      </div>

      {/* ── Global Coach Chat ───────────────────────────── */}
      <div className="flex items-center justify-between px-5 sm:px-8 pt-5 pb-2">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Coach de Insights</h2>
          <p className="text-xs text-slate-400 mt-0.5">Toca un camino para explorarlo en detalle, o escribe directamente.</p>
        </div>
      </div>

      {branchCreated && (
        <div className="mx-5 sm:mx-8 mb-2 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-700 font-semibold animate-in slide-in-from-top-2 duration-300">
          🌳 Nueva meta creada en tu árbol. <a href="/home" className="underline ml-1">Ver árbol →</a>
        </div>
      )}

      <div className="flex-1" style={{ minHeight: '50vh' }}>
        <PermanentAIChat
          context="insights"
          placeholder="Pregunta algo sobre tu camino de vida..."
          emptyStateMessage="Soy tu Agente de Insights ✨"
          onBranchCreated={() => setBranchCreated(true)}
        />
      </div>

      {/* ── Path Detail Panel (slide-in) ─────────────────── */}
      {selectedPath && (
        <PathDetailPanel
          path={selectedPath.path}
          index={selectedPath.index}
          onClose={() => setSelectedPath(null)}
          onReplace={handleReplacePath}
          onBranchCreated={() => {
            setBranchCreated(true);
            setSelectedPath(null);
          }}
        />
      )}
    </div>
  );
}
