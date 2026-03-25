'use client';

import { useState, useEffect } from 'react';

interface User { id: string; name?: string; email: string; createdAt: string; }

export function ProfileView() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(json => { 
        if (json.success) {
          setUser(json.data.user);
          setEditName(json.data.user.name || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
    <div className="min-h-screen px-6 py-8 max-w-2xl bg-transparent">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">Mi Perfil</h1>

      <div className="flex items-center gap-5 mb-10 p-6 glass rounded-3xl">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30 flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-lg font-semibold focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none shadow-sm transition-all"
                placeholder="Tu nombre completo"
                autoFocus
              />
              <p className="text-sm text-slate-500 font-medium">{user.email} (No editable por seguridad)</p>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving || !editName.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar y Actualizar'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(user.name || '');
                  }}
                  disabled={saving}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{user.name ?? '—'}</p>
                  <p className="text-base text-slate-500 font-medium">{user.email}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-slate-500 hover:text-violet-600 bg-slate-100/50 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all text-sm font-bold flex gap-2 items-center"
                  title="Editar Perfil"
                >
                  <span className="text-lg">✏️</span> Editar
                </button>
              </div>
              <p className="text-sm text-slate-400 font-medium mt-3">
                Miembro desde {new Date(user.createdAt).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a href="/dna"
          className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all group">
          <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform origin-left">🧬</span>
          <p className="font-bold text-slate-900 text-base">Mi ADN de vida</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Editar las 19 dimensiones</p>
        </a>
        <a href="/dashboard"
          className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all group">
          <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform origin-left">📊</span>
          <p className="font-bold text-slate-900 text-base">Dashboard</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Ver mis gráficas</p>
        </a>
        <a href="/insights"
          className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all group">
          <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform origin-left">💡</span>
          <p className="font-bold text-slate-900 text-base">Insights</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Recomendaciones de IA</p>
        </a>
        <a href="/onboarding"
          className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all group">
          <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform origin-left">✏️</span>
          <p className="font-bold text-slate-900 text-base">Repetir onboarding</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Actualizar mi perfil</p>
        </a>
      </div>
    </div>
  );
}
