'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PostIt {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  isPinned: boolean;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('yellow');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleCreateSubmit = async () => {
    if (!newNoteContent.trim()) return;
    
    const res = await fetch('/api/schedule/post-its', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newNoteContent,
        color: newNoteColor,
        x: Math.random() * 50 + 20,
        y: Math.random() * 50 + 20,
        rotation: (Math.random() - 0.5) * 10,
        zIndex: postIts.length + 1,
        isPinned: false
      })
    });
    const data = await res.json();
    if (data.success) {
      setPostIts(prev => [...prev, data.postIt]);
      setIsModalOpen(false);
      setNewNoteContent('');
      setNewNoteColor('yellow');
    } else {
      alert('Error al crear la nota. Intenta reiniciar tu servidor de desarrollo (npm run dev) para que tome los cambios de la base de datos.');
    }
  };

  const updatePostIt = async (id: string, updates: Partial<PostIt>) => {
    // Optimistic UI update
    setPostIts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    await fetch(`/api/schedule/post-its/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  const deletePostIt = async (id: string) => {
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

  if (loading) return <div className="p-4 text-stone-400 text-sm">Cargando notas...</div>;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[300px] overflow-hidden">
      <div className="absolute top-4 left-4 z-40">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-stone-200/50 shadow-sm text-stone-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-white hover:scale-105 transition-all active:scale-95"
        >
          <span className="text-lg leading-none">+</span> Nueva Nota
        </button>
      </div>

      <AnimatePresence>
        {postIts.map(postIt => (
          <motion.div
            key={postIt.id}
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            onDragStart={() => bringToFront(postIt.id)}
            onDragEnd={(_, info) => {
              // Update x and y
              const newX = postIt.x + info.offset.x;
              const newY = postIt.y + info.offset.y;
              updatePostIt(postIt.id, { x: newX, y: newY });
            }}
            initial={{ x: postIt.x, y: postIt.y, rotate: postIt.rotation, scale: 0 }}
            animate={{ x: postIt.x, y: postIt.y, rotate: postIt.rotation, scale: 1, zIndex: postIt.zIndex }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`absolute w-40 h-40 p-4 rounded-md shadow-lg border backdrop-blur-sm cursor-grab active:cursor-grabbing flex flex-col ${getColorClasses(postIt.color)}`}
            style={{ touchAction: 'none' }}
          >
            {/* Top bar with delete button */}
            <div className="flex justify-between items-start mb-1">
              <div className="w-full h-4 drag-handle opacity-0 hover:opacity-100 transition-opacity bg-black/5 rounded-full" />
              <button 
                onClick={() => deletePostIt(postIt.id)}
                className="opacity-0 hover:opacity-100 text-black/40 hover:text-red-500 transition-all p-1"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
            
            <textarea
              className="flex-1 w-full bg-transparent border-none outline-none resize-none placeholder-black/30 font-medium text-sm leading-tight focus:ring-0"
              placeholder="Escribe algo..."
              value={postIt.content}
              onChange={(e) => {
                // local state update for fast typing
                setPostIts(prev => prev.map(p => p.id === postIt.id ? { ...p, content: e.target.value } : p));
              }}
              onBlur={(e) => {
                // save on blur
                updatePostIt(postIt.id, { content: e.target.value });
              }}
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking text
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {postIts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-stone-400/60 font-bold text-sm pointer-events-none">
          No tienes notas. ¡Crea una!
        </div>
      )}

      {/* ── Modal to Create Post-it ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-stone-100"
            >
              <h3 className="text-lg font-black text-stone-800 mb-4 tracking-tighter">Crear Nueva Nota</h3>
              
              <textarea
                className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded-xl resize-none outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium text-stone-700"
                placeholder="¿Qué quieres recordar?"
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                autoFocus
              />

              <div className="mt-4">
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

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl font-bold text-sm text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateSubmit}
                  disabled={!newNoteContent.trim()}
                  className="flex-1 py-2 px-4 rounded-xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  Crear Nota
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
