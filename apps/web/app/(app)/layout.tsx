// =======================================================
// BEAN — App Shell Layout (Floating Dock)
// apps/web/app/(app)/layout.tsx
// =======================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Dna, Lightbulb, User } from 'lucide-react';
import { DailyWarmup } from '@/features/schedule/DailyWarmup';

const NAV = [
  { href: '/home', icon: LayoutDashboard, label: 'Árbol' },
  { href: '/schedule', icon: Calendar, label: 'Agenda' },
  { href: '/dna', icon: Dna, label: 'Mi ADN' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
  { href: '/profile', icon: User, label: 'Perfil' },
];

function FloatingDock() {
  const path = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-2 sm:gap-4 rounded-full bg-white/70 border border-black/5 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        {NAV.map(n => {
          const active = path === n.href || path.startsWith(n.href + '/');
          const Icon = n.icon;
          return (
            <Link key={n.href} href={n.href} className="relative group outline-none">
              {active && (
                <motion.div
                  layoutId="active-dock-nav"
                  className="absolute inset-0 rounded-full bg-stone-100 border border-stone-200/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 transition-colors">
                <Icon className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-300 ${active ? 'scale-110 text-emerald-600' : 'text-stone-400 group-hover:scale-110 group-hover:text-stone-600'}`} />
                <span className={`text-[10px] sm:text-xs font-semibold tracking-wide ${active ? 'text-stone-800' : 'hidden sm:block text-stone-500 group-hover:text-stone-700'}`}>
                  {n.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isSchedule = path === '/schedule' || path.startsWith('/schedule/');

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Content area */}
      <main className={`flex-1 w-full min-h-screen relative overflow-x-hidden ${isSchedule ? '' : 'pb-32 sm:pb-32'}`}>
        <div className="w-full h-full">
          {children}
        </div>
      </main>
      <FloatingDock />
      <DailyWarmup />
    </div>
  );
}
