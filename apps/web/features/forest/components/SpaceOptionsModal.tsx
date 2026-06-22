import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteSpace, leaveSpace, updateMemberRole } from '../../spaces/actions/spaces';
import { LogOut, Trash2, Shield, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface SpaceOptionsModalProps {
  space: any;
  onClose: () => void;
  onDeleted: () => void;
}

export function SpaceOptionsModal({ space, onClose, onDeleted }: SpaceOptionsModalProps) {
  const { id: spaceId, name: spaceName, role, membersList = [] } = space;
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const isOwner = role === 'owner';

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { generateInviteLink } = await import('../../spaces/actions/spaces');
      const token = await generateInviteLink(spaceId);
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
          title: `Únete a mi árbol: ${spaceName}`,
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

  const handleLeaveOrDelete = async () => {
    setActionLoading(true);
    try {
      if (isOwner) {
        await deleteSpace(spaceId);
      } else {
        await leaveSpace(spaceId);
      }
      onDeleted();
    } catch (e: any) {
      alert('Error: ' + e.message);
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (targetUserId: string, currentRole: string) => {
    if (!isOwner) return;
    const newRole = currentRole === 'owner' ? 'member' : 'owner';
    try {
      await updateMemberRole(spaceId, targetUserId, newRole);
      // We don't have local mutation here easily without refreshing, 
      // but revalidatePath('/home') in the action will update it on the next fetch.
      // We can optimistic update or just alert success.
    } catch (e: any) {
      alert('Error al cambiar rol: ' + e.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        key="modal"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[101] max-w-lg mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-t-3xl p-6 text-white shadow-2xl"
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
        <h3 className="text-xl font-bold mb-2">Opciones de {spaceName}</h3>
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

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Miembros del Árbol ({membersList.length})
              </h4>
              <div className="space-y-2 mb-8 max-h-[30vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {membersList.map((member: any) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      {member.avatarUrl ? (
                        <Image src={member.avatarUrl} alt={member.name} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white">{member.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          {member.role === 'owner' ? <Shield className="w-3 h-3 text-emerald-400" /> : null}
                          {member.role === 'owner' ? 'Creador' : 'Miembro'}
                        </p>
                      </div>
                    </div>
                    {isOwner && member.role !== 'owner' && (
                      <button 
                        onClick={() => handleChangeRole(member.userId, member.role)}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Hacer Creador
                      </button>
                    )}
                    {isOwner && member.role === 'owner' && membersList.filter((m: any) => m.role === 'owner').length > 1 && (
                      <button 
                        onClick={() => handleChangeRole(member.userId, member.role)}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Hacer Miembro
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {showConfirm ? (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                  <p className="text-red-200 text-sm mb-4 font-medium">
                    {isOwner 
                      ? '¿Estás seguro de eliminar este árbol? Se borrarán todas las ramas, metas y chats para todos los miembros.' 
                      : '¿Estás seguro de que quieres salir de este árbol? Perderás el acceso a todas sus ramas y chat.'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleLeaveOrDelete}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold text-sm"
                    >
                      {actionLoading ? 'Procesando...' : 'Sí, confirmar'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-2xl transition-colors flex justify-center items-center gap-2 border border-red-500/20"
                >
                  {isOwner ? <Trash2 className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
                  {isOwner ? 'Eliminar Árbol (para todos)' : 'Salir del Árbol'}
                </button>
              )}
            </div>
          </motion.div>
    </AnimatePresence>
  );
}
