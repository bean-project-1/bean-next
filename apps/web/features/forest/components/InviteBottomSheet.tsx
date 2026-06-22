import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InviteBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  spaceName: string;
  onGenerateLink: () => Promise<string>;
}

export function InviteBottomSheet({ isOpen, onClose, spaceName, onGenerateLink }: InviteBottomSheetProps) {
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = await onGenerateLink();
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
      setInviteLink(`${origin}/join/${token}`);
    } catch (e) {
      console.error(e);
      alert('Error al generar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && inviteLink) {
      try {
        await navigator.share({
          title: `Únete a mi bosque: ${spaceName}`,
          text: `Te invito a colaborar en "${spaceName}" dentro de Bean.`,
          url: inviteLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] max-w-lg mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-t-3xl p-6 text-white shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">Invitar a {spaceName}</h3>
            <p className="text-slate-300 text-sm mb-6">
              Haz crecer este árbol acompañado. Comparte este enlace con tus amigos, socios o pareja para que puedan ver y editar las metas de este espacio.
            </p>

            {!inviteLink ? (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Generar enlace de invitación'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-emerald-400 truncate text-sm mr-4 font-mono">{inviteLink}</span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-colors flex justify-center items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                  </svg>
                  Compartir enlace
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
