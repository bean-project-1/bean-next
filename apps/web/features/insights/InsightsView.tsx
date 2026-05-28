'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Compass, 
  GitMerge, 
  CheckCircle2, 
  MessageSquare, 
  X, 
  TrendingUp, 
  Dna,
  User,
  Plus,
  ChevronRight
} from 'lucide-react';
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
  type?: string; // synergy | next_step | dominant_dna
}

interface UserAttribute {
  name: string;
  category: string;
  dimension?: { label: string };
}

// ── Color and design system mapping per path type ─────────
const TYPE_THEMES: Record<string, {
  from: string;
  to: string;
  light: string;
  text: string;
  border: string;
  bar: string;
  badge: string;
  glow: string;
  label: string;
  icon: any;
}> = {
  synergy: {
    from: 'from-amber-500', to: 'to-orange-500',
    light: 'bg-amber-50/50', text: 'text-amber-800',
    border: 'border-amber-200/60', bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800 border border-amber-200/30',
    glow: 'shadow-amber-500/5 hover:shadow-amber-500/15 hover:border-amber-300',
    label: 'Sinergia de ADN',
    icon: GitMerge,
  },
  next_step: {
    from: 'from-emerald-500', to: 'to-teal-500',
    light: 'bg-emerald-50/50', text: 'text-emerald-800',
    border: 'border-emerald-200/60', bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200/30',
    glow: 'shadow-emerald-500/5 hover:shadow-emerald-500/15 hover:border-emerald-300',
    label: 'Siguiente Paso',
    icon: TrendingUp,
  },
  dominant_dna: {
    from: 'from-rose-500', to: 'to-indigo-500',
    light: 'bg-rose-50/50', text: 'text-rose-800',
    border: 'border-rose-200/60', bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-800 border border-rose-200/30',
    glow: 'shadow-rose-500/5 hover:shadow-rose-500/15 hover:border-rose-300',
    label: 'Enfoque ADN',
    icon: Compass,
  },
};

const getTheme = (type?: string) => {
  return TYPE_THEMES[type || 'synergy'] || TYPE_THEMES.synergy;
};

