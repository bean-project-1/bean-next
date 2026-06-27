// =======================================================
// BEAN — App Shell Layout (Floating Dock + Tool Speed Dial)
// apps/web/app/(app)/layout.tsx
// =======================================================
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Dna, Lightbulb, Bot } from 'lucide-react';
import { DailyWarmup } from '@/features/schedule/DailyWarmup';
import { PomodoroModal } from '@/features/schedule/PomodoroModal';
import { NotesModal } from '@/features/schedule/NotesModal';
import { useGlobalChat } from '@/features/chat/GlobalChatProvider';
import { AppTour } from '@/components/AppTour';

// ─── Static nav links ────────────────────────────────────────────────────────
const LEFT_LINKS  = [
  { href: '/home',     icon: LayoutDashboard, label: 'Árbol'   },
  { href: '/schedule', icon: Calendar,         label: 'Agenda'  },
];
const RIGHT_LINKS = [
  { href: '/dna',      icon: Dna,       label: 'ADN'      },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
];

// ─── NavLink ─────────────────────────────────────────────────────────────────
function NavLink({ href, icon: Icon, label, path }: { href: string; icon: any; label: string; path: string }) {
  const active = path === href || path.startsWith(href + '/');
  return (
    <Link href={href} id={`tour-nav-${href.replace('/', '')}`} className="relative group outline-none">
      {active && (
        <motion.div
          layoutId="active-dock-nav"
          className="absolute inset-0 rounded-full bg-stone-100 border border-stone-200/50"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <div className="relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 transition-colors">
        <Icon className={`w-5 h-5 transition-transform duration-300 ${
          active ? 'scale-110 text-emerald-600' : 'text-stone-400 group-hover:scale-110 group-hover:text-stone-600'
        }`} />
        <span className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
          active ? 'text-stone-800' : 'hidden sm:block text-stone-500 group-hover:text-stone-700'
        }`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

// ─── Tool definitions (order = grid left-to-right, top-to-bottom) ────────────
const TOOL_DEFS = [
  { id: 'chat',     icon: '💬', label: 'Chat',    gradient: 'from-[#1B7A4E] to-[#0B462C]',    disabled: false },
  { id: 'notas',    icon: '📝', label: 'Notas',   gradient: 'from-amber-400 to-amber-600',     disabled: false },
  { id: 'enfoque',  icon: '🔥', label: 'Enfoque', gradient: 'from-emerald-400 to-emerald-600', disabled: false },
  { id: 'pomodoro', icon: '🍅', label: 'Pomo',    gradient: 'from-rose-400 to-red-500',        disabled: false },
];

// ─── AppLayout ────────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path   = usePathname();
  const router = useRouter();
  const { isOpen: isChatOpen, openChat } = useGlobalChat();
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);

  const isFullscreenApp = path === '/schedule' || path.startsWith('/schedule/') || path === '/home';

  // Close tool menu on route change
  useEffect(() => { setIsToolMenuOpen(false); }, [path]);

  const toolActions: Record<string, () => void> = {
    chat:     () => { openChat(); setIsToolMenuOpen(false); },
    notas:    () => { window.dispatchEvent(new CustomEvent('open-notes-modal')); setIsToolMenuOpen(false); },
    pomodoro: () => { window.dispatchEvent(new CustomEvent('open-pomodoro')); setIsToolMenuOpen(false); },
    enfoque:  () => { window.dispatchEvent(new CustomEvent('open-daily-warmup')); setIsToolMenuOpen(false); },
  };

  return (
    <div className={`flex bg-transparent ${isFullscreenApp ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className={`flex-1 w-full relative overflow-x-hidden ${
        isFullscreenApp ? 'h-[100dvh] overflow-hidden' : 'min-h-screen pb-32 sm:pb-32'
      }`}>
        <div className="w-full h-full">{children}</div>
      </main>

      {/* ── BEAN Speed Dial ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isToolMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="tool-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-stone-950/20 backdrop-blur-[2px] z-40"
              onClick={() => setIsToolMenuOpen(false)}
            />

            {/* 2×2 circle grid — outer div owns centering, motion.div owns animation */}
            <div
              key="tool-menu-anchor"
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.72, y: 16 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{    opacity: 0, scale: 0.72, y: 16 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {TOOL_DEFS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={toolActions[tool.id]}
                      disabled={tool.disabled}
                      className={`w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center gap-1 bg-gradient-to-br ${tool.gradient} border border-white/20 shadow-[0_6px_22px_rgba(0,0,0,0.20)] transition-transform ${
                        tool.disabled ? 'opacity-40 cursor-default' : 'active:scale-95 hover:scale-105'
                      }`}
                    >
                      <span className="text-[24px] leading-none">{tool.icon}</span>
                      <span className="text-[9px] font-black text-white/90 uppercase tracking-wider leading-none">
                        {tool.label}
                      </span>
                      {tool.disabled && (
                        <span className="text-[7px] font-black text-white/40 uppercase tracking-wider -mt-0.5">pronto</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating Dock ──────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        {/* Nav pill — left group · center gap under BEAN · right group */}
        <nav className="relative flex items-center rounded-full bg-white/70 border border-black/5 backdrop-blur-xl px-6 py-3 sm:px-10 sm:py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-center gap-5 sm:gap-7">
            {LEFT_LINKS.map(n => <NavLink key={n.href} path={path} {...n} />)}
          </div>
          <div className="w-12 sm:w-14 shrink-0" />
          <div className="flex items-center gap-5 sm:gap-7">
            {RIGHT_LINKS.map(n => <NavLink key={n.href} path={path} {...n} />)}
          </div>

          {/* BEAN button — absolute, floats above the center of the pill */}
          <button
            onClick={() => setIsToolMenuOpen(v => !v)}
            id="tour-nav-bean"
            aria-label="Herramientas BEAN"
            className="absolute left-1/2 -translate-x-1/2 -top-5 group outline-none"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-[3px] ring-stone-100 transition-all duration-300 ${
              isToolMenuOpen
                ? 'bg-gradient-to-br from-stone-400 to-stone-600 shadow-[0_4px_18px_rgba(0,0,0,0.22)] scale-95'
                : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_6px_22px_rgba(52,211,153,0.50)] group-hover:scale-110 group-hover:shadow-[0_8px_28px_rgba(52,211,153,0.60)]'
            }`}>
              <motion.div
                animate={{ rotate: isToolMenuOpen ? 45 : 0 }}
                transition={{ type: 'spring', damping: 18, stiffness: 280 }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </button>
        </nav>
      </div>

      <DailyWarmup />
      <PomodoroModal />
      <NotesModal />
      <TourLoader />
    </div>
  );
}

// ─── TourLoader ───────────────────────────────────────────────────────────────
function TourLoader() {
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.user) setHasSeen(data.data.user.hasSeenTour);
      })
      .catch(console.error);
  }, []);

  if (hasSeen === null || hasSeen === true) return null;
  return <AppTour hasSeenTour={hasSeen} />;
}
