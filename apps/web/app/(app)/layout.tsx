// =======================================================
// BEAN — App Shell Layout (Dashboard, DNA, Insights)
// apps/web/app/(app)/layout.tsx
//
// Persistent sidebar visible on all authenticated pages.
// Route group (app) does NOT add a URL segment.
// =======================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/home',      icon: '🌳', label: 'Mi Árbol'   },
  { href: '/schedule',  icon: '📅', label: 'Mi Agenda'  },
  { href: '/dna',       icon: '🧬', label: 'Mi ADN'     },
  { href: '/insights',  icon: '💡', label: 'Insights'   },
  { href: '/profile',   icon: '👤', label: 'Perfil'     },
];

function Sidebar() {
  const path = usePathname();
  return (
    <>
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden sm:flex fixed left-0 top-0 z-40 h-screen w-56 flex-col items-start gap-2 border-r border-gray-100 bg-white py-5 px-4">
      {/* Logo */}
      <Link href="/home" className="mb-6 flex items-center gap-3 px-1 sm:px-0">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-600 shadow-sm">
          <span className="text-sm font-bold text-white">B</span>
        </div>
        <span className="hidden text-sm font-bold text-gray-900 sm:block">BEAN</span>
      </Link>

      {/* Nav items */}
      <nav className="flex w-full flex-col gap-1">
        {NAV.map(n => {
          const active = path === n.href || path.startsWith(n.href + '/');
          return (
            <Link key={n.href} href={n.href}
              className={`group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-all sm:px-3 ${
                active
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span className="text-base">{n.icon}</span>
              <span className="hidden sm:block">{n.label}</span>
              {active && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-green-500 sm:block" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto w-full border-t border-gray-100 pt-4">
        <Link href="/profile" className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="h-7 w-7 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs">👤</div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-semibold text-gray-900">Mi perfil</p>
            <p className="text-[10px] text-gray-400">BEAN v1</p>
          </div>
        </Link>
      </div>
      </aside>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-slate-100 px-2 py-2 pb-safe flex items-center justify-around">
        {NAV.map(n => {
          const active = path === n.href || path.startsWith(n.href + '/');
          return (
            <Link key={n.href} href={n.href} className="flex flex-col items-center gap-1 p-2 w-16">
              <span className={`text-xl transition-transform ${active ? 'scale-110' : 'opacity-70'}`}>{n.icon}</span>
              <span className={`text-[9px] font-bold ${active ? 'text-green-600' : 'text-slate-400'}`}>{n.label.split(' ')[1] || n.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      {/* Content area — offset for sidebar on desktop, padding bottom for nav on mobile */}
      <main className="flex-1 w-full sm:pl-56 pb-20 sm:pb-0 bg-white min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
