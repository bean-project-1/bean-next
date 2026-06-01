'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
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
  ChevronRight,
  Gamepad2
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
  type?: string; 
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
    glow: 'shadow-amber-500/10 hover:shadow-amber-500/25 hover:border-amber-300',
    label: 'Misión Combinada',
    icon: GitMerge,
  },
  next_step: {
    from: 'from-emerald-500', to: 'to-teal-500',
    light: 'bg-emerald-50/50', text: 'text-emerald-800',
    border: 'border-emerald-200/60', bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200/30',
    glow: 'shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:border-emerald-300',
    label: 'Subir de Nivel',
    icon: TrendingUp,
  },
  dominant_dna: {
    from: 'from-rose-500', to: 'to-indigo-500',
    light: 'bg-rose-50/50', text: 'text-rose-800',
    border: 'border-rose-200/60', bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-800 border border-rose-200/30',
    glow: 'shadow-rose-500/10 hover:shadow-rose-500/25 hover:border-rose-300',
    label: 'Misión Especial',
    icon: Compass,
  },
};

const getTheme = (type?: string) => {
  return TYPE_THEMES[type || 'synergy'] || TYPE_THEMES.synergy;
};

// ─────────────────────────────────────────────────────────
// PathCard (Responsive Carousel Card)
// ─────────────────────────────────────────────────────────
function PathCard({
  path, index, onExplore, active, isReplacing
}: { path: LifePath; index: number; onExplore: (path: LifePath, idx: number) => void; active: boolean; isReplacing?: boolean }) {
  const g = getTheme(path.type);
  const Icon = g.icon;

  if (isReplacing) {
    return (
      <div className="relative w-full min-w-[85vw] md:min-w-0 snap-center rounded-[32px] overflow-hidden border border-stone-200 bg-stone-50 flex flex-col items-center justify-center p-6 h-[320px] animate-pulse">
        <RefreshCw className="w-8 h-8 text-stone-300 animate-spin mb-3" />
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center">Calculando nueva ruta...</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onExplore(path, index)}
      className={`relative w-full min-w-[85vw] md:min-w-0 snap-center rounded-[32px] overflow-hidden border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between p-6 h-[320px]
        ${active 
          ? `border-stone-300 bg-white shadow-2xl ${g.glow} -translate-y-2 scale-[1.02]` 
          : `border-black/5 bg-white/75 backdrop-blur-md shadow-md hover:shadow-xl hover:-translate-y-1 ${g.glow}`
        }
        group`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${g.from} ${g.to}`} />

      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[9px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${g.badge}`}>
            <Icon className="w-3 h-3 shrink-0" />
            {g.label}
          </span>
          {path.dimensionName && (
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-tight">
              {path.dimensionName}
            </span>
          )}
        </div>

        <div className="flex items-start gap-4 mb-3">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-3xl shadow-lg text-white shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out`}>
            {path.emoji}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-extrabold text-stone-850 text-base leading-tight group-hover:text-stone-900 transition-colors line-clamp-2">
              {path.title}
            </h3>
            <p className="text-xs font-bold text-stone-400 mt-1 truncate">
              {path.tagline}
            </p>
          </div>
        </div>

        {path.description && (
          <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed font-semibold">
            {path.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col justify-end">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Afinidad ADN</span>
          <span className={`text-xs font-black ${g.text}`}>{path.alignment} XP</span>
        </div>
        <div className="h-2 rounded-full bg-stone-100 overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${g.from} ${g.to} transition-all duration-1000 ease-out`} 
            style={{ width: `${path.alignment}%` }} 
          />
        </div>
        
        <div className="h-4 mt-3 flex items-center justify-center overflow-hidden">
          <span className={`text-[10px] font-black ${g.text} flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
            Explorar Misión <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PathDetailPanel (Portal + Framer Motion)
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
  const [activeTab, setActiveTab] = useState<'summary' | 'coach'>('summary');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => setMounted(true), []);

  const g = getTheme(path.type);
  const Icon = g.icon;
  const chatContext = `path_${path.title.toLowerCase().replace(/\s+/g, '_').slice(0, 30)}`;
  const starterMsg = `Quiero iniciar la misión: "${path.title}". ${path.starterQuestion}`;

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container: Draggable Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, info) => {
          // If swiped down past threshold, close it
          if (info.offset.y > 100 && !isExpanded) onClose();
          else if (info.offset.y > 150 && isExpanded) setIsExpanded(false);
          // If swiped up, expand to full screen
          else if (info.offset.y < -50 && !isExpanded) setIsExpanded(true);
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0, height: isExpanded ? '100dvh' : '85dvh' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative w-full md:max-w-5xl md:h-[80vh] bg-stone-50 overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 md:!h-[80vh] md:!rounded-[32px] md:!translate-y-0 ${isExpanded ? 'rounded-none' : 'rounded-t-[32px]'}`}
      >
        
        {/* Mobile Drag Handle Indicator */}
        <div 
          className="w-full flex justify-center pt-3 pb-3 md:hidden bg-white shrink-0 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 bg-stone-200 rounded-full pointer-events-none" />
        </div>

        {/* Mobile Header with Tabs & Close */}
        <div className="flex md:hidden bg-white border-b border-stone-200 p-2 shrink-0 items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl flex-1">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'summary' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}
            >
              Misión
            </button>
            <button 
              onClick={() => setActiveTab('coach')}
              className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'coach' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-400'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Coach
            </button>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl bg-stone-100 text-stone-500 shrink-0 active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left Side (Summary): Hidden on mobile if 'coach' tab is active */}
        <div className={`w-full md:w-[380px] bg-white border-b md:border-b-0 md:border-r border-stone-200/50 p-6 md:p-8 flex-1 flex-col justify-between overflow-y-auto ${activeTab === 'summary' ? 'flex' : 'hidden md:flex'}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${g.badge}`}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {g.label}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-4xl shadow-xl text-white shrink-0 rotate-2`}>
                {path.emoji}
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-800 leading-tight">{path.title}</h2>
                <p className="text-xs font-bold text-stone-400 mt-1">{path.tagline}</p>
              </div>
            </div>

            {path.description && (
              <div className="mb-8 bg-stone-50 rounded-2xl p-5 border border-stone-100 shadow-sm">
                <p className="text-sm text-stone-600 leading-relaxed font-bold">
                  "{path.description}"
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" /> Análisis de Compatibilidad
              </h4>
              <div className="space-y-3">
                {path.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
                    <CheckCircle2 className={`w-5 h-5 ${g.text} shrink-0`} />
                    <span className="text-xs text-stone-700 leading-relaxed font-bold">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Afinidad ADN</span>
                <span className={`text-sm font-black ${g.text}`}>{path.alignment} XP</span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-200 overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${g.from} ${g.to}`} 
                  style={{ width: `${path.alignment}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
            <button
              onClick={() => onReplace(path)}
              className="w-full py-4 border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-600 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-stone-400" />
              Pedir otra Misión
            </button>
            
            <button
              onClick={() => setActiveTab('coach')}
              className={`md:hidden w-full py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md ${activeTab === 'coach' ? 'hidden' : 'flex'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Hablar con el Coach
            </button>
          </div>
        </div>

        {/* Right Side (Chat): Hidden on mobile if 'summary' tab is active */}
        <div className={`flex-1 flex flex-col bg-white relative min-h-0 ${activeTab === 'coach' ? 'flex' : 'hidden md:flex'}`}>
          
          <div className="hidden md:flex shrink-0 px-5 py-4 border-b border-stone-150 items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-black text-stone-800 tracking-wider uppercase">Coach Conversacional</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative min-h-0">
            <div className="absolute inset-0">
              <PermanentAIChat
                context={chatContext}
                placeholder={`Pregunta sobre "${path.title}"...`}
                emptyStateMessage={`¡Preparando la misión "${path.title}"! 🌱 ¿Empezamos?`}
                initialMessage={starterMsg}
                onBranchCreated={onBranchCreated}
              />
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
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
  const [replacingId, setReplacingId] = useState<string | null>(null);

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
    
    setSelectedPath(null);
    setReplacingId(pathToReplace.id);
    
    try {
      const res = await fetch('/api/ai/insights/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replaceId: pathToReplace.id })
      });
      const data = await res.json();
      if (data.success && data.path) {
        setPaths(prev => prev.map(p => p.id === pathToReplace.id ? data.path : p));
      }
    } catch (err) {
      console.error('Failed to replace path:', err);
    } finally {
      setReplacingId(null);
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
      <div className="min-h-screen bg-transparent pb-32 sm:pb-32 mesh-gradient p-4 sm:p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-40 rounded-[32px] bg-white/60 border border-black/5" />
          <div className="flex overflow-hidden gap-4 md:grid md:grid-cols-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="min-w-[85vw] md:min-w-0 h-[320px] rounded-[32px] bg-white/60 border border-black/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-32 sm:pb-32 mesh-gradient p-4 sm:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="glass rounded-[32px] p-6 sm:p-8 border border-black/5 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-[16px] bg-emerald-50 border-2 border-emerald-100 text-emerald-600 shadow-sm rotate-3">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-850 tracking-tight">
                  Hola, {userName || 'Jugador'} ✨
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 font-bold max-w-xl leading-relaxed">
                BEAN Insights analiza tu ADN y metas activas para generar <span className="text-emerald-600 font-black">misiones evolutivas</span> hechas a tu medida.
              </p>
            </div>

            <div className="flex items-center gap-6 divide-x divide-stone-200 border border-stone-200 bg-white/80 backdrop-blur-md rounded-[20px] px-6 py-4 shadow-sm self-start md:self-auto">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-stone-800 leading-tight">{attributes.length}</span>
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Dna className="w-3 h-3 text-rose-500" />
                  Nivel ADN
                </span>
              </div>
              <div className="flex flex-col items-center pl-6">
                <span className="text-2xl font-black text-stone-800 leading-tight">3</span>
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-500" />
                  Rutas Activas
                </span>
              </div>
            </div>
          </div>

          {attributes.length > 0 && (
            <div className="mt-6 pt-5 border-t border-stone-100/50 flex flex-col md:flex-row md:items-center">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider mr-3 shrink-0 mb-3 md:mb-0">Tu Inventario:</span>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden w-full">
                {skills.map((a, i) => (
                  <span key={'s'+i} className="snap-start shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">{a.name}</span>
                ))}
                {interests.map((a, i) => (
                  <span key={'i'+i} className="snap-start shrink-0 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">{a.name}</span>
                ))}
                {values.map((a, i) => (
                  <span key={'v'+i} className="snap-start shrink-0 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">{a.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-stone-850 tracking-tight flex items-center gap-2">
                🗺️ Tablero de Misiones
              </h2>
              <p className="text-xs text-stone-500 font-bold">Rutas proyectadas para subir de nivel tu Árbol</p>
            </div>
            {!pathsError && paths.length > 0 && (
              <button
                onClick={handleRegeneratePaths}
                className="self-start md:self-auto text-xs font-black uppercase tracking-wider text-emerald-700 bg-white border-2 border-stone-200 px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Re-calcular Rutas
              </button>
            )}
          </div>

          {pathsError && (
            <div className="glass rounded-[32px] border border-stone-200/60 bg-white/80 p-12 text-center shadow-lg">
              <div className="w-20 h-20 rounded-[24px] bg-stone-100 flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner">🌱</div>
              <p className="text-stone-700 text-base font-black mb-6 max-w-md mx-auto">
                {attributes.length === 0
                  ? 'Aún no tienes ADN registrado. Completa tu perfil para desbloquear misiones.'
                  : 'Hubo un error de conexión al cargar tus rutas.'}
              </p>
              {attributes.length === 0 ? (
                <a href="/dna" className="inline-flex text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-95">
                  🧬 Construir mi ADN →
                </a>
              ) : (
                <button onClick={handleRegeneratePaths} className="inline-flex text-xs font-black uppercase tracking-wider text-emerald-700 bg-white border-2 border-stone-200 px-8 py-4 rounded-2xl transition-all shadow-sm active:scale-95">
                  ↻ Reintentar Conexión
                </button>
              )}
            </div>
          )}

          {!pathsError && paths.length > 0 && (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 pb-6 pt-2 px-4 -mx-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
              {paths.map((path, i) => (
                <PathCard
                  key={path.id || i}
                  path={path}
                  index={i}
                  onExplore={handleExplorePath}
                  active={selectedPath?.path.title === path.title}
                  isReplacing={path.id === replacingId}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="px-2">
            <h2 className="text-sm font-black text-stone-700 uppercase tracking-widest">Maestro del Gremio (Coach)</h2>
            <p className="text-xs text-stone-500 font-bold mt-1">Planifica tus próximos movimientos con asistencia especializada.</p>
          </div>

          {branchCreated && (
            <div className="flex items-center justify-between gap-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-5 py-4 text-xs text-emerald-800 font-black animate-in slide-in-from-top-2 duration-300 shadow-sm">
              <span className="flex items-center gap-2">
                🏆 ¡Misión añadida a tu Árbol exitosamente!
              </span>
              <a href="/home" className="underline hover:text-emerald-900 flex items-center gap-1 shrink-0 uppercase tracking-wider text-[10px] font-black bg-emerald-100 px-3 py-1.5 rounded-lg">
                Ver árbol <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="glass rounded-[32px] overflow-hidden border border-black/5 shadow-lg" style={{ height: '450px' }}>
            <PermanentAIChat
              context="insights"
              placeholder="Pregunta sobre cómo subir de nivel..."
              emptyStateMessage="Soy tu Mentor de Gremio BEAN ⚔️"
              onBranchCreated={() => setBranchCreated(true)}
            />
          </div>
        </div>

      </div>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}
