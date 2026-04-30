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
  { from: 'from-violet-500', to: 'to-indigo-600', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', bar: 'bg-violet-500' },
  { from: 'from-emerald-500', to: 'to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500' },
  { from: 'from-orange-500', to: 'to-rose-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', bar: 'bg-orange-500' },
];

function PathCard({
  path, index, onExplore, active
}: { path: LifePath; index: number; onExplore: (q: string) => void; active: boolean }) {
  const g = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <div className={`relative shrink-0 w-72 sm:w-80 rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer select-none
      ${active ? `${g.border} shadow-lg scale-[1.01]` : 'border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.01]'}
      bg-white`}
      onClick={() => onExplore(path.starterQuestion)}
    >
      {/* Top gradient band */}
      <div className={`h-2 w-full bg-gradient-to-r ${g.from} ${g.to}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-2xl shadow-md`}>
              {path.emoji}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{path.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{path.tagline}</p>
            </div>
          </div>
        </div>

        {/* Alignment bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alineación</span>
            <span className={`text-sm font-bold ${g.text}`}>{path.alignment}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${g.bar} transition-all duration-700`}
              style={{ width: `${path.alignment}%` }}
            />
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-1.5 mb-4">
          {path.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`text-xs ${g.text} mt-0.5`}>✓</span>
              <span className="text-xs text-slate-600 leading-snug">{r}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); onExplore(path.starterQuestion); }}
          className={`w-full py-2.5 bg-gradient-to-r ${g.from} ${g.to} text-white text-xs font-bold rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-sm`}
        >
          Explorar este camino →
        </button>
      </div>
    </div>
  );
}

function PathsCarousel({ paths, onExplore, activePath }: {
  paths: LifePath[];
  onExplore: (q: string) => void;
  activePath: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {paths.map((path, i) => (
          <div key={i} className="snap-start">
            <PathCard
              path={path}
              index={i}
              onExplore={onExplore}
              active={activePath === path.starterQuestion}
            />
          </div>
        ))}
      </div>
      {/* Scroll hint gradient on right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}

export function InsightsView() {
  const [paths, setPaths] = useState<LifePath[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);
  const [pathsError, setPathsError] = useState(false);
  const [attributes, setAttributes] = useState<UserAttribute[]>([]);
  const [userName, setUserName] = useState('');
  const [branchCreated, setBranchCreated] = useState(false);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load profile and paths in parallel
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

  const handleExplorePath = (starterQuestion: string) => {
    setActivePath(starterQuestion);
    setInitialMessage(starterQuestion);
    // Scroll to chat section
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const attrSlice = (cat: string) =>
    attributes.filter(a => a.category === cat).slice(0, 5);

  const skills = attrSlice('skill');
  const interests = attrSlice('interest');
  const values = attrSlice('value');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="shrink-0 px-5 sm:px-8 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💡</span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Insights{userName ? ` de ${userName}` : ''}
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Caminos de vida alineados con tu ADN y un Coach que los construye contigo.
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
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{a.name}</span>
            ))}
            {interests.map((a, i) => (
              <span key={i} className="bg-orange-50 text-orange-700 border border-orange-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{a.name}</span>
            ))}
            {values.map((a, i) => (
              <span key={i} className="bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{a.name}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Paths Carousel ──────────────────────────── */}
        <div className="px-5 sm:px-8 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Caminos Sugeridos</h2>
              <p className="text-xs text-slate-400 mt-0.5">Basados en tu perfil de ADN · Toca uno para explorarlo</p>
            </div>
            {!pathsLoading && paths.length > 0 && (
              <button
                onClick={() => { setPathsLoading(true); setPathsError(false); fetch('/api/ai/insights/paths').then(r => r.json()).then(d => { if (d.success) setPaths(d.paths); }).finally(() => setPathsLoading(false)); }}
                className="text-xs text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1"
              >
                ↻ Regenerar
              </button>
            )}
          </div>

          {pathsLoading && (
            <div className="flex gap-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="shrink-0 w-72 sm:w-80 h-64 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {!pathsLoading && pathsError && attributes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-slate-500 text-sm font-medium mb-3">Necesitamos conocerte mejor para sugerirte caminos 🌱</p>
              <a href="/dna" className="text-sm font-bold text-violet-600 hover:text-violet-700 bg-violet-50 px-4 py-2 rounded-xl transition-colors">
                🧬 Completar mi ADN →
              </a>
            </div>
          )}

          {!pathsLoading && !pathsError && paths.length > 0 && (
            <PathsCarousel paths={paths} onExplore={handleExplorePath} activePath={activePath} />
          )}
        </div>

        {/* ── Coach Chat ──────────────────────────────── */}
        <div ref={chatSectionRef}>
          {branchCreated && (
            <div className="mx-5 sm:mx-8 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-700 font-semibold animate-in slide-in-from-top-2 duration-300">
              🌳 Nueva meta creada en tu árbol. <a href="/home" className="underline ml-1">Ver árbol →</a>
            </div>
          )}

          <div className="flex items-center justify-between px-5 sm:px-8 pt-5 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Coach de Insights</h2>
              <p className="text-xs text-slate-400 mt-0.5">Toca un camino de arriba para explorarlo, o escribe directamente.</p>
            </div>
          </div>

          <div className="h-[60vh]">
            <PermanentAIChat
              context="insights"
              placeholder="Pregunta algo... ¿Qué camino se alinea más conmigo?"
              emptyStateMessage="Soy tu Agente de Insights ✨"
              initialMessage={initialMessage}
              onBranchCreated={() => setBranchCreated(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
