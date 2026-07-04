// =======================================================
// BEAN — App Shell Layout (Floating Dock + Tool Speed Dial)
// apps/web/app/(app)/layout.tsx
// =======================================================
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Dna, Lightbulb, Bot, X, Timer, PenTool, Flame, MessageCircle } from 'lucide-react';
import { DailyWarmup } from '@/features/schedule/DailyWarmup';
import { PomodoroModal } from '@/features/schedule/PomodoroModal';
import { NotesModal } from '@/features/schedule/NotesModal';
import { useGlobalChat } from '@/features/chat/GlobalChatProvider';
import { AppTour } from '@/components/AppTour';
import { UserMenu } from '@/components/UserMenu';

// ─── Static nav links ────────────────────────────────────────────────────────
const LEFT_LINKS = [
  { href: '/home', icon: LayoutDashboard, label: 'Árbol' },
  { href: '/schedule', icon: Calendar, label: 'Agenda' },
];
const RIGHT_LINKS = [
  { href: '/dna', icon: Dna, label: 'Yo' },
  { href: '/descubre', icon: Lightbulb, label: 'Descubre' },
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
        <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110 text-emerald-600' : 'text-stone-400 group-hover:scale-110 group-hover:text-stone-600'
          }`} />
        <span className={`text-[10px] sm:text-xs font-semibold tracking-wide ${active ? 'text-stone-800' : 'hidden sm:block text-stone-500 group-hover:text-stone-700'
          }`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { isOpen: isChatOpen, openChat, closeChat } = useGlobalChat();
  const [showRadialMenu, setShowRadialMenu] = useState(false);

  const isFullscreenApp = path === '/schedule' || path.startsWith('/schedule/') || path === '/home';

  // Close chat/menu on route change
  const lastPathRef = useRef(path);
  useEffect(() => {
    if (lastPathRef.current !== path) {
      closeChat();
      setShowRadialMenu(false);
      lastPathRef.current = path;
    }
  }, [path, closeChat]);

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (!isChatOpen) {
        setShowRadialMenu(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500);
  };

  const handlePointerUpOrLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleCentralButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLongPressRef.current) {
      // It was a long press, do nothing on click
      return;
    }

    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
      if (showRadialMenu) setShowRadialMenu(false);
    }
  };

  const tools = [
    {
      name: 'Pomodoro',
      icon: Timer,
      color: 'bg-rose-50 hover:bg-rose-100 text-rose-600 ring-rose-200/50',
      angle: 180,
      action: () => {
        window.dispatchEvent(new CustomEvent('open-pomodoro'));
        setShowRadialMenu(false);
      },
    },
    {
      name: 'Notas',
      icon: PenTool,
      color: 'bg-amber-50 hover:bg-amber-100 text-amber-600 ring-amber-200/50',
      angle: 120,
      action: () => {
        window.dispatchEvent(new CustomEvent('open-notes-modal'));
        setShowRadialMenu(false);
      },
    },
    {
      name: 'Enfoque',
      icon: Flame,
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-600 ring-orange-200/50',
      angle: 60,
      action: () => {
        window.dispatchEvent(new CustomEvent('open-daily-warmup'));
        setShowRadialMenu(false);
      },
    },
    {
      name: 'HollyChat',
      icon: MessageCircle,
      color: 'bg-[#EBF2EB] hover:bg-[#DCE9DC] text-emerald-700 ring-emerald-200/50',
      angle: 0,
      action: () => {
        window.open('https://hollychat.org', '_blank', 'noopener,noreferrer');
        setShowRadialMenu(false);
      },
    },
  ];

  return (
    <div className={`flex bg-transparent ${isFullscreenApp ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>

      {/* Backdrop overlay for radial menu */}
      <AnimatePresence>
        {showRadialMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/10 backdrop-blur-[2px] z-40"
            onClick={() => setShowRadialMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className={`flex-1 w-full relative overflow-x-hidden ${isFullscreenApp ? 'h-[100dvh] overflow-hidden' : 'min-h-screen pb-32 sm:pb-32'
        }`}>
        <UserMenu />
        <div className="w-full h-full">{children}</div>
      </main>

      {/* ── Floating Dock ──────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">

        {/* Radial Speed Dial Menu */}
        <AnimatePresence>
          {showRadialMenu && (
            <div className="absolute left-1/2 -top-5 -translate-x-1/2 pointer-events-none z-10 w-14 h-14">
              {/* Radial Backdrop Dome */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                style={{
                  position: 'absolute',
                  left: 'calc(50% - 135px)',
                  top: 'calc(50% - 135px)',
                  width: '270px',
                  height: '270px',
                }}
                className="rounded-full bg-white/50 border border-white/30 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] pointer-events-auto origin-center -z-10"
              />

              {/* Radial buttons */}
              {tools.map((tool, idx) => {
                const angleRad = (tool.angle * Math.PI) / 180;
                const radius = 85;
                const targetX = Math.round(radius * Math.cos(angleRad));
                const targetY = Math.round(-radius * Math.sin(angleRad));

                const Icon = tool.icon;

                return (
                  <motion.button
                    key={tool.name}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ x: targetX, y: targetY, scale: 1, opacity: 1 }}
                    exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 20,
                      stiffness: 250,
                      delay: idx * 0.02,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      tool.action();
                    }}
                    style={{
                      position: 'absolute',
                      left: 'calc(50% - 22px)',
                      top: 'calc(50% - 22px)',
                    }}
                    className="pointer-events-auto flex flex-col items-center group outline-none w-11 h-11"
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md border border-stone-200/10 ring-[3px] ring-white transition-transform duration-200 active:scale-95 ${tool.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-stone-500 tracking-tight whitespace-nowrap opacity-85 group-hover:opacity-100 group-hover:text-stone-700 transition-opacity">
                      {tool.name}
                    </span>
                  </motion.button>
                );
              })}

              {/* Central BEAN button replica (inside container context, stacks above dome) */}
              <button
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUpOrLeave}
                onPointerLeave={handlePointerUpOrLeave}
                onClick={handleCentralButtonClick}
                className="pointer-events-auto group outline-none w-14 h-14 z-20"
                style={{
                  position: 'absolute',
                  left: 'calc(50% - 28px)',
                  top: 'calc(50% - 28px)',
                }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-[3px] ring-stone-100 transition-all duration-300 ${isChatOpen
                    ? 'bg-gradient-to-br from-stone-400 to-stone-600 shadow-[0_4px_18px_rgba(0,0,0,0.22)] scale-95'
                    : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_6px_22px_rgba(52,211,153,0.50)] group-hover:scale-110 group-hover:shadow-[0_8px_28px_rgba(52,211,153,0.60)]'
                  }`}>
                  <motion.div
                    animate={{ rotate: isChatOpen ? 90 : 0 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 280 }}
                  >
                    {isChatOpen ? (
                      <X className="w-6 h-6 text-white" />
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                </div>
              </button>
            </div>
          )}
        </AnimatePresence>

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
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            onClick={handleCentralButtonClick}
            id="tour-nav-bean"
            aria-label="Herramientas BEAN"
            className={`absolute left-1/2 -translate-x-1/2 -top-5 group outline-none transition-opacity duration-200 ${showRadialMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-[3px] ring-stone-100 transition-all duration-300 ${isChatOpen
                ? 'bg-gradient-to-br from-stone-400 to-stone-600 shadow-[0_4px_18px_rgba(0,0,0,0.22)] scale-95'
                : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_6px_22px_rgba(52,211,153,0.50)] group-hover:scale-110 group-hover:shadow-[0_8px_28px_rgba(52,211,153,0.60)]'
              }`}>
              <motion.div
                animate={{ rotate: isChatOpen ? 90 : 0 }}
                transition={{ type: 'spring', damping: 18, stiffness: 280 }}
              >
                {isChatOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
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
