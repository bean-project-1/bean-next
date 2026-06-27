'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  X, Play, Pause, RotateCcw, Settings,
  Minimize2, Maximize2, ChevronLeft,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase      = 'work' | 'break' | 'longBreak';
type ModalState = 'hidden' | 'mini' | 'normal' | 'maximized';

interface Config {
  work: number; break: number; longBreak: number; sessionsBeforeLong: number;
}
interface Toast { title: string; body: string; emoji: string }

// ─── Audio chime ──────────────────────────────────────────────────────────────
function playChime(notes = [528, 660, 792]) {
  try {
    const ctx = new AudioContext();
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      osc.start(t); osc.stop(t + 1.4);
    });
  } catch (_) {}
}

// ─── Browser notifications ────────────────────────────────────────────────────
async function requestNotifPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}
function sendBrowserNotif(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

// ─── Progress Ring (full size) ────────────────────────────────────────────────
function ProgressRing({ progress, phase, size = 200 }: { progress: number; phase: Phase; size?: number }) {
  const cx    = size / 2;
  const r     = cx - 10;
  const circ  = 2 * Math.PI * r;
  const color = phase === 'work' ? '#1B7A4E' : phase === 'break' ? '#3B82F6' : '#D97706';
  const track = phase === 'work' ? '#D1FAE5' : phase === 'break' ? '#DBEAFE' : '#FEF3C7';

  const dot = (() => {
    if (progress <= 0.01) return null;
    const angle = -90 + 360 * progress;
    const rad   = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cx + r * Math.sin(rad) };
  })();

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cx} r={r + 2} fill="none" stroke={color} strokeWidth={12} opacity={0.06} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={track} strokeWidth={7} />
      <motion.circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - progress) }}
        transition={{ duration: 0.5, ease: 'linear' }}
        style={{ rotate: '-90deg', transformOrigin: `${cx}px ${cx}px` }}
      />
      {dot && <circle cx={dot.x} cy={dot.y} r={4.5} fill={color} />}
    </svg>
  );
}

// ─── Mini ring ────────────────────────────────────────────────────────────────
function MiniRing({ progress, phase, size = 32 }: { progress: number; phase: Phase; size?: number }) {
  const cx   = size / 2;
  const r    = cx - 3;
  const circ = 2 * Math.PI * r;
  const color = phase === 'work' ? '#1B7A4E' : phase === 'break' ? '#3B82F6' : '#D97706';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#E5E7EB" strokeWidth={3} />
      <motion.circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - progress) }}
        transition={{ duration: 0.5 }}
        style={{ rotate: '-90deg', transformOrigin: `${cx}px ${cx}px` }}
      />
    </svg>
  );
}

