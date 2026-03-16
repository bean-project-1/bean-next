// =======================================================
// BEAN — Insights Page (Coming soon)
// apps/web/app/(app)/insights/page.tsx
// =======================================================
'use client';

export default function InsightsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="text-5xl mb-4">💡</span>
      <h1 className="text-2xl font-bold text-white mb-2">Insights</h1>
      <p className="text-neutral-400 text-sm mb-6 max-w-sm">
        Aquí verás los insights generados por IA sobre tu trayectoria de vida.
        Completa tu perfil primero para comenzar a recibirlos.
      </p>
      <div className="flex gap-3">
        <a href="/dna"
          className="rounded-xl border border-violet-500/30 bg-violet-600/10 px-5 py-2.5 text-sm font-medium text-violet-300 hover:bg-violet-600/20 transition-all">
          🧬 Completar mi ADN
        </a>
        <a href="/dashboard"
          className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-neutral-400 hover:text-white transition-all">
          ← Dashboard
        </a>
      </div>
      <p className="mt-8 text-xs text-neutral-700">Próximamente — análisis con IA de las 19 dimensiones</p>
    </div>
  );
}
