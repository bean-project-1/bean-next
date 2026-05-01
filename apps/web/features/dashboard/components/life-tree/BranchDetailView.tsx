'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Branch } from './types';
import { TaskCoachChat } from './TaskCoachChat';

interface Props {
  branch: Branch;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onToggleAction?: (id: string, data: { completed?: boolean; targetDate?: string }) => Promise<void>;
  onDeleteAction?: (id: string) => Promise<void>;
  onLeafClick?: (id: string) => void;
  onUpdateGoal?: (id: string, data: { goal?: string; description?: string }) => Promise<void>;
  onAddAction?: (goalId: string, name: string, data?: { targetDate?: string }) => Promise<any>;
}

const PALETTES: Record<string, { primary: string; light: string; mid: string; road: string }> = {
  violet: { primary: '#8b5cf6', light: '#f5f3ff', mid: '#7c3aed', road: '#ede9fe' },
  indigo: { primary: '#6366f1', light: '#eef2ff', mid: '#4f46e5', road: '#e0e7ff' },
  pink: { primary: '#ec4899', light: '#fdf2f8', mid: '#db2777', road: '#fce7f3' },
  teal: { primary: '#14b8a6', light: '#f0fdfa', mid: '#0f766e', road: '#ccfbf1' },
  amber: { primary: '#f59e0b', light: '#fffbeb', mid: '#d97706', road: '#fef3c7' },
  green: { primary: '#22c55e', light: '#f0fdf4', mid: '#16a34a', road: '#dcfce7' },
  sky: { primary: '#0ea5e9', light: '#f0f9ff', mid: '#0284c7', road: '#e0f2fe' },
};
const KEYS = Object.keys(PALETTES);
function getPalette(id: string) {
  return PALETTES[KEYS[Math.abs(id.charCodeAt(0)) % KEYS.length]]!;
}

// SVG viewBox — compact, fits on screen
const W = 400;
const H = 560;

// Branch spine: S-curve from bottom to top
// t=0 → base (thick), t=1 → tip (thin)
function spinePoint(t: number): { x: number; y: number } {
  const y = H - 40 - t * (H - 80);
  const x = W / 2 + Math.sin(t * Math.PI * 1.5) * 52;
  return { x, y };
}

// Branch half-width: thick at base, pencil-thin at tip
function branchHW(t: number) { return 10 - t * 8.5; } // 10px → 1.5px

// Build the tapered branch silhouette
function buildBranchPath(steps = 80) {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = spinePoint(t);
    const hw = branchHW(t);
    const dt = 0.01;
    const cN = spinePoint(Math.min(1, t + dt));
    const dx = cN.x - c.x, dy = cN.y - c.y;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len;
    left.push(`${(c.x + px * hw).toFixed(1)},${(c.y + py * hw).toFixed(1)}`);
    right.unshift(`${(c.x - px * hw).toFixed(1)},${(c.y - py * hw).toFixed(1)}`);
  }
  return `M ${left.join(' L ')} L ${right.join(' L ')} Z`;
}

