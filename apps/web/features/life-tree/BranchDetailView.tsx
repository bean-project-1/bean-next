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
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  // Local copy of leaves — persists task state across panel open/close
  const [localLeaves, setLocalLeaves] = useState(() => branch.leaves);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  // Sync localLeaves if branch prop changes (e.g. full data reload from parent)
  useEffect(() => { setLocalLeaves(branch.leaves); }, [branch.leaves]);

  // Update a single task across localLeaves
  const updateTaskInLeaves = (taskId: string, done: boolean) => {
    setLocalLeaves(prev => prev.map(leaf => ({
      ...leaf,
      tasks: leaf.tasks?.map((t: any) => t.id === taskId ? { ...t, isCompleted: done } : t),
    })));
  };

  // Filter hierarchical components
  const phases = localLeaves.filter(l => l.type === 'phase' || (!l.type && !l.parentId));
  const habits = localLeaves.filter(l => l.type === 'habit');

  const completed = phases.filter(l => l.completed).length;
  const pct = phases.length > 0 ? Math.round((completed / phases.length) * 100) : 0;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex items-center p-4 sm:py-6 sm:pr-6 pointer-events-none">
      <div 
        className="w-full sm:w-[450px] h-full bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-500 pointer-events-auto border border-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="shrink-0 px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                Gestión de Meta
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">
                {completed}/{phases.length} Fases
              </span>
            </div>
            {isEditingTitle ? (
              <input
                autoFocus
                className="w-full text-2xl font-black text-slate-900 bg-slate-50 border-b-2 border-emerald-500 focus:outline-none"
                value={editGoal}
                onChange={e => setEditGoal(e.target.value)}
                onBlur={async () => {
                  setIsEditingTitle(false);
                  if (editGoal.trim() && editGoal !== branch.goal) {
                    await onUpdateGoal?.(branch.id, { goal: editGoal.trim() });
                  }
                }}
                onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
              />
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-black text-slate-900 truncate hover:text-emerald-600 transition-colors cursor-pointer"
              >
                {editGoal}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                if (confirm('¿Eliminar esta meta completa?')) {
                  await onDelete?.(branch.id);
                  onClose();
                }
              }}
              className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors"
              title="Eliminar Meta"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/30 custom-scrollbar">
          {/* Description Section */}
          <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción del Proyecto</p>
              {!isEditingDesc && (
                <button onClick={() => setIsEditingDesc(true)} className="text-[10px] font-bold text-emerald-600 hover:underline">Editar</button>
              )}
            </div>
            {isEditingDesc ? (
              <div className="space-y-3">
                <textarea
                  autoFocus
                  className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500/20"
                  rows={3}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditingDesc(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancelar</button>
                  <button 
                    onClick={async () => {
                      setIsEditingDesc(false);
                      await onUpdateGoal?.(branch.id, { description: editDesc.trim() });
                    }}
                    className="px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl"
                  >Guardar</button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {editDesc || 'Sin descripción detallada.'}
              </p>
            )}
          </section>

          {/* Accordion List of Phases */}
          <section className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planificación por Fases</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                + Nueva Fase
              </button>
            </div>

            <div className="space-y-3">
              {phases.map((phase) => {
                const isExpanded = expandedPhaseId === phase.id;
                const children = localLeaves.filter(l => l.parentId === phase.id);
                const doneCount = children.filter(c => c.completed).length;
                
                return (
                  <div 
                    key={phase.id} 
                    className={`rounded-[28px] border transition-all duration-300 ${isExpanded ? 'bg-white border-emerald-100 shadow-xl' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}
                  >
                    <div 
                      className="p-5 flex items-center gap-4 cursor-pointer"
                      onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${phase.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {phase.completed ? '✓' : '⏳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold leading-tight ${phase.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {phase.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {children.length > 0 ? `${doneCount}/${children.length} tareas completadas` : 'Sin tareas asignadas'}
                        </p>
                      </div>
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                        className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="border-t border-slate-50 pt-5 space-y-3">
                          {children.length > 0 ? (
                            children.map(child => (
                              <div key={child.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-emerald-100 transition-colors group">
                                <button 
                                  onClick={async () => {
                                    const next = !child.completed;
                                    setLocalLeaves(prev => prev.map(l => l.id === child.id ? { ...l, completed: next } : l));
                                    await onToggleAction?.(child.id, { completed: next });
                                  }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${child.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200 group-hover:border-emerald-400'}`}
                                >
                                  {child.completed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                </button>
                                <div className="flex-1">
                                  <p className={`text-sm font-bold ${child.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                    {child.name}
                                  </p>
                                </div>
                                <button 
                                  onClick={async () => {
                                    if (confirm('¿Eliminar actividad?')) {
                                      await onDeleteAction?.(child.id);
                                    }
                                  }}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /></svg>
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic text-center py-4">Sin actividades registradas.</p>
                          )}
                          <button 
                            onClick={() => { setIsAdding(true); /* Logic to set parentId needed if strictly hierarchical */ }}
                            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 text-xs font-bold hover:border-emerald-200 hover:text-emerald-500 transition-all"
                          >
                            + Añadir Tarea a esta Fase
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer Area */}
        <div className="shrink-0 px-8 py-4 bg-white border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Usa el Coach en cada tarea para obtener ayuda detallada
          </p>
        </div>
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
        <div 
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAdding(false)}
        >
          <div 
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
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
