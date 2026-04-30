'use client';

import { useState, useEffect, useRef } from 'react';
import { PermanentAIChat } from './PermanentAIChat';

interface LifePath {
  title: string;
  emoji: string;
  alignment: number;
  tagline: string;
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
      className={`relative shrink-0 w-64 sm:w-72 rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer select-none
        ${active ? `${g.border} shadow-xl shadow-${g.glow} scale-[1.02]` : 'border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.01]'}
        bg-white`}
      onClick={() => onExplore(path, index)}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${g.from} ${g.to}`} />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-xl shadow-md`}>
            {path.emoji}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{path.title}</h3>
            <p className="text-[11px] text-slate-400 truncate">{path.tagline}</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Alineación</span>
            <span className={`text-xs font-bold ${g.text}`}>{path.alignment}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${g.bar} transition-all duration-700`} style={{ width: `${path.alignment}%` }} />
          </div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onExplore(path, index); }}
          className={`w-full py-2 bg-gradient-to-r ${g.from} ${g.to} text-white text-[11px] font-bold rounded-xl transition-all hover:opacity-90 active:scale-95`}
        >
          Explorar →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PathDetailPanel (slide-in detail + dedicated chat)
// ─────────────────────────────────────────────────────────
function PathDetailPanel({
  path, index, onClose, onBranchCreated
}: { path: LifePath; index: number; onClose: () => void; onBranchCreated: () => void }) {
  const g = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  // Use a path-specific chat context so each path has its own conversation
  const chatContext = `path_${path.title.toLowerCase().replace(/\s+/g, '_').slice(0, 30)}`;
  const starterMsg = `Quiero explorar el camino de vida: "${path.title}". ${path.starterQuestion}`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col sm:flex-row animate-in fade-in duration-200">
      {/* Backdrop (click to close on desktop) */}
      <div className="hidden sm:block absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative sm:ml-auto w-full sm:w-[480px] lg:w-[560px] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-right-8 sm:slide-in-from-right-16 duration-300">

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
          <span className={`ml-auto shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${g.badge}`}>
            {path.alignment}% alineado
          </span>
        </div>

        {/* Path detail summary */}
        <div className={`shrink-0 mx-4 mt-4 rounded-2xl ${g.light} border ${g.border} p-4`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${g.text} mb-2`}>Por qué este camino te va</p>
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
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nivel de alineación</span>
              <span className={`text-xs font-bold ${g.text}`}>{path.alignment}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/70 overflow-hidden">
              <div className={`h-full rounded-full ${g.bar} transition-all duration-1000`} style={{ width: `${path.alignment}%` }} />
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
    <div className="relative">
      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {paths.map((path, i) => (
          <div key={i} className="snap-start">
            <PathCard path={path} index={i} onExplore={onExplore} active={activePath === path.title} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
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

  const handleRegeneratePaths = () => {
    setPathsLoading(true);
    setPathsError(false);
    fetch('/api/ai/insights/paths').then(r => r.json())
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
    <div className="flex flex-col min-h-screen bg-white">

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
      <div className="px-5 sm:px-8 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Caminos Sugeridos</h2>
            <p className="text-xs text-slate-400 mt-0.5">Basados en tu ADN · Toca uno para ver el detalle</p>
          </div>
          {!pathsLoading && paths.length > 0 && (
            <button onClick={handleRegeneratePaths} className="text-xs text-slate-400 hover:text-violet-600 transition-colors">
              ↻ Regenerar
            </button>
          )}
        </div>

        {pathsLoading && (
          <div className="flex gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="shrink-0 w-64 sm:w-72 h-48 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {!pathsLoading && pathsError && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-slate-500 text-sm font-medium mb-3">
              {attributes.length === 0
                ? 'Agrega características en tu ADN para ver caminos sugeridos 🌱'
                : 'No se pudieron generar caminos. Intenta de nuevo.'}
            </p>
            {attributes.length === 0 ? (
              <a href="/dna" className="text-sm font-bold text-violet-600 hover:text-violet-700 bg-violet-50 px-4 py-2 rounded-xl transition-colors">
                🧬 Completar mi ADN →
              </a>
            ) : (
              <button onClick={handleRegeneratePaths} className="text-sm font-bold text-violet-600 bg-violet-50 px-4 py-2 rounded-xl">
                ↻ Reintentar
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
          onBranchCreated={() => {
            setBranchCreated(true);
            setSelectedPath(null);
          }}
        />
      )}
    </div>
  );
}
