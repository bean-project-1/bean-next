'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { X, RefreshCw, Maximize2, Minimize2, MessageCircle } from 'lucide-react';

export function HollyChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Drag positions for desktop — persist within session
  const modalX = useMotionValue(0);
  const modalY = useMotionValue(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen to custom open event
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-hollychat', handler);
    return () => window.removeEventListener('open-hollychat', handler);
  }, []);

  // Reset drag position on open (desktop only)
  useEffect(() => {
    if (isOpen && !isMobile) {
      modalX.set(0);
      modalY.set(0);
    }
  }, [isOpen, isMobile, modalX, modalY]);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'https://hollychat.org';
    }
  };

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="holly-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-[200]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Modal Window ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="holly-modal"
            {...(isMobile
              ? {
                  drag: 'y',
                  dragConstraints: { top: 0, bottom: 0 },
                  dragElastic: 0.15,
                  onDragEnd: (e, info) => {
                    if (info.offset.y > 150) {
                      setIsOpen(false);
                    }
                  },
                  initial: { y: '100%' },
                  animate: { y: 0 },
                  exit: { y: '100%' },
                }
              : {
                  drag: !isMaximized,
                  dragMomentum: false,
                  dragElastic: 0.08,
                  style: { x: modalX, y: modalY },
                  initial: { opacity: 0, scale: 0.9, y: 32 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.9, y: 32 },
                })}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={
              isMobile
                ? "fixed bottom-0 left-0 w-full h-[90dvh] z-[201] bg-[#F4F6F4] rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] border-t border-[#E1E6E1] overflow-hidden flex flex-col"
                : isMaximized
                ? "fixed inset-4 z-[201] bg-[#F4F6F4] rounded-3xl shadow-2xl border border-[#E1E6E1] overflow-hidden flex flex-col"
                : "fixed inset-x-4 bottom-6 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-10 sm:w-[480px] sm:h-[600px] z-[201] bg-[#F4F6F4] rounded-3xl shadow-2xl border border-[#E1E6E1] overflow-hidden flex flex-col cursor-default"
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Swipe handle */}
            {isMobile && (
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />
            )}

            {/* Header */}
            <div
              className={`px-5 py-4 bg-[#EBF2EB] border-b border-[#D5DDD5] flex items-center justify-between shrink-0 ${
                isMobile || isMaximized ? '' : 'cursor-grab active:cursor-grabbing'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700/70">
                    Bienestar Emocional
                  </p>
                  <p className="text-sm font-bold text-stone-800 -mt-0.5">HollyChat</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                {/* Reload */}
                <button
                  onClick={handleReload}
                  title="Recargar HollyChat"
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-stone-500 hover:text-stone-700 flex items-center justify-center transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Maximize / Minimize (Desktop only) */}
                {!isMobile && (
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? 'Restaurar tamaño' : 'Maximizar'}
                    className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-stone-500 hover:text-stone-700 flex items-center justify-center transition-colors"
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar"
                  className="w-8 h-8 rounded-full bg-stone-200/50 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Iframe content */}
            <div className="flex-1 w-full bg-white relative">
              <iframe
                ref={iframeRef}
                src="https://hollychat.org"
                title="HollyChat Platform"
                className="w-full h-full border-none"
                allow="microphone"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
