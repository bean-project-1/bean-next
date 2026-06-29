'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { X, Plus, Pin, Trash2, StickyNote, LayoutGrid } from 'lucide-react';
import type { PostIt } from './PostItWall';

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = [
  { classes: 'bg-yellow-100 text-yellow-900 border-yellow-200',    dot: 'bg-yellow-300',  value: 'bg-yellow-100/90 text-yellow-900 border-yellow-200/50'  },
  { classes: 'bg-emerald-100 text-emerald-900 border-emerald-200', dot: 'bg-emerald-300', value: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/50' },
  { classes: 'bg-rose-100 text-rose-900 border-rose-200',          dot: 'bg-rose-300',    value: 'bg-rose-100/90 text-rose-900 border-rose-200/50'          },
  { classes: 'bg-blue-100 text-blue-900 border-blue-200',          dot: 'bg-blue-300',    value: 'bg-blue-100/90 text-blue-900 border-blue-200/50'          },
  { classes: 'bg-violet-100 text-violet-900 border-violet-200',    dot: 'bg-violet-300',  value: 'bg-violet-100/90 text-violet-900 border-violet-200/50'    },
];
const colorClasses = (c: string) => PALETTE.find(p => p.value === c)?.classes ?? PALETTE[0].classes;

// Scatter notes in a loose 2-column layout with jitter + slight rotation
function scatter(i: number) {
  return {
    x:   (i % 2) * 158 + ((i * 37) % 24) - 12 + 8,
    y:   Math.floor(i / 2) * 148 + ((i * 53) % 20) - 10 + 12,
    rot: ((i * 17) % 10) - 5,
  };
}

// ─── New note form ────────────────────────────────────────────────────────────
function NewNoteForm({ initialContent = '', initialColor = PALETTE[0].value, onSave, onCancel }: {
  initialContent?: string;
  initialColor?:  string;
  onSave:   (content: string, color: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [color,   setColor]   = useState(initialColor);
  const [saving,  setSaving]  = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { 
    textRef.current?.focus(); 
    if (textRef.current) {
      const len = textRef.current.value.length;
      textRef.current.setSelectionRange(len, len);
    }
  }, []);

  const save = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await onSave(content.trim(), color);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -8, scale: 0.96 }}
      onPointerDown={e => e.stopPropagation()}
      className={`rounded-2xl border p-4 shadow-md mb-3 ${colorClasses(color)}`}
    >
      <textarea
        ref={textRef}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Escribe tu nota…"
        rows={3}
        className="w-full bg-transparent resize-none outline-none text-sm font-medium placeholder:opacity-50 leading-relaxed"
        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) save(); if (e.key === 'Escape') onCancel(); }}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          {PALETTE.map(p => (
            <button key={p.value} onClick={() => setColor(p.value)}
              className={`w-5 h-5 rounded-full ${p.dot} transition-transform ${color === p.value ? 'scale-125 ring-2 ring-offset-1 ring-stone-400' : 'hover:scale-110'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="text-xs font-bold text-stone-500 px-3 py-1.5 rounded-xl hover:bg-black/5">Cancelar</button>
          <button onClick={save} disabled={!content.trim() || saving}
            className="text-xs font-black bg-stone-800 text-white px-4 py-1.5 rounded-xl disabled:opacity-40 active:scale-95">
            {saving ? '…' : 'Guardar'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Draggable note card ──────────────────────────────────────────────────────
function DraggableNote({ note, index, containerRef, onPin, onDelete, onEdit }: {
  note:         PostIt;
  index:        number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPin:        (id: string, v: boolean) => void;
  onDelete:     (id: string) => void;
  onEdit:       (note: PostIt) => void;
}) {
  const pos           = scatter(index);
  const nx            = useMotionValue(pos.x);
  const ny            = useMotionValue(pos.y);
  const [raised,   setRaised]  = useState(false);
  const [confirm,  setConfirm] = useState(false);
  const pinned = note.isPinned;

  return (
    <motion.div
      drag={!pinned}
      dragConstraints={containerRef} dragMomentum={false} dragElastic={0.06}
      style={{ x: nx, y: ny, rotate: pos.rot, position: 'absolute', width: 148, zIndex: raised ? 50 : note.zIndex }}
      onDragStart={() => setRaised(true)}
      onDragEnd={()  => setRaised(false)}
      onDoubleClick={() => onEdit(note)}
      whileDrag={{ scale: 1.06, zIndex: 50 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1   }}
      exit={{    opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      className={`rounded-2xl border select-none touch-none ${pinned ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${colorClasses(note.color)} ${raised ? 'shadow-xl' : 'shadow-md'}`}
    >
      {pinned && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-stone-800 rounded-full flex items-center justify-center z-10 shadow-md ring-2 ring-white">
          <Pin className="w-2.5 h-2.5 text-white" fill="white" />
        </div>
      )}
      <div className="p-3">
        <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words min-h-[3rem]">{note.content}</p>
        <div className="flex justify-end gap-1 mt-2">
          <button onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onPin(note.id, !note.isPinned); }}
            className="w-6 h-6 rounded-full bg-black/8 hover:bg-black/14 flex items-center justify-center transition-colors">
            <Pin className={`w-2.5 h-2.5 ${note.isPinned ? 'text-stone-700' : 'text-stone-400'}`} fill={note.isPinned ? 'currentColor' : 'none'} />
          </button>
          {confirm ? (
            <div className="flex gap-1" onPointerDown={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); onDelete(note.id); }} className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-lg">Sí</button>
              <button onClick={e => { e.stopPropagation(); setConfirm(false); }} className="text-[9px] font-black bg-black/10 px-1.5 py-0.5 rounded-lg">No</button>
            </div>
          ) : (
            <button onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setConfirm(true); }}
              className="w-6 h-6 rounded-full bg-black/8 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Box note card (grid view) ────────────────────────────────────────────────
function BoxNote({ note, onPin, onDelete, onEdit }: {
  note:     PostIt;
  onPin:    (id: string, v: boolean) => void;
  onDelete: (id: string) => void;
  onEdit:   (note: PostIt) => void;
}) {
  const [confirm, setConfirm] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1    }}
      exit={{    opacity: 0, scale: 0.88  }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      onClick={() => onEdit(note)}
      className={`rounded-2xl border p-4 shadow-sm flex flex-col gap-2 ${colorClasses(note.color)} cursor-pointer hover:shadow-md transition-shadow`}
    >
      {note.isPinned && (
        <div className="flex items-center gap-1 opacity-60">
          <Pin className="w-3 h-3" fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-wider">Fijada</span>
        </div>
      )}
      <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words flex-1">
        {note.content}
      </p>
      <div className="flex justify-end gap-1.5 mt-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => onPin(note.id, !note.isPinned)}
          className="w-7 h-7 rounded-full bg-black/8 hover:bg-black/14 flex items-center justify-center transition-colors">
          <Pin className={`w-3 h-3 ${note.isPinned ? 'text-stone-700' : 'text-stone-400'}`} fill={note.isPinned ? 'currentColor' : 'none'} />
        </button>
        {confirm ? (
          <div className="flex gap-1">
            <button onClick={() => onDelete(note.id)} className="text-[9px] font-black bg-red-500 text-white px-2 py-1 rounded-lg">Sí</button>
            <button onClick={() => setConfirm(false)}  className="text-[9px] font-black bg-black/10 px-2 py-1 rounded-lg">No</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)}
            className="w-7 h-7 rounded-full bg-black/8 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_W = 420;
const DEFAULT_H = 560;
const MIN_W     = 300;
const MIN_H     = 340;

// ─── Notes Modal ─────────────────────────────────────────────────────────────
export function NotesModal() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [notes,     setNotes]     = useState<PostIt[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [viewMode,  setViewMode]  = useState<'postits' | 'boxes'>('postits');
  const [size,      setSize]      = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [isMobile,  setIsMobile]  = useState(false);
  const [editingNote, setEditingNote] = useState<PostIt | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const resizeData   = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);

  // Position from fixed left:0 top:0 — x/y are absolute page coords
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Force boxes view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('boxes');
    }
  }, [isMobile]);

  // Center on open (desktop only)
  useEffect(() => {
    if (isOpen && !isMobile) {
      x.set((window.innerWidth  - DEFAULT_W) / 2);
      y.set((window.innerHeight - DEFAULT_H) / 2);
      setSize({ w: DEFAULT_W, h: DEFAULT_H });
    }
  }, [isOpen, isMobile, x, y]);

  // Open via custom event
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-notes-modal', handler);
    return () => window.removeEventListener('open-notes-modal', handler);
  }, []);

  // Load notes when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/schedule/post-its')
      .then(r => r.json())
      .then(d => { if (d.postIts) setNotes(d.postIts); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  // ── Resize via bottom-right corner drag (desktop only) ───────────────────
  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeData.current = { sx: e.clientX, sy: e.clientY, sw: size.w, sh: size.h };

    const onMove = (ev: PointerEvent) => {
      if (!resizeData.current) return;
      setSize({
        w: Math.max(MIN_W, resizeData.current.sw + ev.clientX - resizeData.current.sx),
        h: Math.max(MIN_H, resizeData.current.sh + ev.clientY - resizeData.current.sy),
      });
    };
    const onUp = () => {
      resizeData.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  };

  // ── Data handlers ─────────────────────────────────────────────────────────
  const handleSave = async (content: string, color: string) => {
    if (editingNote) {
      const id = editingNote.id;
      setNotes(prev => prev.map(n => n.id === id ? { ...n, content, color } : n));
      await fetch(`/api/schedule/post-its/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, color }),
      });
      setEditingNote(null);
      setShowForm(false);
    } else {
      const res  = await fetch('/api/schedule/post-its', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, color, x: 8, y: 12, rotation: 0, zIndex: 1 }),
      });
      const data = await res.json();
      if (data.postIt) { setNotes(prev => [data.postIt, ...prev]); setShowForm(false); }
    }
  };

  const handleStartEdit = (note: PostIt) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned } : n));
    await fetch(`/api/schedule/post-its/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned }),
    });
  };

  const handleDelete = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editingNote?.id === id) {
      setEditingNote(null);
      setShowForm(false);
    }
    await fetch(`/api/schedule/post-its/${id}`, { method: 'DELETE' });
  };

  const sorted = [...notes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-stone-950/25 backdrop-blur-[2px] z-[202]"
            onClick={() => { setIsOpen(false); setShowForm(false); setEditingNote(null); }}
          />

          {/* ── Modal Window / Bottom Sheet ──────────────────────────────── */}
          <motion.div
            {...(isMobile ? {
              drag: 'y',
              dragConstraints: { top: 0, bottom: 0 },
              dragElastic: 0.15,
              onDragEnd: (e, info) => {
                if (info.offset.y > 120) {
                  setIsOpen(false);
                  setShowForm(false);
                  setEditingNote(null);
                }
              },
              initial: { y: '100%' },
              animate: { y: 0 },
              exit: { y: '100%' },
              style: { height: '82vh', width: '100%' }
            } : {
              drag: true,
              dragMomentum: false,
              dragElastic: 0.04,
              style: { x, y, width: size.w, height: size.h },
              initial: { opacity: 0, scale: 0.92 },
              animate: { opacity: 1, scale: 1    },
              exit: {    opacity: 0, scale: 0.88  }
            })}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={
              isMobile
                ? "fixed bottom-0 left-0 w-full z-[203] bg-[#FAF9F6] rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] border-t border-[#E6E1D6] flex flex-col overflow-hidden"
                : "fixed left-0 top-0 z-[203] bg-[#FAF9F6] rounded-3xl shadow-2xl border border-[#E6E1D6] flex flex-col overflow-hidden cursor-grab active:cursor-grabbing"
            }
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile swipe indicator */}
            {isMobile && (
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />
            )}

            {/* ── Header ──────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between px-5 pt-3 pb-4 border-b border-[#E6E1D6] bg-[#FAF9F6]">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Tablero</p>
                <h2 className="text-base font-black text-stone-900 mt-0.5">📝 Mis Notas</h2>
              </div>

              {/* Grip dots (desktop only) */}
              {!isMobile && (
                <div className="flex flex-col gap-[3px] mx-auto opacity-20 pointer-events-none select-none">
                  {[0, 1].map(r => (
                    <div key={r} className="flex gap-[3px]">
                      {[0, 1, 2].map(c => <div key={c} className="w-1 h-1 rounded-full bg-stone-600" />)}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* View toggle pill (desktop only) */}
                {!isMobile && (
                  <div className="flex items-center bg-stone-100 rounded-full p-0.5 gap-0.5" onPointerDown={e => e.stopPropagation()}>
                    <button
                      onClick={() => setViewMode('postits')}
                      title="Vista post-its"
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${viewMode === 'postits' ? 'bg-white shadow-sm text-stone-700' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('boxes')}
                      title="Vista cajas"
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${viewMode === 'boxes' ? 'bg-white shadow-sm text-stone-700' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() => {
                    if (showForm && editingNote) {
                      setEditingNote(null);
                    } else {
                      setShowForm(v => !v);
                    }
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${showForm ? 'bg-stone-200 text-stone-700' : 'bg-[#1B7A4E] text-white shadow-[0_3px_12px_rgba(27,122,78,0.35)]'}`}
                >
                  <Plus className="w-5 h-5" style={{ transform: showForm ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <button
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() => { setIsOpen(false); setShowForm(false); setEditingNote(null); }}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── New / Edit note form ──────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div 
                  key={editingNote ? `edit-${editingNote.id}` : 'new-note'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pt-4 shrink-0 overflow-hidden"
                >
                  <NewNoteForm 
                    key={editingNote ? `form-${editingNote.id}` : 'new-form'}
                    initialContent={editingNote?.content}
                    initialColor={editingNote?.color}
                    onSave={handleSave} 
                    onCancel={() => { setShowForm(false); setEditingNote(null); }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Board / grid ─────────────────────────────────────────── */}
            <div
              className="flex-1 min-h-0 relative cursor-default"
              onPointerDown={e => e.stopPropagation()}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-2 border-[#1B7A4E] border-t-transparent" />
                  <p className="text-xs text-stone-400 font-semibold">Cargando notas…</p>
                </div>
              ) : sorted.length === 0 && !showForm ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-3">
                  <span className="text-5xl">🌱</span>
                  <p className="text-sm font-black text-stone-500">Sin notas aún</p>
                  <p className="text-xs text-stone-400 text-center">Toca <strong>+</strong> para crear tu primera nota</p>
                </motion.div>
              ) : viewMode === 'postits' ? (
                /* ── Post-its: free-drag scattered board (desktop only) ── */
                <div ref={containerRef} className="absolute inset-0 overflow-hidden">
                  <AnimatePresence>
                    {sorted.map((note, i) => (
                      <DraggableNote key={note.id} note={note} index={i}
                        containerRef={containerRef} onPin={handlePin} onDelete={handleDelete} onEdit={handleStartEdit} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Boxes: scrollable grid ── */
                <div className="absolute inset-0 overflow-y-auto p-4">
                  <motion.div layout className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    <AnimatePresence>
                      {sorted.map(note => (
                        <BoxNote key={note.id} note={note} onPin={handlePin} onDelete={handleDelete} onEdit={handleStartEdit} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </div>

            {/* ── Resize handle — bottom-right corner (desktop only) ── */}
            {!isMobile && (
              <div
                onPointerDown={startResize}
                className="absolute bottom-0 right-0 w-9 h-9 z-10 flex items-end justify-end p-2.5 cursor-se-resize group"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-25 group-hover:opacity-55 transition-opacity">
                  <circle cx="10" cy="10" r="1.5" fill="#78716c" />
                  <circle cx="6"  cy="10" r="1.5" fill="#78716c" />
                  <circle cx="10" cy="6"  r="1.5" fill="#78716c" />
                  <circle cx="2"  cy="10" r="1.5" fill="#78716c" />
                  <circle cx="6"  cy="6"  r="1.5" fill="#78716c" />
                  <circle cx="10" cy="2"  r="1.5" fill="#78716c" />
                </svg>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
