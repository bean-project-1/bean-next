'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';

export function NotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm opacity-60">
        <div className="flex items-center gap-4">
          <BellOff className="w-6 h-6 text-slate-400" />
          <div className="text-left">
            <p className="font-bold text-slate-900 text-base">Notificaciones Push</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Tu navegador no soporta notificaciones.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/60 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className={`p-2 rounded-xl ${isSubscribed ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>
          {isSubscribed ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-900 text-base">Nudges de Productividad</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isSubscribed 
              ? 'Recibes recordatorios rápidos para vencer la inercia.'
              : 'Activa las notificaciones para ayudarte a empezar.'}
          </p>
          {permission === 'denied' && (
            <p className="text-xs text-red-500 font-medium mt-1">Permiso denegado en el navegador. Cambialo en ajustes.</p>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {isSubscribed ? (
          <button
            onClick={unsubscribe}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Desactivar'}
          </button>
        ) : (
          <button
            onClick={subscribe}
            disabled={isLoading || permission === 'denied'}
            className="w-full sm:w-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm shadow-md shadow-violet-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activar'}
          </button>
        )}
      </div>
    </div>
  );
}
