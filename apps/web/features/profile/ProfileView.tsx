'use client';

import { useState, useEffect } from 'react';

interface User { id: string; name?: string; email: string; createdAt: string; }

export function ProfileView() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(json => { if (json.success) setUser(json.data.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
        <span className="text-5xl mb-4">👤</span>
        <h1 className="text-xl font-bold text-white mb-2">Sin sesión activa</h1>
        <a href="/onboarding"
          className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white">
          Comenzar onboarding →
        </a>
      </div>
    );
  }

  const initials = (user.name ?? user.email)
    .split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Mi Perfil</h1>

      <div className="flex items-center gap-5 mb-8">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-violet-500/30">
          {initials}
        </div>
        <div>
          <p className="text-xl font-bold text-white">{user.name ?? '—'}</p>
          <p className="text-sm text-neutral-400">{user.email}</p>
          <p className="text-xs text-neutral-600 mt-1">
            Miembro desde {new Date(user.createdAt).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a href="/dna"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all group">
          <span className="text-2xl block mb-2">🧬</span>
          <p className="font-semibold text-white text-sm">Mi ADN de vida</p>
          <p className="text-xs text-neutral-500 mt-1">Editar las 19 dimensiones</p>
        </a>
        <a href="/dashboard"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all">
          <span className="text-2xl block mb-2">📊</span>
          <p className="font-semibold text-white text-sm">Dashboard</p>
          <p className="text-xs text-neutral-500 mt-1">Ver mis gráficas</p>
        </a>
        <a href="/insights"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all">
          <span className="text-2xl block mb-2">💡</span>
          <p className="font-semibold text-white text-sm">Insights</p>
          <p className="text-xs text-neutral-500 mt-1">Recomendaciones de IA</p>
        </a>
        <a href="/onboarding"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all">
          <span className="text-2xl block mb-2">✏️</span>
          <p className="font-semibold text-white text-sm">Repetir onboarding</p>
          <p className="text-xs text-neutral-500 mt-1">Actualizar mi perfil</p>
        </a>
      </div>
    </div>
  );
}
