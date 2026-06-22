'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { NotificationSettings } from './NotificationSettings';

interface User { id: string; name?: string; email: string; createdAt: string; notificationPreferences?: any; }

export function ProfileView() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [weeklyReviewEnabled, setWeeklyReviewEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(json => { 
        if (json.success) {
          setUser(json.data.user);
          setEditName(json.data.user.name || '');
          const prefs = json.data.user.notificationPreferences;
          setWeeklyReviewEnabled(prefs?.weeklyReview !== false);
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

  const handleToggleWeeklyReview = async (newValue: boolean) => {
    setWeeklyReviewEnabled(newValue);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notificationPreferences: {
            ...user?.notificationPreferences,
            weeklyReview: newValue
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y borrará todo tu bosque, objetivos, y ADN de forma permanente.')) {
      setSaving(true);
      try {
        const res = await fetch('/api/profile', { method: 'DELETE' });
        if (res.ok) {
          await signOut({ callbackUrl: '/login' });
        } else {
          alert('Error al eliminar la cuenta. Por favor, intenta de nuevo.');
        }
      } catch (err) {
        console.error(err);
        alert('Ocurrió un error al eliminar tu cuenta.');
      } finally {
        setSaving(false);
      }
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
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 max-w-md mx-auto w-full pb-24 sm:pb-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 sm:mb-10 tracking-tight text-center">Mi Perfil</h1>

      <div className="flex flex-col items-center p-8 glass rounded-3xl mb-8">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-violet-500/30 mb-5">
          {initials}
        </div>
        <div className="w-full">
          {isEditing ? (
            <div className="space-y-4 w-full">
              <div>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-center text-lg font-semibold focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none shadow-sm transition-all"
                  placeholder="Tu nombre completo"
                  autoFocus
                />
                <p className="text-xs text-slate-500 font-medium text-center mt-2">{user.email}</p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving || !editName.trim()}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white px-5 py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(user.name || '');
                  }}
                  disabled={saving}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-slate-900">{user.name ?? '—'}</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">{user.email}</p>
              
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-5 text-violet-600 bg-violet-50 hover:bg-violet-100 px-6 py-2.5 rounded-full font-bold transition-all text-sm flex items-center gap-2"
                title="Editar Nombre"
              >
                <span>✏️</span> Editar perfil
              </button>
              
              <p className="text-xs text-slate-400 font-medium mt-6">
                Miembro desde {new Date(user.createdAt).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Configuración</h3>
          <div className="space-y-4">
            <NotificationSettings />
            
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${weeklyReviewEnabled ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>
                  <span className="text-xl">🔄</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-base">Revisión Semanal Proactiva</p>
                  <p className="text-xs text-slate-500/80 font-medium mt-0.5">
                    El Guía BEAN te contactará los domingos para auditar tu progreso y ajustar tu plan.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={weeklyReviewEnabled}
                    onChange={e => handleToggleWeeklyReview(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-violet-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Cuenta</h3>
          <div className="space-y-3">
            <a href="/onboarding"
              className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm hover:border-violet-300 hover:shadow-md hover:shadow-violet-100 transition-all group">
              <div className="flex items-center gap-4">
                 <span className="text-2xl group-hover:scale-110 transition-transform">✏️</span>
             <div className="text-left">
               <p className="font-bold text-slate-900 text-base">Repetir onboarding</p>
               <p className="text-xs text-slate-500 font-medium mt-0.5">Volver a configurar mis metas</p>
             </div>
          </div>
          <span className="text-slate-300 group-hover:text-violet-500 transition-colors font-bold text-lg">→</span>
        </a>

        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group text-left">
          <div className="flex items-center gap-4">
             <span className="text-2xl group-hover:scale-110 transition-transform">🚪</span>
             <div className="text-left">
               <p className="font-bold text-slate-700 text-base">Cerrar Sesión</p>
               <p className="text-xs text-slate-500/70 font-medium mt-0.5">Salir de tu cuenta de forma segura</p>
             </div>
          </div>
          <span className="text-slate-300 group-hover:text-slate-500 transition-colors font-bold text-lg">→</span>
        </button>

        <button onClick={handleDeleteAccount}
          disabled={saving}
          className="w-full flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 shadow-sm hover:border-red-200 hover:shadow-md hover:shadow-red-100 transition-all group text-left disabled:opacity-50">
          <div className="flex items-center gap-4">
             <span className="text-2xl group-hover:scale-110 transition-transform">⚠️</span>
             <div className="text-left">
               <p className="font-bold text-red-700 text-base">Eliminar Cuenta</p>
               <p className="text-xs text-red-500/70 font-medium mt-0.5">Borrar todo mi bosque y progreso</p>
             </div>
          </div>
          <span className="text-red-300 group-hover:text-red-500 transition-colors font-bold text-lg">→</span>
        </button>
          </div>
        </div>
      </div>
    </div>
  );
}