// ─────────────────────────────────────────────────────────
// PathCard (Responsive Grid Card)
// ─────────────────────────────────────────────────────────
function PathCard({
  path, index, onExplore, active
}: { path: LifePath; index: number; onExplore: (path: LifePath, idx: number) => void; active: boolean }) {
  const g = getTheme(path.type);
  const Icon = g.icon;

  return (
    <div
      onClick={() => onExplore(path, index)}
      className={`relative w-full rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between p-6 h-[320px]
        ${active 
          ? `border-stone-300 bg-white shadow-xl ${g.glow} -translate-y-1.5` 
          : `border-black/5 bg-white/75 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 ${g.glow}`
        }
        group`}
    >
      {/* Top Gradient Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${g.from} ${g.to}`} />

      <div>
        {/* Card Header: Type Badge & Dimension */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${g.badge}`}>
            <Icon className="w-3 h-3 shrink-0" />
            {g.label}
          </span>
          {path.dimensionName && (
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">
              {path.dimensionName}
            </span>
          )}
        </div>

        {/* Title, Tagline & Emoji */}
        <div className="flex items-start gap-4 mb-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-2xl shadow-md text-white shrink-0 group-hover:scale-105 transition-transform duration-300`}>
            {path.emoji}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-stone-850 text-base leading-tight group-hover:text-stone-900 transition-colors line-clamp-2">
              {path.title}
            </h3>
            <p className="text-xs font-semibold text-stone-400 mt-1 truncate">
              {path.tagline}
            </p>
          </div>
        </div>

        {/* Short description */}
        {path.description && (
          <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed font-medium">
            {path.description}
          </p>
        )}
      </div>

      {/* Card Footer: DNA Alignment progress bar */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col justify-end">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Coherencia ADN</span>
          <span className={`text-xs font-extrabold ${g.text}`}>{path.alignment}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-stone-100/80 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${g.from} ${g.to} transition-all duration-1000 ease-out`} 
            style={{ width: `${path.alignment}%` }} 
          />
        </div>
        
        {/* Hover action guide */}
        <div className="h-4 mt-3 flex items-center justify-center overflow-hidden">
          <span className={`text-[10px] font-bold ${g.text} flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
            Ver detalles del camino <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PathDetailPanel (Beautiful 2-Column Floating Modal)
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
  const g = getTheme(path.type);
  const Icon = g.icon;
  const chatContext = `path_${path.title.toLowerCase().replace(/\s+/g, '_').slice(0, 30)}`;
  const starterMsg = `Quiero explorar el camino de vida: "${path.title}". ${path.starterQuestion}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[90vh] sm:h-[80vh] bg-stone-50 border border-black/5 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-350">
        
        {/* Left Side: Path Details & Info */}
        <div className="w-full md:w-[380px] bg-white border-b md:border-b-0 md:border-r border-stone-200/50 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Close Button (Mobile Only) */}
            <div className="flex md:hidden justify-end mb-2">
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${g.badge}`}>
                <Icon className="w-3 h-3 shrink-0" />
                {g.label}
              </span>
              {path.dimensionName && (
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-500 uppercase tracking-tight">
                  {path.dimensionName}
                </span>
              )}
            </div>

            {/* Emoji & Title */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-3xl shadow-lg text-white shrink-0`}>
                {path.emoji}
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-800 leading-tight">{path.title}</h2>
                <p className="text-xs font-semibold text-stone-400 mt-1">{path.tagline}</p>
              </div>
            </div>

            {/* Description */}
            {path.description && (
              <div className="mb-6 bg-stone-50 rounded-2xl p-4 border border-stone-100/50">
                <p className="text-xs text-stone-600 leading-relaxed font-semibold italic">
                  "{path.description}"
                </p>
              </div>
            )}

            {/* Why This Path (Reasons) */}
            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">¿Por qué se alinea contigo?</h4>
              <div className="space-y-2">
                {path.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${g.text} shrink-0 mt-0.5`} />
                    <span className="text-xs text-stone-700 leading-relaxed font-semibold">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alignment progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Coherencia de ADN</span>
                <span className={`text-xs font-extrabold ${g.text}`}>{path.alignment}%</span>
              </div>
              <div className="h-2 rounded-full bg-stone-100 overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${g.from} ${g.to}`} 
                  style={{ width: `${path.alignment}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => onReplace(path)}
              className="w-full py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-450" />
              Reemplazar idea
            </button>
          </div>
        </div>

        {/* Right Side: Chat & Close Button */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* Header Bar */}
          <div className="shrink-0 px-5 py-4 border-b border-stone-150 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-black text-stone-700 tracking-wider uppercase">Coach Conversacional</span>
            </div>
            {/* Close Button for desktop */}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dedicated Chat */}
          <div className="flex-1 overflow-hidden">
            <PermanentAIChat
              context={chatContext}
              placeholder={`Pregunta sobre "${path.title}"...`}
              emptyStateMessage={`Planifiquemos el camino de "${path.title}" 🌱`}
              initialMessage={starterMsg}
              onBranchCreated={onBranchCreated}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// InsightsView (Main)
// ─────────────────────────────────────────────────────────
export function InsightsView() {
  const [paths, setPaths] = useState<LifePath[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);
  const [pathsError, setPathsError] = useState(false);
  const [attributes, setAttributes] = useState<UserAttribute[]>([]);
  const [userName, setUserName] = useState('');
  const [branchCreated, setBranchCreated] = useState(false);
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
    setPathsLoading(true);
    try {
      const res = await fetch('/api/ai/insights/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replaceId: pathToReplace.id })
      });
      const data = await res.json();
      if (data.success && data.path) {
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

  if (pathsLoading) {
    return (
      <div className="min-h-screen bg-transparent pb-32 sm:pb-32 mesh-gradient p-6 sm:p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-32 rounded-3xl bg-white/60 border border-black/5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-[320px] rounded-3xl bg-white/60 border border-black/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-32 sm:pb-32 mesh-gradient p-4 sm:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ── Header Dashboard Card (Glassmorphism) ────────── */}
        <div className="glass rounded-[32px] p-6 sm:p-8 border border-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
                  Hola, {userName || 'Viajero'} ✨
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl">
                BEAN Insights analiza tu ADN y metas activas para proyectar oportunidades evolutivas únicas y sinergias en tu vida.
              </p>
            </div>

            {/* Quick Stats Panel */}
            <div className="flex items-center gap-6 divide-x divide-stone-200 border border-stone-150/50 bg-white/60 rounded-2xl px-6 py-4 shadow-sm self-start md:self-auto">
              <div className="flex flex-col">
                <span className="text-xl font-black text-stone-800 leading-tight">{attributes.length}</span>
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Dna className="w-2.5 h-2.5 text-rose-500" />
                  Atributos ADN
                </span>
              </div>
              <div className="flex flex-col pl-6">
                <span className="text-xl font-black text-stone-800 leading-tight">3</span>
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Compass className="w-2.5 h-2.5 text-amber-500" />
                  Caminos Proyectados
                </span>
              </div>
            </div>
          </div>

          {/* DNA attributes pill area */}
          {attributes.length > 0 && (
            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap gap-2 items-center">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider mr-1">Tus Pilares:</span>
              {skills.map((a, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">{a.name}</span>
              ))}
              {interests.map((a, i) => (
                <span key={i} className="bg-amber-50 text-amber-700 border border-amber-100/50 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">{a.name}</span>
              ))}
              {values.map((a, i) => (
                <span key={i} className="bg-rose-50 text-rose-700 border border-rose-100/50 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">{a.name}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Suggested Paths Section ──────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-stone-850 tracking-tight flex items-center gap-2">
                🌳 Caminos de Vida Proyectados
              </h2>
              <p className="text-xs text-stone-450 font-semibold">Caminos evolutivos cruzados y optimizaciones para tu Árbol</p>
            </div>
            {!pathsError && paths.length > 0 && (
              <button
                onClick={handleRegeneratePaths}
                className="text-xs font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 bg-white border border-stone-200 px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerar todo
              </button>
            )}
          </div>

          {pathsError && (
            <div className="glass rounded-[32px] border border-stone-200/60 bg-white/50 p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-stone-100/80 flex items-center justify-center mx-auto mb-4 text-2xl">🌱</div>
              <p className="text-stone-600 text-sm font-bold mb-4">
                {attributes.length === 0
                  ? 'Completa tu ADN en la sección correspondiente para que BEAN pueda recomendarte caminos.'
                  : 'Hubo un error de conexión al cargar tus caminos de vida.'}
              </p>
              {attributes.length === 0 ? (
                <a href="/dna" className="inline-flex text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 rounded-2xl transition-all shadow-md active:scale-95">
                  🧬 Completar mi ADN →
                </a>
              ) : (
                <button onClick={handleRegeneratePaths} className="inline-flex text-xs font-black uppercase tracking-wider text-emerald-600 bg-white border border-stone-200 px-6 py-3.5 rounded-2xl transition-all shadow-sm active:scale-95">
                  ↻ Reintentar Proyección
                </button>
              )}
            </div>
          )}

          {!pathsError && paths.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paths.map((path, i) => (
                <PathCard
                  key={path.id || i}
                  path={path}
                  index={i}
                  onExplore={handleExplorePath}
                  active={selectedPath?.path.title === path.title}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Global Coach Chat Section ────────────────────── */}
        <div className="space-y-4">
          <div className="px-2">
            <h2 className="text-sm font-black text-stone-700 uppercase tracking-widest">Coach de Vida General</h2>
            <p className="text-xs text-stone-450 font-semibold mt-0.5">Resuelve dudas sobre tu rumbo o planifica pasos personalizados.</p>
          </div>

          {branchCreated && (
            <div className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-150 rounded-2xl px-5 py-3.5 text-xs text-emerald-800 font-bold animate-in slide-in-from-top-2 duration-300 shadow-sm">
              <span className="flex items-center gap-2">
                🌳 ¡Nueva meta creada exitosamente en tu Árbol!
              </span>
              <a href="/home" className="underline hover:text-emerald-900 flex items-center gap-1 shrink-0 uppercase tracking-wider text-[10px] font-black">
                Ver árbol de vida <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="glass rounded-[32px] overflow-hidden border border-black/5 shadow-sm" style={{ height: '450px' }}>
            <PermanentAIChat
              context="insights"
              placeholder="Pregunta algo sobre tu camino de vida o tu ADN..."
              emptyStateMessage="Soy tu Coach de Insights BEAN ✨"
              onBranchCreated={() => setBranchCreated(true)}
            />
          </div>
        </div>

      </div>

      {/* ── Detail Panel Modal ────────────────────────────── */}
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
