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
  { href: '/dashboard', icon: '📊', label: 'Dashboard'  },
  { href: '/dna',       icon: '🧬', label: 'Mi ADN'     },
  { href: '/insights',  icon: '💡', label: 'Insights'   },
  { href: '/profile',   icon: '👤', label: 'Perfil'     },
];

function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center gap-2 border-r border-white/8 bg-white/[0.02] py-5 backdrop-blur-xl sm:w-56 sm:items-start sm:px-4">
      {/* Logo */}
      <Link href="/dashboard" className="mb-6 flex items-center gap-3 px-1 sm:px-0">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
          <span className="text-sm font-bold text-white">B</span>
        </div>
        <span className="hidden text-sm font-bold text-white sm:block">BEAN</span>
      </Link>

      {/* Nav items */}
      <nav className="flex w-full flex-col gap-1">
        {NAV.map(n => {
          const active = path === n.href || path.startsWith(n.href + '/');
          return (
            <Link key={n.href} href={n.href}
              className={`group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition-all sm:px-3 ${
                active
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-neutral-500 hover:bg-white/5 hover:text-white'
              }`}>
              <span className="text-base">{n.icon}</span>
              <span className="hidden sm:block font-medium">{n.label}</span>
              {active && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-violet-400 sm:block" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto hidden w-full border-t border-white/8 pt-4 sm:block">
        <div className="flex items-center gap-2.5 rounded-xl p-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-medium text-white">Mi perfil</p>
            <p className="text-[10px] text-neutral-600">BEAN v1</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Content area — offset for sidebar */}
      <main className="flex-1 pl-16 sm:pl-56">
        {children}
      </main>
    </div>
  );
}
