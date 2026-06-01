'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

export interface PostIt {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  isPinned: boolean;
  anchoredDate?: string | null;
  createdAt?: string;
}

const COLORS = [
  'bg-yellow-100/90 text-yellow-900 border-yellow-200/50',
  'bg-emerald-100/90 text-emerald-900 border-emerald-200/50',
  'bg-rose-100/90 text-rose-900 border-rose-200/50',
  'bg-blue-100/90 text-blue-900 border-blue-200/50',
  'bg-violet-100/90 text-violet-900 border-violet-200/50',
];

export function PostItWall() {
  const [postIts, setPostIts] = useState<PostIt[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('yellow');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAnchoredDate, setEditingAnchoredDate] = useState<string | null>(null);
  
  const [isMobileTrayOpen, setIsMobileTrayOpen] = useState(false);
  const trayDragControls = useDragControls();
  const [isTrayExpanded, setIsTrayExpanded] = useState(false);
  
  const modalDragControls = useDragControls();

  useEffect(() => setMounted(true), []);

  // Listen for edit requests from Calendar
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      const p = e.detail as PostIt;
      if (p) openEditModal(p);
    };
    window.addEventListener('open-postit-modal', handleOpenModal);
    return () => window.removeEventListener('open-postit-modal', handleOpenModal);
  }, []);

  // Load PostIts
  useEffect(() => {
    fetch('/api/schedule/post-its')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPostIts(data.postIts);
        }
        setLoading(false);
      });
  }, []);

  // Reset expansion state when closing
  useEffect(() => {
    if (!isMobileTrayOpen) setIsTrayExpanded(false);
  }, [isMobileTrayOpen]);

  const openCreateModal = () => {
    setEditingId(null);
    setEditingAnchoredDate(null);
    setNewNoteContent('');
    setNewNoteColor('yellow');
    setIsModalOpen(true);
  };

  const openEditModal = (postIt: PostIt) => {
    setEditingId(postIt.id);
    setEditingAnchoredDate(postIt.anchoredDate || null);
    setNewNoteContent(postIt.content);
    setNewNoteColor(postIt.color);
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (overrideAnchoredDate?: null) => {
    if (!newNoteContent.trim()) return;

    if (editingId) {
      // Update existing
      const finalAnchoredDate = overrideAnchoredDate !== undefined ? overrideAnchoredDate : editingAnchoredDate;
      const isUnanchoring = editingAnchoredDate && finalAnchoredDate === null;

      const updates: Partial<PostIt> = {
        content: newNoteContent,
        color: newNoteColor,
        anchoredDate: finalAnchoredDate
      };

      if (isUnanchoring) {
        updates.x = Math.random() * 80 + 40; 
        updates.y = Math.random() * 300 + 150; 

        const optimisticNote: any = {
          id: editingId,
          content: updates.content,
          color: updates.color,
          anchoredDate: null,
          x: updates.x,
          y: updates.y,
          rotation: (Math.random() - 0.5) * 10,
          zIndex: 999,
          createdAt: new Date().toISOString()
        };
        setPostIts((prev: any) => [...prev, optimisticNote]);
      }

      updatePostIt(editingId, updates);

      if (isUnanchoring) {
        setTimeout(() => {
          window.dispatchEvent(new Event('refresh-schedule'));
        }, 100);
      } else if (finalAnchoredDate) {
        setTimeout(() => window.dispatchEvent(new Event('refresh-schedule')), 100);
      }

      setIsModalOpen(false);
      return;
    }

    // Create new
    const res = await fetch('/api/schedule/post-its', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newNoteContent,
        color: newNoteColor,
        anchoredDate: editingAnchoredDate,
        x: Math.random() * 50 + 20,
        y: Math.random() * 50 + 20,
        rotation: (Math.random() - 0.5) * 10,
        zIndex: postIts.length + 1,
        isPinned: false
      })
    });
    const data = await res.json();
    if (data.success) {
      if (!editingAnchoredDate) {
        setPostIts(prev => [...prev, data.postIt]);
      } else {
        setTimeout(() => window.dispatchEvent(new Event('refresh-schedule')), 100);
      }
      setIsModalOpen(false);
      setNewNoteContent('');
      setNewNoteColor('yellow');
    } else {
      alert('Error al crear la nota. Intenta reiniciar tu servidor de desarrollo.');
    }
  };

  const updatePostIt = async (id: string, updates: Partial<PostIt>) => {
    setPostIts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    await fetch(`/api/schedule/post-its/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  const deletePostIt = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPostIts(prev => prev.filter(p => p.id !== id));
    await fetch(`/api/schedule/post-its/${id}`, { method: 'DELETE' });
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...postIts.map(p => p.zIndex), 0);
    updatePostIt(id, { zIndex: maxZ + 1 });
  };

  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'emerald': return 'bg-emerald-100/90 text-emerald-900 border-emerald-200/50 shadow-emerald-900/10';
      case 'rose': return 'bg-rose-100/90 text-rose-900 border-rose-200/50 shadow-rose-900/10';
      case 'blue': return 'bg-blue-100/90 text-blue-900 border-blue-200/50 shadow-blue-900/10';
      case 'violet': return 'bg-violet-100/90 text-violet-900 border-violet-200/50 shadow-violet-900/10';
      default: return 'bg-yellow-100/90 text-yellow-900 border-yellow-200/50 shadow-yellow-900/10';
    }
  };

  if (loading) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-30">
      {/* Left Mobile Button: Ideas Tray */}
      <div className="fixed bottom-28 left-4 z-40 pointer-events-auto xl:hidden">
        <button
          onClick={() => setIsMobileTrayOpen(true)}
          className="flex items-center justify-center gap-2 bg-stone-800 text-white shadow-xl text-xs font-bold px-4 py-3 rounded-full hover:scale-105 transition-all active:scale-95"
        >
          📝 Notas ({postIts.length})
        </button>
      </div>

      {/* Right Mobile Button: Daily Warmup (Enfoque) */}
      <div className="fixed bottom-28 right-4 z-40 pointer-events-auto xl:hidden">
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log('Dispatching open-daily-warmup');
            window.dispatchEvent(new CustomEvent('open-daily-warmup'));
          }}
          className="flex items-center justify-center gap-2 bg-emerald-500 border border-emerald-400 shadow-xl text-white text-xs font-bold w-14 h-14 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full hover:bg-emerald-400 hover:scale-105 transition-all active:scale-95"
        >
          <span className="text-2xl sm:text-lg leading-none">🔥</span> <span className="hidden sm:inline">Enfoque</span>
        </button>
      </div>

      {/* Desktop Button: New Note */}
      <div className="hidden xl:absolute xl:bottom-8 xl:left-[140px] xl:-translate-x-1/2 xl:flex z-40 pointer-events-auto">
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm text-stone-600 text-xs font-bold px-4 py-2 rounded-xl hover:bg-white hover:scale-105 transition-all active:scale-95"
        >
          <span className="text-lg leading-none text-emerald-500">+</span> <span>Nueva Nota</span>
        </button>
      </div>

      <AnimatePresence>
        {postIts.map(postIt => (
          <DraggablePostIt
            key={postIt.id}
            postIt={postIt}
            containerRef={containerRef}
            isDraggingRef={isDragging}
            bringToFront={bringToFront}
            setPostIts={setPostIts}
            updatePostIt={updatePostIt}
            openEditModal={openEditModal}
            getColorClasses={getColorClasses}
            deletePostIt={deletePostIt}
          />
        ))}
      </AnimatePresence>

      {/* ── Modal to Create/Edit Post-it ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                drag="y"
                dragControls={modalDragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                  if (info.offset.y > 100) setIsModalOpen(false);
                }}
                initial={{ y: '100%' }}
                animate={{ y: 0, height: 'auto' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg bg-white flex flex-col shadow-2xl transition-all duration-300 overflow-hidden rounded-t-[32px] sm:rounded-2xl sm:mb-10"
              >
                <div
                  className="w-full flex justify-center pt-3 pb-3 bg-white shrink-0 cursor-grab active:cursor-grabbing touch-none border-b border-stone-100 sm:hidden"
                  onPointerDown={(e) => modalDragControls.start(e)}
                >
                  <div className="w-12 h-1.5 bg-stone-200 rounded-full pointer-events-none" />
                </div>
                
                <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                  <h3 className="text-lg font-black text-stone-800 tracking-tighter">
                    {editingId ? 'Editar Nota' : 'Crear Nueva Nota'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold transition-colors">✕</button>
                </div>

                <div className="p-6 overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <textarea
                    className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded-xl resize-none outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium text-stone-700"
                    placeholder="¿Qué quieres recordar?"
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                  />

                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Color</p>
                      <div className="flex gap-2">
                        {['yellow', 'emerald', 'rose', 'blue', 'violet'].map(color => (
                          <button
                            key={color}
                            onClick={() => setNewNoteColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${getColorClasses(color).split(' ')[0]} ${newNoteColor === color ? 'border-stone-800 scale-110' : 'border-transparent hover:scale-105'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Fecha (Opcional)</p>
                      <input
                        type="date"
                        className="w-full sm:w-auto p-2 text-xs font-bold uppercase border border-stone-200 rounded-lg text-stone-600 bg-stone-50 outline-none focus:border-emerald-500 transition-colors cursor-pointer hover:bg-stone-100"
                        value={editingAnchoredDate ? new Date(editingAnchoredDate).toISOString().split('T')[0] : ''}
                        onChange={e => {
                          if (!e.target.value) setEditingAnchoredDate(null);
                          else {
                            const d = new Date(e.target.value);
                            const tzDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
                            setEditingAnchoredDate(tzDate.toISOString());
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-6">
                    {editingId && editingAnchoredDate && (
                      <button
                        onClick={() => handleSaveSubmit(null)}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors border border-stone-200"
                      >
                        Desanclar y Enviar a Ideas
                      </button>
                    )}
                    <button
                      onClick={() => handleSaveSubmit()}
                      disabled={!newNoteContent.trim()}
                      className="w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-md"
                    >
                      {editingId ? 'Guardar Cambios' : 'Crear Nota'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Mobile Tray for Ideas ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMobileTrayOpen && (
            <div className="fixed inset-0 z-[99998] flex items-end justify-center overflow-hidden xl:hidden pointer-events-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={() => setIsMobileTrayOpen(false)}
              />
              
              <motion.div
                drag="y"
                dragControls={trayDragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                  if (info.offset.y > 100 && !isTrayExpanded) setIsMobileTrayOpen(false);
                  else if (info.offset.y > 150 && isTrayExpanded) setIsTrayExpanded(false);
                  else if (info.offset.y < -50 && !isTrayExpanded) setIsTrayExpanded(true);
                }}
                initial={{ y: '100%' }}
                animate={{ y: 0, height: isTrayExpanded ? '100dvh' : '80dvh' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`relative w-full bg-[#fffcf8] flex flex-col shadow-2xl transition-all duration-300 overflow-hidden ${isTrayExpanded ? 'rounded-none' : 'rounded-t-[32px]'}`}
              >
                <div
                  className="w-full flex justify-center pt-3 pb-3 bg-white shrink-0 cursor-grab active:cursor-grabbing touch-none border-b border-stone-100"
                  onPointerDown={(e) => trayDragControls.start(e)}
                >
                  <div className="w-12 h-1.5 bg-stone-200 rounded-full pointer-events-none" />
                </div>
                
                <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-white shrink-0">
                  <h3 className="text-xl font-black text-stone-800 tracking-tighter">Bandeja de Ideas</h3>
                  <button onClick={() => setIsMobileTrayOpen(false)} className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold transition-colors">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-[linear-gradient(transparent_27px,#f1f5f9_28px)] bg-[length:100%_28px] pb-32">
                  {postIts.length === 0 ? (
                    <div className="text-center mt-10">
                      <span className="text-4xl opacity-50 mb-2 block">📝</span>
                      <p className="text-sm font-bold text-stone-400">No hay notas sueltas.</p>
                      <p className="text-xs font-medium text-stone-400">Crea una nueva nota para recordarla.</p>
                    </div>
                  ) : (
                    postIts.map(postIt => (
                      <div
                        key={postIt.id}
                        onClick={() => {
                          setIsMobileTrayOpen(false);
                          openEditModal(postIt);
                        }}
                        className={`w-full p-4 rounded-2xl shadow-sm border cursor-pointer active:scale-[0.98] transition-transform ${getColorClasses(postIt.color)}`}
                      >
                        <p className="text-sm font-medium text-stone-800 whitespace-pre-wrap leading-relaxed">{postIt.content}</p>
                        <p className="text-[10px] font-bold opacity-50 mix-blend-multiply mt-2 uppercase tracking-widest">
                          {new Date(postIt.createdAt || Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Fixed "Crear Nota" button inside the Tray */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#fffcf8] via-[#fffcf8] to-transparent pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <button
                    onClick={() => {
                      setIsMobileTrayOpen(false);
                      openCreateModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white shadow-xl text-sm font-black uppercase tracking-wider px-6 py-4 rounded-2xl transition-all active:scale-95"
                  >
                    <span className="text-lg leading-none text-emerald-400">+</span> Crear Nueva Nota
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function DraggablePostIt({
  postIt,
  containerRef,
  isDraggingRef,
  bringToFront,
  setPostIts,
  updatePostIt,
  openEditModal,
  getColorClasses,
  deletePostIt
}: any) {
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      onDragStart={() => {
        isDraggingRef.current = true;
        bringToFront(postIt.id);
      }}
      onDrag={(e, info) => {
        if (typeof document !== 'undefined') {
          const elements = document.elementsFromPoint(info.point.x, info.point.y);
          const cellEl = elements.find(el => el.getAttribute('data-date'));
          if (cellEl && !isHoveringDrop) {
            setIsHoveringDrop(true);
          } else if (!cellEl && isHoveringDrop) {
            setIsHoveringDrop(false);
          }
        }
      }}
      onDragEnd={(_, info) => {
        setTimeout(() => { isDraggingRef.current = false; }, 150);
        setIsHoveringDrop(false);
        if (typeof document !== 'undefined') {
          const elements = document.elementsFromPoint(info.point.x, info.point.y);
          const cellEl = elements.find(el => el.getAttribute('data-date'));
          if (cellEl) {
            const timestamp = parseInt(cellEl.getAttribute('data-date')!, 10);
            if (!isNaN(timestamp)) {
              const anchoredDate = new Date(timestamp);
              setPostIts((prev: any) => prev.filter((p: any) => p.id !== postIt.id));
              updatePostIt(postIt.id, { anchoredDate: anchoredDate.toISOString() });
              setTimeout(() => window.dispatchEvent(new Event('refresh-schedule')), 300);
              return;
            }
          }
        }

        const newX = postIt.x + info.offset.x;
        const newY = postIt.y + info.offset.y;
        updatePostIt(postIt.id, { x: newX, y: newY });
      }}
      onClick={() => {
        if (isDraggingRef.current) return;
        openEditModal(postIt);
      }}
      initial={{ x: postIt.x, y: postIt.y, rotate: postIt.rotation, scale: 0 }}
      animate={{
        x: postIt.x,
        y: postIt.y,
        rotate: postIt.rotation,
        scale: isHoveringDrop ? 0.3 : 1,
        zIndex: postIt.zIndex,
        opacity: isHoveringDrop ? 0.8 : 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`hidden xl:flex absolute w-40 h-40 p-4 rounded-md shadow-lg border backdrop-blur-sm cursor-grab active:cursor-grabbing flex-col pointer-events-auto ${getColorClasses(postIt.color)}`}
      style={{ touchAction: 'none' }}
    >
      <div className="flex justify-between items-start mb-1 absolute top-2 w-full left-0 px-2 pointer-events-none">
        <span className="text-[10px] font-bold opacity-40 mix-blend-multiply ml-1 mt-0.5">
          {new Date(postIt.createdAt || Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
        </span>
        <button
          onClick={(e) => deletePostIt(postIt.id, e)}
          className="opacity-0 group-hover:opacity-100 text-black/40 hover:text-red-500 transition-all p-1 bg-white/50 rounded-full pointer-events-auto mr-1"
          title="Eliminar"
        >
          ✕
        </button>
      </div>

      <p className="flex-1 w-full mt-5 font-medium text-sm leading-tight overflow-hidden break-words whitespace-pre-wrap select-none">
        {postIt.content}
      </p>
    </motion.div>
  );
}
