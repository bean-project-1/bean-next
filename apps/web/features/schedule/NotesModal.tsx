'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { X, Plus, Pin, Trash2 } from 'lucide-react';
import type { PostIt } from './PostItWall';

// ─── Color palette ────────────────────────────────────────────────────────────
const PALETTE = [
  { classes: 'bg-yellow-100 text-yellow-900 border-yellow-200',    dot: 'bg-yellow-300',   value: 'bg-yellow-100/90 text-yellow-900 border-yellow-200/50'  },
  { classes: 'bg-emerald-100 text-emerald-900 border-emerald-200', dot: 'bg-emerald-300',  value: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/50' },
  { classes: 'bg-rose-100 text-rose-900 border-rose-200',          dot: 'bg-rose-300',     value: 'bg-rose-100/90 text-rose-900 border-rose-200/50'          },
  { classes: 'bg-blue-100 text-blue-900 border-blue-200',          dot: 'bg-blue-300',     value: 'bg-blue-100/90 text-blue-900 border-blue-200/50'          },
  { classes: 'bg-violet-100 text-violet-900 border-violet-200',    dot: 'bg-violet-300',   value: 'bg-violet-100/90 text-violet-900 border-violet-200/50'    },
];

function colorClasses(color: string) {
  return PALETTE.find(p => p.value === color)?.classes ?? PALETTE[0].classes;
}

// Deterministic scatter: 2-column layout + slight offsets per note
function initialPos(index: number) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const jitterX = ((index * 37) % 24) - 12;
  const jitterY = ((index * 53) % 20) - 10;
  return {
    x: col * 158 + jitterX + 8,
    y: row * 148 + jitterY + 12,
    rot: ((index * 17) % 10) - 5,  // −5° to +5°
  };
}

