'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function NotificationPrompt() {
  const { isSupported, permission, isSubscribed, isLoading, subscribe } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(true);

  if (!isSupported) {
    return null; // Not supported on this browser (e.g. Safari on iOS without PWA installed)
  }

  if (permission === 'denied' || isSubscribed || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 max-w-sm w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-2xl z-50 overflow-hidden"
      >
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex items-start gap-4 relative">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1">
              Vence la pereza
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Activa las notificaciones para recibir pequeños impulsos ("nudges") que te ayudarán a empezar tus tareas diarias en menos de 2 minutos.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={subscribe}
                disabled={isLoading}
                className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Activar Nudges'
                )}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label="No gracias"
              >
                <BellOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
