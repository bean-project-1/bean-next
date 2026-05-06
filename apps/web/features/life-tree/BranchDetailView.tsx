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

// ── Leaf Detail Panel ─────────────────────────────
function LeafPanel({
  leaf, palette, onClose, onToggle, onDelete, onToggleTask, allLeaves, onToggleSubAction
}: {
  leaf: Branch['leaves'][0];
  palette: ReturnType<typeof getPalette>;
  onClose: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
  onToggleTask?: (taskId: string, done: boolean) => Promise<void> | void;
  allLeaves: Branch['leaves'];
  onToggleSubAction?: (id: string, data: { completed: boolean }) => Promise<void>;
}) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [chatTaskId, setChatTaskId] = useState<string | null>(null);
  
  // Find sub-actions (tasks/milestones) if this is a phase
  const children = allLeaves ? allLeaves.filter(l => l.parentId === leaf.id) : [];
  const tasks = children.filter(c => c.type === 'task');
  const milestones = children.filter(c => c.type === 'milestone');

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
                <div className="flex flex-wrap gap-2 mt-2">
                  {(leaf as any).description && (
                    <p className="text-sm text-slate-500 leading-relaxed">{(leaf as any).description}</p>
                  )}
                  {leaf.targetDate && (
                    <div className="w-full">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        📅 Finaliza: {new Date(leaf.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>

          {/* Tasks checklist */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-slate-50/40">
            {leaf.type === 'phase' && tasks.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Actividades de la Fase</p>
                <div className="space-y-2">
                  {tasks.map((task: any, i: number) => {
                    const isExpanded = expandedTask === (task.id ?? i);
                    const isActive = chatTaskId === task.id;
                    return (
                      <div
                        key={task.id ?? i}
                        className="rounded-2xl border bg-white overflow-hidden transition-all shadow-sm"
                        style={{ borderColor: isActive ? palette.primary : task.completed ? palette.primary + '44' : '#e8edf2' }}
                      >
                        <div
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setExpandedTask(isExpanded ? null : (task.id ?? i))}
                        >
                          {/* Checkbox */}
                          <div
                            onClick={async (e) => { 
                              e.stopPropagation(); 
                              const nextDone = !task.completed;
                              await onToggleSubAction?.(task.id, { completed: nextDone }); 
                            }}
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer"
                            style={{ background: task.completed ? palette.primary : 'white', border: `2px solid ${task.completed ? palette.primary : '#cbd5e1'}` }}
                          >
                            {task.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                {task.name}
                              </p>
                              <svg 
                                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                              >
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </div>
                            {task.targetDate && (
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                                <span className="text-[8px]">📅</span> {new Date(task.targetDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          {/* Coach Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setChatTaskId(isActive ? null : task.id); }}
                            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                            title="Preguntar al Coach"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          </button>
                        </div>

                        {/* Description Expansion */}
                        {isExpanded && task.description && (
                          <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="pl-9 pr-2 py-3 border-t border-slate-50">
                              <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                {task.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {leaf.type === 'phase' && milestones.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hitos de Cierre</p>
                <div className="space-y-2">
                  {milestones.map((ms: any) => (
                    <div key={ms.id} className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${ms.completed ? 'bg-indigo-500' : 'bg-white border border-indigo-200'}`}>
                        {ms.completed ? '🏆' : '🏁'}
                      </div>
                      <span className={`font-bold italic ${ms.completed ? 'text-indigo-400' : 'text-indigo-900'}`}>{ms.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leaf.type === 'habit' && (
              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Consistencia Actual</p>
                    <p className="text-4xl font-black text-emerald-600">{Math.round((leaf.consistency || 0) * 100)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Racha 🔥</p>
                    <p className="text-3xl font-black text-emerald-600">{leaf.streak || 0} días</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frecuencia</p>
                  <p className="text-sm font-bold text-slate-700">
                    {leaf.frequency?.type === 'daily' ? `Cada ${leaf.frequency.value} día(s)` : 'Semanal'}
                  </p>
                </div>
              </div>
            )}

            {leaf.type === 'phase' && tasks.length === 0 && milestones.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No hay actividades ni hitos definidos para esta fase.</p>
            )}
          </div>

          {/* Footer — only delete button */}
          <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            {/* Progress indicator */}
            {tasks.length > 0 && (() => {
              const done = tasks.filter(t => t.completed).length;
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

  // Filter hierarchical components
  const phases = localLeaves.filter(l => l.type === 'phase' || (!l.type && !l.parentId));
  const habits = localLeaves.filter(l => l.type === 'habit');

  const completed = phases.filter(l => l.completed).length;
  const pct = phases.length > 0 ? Math.round((completed / phases.length) * 100) : 0;

  // ── SVG Helpers ──
  const W = 390, H = 550;
  const spinePoint = (t: number) => {
    const bend = 30;
    const curve = Math.sin(t * Math.PI) * bend;
    return { x: W / 2 + curve, y: H - (t * (H - 80)) - 40 };
  };
  const branchHW = (t: number) => 14 - t * 8;
  const buildSpinePath = () => {
    let d = `M ${spinePoint(0).x} ${spinePoint(0).y}`;
    for (let i = 1; i <= 20; i++) {
      const p = spinePoint(i / 20);
      d += ` L ${p.x} ${p.y}`;
    }
    return d;
  };
  const buildBranchPath = () => {
    const pts = [];
    for (let i = 0; i <= 20; i++) pts.push(spinePoint(i / 20));
    let left = `M ${pts[0]!.x - branchHW(0)} ${pts[0]!.y}`;
    for (let i = 1; i < pts.length; i++) left += ` L ${pts[i]!.x - branchHW(i / 20)} ${pts[i]!.y}`;
    let right = `L ${pts[pts.length - 1]!.x + branchHW(1)} ${pts[pts.length - 1]!.y}`;
    for (let i = pts.length - 2; i >= 0; i--) right += ` L ${pts[i]!.x + branchHW(i / 20)} ${pts[i]!.y}`;
    return left + ' ' + right + ' Z';
  };

  const leafPath = (x: number, y: number, w: number, h: number, side: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const cp1x = x + side * (w * 0.3) * Math.cos(rad - 0.2);
    const cp1y = y - (w * 0.3) * Math.sin(rad - 0.2);
    const tipX = x + side * w * Math.cos(rad);
    const tipY = y - w * Math.sin(rad);
    const cp2x = x + side * (w * 0.3) * Math.cos(rad + 0.2);
    const cp2y = y - (w * 0.3) * Math.sin(rad + 0.2);

    return `M ${x} ${y} 
            C ${cp1x} ${cp1y - h}, ${tipX - side * 5} ${tipY - h / 2}, ${tipX} ${tipY}
            C ${tipX - side * 5} ${tipY + h / 2}, ${cp2x} ${cp2y + h}, ${x} ${y} Z`;
  };

  const midribPath = (x: number, y: number, w: number, side: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const tx = x + side * w * Math.cos(rad);
    const ty = y - w * Math.sin(rad);
    return `M ${x} ${y} L ${tx} ${ty}`;
  };

  const branchPathData = buildBranchPath();
  const spinePathData = buildSpinePath();

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
          <span className="text-xs font-black tabular-nums" style={{ color: palette.primary }}>{completed}/{phases.length}</span>
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
          <style>{`
            @keyframes leafSway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
            @keyframes auraFloat { 
              0%, 100% { transform: translate(0, 0); opacity: 0.6; } 
              50% { transform: translate(10px, -15px); opacity: 0.9; } 
            }
          `}</style>
          <defs>
            <linearGradient id={`brGrad-${branch.id}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={palette.mid} stopOpacity="1" />
              <stop offset="100%" stopColor={palette.primary} stopOpacity="0.5" />
            </linearGradient>
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

          <path d={branchPathData} fill={`url(#brGrad-${branch.id})`} />
          <path d={spinePathData} fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />

          {/* Goal bud at tip */}
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

          {/* Habit Aura */}
          {habits.map((habit, i) => {
            const t = 0.2 + (i * 0.15) % 0.7;
            const center = spinePoint(t);
            const side = i % 2 === 0 ? 1 : -1;
            const x = center.x + side * (100 + (i * 20) % 50);
            const y = center.y - 40 - (i * 15) % 60;
            return (
              <g key={habit.id} onClick={() => setSelectedLeaf(habit)} style={{ cursor: 'pointer', animation: `auraFloat ${4 + (i % 3)}s ${i * 0.5}s ease-in-out infinite` }}>
                <circle cx={x} cy={y} r="20" fill={palette.primary} opacity="0.05" />
                <rect x={x - 40} y={y - 12} width="80" height="24" rx="12" fill="white" stroke={palette.primary} strokeWidth="1" strokeOpacity="0.3" className="shadow-sm" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill={palette.primary} opacity="0.8">
                  {habit.name.length > 10 ? habit.name.slice(0, 8) + '..' : habit.name}
                </text>
                <circle cx={x - 30} cy={y} r="3" fill={palette.primary} />
              </g>
            );
          })}

          {/* Phase Leaves */}
          {phases.map((leaf, i) => {
            const total = phases.length;
            const t = total === 1 ? 0.5 : 0.1 + (i / (total - 1)) * 0.78;
            const center = spinePoint(t);
            const side: 1 | -1 = i % 2 === 0 ? 1 : -1;
            const lw = 80 - t * 26, lh = 22 - t * 6, angleUp = 18 + (i % 3) * 5 - (t * 8);
            const bw = branchHW(t), attachX = center.x + side * bw, attachY = center.y;
            const rad = (angleUp * Math.PI) / 180, tipX = attachX + side * lw * Math.cos(rad), tipY = attachY - lw * Math.sin(rad);
            const fillGrad = leaf.completed ? `url(#lfGradDone-${branch.id})` : `url(#lfGrad-${branch.id})`;
            const LW = 120, LH = 34, extX = tipX + side * 10, extY = tipY - 2;
            const labelRectX = side > 0 ? extX : extX - LW, labelRectY = extY - LH / 2;
            const children = localLeaves.filter(l => l.parentId === leaf.id);
            const tasksDone = children.filter(c => c.completed).length;
            const tasksTotal = children.length;

            return (
              <g key={leaf.id} style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${0.15 + i * 0.08}s`, cursor: 'pointer' }} onClick={() => setSelectedLeaf(leaf)}>
                <g style={{ transformOrigin: `${attachX.toFixed(1)}px ${attachY.toFixed(1)}px`, animation: mounted ? `leafSway ${2.8 + (i % 4) * 0.5}s ${(i * 0.4) % 2}s ease-in-out infinite` : 'none' }}>
                  <path d={leafPath(attachX, attachY, lw, lh, side, angleUp)} fill={fillGrad} filter="url(#leafShadow)" />
                  <path d={midribPath(attachX, attachY, lw * 0.88, side, angleUp)} fill="none" stroke="white" strokeWidth="0.7" opacity="0.4" strokeLinecap="round" />
                  {leaf.completed && <text x={(attachX + tipX) / 2} y={(attachY + tipY) / 2 + 3} textAnchor="middle" fontSize="9" fill="white" fontWeight="900" pointerEvents="none" opacity="0.85">✓</text>}
                </g>
                <g>
                  <rect x={labelRectX} y={labelRectY} width={LW} height={LH} rx="9" fill="white" filter="url(#leafShadow)" />
                  <rect x={side > 0 ? labelRectX : labelRectX + LW - 3.5} y={labelRectY + 6} width="3.5" height={LH - 12} rx="2" fill={leaf.completed ? palette.primary : '#cbd5e1'} opacity="0.9" />
                  <circle cx={side > 0 ? labelRectX + LW - 10 : labelRectX + 10} cy={labelRectY + LH / 2} r="4" fill={leaf.completed ? palette.primary : '#e2e8f0'} />
                  <text x={side > 0 ? labelRectX + 12 : labelRectX + 10} y={labelRectY + 14} fontSize="9.5" fill="#1e293b" fontWeight="800" fontFamily="sans-serif" pointerEvents="none">
                    {leaf.name.length > 18 ? leaf.name.slice(0, 18) + '…' : leaf.name}
                  </text>
                  <text x={side > 0 ? labelRectX + 12 : labelRectX + 10} y={labelRectY + 26} fontSize="7.5" fill={leaf.completed ? palette.primary : '#94a3b8'} fontWeight="700" fontFamily="sans-serif" pointerEvents="none">
                    {leaf.completed ? '✓ Completado' : tasksTotal > 0 ? `${tasksDone}/${tasksTotal} tareas` : 'Toca para ver'}
                  </text>
                </g>
              </g>
            );
          })}

          <style>{`@keyframes leafSway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2.5deg); } }`}</style>
          
          {localLeaves.length === 0 && (
            <g>
              <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="12" fill="#cbd5e1" fontWeight="700" fontFamily="sans-serif">Sin actividades aún</text>
              <text x={W / 2} y={H / 2 + 18} textAnchor="middle" fontSize="10" fill="#e2e8f0" fontFamily="sans-serif">Toca + para añadir la primera</text>
            </g>
          )}

          {(() => {
            const base = spinePoint(0);
            return (
              <text x={base.x} y={base.y + 20} textAnchor="middle" fontSize="8" fill={palette.primary} fontWeight="700" fontFamily="sans-serif" opacity="0.4" letterSpacing="2">INICIO</text>
            );
          })()}
        </svg>
      </div>

      <div className="shrink-0 py-1.5 text-center">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Toca una hoja para ver el detalle</span>
      </div>

      {selectedLeaf && (
        <LeafPanel
          leaf={selectedLeaf}
          allLeaves={localLeaves}
          palette={palette}
          onClose={() => setSelectedLeaf(null)}
          onToggleTask={async (taskId, done) => {
            updateTaskInLeaves(taskId, done);
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
          onToggleSubAction={async (id, data) => {
          // Optimistic update for local UI
          setLocalLeaves(prev => prev.map(l => l.id === id ? { ...l, completed: !!data.completed } : l));
          await onToggleAction?.(id, data);
        }}
          onDelete={async () => {
            if (confirm('¿Eliminar esta actividad?')) {
              await onDeleteAction?.(selectedLeaf.id);
              setSelectedLeaf(null);
            }
          }}
        />
      )}

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