// ─── Plant Scene ──────────────────────────────────────────────────────────────
function PlantScene({ progress, phase }: { progress: number; phase: Phase }) {
  const p = phase === 'work' ? progress : 1;

  const seedOp   = p < 0.12 ? p / 0.12 : Math.max(0, 1 - (p - 0.12) / 0.10);
  const stemGrow = Math.max(0, Math.min(1, (p - 0.10) / 0.72));
  const leaf1Op  = Math.max(0, Math.min(1, (p - 0.32) / 0.12));
  const leaf2Op  = Math.max(0, Math.min(1, (p - 0.54) / 0.12));
  const budOp    = Math.max(0, Math.min(1, (p - 0.80) / 0.10));

  const green  = phase === 'work' ? '#1B7A4E' : phase === 'break' ? '#3B82F6' : '#D97706';
  const light  = phase === 'work' ? '#34D399' : phase === 'break' ? '#93C5FD' : '#FDE68A';
  const floral = phase === 'work' ? '#F0FDF4' : phase === 'break' ? '#EFF6FF' : '#FFFBEB';

  const swayAnim  = phase !== 'work' ? { rotate: [0, 2, -2, 1, 0] } : {};
  const swayTrans: object = phase !== 'work'
    ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    : {};

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <ellipse cx="60" cy="108" rx="36" ry="7"  fill="#92622A" opacity="0.18" />
      <ellipse cx="60" cy="106" rx="26" ry="5"  fill="#7A4F1A" opacity="0.15" />
      {[[42,109],[54,111],[68,110],[78,108],[50,107]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#7A5020" opacity="0.22" />
      ))}

      <motion.g animate={{ opacity: seedOp, scale: seedOp > 0 ? 1 : 0.6 }}
        style={{ transformOrigin: '60px 101px' }} transition={{ duration: 0.4 }}>
        <ellipse cx="60" cy="102" rx="7.5" ry="4.5" fill="#7A4A10" />
        <ellipse cx="59" cy="101" rx="4.5" ry="2.8" fill="#A06828" opacity="0.7" />
        <path d="M 57 101 Q 60 99 63 101" stroke="#5A3208" strokeWidth="0.8" fill="none"
          opacity={Math.min(1, seedOp * 2)} />
      </motion.g>

      <motion.path d="M 60 102 C 59 90 61 75 58 58 C 57 45 62 35 60 22"
        stroke={green} strokeWidth="2.8" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: stemGrow }}
        transition={{ duration: 0.6, ease: 'easeOut' }} />

      <motion.g animate={{ opacity: leaf1Op, scale: leaf1Op > 0 ? 1 : 0.3 }}
        style={{ transformOrigin: '60px 72px' }} transition={{ duration: 0.5, ease: 'backOut' }}>
        <path d="M 58 72 Q 36 62 33 48 Q 48 60 58 66" fill={green} />
        <path d="M 58 72 Q 39 64 36 52" stroke={light} strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M 60 72 Q 82 62 85 48 Q 70 60 60 66" fill={light} />
        <path d="M 60 72 Q 79 64 82 52" stroke={green} strokeWidth="0.8" fill="none" opacity="0.5" />
      </motion.g>

      <motion.g animate={{ opacity: leaf2Op, scale: leaf2Op > 0 ? 1 : 0.3 }}
        style={{ transformOrigin: '60px 50px' }} transition={{ duration: 0.5, ease: 'backOut' }}>
        <path d="M 58 50 Q 38 40 36 26 Q 50 38 58 44" fill={light} />
        <path d="M 60 50 Q 80 40 82 26 Q 68 38 60 44" fill={green} />
      </motion.g>

      <motion.g animate={{ ...swayAnim, opacity: budOp, scale: budOp > 0 ? 1 : 0.2 }}
        style={{ transformOrigin: '60px 24px' }}
        transition={{ duration: 0.6, ease: 'backOut', ...swayTrans }}>
        {[0,60,120,180,240,300].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const px  = 60 + 9 * Math.cos(rad);
          const py  = 24 + 9 * Math.sin(rad);
          return (
            <ellipse key={deg} cx={px} cy={py} rx="5.5" ry="3.5" fill={floral}
              style={{ transform: `rotate(${deg}deg)`, transformOrigin: `${px}px ${py}px` }} />
          );
        })}
        <circle cx="60" cy="24" r="6"   fill="#FBBF24" />
        <circle cx="60" cy="24" r="3.8" fill="#F97316" />
        <circle cx="60" cy="24" r="1.8" fill="#EA580C" />
      </motion.g>
    </svg>
  );
}

// ─── Config stepper ───────────────────────────────────────────────────────────
function Stepper({ label, value, unit, min, max, onChange }: {
  label: string; value: number; unit: string; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl px-3 py-2.5 border border-[#E6E1D6]">
      <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-black flex items-center justify-center transition-colors text-sm">−</button>
        <span className="flex-1 text-center text-sm font-black text-stone-800">{value}{unit}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))}
          className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-black flex items-center justify-center transition-colors text-sm">+</button>
      </div>
    </div>
  );
}

