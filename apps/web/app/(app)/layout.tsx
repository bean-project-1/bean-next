// =======================================================
// BEAN — App Shell Layout (Floating Dock + Tool Speed Dial)
// apps/web/app/(app)/layout.tsx
// =======================================================
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Dna, Lightbulb, Bot, X } from 'lucide-react';
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

// ─── AppLayout ────────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path   = usePathname();
  const router = useRouter();
  const { isOpen: isChatOpen, openChat, closeChat } = useGlobalChat();

  const isFullscreenApp = path === '/schedule' || path.startsWith('/schedule/') || path === '/home';

  // Close chat on route change
  const lastPathRef = useRef(path);
  useEffect(() => { 
    if (lastPathRef.current !== path) {
      closeChat(); 
      lastPathRef.current = path;
    }
  }, [path, closeChat]);

  const toggleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  return (
    <div className={`flex bg-transparent ${isFullscreenApp ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className={`flex-1 w-full relative overflow-x-hidden ${
        isFullscreenApp ? 'h-[100dvh] overflow-hidden' : 'min-h-screen pb-32 sm:pb-32'
      }`}>
        <div className="w-full h-full">{children}</div>
      </main>

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
            onClick={toggleChat}
            id="tour-nav-bean"
            aria-label="Herramientas BEAN"
            className="absolute left-1/2 -translate-x-1/2 -top-5 group outline-none"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-[3px] ring-stone-100 transition-all duration-300 ${
              isChatOpen
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
