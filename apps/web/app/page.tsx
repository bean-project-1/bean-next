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
    <main className="flex min-h-screen flex-col">
      {/* ---- Navigation ---- */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <span className="text-lg font-bold text-white">BEAN</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/onboarding"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-700 hover:to-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="animate-slide-up max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Life Intelligence Platform
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Understand your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              life trajectory
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400 sm:text-xl">
            BEAN analyzes your identity, capital, and wellbeing to generate a personalized life
            score and AI-powered insights — so you can make better decisions about what matters
            most.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-violet-500/40"
            >
              Start your life assessment →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              View demo dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-12">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-white">{s.value}</span>
              <span className="text-sm text-neutral-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Dimensions ---- */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Three pillars. One life score.</h2>
            <p className="text-neutral-400">
              BEAN measures what matters across all dimensions of a fulfilling life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dimensions.map((d) => (
              <div
                key={d.label}
                className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/8"
              >
                <div className="mb-4 text-4xl">{d.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{d.label}</h3>
                <p className="text-neutral-400">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-neutral-600">
        © {new Date().getFullYear()} BEAN — Life Intelligence Platform. Built with ♥ and AI.
      </footer>
    </main>
  );
}
