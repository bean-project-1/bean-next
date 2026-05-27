// =======================================================
// BEAN — Home Page (Organic V2)
// apps/web/app/page.tsx
// =======================================================
import Link from 'next/link';
import { Compass, Briefcase, Heart } from 'lucide-react';

const dimensions = [
  { icon: Compass, label: 'Identidad', desc: 'Valores, intereses y motivaciones profundas.' },
  { icon: Briefcase, label: 'Capital', desc: 'Conocimiento, habilidades y trayectoria.' },
  { icon: Heart, label: 'Bienestar', desc: 'Salud, relaciones y paz mental.' },
];

const stats = [
  { value: '10', label: 'Dimensiones' },
  { value: 'IA', label: 'Coaching Activo' },
  { value: '360°', label: 'Visión de Vida' },
];

export default function HomePage() {
  return (
    <main className="mesh-gradient flex min-h-screen flex-col bg-transparent selection:bg-emerald-500/20">
      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 shadow-inner">
              <span className="text-base font-black text-emerald-700">B</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-stone-800">BEAN</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/home"
              className="hidden sm:inline text-sm font-semibold text-stone-500 transition-colors hover:text-stone-900"
            >
              Árbol
            </Link>
            <div className="hidden sm:block h-4 w-px bg-stone-200" />
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-semibold text-stone-500 transition-colors hover:text-stone-900"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/onboarding"
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-stone-800 active:scale-95 shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center">
        <div className="animate-slide-up max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-wider text-amber-700 uppercase shadow-sm">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            Tu Asistente de Vida Inteligente
          </div>

          {/* Headline */}
          <h1 className="mb-6 sm:mb-8 text-5xl sm:text-7xl lg:text-[5.5rem] font-display font-extrabold leading-[1.05] tracking-tight text-stone-900">
            Diseña tu{' '}
            <span className="text-emerald-600">
              vida ideal
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-10 sm:mb-12 max-w-2xl text-base sm:text-xl leading-relaxed text-stone-600 font-medium">
            Descubre patrones, establece metas con propósito y recibe acompañamiento diario. BEAN es tu espacio personal para cultivar la mejor versión de ti mismo.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)]"
            >
              Crear mi perfil
              <span className="transition-transform group-hover:translate-x-1.5">→</span>
            </Link>
            <Link
              href="/home"
              className="rounded-full border border-stone-200 bg-white/60 px-8 py-4 text-base font-bold text-stone-700 backdrop-blur-xl transition-all hover:bg-white hover:border-stone-300 shadow-sm"
            >
              Explorar
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-24 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <span className="text-4xl font-display font-black tracking-tighter text-stone-800">
                {s.value}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Pillars ---- */}
      <section className="relative px-6 py-32 bg-white/40 border-t border-stone-100">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-display font-bold tracking-tight text-stone-900 sm:text-5xl">El ADN de tu Desarrollo</h2>
            <p className="mx-auto max-w-xl text-stone-500 font-medium text-lg">
              Analizamos tres dimensiones fundamentales para ayudarte a encontrar el equilibrio perfecto.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {dimensions.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.label}
                  className="group relative overflow-hidden rounded-[2rem] border border-stone-100 bg-white/80 p-8 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative z-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner bg-stone-50 text-emerald-600 border border-stone-100 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mb-3 text-2xl font-display font-bold text-stone-800 tracking-tight">{d.label}</h3>
                    <p className="text-stone-500 font-medium leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-black/5 px-6 py-12 text-center bg-transparent">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm font-semibold text-stone-400">
            © {new Date().getFullYear()} BEAN — Inteligencia de Vida.
          </p>
          <div className="flex gap-8 text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-widest hover:text-stone-800 cursor-pointer transition-colors">Privacidad</span>
            <span className="text-[11px] font-bold uppercase tracking-widest hover:text-stone-800 cursor-pointer transition-colors">Términos</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