// ─── In-app Toast ─────────────────────────────────────────────────────────────
function InAppToast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1,  y: 0,   scale: 1    }}
      exit={{    opacity: 0,  y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] w-[min(340px,calc(100vw-2rem))]"
    >
      <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-stone-100 overflow-hidden">
        {/* Progress bar */}
        <motion.div
          className="h-1 bg-emerald-400"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4.5, ease: 'linear' }}
        />
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-2xl">{toast.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-stone-900 leading-tight">{toast.title}</p>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5 leading-tight">{toast.body}</p>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-500 transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PomodoroModal() {
  const [modalState, setModalState] = useState<ModalState>('hidden');
  const [phase,      setPhase]      = useState<Phase>('work');
  const [config,     setConfig]     = useState<Config>({ work: 25, break: 5, longBreak: 15, sessionsBeforeLong: 4 });
  const [timeLeft,   setTimeLeft]   = useState(25 * 60);
  const [isRunning,  setIsRunning]  = useState(false);
  const [sessions,   setSessions]   = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [toast,      setToast]      = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag positions — persist within session
  const miniX  = useMotionValue(0);
  const miniY  = useMotionValue(0);
  const modalX = useMotionValue(0);
  const modalY = useMotionValue(0);

  // Fresh refs for interval callbacks
  const stateRef = useRef({ phase, sessions, config });
  stateRef.current = { phase, sessions, config };

  const phaseTotal = phase === 'work'
    ? config.work * 60
    : phase === 'break'
    ? config.break * 60
    : config.longBreak * 60;
  const progress = phaseTotal > 0 ? 1 - timeLeft / phaseTotal : 0;

  const phaseLabel = phase === 'work' ? 'Tiempo de enfoque' : phase === 'break' ? 'Descanso corto' : 'Gran descanso 🌿';
  const phaseColor = phase === 'work' ? '#1B7A4E'   : phase === 'break' ? '#3B82F6' : '#D97706';
  const phaseBg    = phase === 'work' ? 'bg-[#EAF5EC]' : phase === 'break' ? 'bg-blue-50'    : 'bg-amber-50';
  const btnGrad    = phase === 'work' ? 'from-emerald-400 to-[#1B7A4E]'
                   : phase === 'break' ? 'from-blue-400 to-blue-600' : 'from-amber-400 to-amber-600';
  const maxBg      = phase === 'work'
    ? 'from-[#EAF5EC] via-[#F3FBF6] to-[#FAF9F6]'
    : phase === 'break' ? 'from-blue-50 via-blue-50/60 to-[#FAF9F6]' : 'from-amber-50 via-amber-50/60 to-[#FAF9F6]';

  const growthMsg =
    phase !== 'work'     ? (phase === 'break' ? 'La planta descansa y absorbe agua 💧' : 'Gran descanso — raíces más profundas 🌳')
    : progress < 0.12   ? 'La semilla espera tu enfoque...'
    : progress < 0.35   ? 'Echando raíces 🌱'
    : progress < 0.55   ? 'Primeras hojas 🍃'
    : progress < 0.80   ? 'Creciendo fuerte 🌿'
    :                     '¡Casi en flor! 🌸';

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = useCallback((title: string, body: string, emoji: string = '🍅') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ title, body, emoji });
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  // ── Open via event ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setModalState(s => s === 'hidden' ? 'normal' : s === 'mini' ? 'normal' : s);
    window.addEventListener('open-pomodoro', handler);
    return () => window.removeEventListener('open-pomodoro', handler);
  }, []);

  // ── Advance phase ─────────────────────────────────────────────────────────
  const advancePhase = useCallback(() => {
    const { phase: p, sessions: s, config: c } = stateRef.current;
    setIsRunning(false);
    playChime();

    if (p === 'work') {
      const ns = s + 1;
      setSessions(ns);
      const isLong = ns % c.sessionsBeforeLong === 0;
      const nextPhase = isLong ? 'longBreak' : 'break';
      const nextTime  = isLong ? c.longBreak * 60 : c.break * 60;
      setPhase(nextPhase);
      setTimeLeft(nextTime);
      const msg = isLong ? '¡Gran descanso! Tomaste 4 pomodoros 🌳' : '¡Descansa un momento! 💧';
      showToast('🍅 Pomodoro completado', msg, '✅');
      sendBrowserNotif('✅ Pomodoro completado', msg);
    } else {
      setPhase('work');
      setTimeLeft(c.work * 60);
      showToast('🚀 ¡A enfocarse!', `Nuevo ciclo de ${c.work} minutos`, '🌱');
      sendBrowserNotif('🚀 ¡A enfocarse!', `Nuevo ciclo de ${c.work} minutos`);
    }
  }, [showToast]);

  // ── Ticker ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setTimeout(advancePhase, 0); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, advancePhase]);

  // ── Start handler (request permission first time) ─────────────────────────
  const handlePlayPause = useCallback(async () => {
    if (!isRunning) await requestNotifPermission();
    setIsRunning(v => !v);
  }, [isRunning]);

  const handleReset = () => { setIsRunning(false); setTimeLeft(phaseTotal); };
  const handleClose = () => { setIsRunning(false); setModalState('hidden'); };

  // ── Controls block (shared between normal + maximized) ────────────────────
  const Controls = ({ size = 'normal' }: { size?: 'normal' | 'large' }) => (
    <div className={`flex items-center justify-center ${size === 'large' ? 'gap-8' : 'gap-5'}`}>
      <button onClick={handleReset}
        className={`${size === 'large' ? 'w-14 h-14' : 'w-11 h-11'} rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-stone-500 transition-all hover:scale-105 active:scale-95 shadow-sm`}>
        <RotateCcw className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} />
      </button>

      <motion.button whileTap={{ scale: 0.92 }} onClick={handlePlayPause}
        className={`${size === 'large' ? 'w-[88px] h-[88px]' : 'w-[72px] h-[72px]'} rounded-full flex items-center justify-center text-white bg-gradient-to-br ${btnGrad} shadow-[0_6px_22px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.22)]`}>
        <AnimatePresence mode="wait">
          <motion.div key={isRunning ? 'pause' : 'play'}
            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
            {isRunning ? <Pause className={size === 'large' ? 'w-9 h-9' : 'w-7 h-7'} />
                       : <Play  className={size === 'large' ? 'w-9 h-9 ml-1' : 'w-7 h-7 ml-0.5'} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {size === 'normal' && (
        <button onClick={() => setShowConfig(v => !v)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${showConfig ? 'bg-stone-200 text-stone-700' : 'bg-white/60 hover:bg-white text-stone-500'} shadow-sm`}>
          <Settings className="w-4 h-4" />
        </button>
      )}
      {size === 'large' && (
        <button onClick={() => setModalState('normal')}
          className="w-14 h-14 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-stone-500 transition-all hover:scale-105 active:scale-95 shadow-sm">
          <Minimize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── In-app Toast ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <InAppToast key="toast" toast={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* ── Backdrop (normal mode only) ───────────────────────────────────── */}
      <AnimatePresence>
        {modalState === 'normal' && (
          <motion.div key="pomo-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-[200]"
            onClick={() => setModalState('mini')}
          />
        )}
      </AnimatePresence>

      {/* ── Normal modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalState === 'normal' && (
          <motion.div key="pomo-normal"
            drag
            dragMomentum={false}
            dragElastic={0.08}
            style={{ x: modalX, y: modalY }}
            initial={{ opacity: 0, scale: 0.90, y: 32 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.90, y: 32 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed inset-x-4 bottom-6 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-10 sm:w-[370px] z-[201] bg-[#FAF9F6] rounded-3xl shadow-2xl border border-[#E6E1D6] overflow-hidden cursor-default"
            onClick={e => e.stopPropagation()}
          >
            {/* Header — drag handle zone */}
            <div
              className={`${phaseBg} px-5 pt-5 pb-4 flex items-center justify-between border-b border-[#E6E1D6] cursor-grab active:cursor-grabbing`}
            >
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Pomodoro</p>
                <motion.p key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-black mt-0.5" style={{ color: phaseColor }}>
                  {phaseLabel}
                </motion.p>
              </div>

              {/* Drag grip indicator */}
              <div className="flex flex-col gap-[3px] mx-auto opacity-30">
                {[0,1].map(r => (
                  <div key={r} className="flex gap-[3px]">
                    {[0,1,2].map(c => <div key={c} className="w-1 h-1 rounded-full bg-stone-500" />)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {/* Minimize */}
                <button onClick={() => setModalState('mini')}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                {/* Maximize */}
                <button onClick={() => setModalState('maximized')}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {/* Close */}
                <button onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ring + Plant */}
            <div className="px-6 pt-5 pb-2 flex flex-col items-center">
              {/* Session dots — top of body */}
              <div className="flex items-center gap-2 mb-5">
                {Array.from({ length: config.sessionsBeforeLong }).map((_, i) => {
                  const done = i < (sessions % config.sessionsBeforeLong);
                  return (
                    <motion.div key={i}
                      animate={{ scale: done ? 1 : 0.8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`rounded-full transition-colors duration-300 ${done ? 'w-3 h-3 bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'w-2.5 h-2.5 bg-stone-200'}`}
                    />
                  );
                })}
              </div>
              <div className="relative w-48 h-48">
                <div className="absolute inset-0">
                  <ProgressRing progress={progress} phase={phase} size={192} />
                </div>
                <div className="absolute inset-7">
                  <PlantScene progress={progress} phase={phase} />
                </div>
              </div>
              <p className="text-5xl font-black text-stone-800 tabular-nums tracking-tighter mt-4 select-none">
                {fmt(timeLeft)}
              </p>
              <p className="text-[10px] font-semibold text-stone-400 mt-1 mb-5 text-center h-4">
                {growthMsg}
              </p>
            </div>

            {/* Controls */}
            <div className="pb-6"><Controls size="normal" /></div>

            {/* Config panel */}
            <AnimatePresence>
              {showConfig && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden">
                  <div className="px-5 pb-5 pt-1 border-t border-[#E6E1D6]">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-stone-400 mb-3 mt-3">Configuración</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Stepper label="Trabajo" value={config.work} unit="m" min={1} max={90}
                        onChange={v => { setIsRunning(false); setConfig(c => ({ ...c, work: v })); if (phase === 'work') setTimeLeft(v * 60); }} />
                      <Stepper label="Descanso" value={config.break} unit="m" min={1} max={30}
                        onChange={v => { setIsRunning(false); setConfig(c => ({ ...c, break: v })); if (phase === 'break') setTimeLeft(v * 60); }} />
                      <Stepper label="Desc. largo" value={config.longBreak} unit="m" min={5} max={60}
                        onChange={v => { setIsRunning(false); setConfig(c => ({ ...c, longBreak: v })); if (phase === 'longBreak') setTimeLeft(v * 60); }} />
                      <Stepper label="Sesiones" value={config.sessionsBeforeLong} unit="" min={1} max={8}
                        onChange={v => setConfig(c => ({ ...c, sessionsBeforeLong: v }))} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Maximized (full screen) ────────────────────────────────────────── */}
      <AnimatePresence>
        {modalState === 'maximized' && (
          <motion.div key="pomo-maximized"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{    opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed inset-0 z-[210] bg-gradient-to-b ${maxBg} flex flex-col`}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 pt-12 pb-4">
              <button onClick={() => setModalState('normal')}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-bold">Atrás</span>
              </button>
              <div className="flex flex-col items-center">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Pomodoro</p>
                <p className="text-sm font-black" style={{ color: phaseColor }}>{phaseLabel}</p>
              </div>
              <button onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session dots */}
            <div className="flex justify-center gap-2 mb-2">
              {Array.from({ length: config.sessionsBeforeLong }).map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < (sessions % config.sessionsBeforeLong) ? 'bg-emerald-500' : 'bg-stone-200'}`} />
              ))}
            </div>

            {/* Center: big ring + plant */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0">
                  <ProgressRing progress={progress} phase={phase} size={288} />
                </div>
                <div className="absolute inset-9">
                  <PlantScene progress={progress} phase={phase} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-7xl font-black text-stone-800 tabular-nums tracking-tighter select-none">
                  {fmt(timeLeft)}
                </p>
                <p className="text-sm text-stone-400 font-semibold mt-2">{growthMsg}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="pb-16 pt-4"><Controls size="large" /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mini floating widget ───────────────────────────────────────────── */}
      <AnimatePresence>
        {modalState === 'mini' && (
          <motion.div
            key="pomo-mini"
            drag
            dragMomentum={false}
            dragElastic={0.08}
            dragConstraints={{ top: -600, bottom: 100, left: -340, right: 20 }}
            style={{ x: miniX, y: miniY }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{    opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed bottom-24 right-4 z-[300] cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div
              className="flex items-center gap-2.5 bg-white rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.16)] border border-stone-100 pl-3 pr-2 py-2.5"
              style={{ borderLeft: `3px solid ${phaseColor}` }}
            >
              {/* Mini ring */}
              <div className="relative shrink-0" onClick={() => setModalState('normal')}>
                <MiniRing progress={progress} phase={phase} size={36} />
                {/* Pulsing dot when running */}
                {isRunning && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"
                  />
                )}
              </div>

              {/* Time */}
              <button
                onClick={() => setModalState('normal')}
                className="flex flex-col items-start cursor-pointer"
              >
                <span className="text-lg font-black text-stone-800 tabular-nums tracking-tight leading-none">
                  {fmt(timeLeft)}
                </span>
                <span className="text-[9px] font-bold text-stone-400 leading-none mt-0.5">
                  {phase === 'work' ? 'Enfoque' : phase === 'break' ? 'Descanso' : 'Gran desc.'}
                </span>
              </button>

              {/* Play/pause inline */}
              <button
                onClick={handlePlayPause}
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${btnGrad} flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              {/* Close mini */}
              <button
                onClick={handleClose}
                className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 shrink-0 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