// Smooth spine path for stroke overlay
function buildSpinePath(steps = 80) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = spinePoint(t);
    pts.push(`${c.x.toFixed(1)},${c.y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

// Leaf shape — tilted upward, asymmetric (tight upper arc, droopy lower arc)
// ax,ay = attachment on branch | lw = length | lh = half-height | side = ±1 | angleUp = degrees
function leafPath(
  ax: number, ay: number,
  lw: number, lh: number,
  side: 1 | -1,
  angleUp: number
): string {
  const rad = (angleUp * Math.PI) / 180;
  // Tip of leaf
  const tipX = ax + side * lw * Math.cos(rad);
  const tipY = ay - lw * Math.sin(rad); // up in SVG
  // Leaf axis vector
  const dx = tipX - ax, dy = tipY - ay;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular (rotated 90° CCW from leaf axis)
  const px = -dy / len, py = dx / len;
  // Quarter & three-quarter points along the axis
  const q1x = ax + dx * 0.28, q1y = ay + dy * 0.28;
  const q2x = ax + dx * 0.72, q2y = ay + dy * 0.72;
  // Upper arc: tight positive-perpendicular bulge
  const uc1x = q1x + px * lh * 0.9, uc1y = q1y + py * lh * 0.9;
  const uc2x = q2x + px * lh * 1.1, uc2y = q2y + py * lh * 1.1;
  // Lower arc: droopier negative-perpendicular
  const lc1x = q2x - px * lh * 1.5, lc1y = q2y - py * lh * 1.5;
  const lc2x = q1x - px * lh * 0.6, lc2y = q1y - py * lh * 0.6;
  return [
    `M ${ax.toFixed(1)},${ay.toFixed(1)}`,
    `C ${uc1x.toFixed(1)},${uc1y.toFixed(1)} ${uc2x.toFixed(1)},${uc2y.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`,
    `C ${lc1x.toFixed(1)},${lc1y.toFixed(1)} ${lc2x.toFixed(1)},${lc2y.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)}`,
    'Z',
  ].join(' ');
}

// Curved midrib vein path
function midribPath(ax: number, ay: number, lw: number, side: 1 | -1, angleUp: number): string {
  const rad = (angleUp * Math.PI) / 180;
  const tipX = ax + side * lw * Math.cos(rad);
  const tipY = ay - lw * Math.sin(rad);
  const mx = (ax + tipX) / 2 + (tipY - ay) * 0.15;
  const my = (ay + tipY) / 2 - (tipX - ax) * 0.15 * side;
  return `M ${ax.toFixed(1)},${ay.toFixed(1)} Q ${mx.toFixed(1)},${my.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`;
}

// ── Leaf Detail Panel ─────────────────────────────
function LeafPanel({
  leaf, palette, onClose, onToggle, onDelete, onToggleTask,
}: {
  leaf: Branch['leaves'][0];
  palette: ReturnType<typeof getPalette>;
  onClose: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
  onToggleTask?: (taskId: string, done: boolean) => Promise<void> | void;
}) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [chatTaskId, setChatTaskId] = useState<string | null>(null);
  // Local task state for optimistic checkbox updates
  const [localTasks, setLocalTasks] = useState<any[]>(() => leaf.tasks || []);

  // Sync if leaf changes (e.g. after toggle)
  React.useEffect(() => { setLocalTasks(leaf.tasks || []); }, [leaf]);

  const handleToggleTask = async (taskId: string, done: boolean) => {
    // Optimistic update
    const next = localTasks.map(t => t.id === taskId ? { ...t, isCompleted: done } : t);
    setLocalTasks(next);
    try {
      await onToggleTask?.(taskId, done);
      // Auto-update activity completion based on task states
      if (done) {
        // Mark as done if all are now checked
        if (next.length > 0 && next.every(t => t.isCompleted) && !leaf.completed) {
          await onToggle?.();
        }
      } else {
        // Unmark as done if any are now unchecked
        if (leaf.completed) {
          await onToggle?.();
        }
      }
    } catch {
      // Rollback on failure
      setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !done } : t));
    }
  };

  const tasks = localTasks;
  const chatTask = tasks.find((t: any) => t.id === chatTaskId);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center sm:p-6"
      style={{ background: 'rgba(15,15,30,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full h-full sm:h-[88vh] sm:max-w-4xl flex flex-col lg:flex-row bg-white sm:rounded-[32px] shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── LEFT: Tasks column ── */}
        <div className={`flex-1 flex flex-col overflow-hidden ${chatTaskId ? 'hidden lg:flex' : 'flex'}`}>
          {/* Color bar */}
          <div className="h-1.5 w-full shrink-0" style={{ background: `linear-gradient(90deg,${palette.primary},${palette.mid})` }} />

          {/* Header */}
          <div className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2"
                  style={{ background: leaf.completed ? palette.light : '#fef3c7', color: leaf.completed ? palette.primary : '#d97706' }}
                >
                  {leaf.completed ? '✓ Completado' : '⏳ En progreso'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{leaf.name}</h3>
                {(leaf as any).description && (
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{(leaf as any).description}</p>
                )}
              </div>
              <button onClick={onClose} className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>

          {/* Tasks checklist */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-slate-50/40">
            {tasks.length > 0 ? (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pasos / Tareas</p>
                <div className="space-y-2">
                  {tasks.map((task: any, i: number) => {
                    const isExpanded = expandedTask === (task.id ?? i);
                    const isActive = chatTaskId === task.id;
                    return (
                      <div
                        key={task.id ?? i}
                        className="rounded-2xl border bg-white overflow-hidden transition-all shadow-sm"
                        style={{ borderColor: isActive ? palette.primary : task.isCompleted ? palette.primary + '44' : '#e8edf2' }}
                      >
                        <div
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setExpandedTask(isExpanded ? null : (task.id ?? i))}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={e => { e.stopPropagation(); handleToggleTask(task.id, !task.isCompleted); }}
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                            style={{ background: task.isCompleted ? palette.primary : 'white', border: `2px solid ${task.isCompleted ? palette.primary : '#cbd5e1'}` }}
                          >
                            {task.isCompleted && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </button>

                          <span className={`flex-1 text-sm font-semibold leading-snug ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </span>

                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-4 pt-1 border-t border-slate-100">
                            {task.description && <p className="text-xs text-slate-600 leading-relaxed mb-3">{task.description}</p>}
                            <button
                              onClick={e => { e.stopPropagation(); setChatTaskId(chatTaskId === task.id ? null : task.id); }}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all"
                              style={{ background: isActive ? palette.primary + '22' : palette.light, color: palette.primary }}
                            >
                              🤖 {isActive ? 'Ver coach →' : 'Consultar con el Coach'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">Esta actividad no tiene tareas registradas.</p>
            )}
          </div>

          {/* Footer — only delete button */}
          <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            {/* Progress indicator */}
            {tasks.length > 0 && (() => {
              const done = tasks.filter(t => t.isCompleted).length;
              const pct = Math.round((done / tasks.length) * 100);
              return (
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {leaf.completed ? '✓ Completada' : `${done}/${tasks.length} tareas`}
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: pct === 100 ? palette.primary : '#94a3b8' }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: palette.primary }}
                    />
                  </div>
                </div>
              );
            })()}
            <button
              onClick={onDelete}
              className="shrink-0 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /></svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Coach chat column — only shown when a task is selected ── */}
        {chatTaskId && chatTask && (
          <div className="flex flex-1 lg:flex-none lg:w-[420px] flex-col border-l border-slate-100">
            <TaskCoachChat
              taskId={chatTaskId}
              taskTitle={chatTask.title}
              taskDescription={chatTask.description}
              onCloseMobile={() => setChatTaskId(null)}
            />
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(40px) scale(0.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ── Main View ────────────────────────────────────
export function BranchDetailView({ branch, onClose, onDelete, onUpdateGoal, onToggleAction, onDeleteAction, onLeafClick, onAddAction }: Props) {
  const palette = getPalette(branch.id);
  const [mounted, setMounted] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<Branch['leaves'][0] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editGoal, setEditGoal] = useState(branch.goal);
  const [editDesc, setEditDesc] = useState(branch.description || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [containerW, setContainerW] = useState(390);
  // Local copy of leaves — persists task state across panel open/close
  const [localLeaves, setLocalLeaves] = useState(() => branch.leaves);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  // Sync localLeaves if branch prop changes (e.g. full data reload from parent)
  useEffect(() => { setLocalLeaves(branch.leaves); }, [branch.leaves]);

  // Update a single task across localLeaves + keep selectedLeaf in sync
  const updateTaskInLeaves = (taskId: string, done: boolean) => {
    setLocalLeaves(prev => prev.map(leaf => ({
      ...leaf,
      tasks: leaf.tasks?.map((t: any) => t.id === taskId ? { ...t, isCompleted: done } : t),
    })));
    // Keep the currently open leaf panel in sync too
    setSelectedLeaf(prev => {
      if (!prev) return prev;
      const updatedTasks = prev.tasks?.map((t: any) => t.id === taskId ? { ...t, isCompleted: done } : t);
      return { ...prev, tasks: updatedTasks };
    });
  };

  const completed = localLeaves.filter(l => l.completed).length;
  const pct = localLeaves.length > 0 ? Math.round((completed / localLeaves.length) * 100) : 0;

  const branchPath = buildBranchPath();
  const spinePath = buildSpinePath();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
      {/* ── Header ── */}
      <div
        className="shrink-0 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(-8px)', transition: 'all 0.4s ease' }}
      >
        <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Tu Árbol
        </button>

        <div className="flex-1 flex flex-col items-center px-4 overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: palette.primary }}>Meta</p>
          {isEditingTitle ? (
            <input
              autoFocus
              className="w-full text-center text-sm font-bold text-slate-900 bg-slate-50 border-b-2 border-emerald-500 focus:outline-none"
              value={editGoal}
              onChange={e => setEditGoal(e.target.value)}
              onBlur={async () => {
                setIsEditingTitle(false);
                if (editGoal.trim() && editGoal !== branch.goal) {
                  await onUpdateGoal?.(branch.id, { goal: editGoal.trim() });
                }
              }}
              onKeyDown={async e => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
            />
          ) : (
            <p 
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-bold text-slate-900 truncate max-w-full cursor-pointer hover:text-emerald-600 transition-colors"
            >
              {editGoal}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onAddAction && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-all hover:scale-110 active:scale-95"
              style={{ background: palette.primary, color: 'white' }}
            >+</button>
          )}
          {onDelete && (
            <button
              onClick={async () => {
                if (confirm('¿Eliminar esta meta completa y todas sus actividades? Esta acción no se puede deshacer.')) {
                  await onDelete(branch.id);
                  onClose();
                }
              }}
              className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors shadow-sm active:scale-95"
              title="Eliminar Meta"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Progress & Description ── */}
      <div className="shrink-0 px-5 py-3 bg-white space-y-3" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg,${palette.primary},${palette.mid})` }}
            />
          </div>
          <span className="text-xs font-black tabular-nums" style={{ color: palette.primary }}>{completed}/{localLeaves.length}</span>
        </div>

        {/* Description area */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descripción</span>
            {!isEditingDesc && (
              <button onClick={() => setIsEditingDesc(true)} className="text-[10px] font-bold text-emerald-600 hover:underline">Editar</button>
            )}
          </div>
          {isEditingDesc ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={2}
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => { setEditDesc(branch.description || ''); setIsEditingDesc(false); }}
                  className="text-[10px] font-bold text-slate-400"
                >Cancelar</button>
                <button 
                  onClick={async () => {
                    setIsEditingDesc(false);
                    await onUpdateGoal?.(branch.id, { description: editDesc.trim() });
                  }}
                  className="text-[10px] font-bold text-emerald-600"
                >Guardar</button>
              </div>
            </div>
          ) : (
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {editDesc || 'Sin descripción... Añade una para dar contexto a tu meta.'}
            </p>
          )}
        </div>
      </div>

      {/* ── Branch SVG (fills remaining height, no scroll) ── */}
      <div ref={svgWrapRef} className="flex-1 w-full min-h-0">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.1s', display: 'block' }}
        >
          <defs>
            {/* Branch gradient: dark at base, light at tip */}
            <linearGradient id={`brGrad-${branch.id}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={palette.mid} stopOpacity="1" />
              <stop offset="100%" stopColor={palette.primary} stopOpacity="0.5" />
            </linearGradient>
            {/* Leaf fill gradient */}
            <linearGradient id={`lfGrad-${branch.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={palette.primary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={palette.mid} stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id={`lfGradDone-${branch.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={palette.mid} stopOpacity="1" />
              <stop offset="100%" stopColor={palette.primary} stopOpacity="0.9" />
            </linearGradient>
            <filter id="leafShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#00000022" />
            </filter>
            <filter id="goalGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Branch body ── */}
          <path d={branchPath} fill={`url(#brGrad-${branch.id})`} />
          {/* Highlight stripe along top edge of branch */}
          <path d={spinePath} fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

          {/* ── Goal bud at tip ── */}
          {(() => {
            const tip = spinePoint(1);
            return (
              <g filter="url(#goalGlow)">
                <circle cx={tip.x} cy={tip.y} r="9" fill={palette.primary} opacity="0.2" />
                <circle cx={tip.x} cy={tip.y} r="5.5" fill={palette.primary} />
                <circle cx={tip.x} cy={tip.y} r="2.5" fill="white" opacity="0.8" />
                <text x={tip.x} y={tip.y - 16} textAnchor="middle" fontSize="8" fill={palette.mid}
                  fontWeight="800" fontFamily="sans-serif" letterSpacing="1.5">META</text>
              </g>
            );
          })()}

          {/* ── Leaf indicators ── */}
          {localLeaves.map((leaf, i) => {
            const total = localLeaves.length;
            const t = total === 1 ? 0.5 : 0.1 + (i / (total - 1)) * 0.78;
            const center = spinePoint(t);
            const side: 1 | -1 = i % 2 === 0 ? 1 : -1;

            const lw = 80 - t * 26;
            const lh = 22 - t * 6;
            const angleUp = 18 + (i % 3) * 5 - (t * 8);
            const bw = branchHW(t);
            const attachX = center.x + side * bw;
            const attachY = center.y;

            // Tip of the leaf (static position — for label anchor)
            const rad = (angleUp * Math.PI) / 180;
            const tipX = attachX + side * lw * Math.cos(rad);
            const tipY = attachY - lw * Math.sin(rad);

            const swayDuration = 2.8 + (i % 4) * 0.5;
            const swayDelay = (i * 0.4) % 2;

            const fillGrad = leaf.completed
              ? `url(#lfGradDone-${branch.id})`
              : `url(#lfGrad-${branch.id})`;

            // Label pill geometry — wider for better title visibility
            const LW = 120, LH = 34;
            // Label placed just past tip, continuing in leaf direction
            const extX = tipX + side * 10;
            const extY = tipY - 2;
            // Anchor: left edge for right-side leaves, right edge for left-side leaves
            const labelRectX = side > 0 ? extX : extX - LW;
            const labelRectY = extY - LH / 2;

            // Done count
            const tasksDone = leaf.tasks ? leaf.tasks.filter((t: any) => t.isCompleted).length : 0;
            const tasksTotal = leaf.tasks?.length ?? 0;

            return (
              <g
                key={leaf.id}
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.15 + i * 0.08}s`,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedLeaf(leaf)}
              >
                {/* ── Leaf body (swaying) ── */}
                <g
                  style={{
                    transformOrigin: `${attachX.toFixed(1)}px ${attachY.toFixed(1)}px`,
                    animation: mounted
                      ? `leafSway ${swayDuration}s ${swayDelay}s ease-in-out infinite`
                      : 'none',
                  }}
                >
                  <path d={leafPath(attachX, attachY, lw, lh, side, angleUp)} fill={fillGrad} filter="url(#leafShadow)" />
                  <path d={midribPath(attachX, attachY, lw * 0.88, side, angleUp)} fill="none" stroke="white" strokeWidth="0.7" opacity="0.4" strokeLinecap="round" />
                  {/* Small ✓ glyph inside leaf when done */}
                  {leaf.completed && (
                    <text
                      x={(attachX + tipX) / 2} y={(attachY + tipY) / 2 + 3}
                      textAnchor="middle" fontSize="9" fill="white"
                      fontWeight="900" pointerEvents="none" opacity="0.85"
                    >✓</text>
                  )}
                </g>

                {/* ── Label pill (static, outside leaf) ── */}
                <g>
                  {/* Drop shadow rect */}
                  <rect
                    x={labelRectX} y={labelRectY}
                    width={LW} height={LH} rx="9"
                    fill="white"
                    filter="url(#leafShadow)"
                  />
                  {/* Color accent bar on inner edge */}
                  <rect
                    x={side > 0 ? labelRectX : labelRectX + LW - 3.5}
                    y={labelRectY + 6}
                    width="3.5" height={LH - 12} rx="2"
                    fill={leaf.completed ? palette.primary : '#cbd5e1'}
                    opacity="0.9"
                  />
                  {/* Status dot — visual only */}
                  <circle
                    cx={side > 0 ? labelRectX + LW - 10 : labelRectX + 10}
                    cy={labelRectY + LH / 2}
                    r="4"
                    fill={leaf.completed ? palette.primary : '#e2e8f0'}
                  />
                  {/* Activity name */}
                  <text
                    x={side > 0 ? labelRectX + 12 : labelRectX + 10}
                    y={labelRectY + 14}
                    fontSize="9.5" fill="#1e293b" fontWeight="800"
                    fontFamily="sans-serif" pointerEvents="none"
                  >
                    {leaf.name.length > 18 ? leaf.name.slice(0, 18) + '…' : leaf.name}
                  </text>
                  {/* Task count or "Completado" */}
                  <text
                    x={side > 0 ? labelRectX + 12 : labelRectX + 10}
                    y={labelRectY + 26}
                    fontSize="7.5" fill={leaf.completed ? palette.primary : '#94a3b8'}
                    fontWeight="700" fontFamily="sans-serif" pointerEvents="none"
                  >
                    {leaf.completed
                      ? '✓ Completado'
                      : tasksTotal > 0
                        ? `${tasksDone}/${tasksTotal} tareas`
                        : 'Toca para ver'}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Sway keyframes injected via foreignObject trick — use a <style> inside SVG */}
          <defs>
            <style>{`
              @keyframes leafSway {
                0%   { transform: rotate(0deg); }
                30%  { transform: rotate(2.5deg); }
                60%  { transform: rotate(-1.8deg); }
                100% { transform: rotate(0deg); }
              }
            `}</style>
          </defs>

          {/* Empty state */}
          {localLeaves.length === 0 && (
            <g>
              <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="12" fill="#cbd5e1" fontWeight="700" fontFamily="sans-serif">
                Sin actividades aún
              </text>
              <text x={W / 2} y={H / 2 + 18} textAnchor="middle" fontSize="10" fill="#e2e8f0" fontFamily="sans-serif">
                Toca + para añadir la primera
              </text>
            </g>
          )}

          {/* Base label */}
          {(() => {
            const base = spinePoint(0);
            return (
              <text x={base.x} y={base.y + 20} textAnchor="middle" fontSize="8" fill={palette.primary}
                fontWeight="700" fontFamily="sans-serif" opacity="0.4" letterSpacing="2">
                INICIO
              </text>
            );
          })()}
        </svg>
      </div>

      {/* Hint */}
      <div className="shrink-0 py-1.5 text-center">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Toca una hoja para ver el detalle</span>
      </div>

      {/* ── Leaf detail panel ── */}
      {selectedLeaf && (
        <LeafPanel
          leaf={selectedLeaf}
          palette={palette}
          onClose={() => setSelectedLeaf(null)}
          onToggleTask={async (taskId, done) => {
            // Update local state first
            updateTaskInLeaves(taskId, done);
            // Sync with API
            await fetch(`/api/profile/goals/tasks/${taskId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isCompleted: done }),
            });
          }}
          onToggle={async () => {
            await onToggleAction?.(selectedLeaf.id, { completed: !selectedLeaf.completed });
            setSelectedLeaf(null);
          }}
          onDelete={async () => {
            if (confirm('¿Eliminar esta actividad?')) {
              await onDeleteAction?.(selectedLeaf.id);
              setSelectedLeaf(null);
            }
          }}
        />
      )}

      {/* ── Add activity modal ── */}
      {isAdding && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">Nueva Actividad</h3>
              <button onClick={() => setIsAdding(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">¿Qué vas a hacer?</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Nombre de la actividad"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) document.getElementById('add-btn')?.click(); }}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">¿Cuándo? (opcional)</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setIsAdding(false); setNewName(''); setNewDate(''); }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
              >Cancelar</button>
              <button
                id="add-btn"
                disabled={!newName.trim() || isSubmitting}
                onClick={async () => {
                  if (!newName.trim() || isSubmitting) return;
                  setIsSubmitting(true);
                  await onAddAction?.(branch.id, newName.trim(), { targetDate: newDate || undefined });
                  setIsSubmitting(false);
                  setNewName(''); setNewDate('');
                  setIsAdding(false);
                }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                style={{ background: `linear-gradient(135deg,${palette.primary},${palette.mid})` }}
              >{isSubmitting ? 'Añadiendo…' : '✓ Añadir'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