// ─── New note form ────────────────────────────────────────────────────────────
function NewNoteForm({ onSave, onCancel }: {
  onSave:   (content: string, color: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState('');
  const [color,   setColor]   = useState(PALETTE[0].value);
  const [saving,  setSaving]  = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const save = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await onSave(content.trim(), color);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: -8 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{    opacity: 0, scale: 0.94, y: -8 }}
      className={`rounded-2xl border p-4 shadow-md ${colorClasses(color)} mb-1`}
    >
      <textarea
        ref={ref}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Escribe tu nota..."
        rows={3}
        className="w-full bg-transparent resize-none outline-none text-sm font-medium placeholder:opacity-50 leading-relaxed"
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) save(); if (e.key === 'Escape') onCancel(); }}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {PALETTE.map(p => (
            <button key={p.value} onClick={() => setColor(p.value)}
              className={`w-5 h-5 rounded-full ${p.dot} transition-transform ${color === p.value ? 'scale-125 ring-2 ring-offset-1 ring-stone-400' : 'hover:scale-110'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel}
            className="text-xs font-bold text-stone-500 hover:text-stone-700 px-3 py-1.5 rounded-xl transition-colors">
            Cancelar
          </button>
          <button onClick={save} disabled={!content.trim() || saving}
            className="text-xs font-black bg-stone-800 text-white px-4 py-1.5 rounded-xl disabled:opacity-40 transition-opacity active:scale-95">
            {saving ? '...' : 'Guardar'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Draggable note card ──────────────────────────────────────────────────────
function DraggableNote({ note, index, containerRef, onPin, onDelete }: {
  note:         PostIt;
  index:        number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPin:        (id: string, v: boolean) => void;
  onDelete:     (id: string) => void;
}) {
  const pos = initialPos(index);
  const x   = useMotionValue(pos.x);
  const y   = useMotionValue(pos.y);
  const [raised,   setRaised]   = useState(false);
  const [confirm,  setConfirm]  = useState(false);
  const classes = colorClasses(note.color);

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.08}
      style={{ x, y, rotate: pos.rot, position: 'absolute', width: 148, zIndex: raised ? 50 : note.zIndex }}
      onDragStart={() => setRaised(true)}
      onDragEnd={()  => setRaised(false)}
      whileDrag={{ scale: 1.06, rotate: pos.rot + 1, zIndex: 50 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1  }}
      exit={{    opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      className={`rounded-2xl border shadow-md cursor-grab active:cursor-grabbing select-none touch-none ${classes} ${raised ? 'shadow-xl' : ''}`}
    >
      {/* Pin badge */}
      {note.isPinned && (
        <div className="absolute -top-2 left-3 w-5 h-5 bg-stone-700 rounded-full flex items-center justify-center z-10">
          <Pin className="w-2.5 h-2.5 text-white" fill="white" />
        </div>
      )}

      <div className="p-3">
        <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words min-h-[3rem]">
          {note.content}
        </p>
        <div className="flex items-center justify-end gap-1 mt-2">
          {/* Pin */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onPin(note.id, !note.isPinned); }}
            className="w-6 h-6 rounded-full bg-black/8 hover:bg-black/14 flex items-center justify-center transition-colors"
          >
            <Pin className={`w-2.5 h-2.5 ${note.isPinned ? 'text-stone-700' : 'text-stone-400'}`}
              fill={note.isPinned ? 'currentColor' : 'none'} />
          </button>

          {/* Delete */}
          {confirm ? (
            <div className="flex items-center gap-1" onPointerDown={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); onDelete(note.id); }}
                className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-lg">Sí</button>
              <button onClick={e => { e.stopPropagation(); setConfirm(false); }}
                className="text-[9px] font-black bg-black/10 px-1.5 py-0.5 rounded-lg">No</button>
            </div>
          ) : (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setConfirm(true); }}
              className="w-6 h-6 rounded-full bg-black/8 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Notes Modal ─────────────────────────────────────────────────────────────
export function NotesModal() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [notes,    setNotes]    = useState<PostIt[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-notes-modal', handler);
    return () => window.removeEventListener('open-notes-modal', handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/schedule/post-its')
      .then(r => r.json())
      .then(d => { if (d.postIts) setNotes(d.postIts); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSave = async (content: string, color: string) => {
    const res = await fetch('/api/schedule/post-its', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, color, x: 8, y: 12, rotation: 0, zIndex: 1 }),
    });
    const data = await res.json();
    if (data.postIt) {
      setNotes(prev => [data.postIt, ...prev]);
      setShowForm(false);
    }
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned } : n));
    await fetch(`/api/schedule/post-its/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned }),
    });
  };

  const handleDelete = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await fetch(`/api/schedule/post-its/${id}`, { method: 'DELETE' });
  };

  const sorted = [...notes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-[202]"
            onClick={() => { setIsOpen(false); setShowForm(false); }}
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[203] bg-[#FAF9F6] rounded-t-3xl shadow-2xl border-t border-[#E6E1D6] sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8 sm:w-[460px] sm:rounded-3xl sm:border flex flex-col"
            style={{ height: '78dvh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-stone-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-[#E6E1D6] shrink-0">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Tablero</p>
                <h2 className="text-base font-black text-stone-900 mt-0.5">📝 Mis Notas</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowForm(v => !v)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    showForm
                      ? 'bg-stone-200 text-stone-700'
                      : 'bg-[#1B7A4E] text-white shadow-[0_3px_12px_rgba(27,122,78,0.35)]'
                  }`}
                >
                  <Plus className="w-5 h-5" style={{ transform: showForm ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <button
                  onClick={() => { setIsOpen(false); setShowForm(false); }}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* New note form (above the board) */}
            <AnimatePresence>
              {showForm && (
                <div className="px-5 pt-4 shrink-0">
                  <NewNoteForm onSave={handleSave} onCancel={() => setShowForm(false)} />
                </div>
              )}
            </AnimatePresence>

            {/* Free-drag board */}
            <div className="flex-1 overflow-hidden relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-2 border-[#1B7A4E] border-t-transparent"
                  />
                  <p className="text-xs text-stone-400 font-semibold">Cargando notas...</p>
                </div>
              ) : sorted.length === 0 && !showForm ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-3">
                  <span className="text-5xl">🌱</span>
                  <p className="text-sm font-black text-stone-500">Sin notas aún</p>
                  <p className="text-xs text-stone-400 text-center">Toca <strong>+</strong> para crear tu primera nota</p>
                </motion.div>
              ) : (
                <div
                  ref={containerRef}
                  className="absolute inset-0 overflow-hidden"
                >
                  <AnimatePresence>
                    {sorted.map((note, i) => (
                      <DraggableNote
                        key={note.id}
                        note={note}
                        index={i}
                        containerRef={containerRef}
                        onPin={handlePin}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
