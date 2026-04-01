// =======================================================
// BEAN — Home Page
// apps/web/app/page.tsx
// =======================================================
import Link from 'next/link';

const dimensions = [
  { icon: '🧭', label: 'Identity', desc: 'Values, interests & motivations' },
  { icon: '💼', label: 'Capital', desc: 'Knowledge, skills, career & income' },
  { icon: '❤️', label: 'Wellbeing', desc: 'Health, relationships & happiness' },
];

const stats = [
  { value: '10', label: 'Life Dimensions' },
  { value: 'AI', label: 'Powered Analysis' },
  { value: '360°', label: 'Life View' },
];

export default function HomePage() {
  return (
    <main className="mesh-gradient flex min-h-screen flex-col bg-[#020617] selection:bg-violet-500/30">
      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020617]/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <span className="text-base font-black text-white">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">BEAN</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/onboarding"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:from-violet-500 hover:to-indigo-500 active:scale-95 shadow-lg shadow-violet-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        
        <div className="animate-slide-up max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-violet-300 uppercase">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            Life Intelligence Platform
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-6xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Engineer your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ideal life
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
            BEAN uses advanced AI to synthesize your identity, professional capital, and wellbeing into a unified intelligence engine. Make decisions backed by data, not guesswork.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding"
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-base font-bold text-black transition-all hover:bg-neutral-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Start Life Assessment
              <span className="transition-transform group-hover:translate-x-1.5">→</span>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-16">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <span className="text-4xl font-black tracking-tighter text-white">
                {s.value}
              </span>
              <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Pillars ---- */}
      <section className="relative border-t border-white/5 px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">The DNA of Intelligence</h2>
            <p className="mx-auto max-w-xl text-neutral-400">
              Our framework analyzes three core resonance fields to build your unique life profile.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {dimensions.map((d, i) => (
              <div
                key={d.label}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-8 transition-all hover:-translate-y-2 hover:border-white/20 ${
                  i === 0 ? 'hover:shadow-violet-500/10' : 
                  i === 1 ? 'hover:shadow-blue-500/10' : 
                  'hover:shadow-emerald-500/10'
                }`}
              >
                {/* Accent Glow */}
                <div className={`absolute -right-4 -top-4 h-24 w-24 blur-3xl opacity-0 transition-opacity group-hover:opacity-40 ${
                  i === 0 ? 'bg-violet-500' : 
                  i === 1 ? 'bg-blue-500' : 
                  'bg-emerald-500'
                }`} />

                <div className="relative z-10">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner ${
                    i === 0 ? 'bg-violet-500/10 text-violet-400' : 
                    i === 1 ? 'bg-blue-500/10 text-blue-400' : 
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {d.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">{d.label}</h3>
                  <p className="text-neutral-400 leading-relaxed text-sm">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-white/5 px-6 py-12 text-center">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm font-medium text-neutral-500">
            © {new Date().getFullYear()} BEAN — Life Intelligence. Engineered for growth.
          </p>
          <div className="flex gap-8 text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="text-xs font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Docs</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
