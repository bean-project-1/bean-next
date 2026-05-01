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
  onAddAction?: (goalId: string, name: string, data?: { targetDate?: string }) => Promise<any>;
}

const PALETTES: Record<string, { primary: string; light: string; mid: string; road: string }> = {
  violet: { primary: '#8b5cf6', light: '#f5f3ff', mid: '#7c3aed', road: '#ede9fe' },
  indigo: { primary: '#6366f1', light: '#eef2ff', mid: '#4f46e5', road: '#e0e7ff' },
  pink:   { primary: '#ec4899', light: '#fdf2f8', mid: '#db2777', road: '#fce7f3' },
  teal:   { primary: '#14b8a6', light: '#f0fdfa', mid: '#0f766e', road: '#ccfbf1' },
  amber:  { primary: '#f59e0b', light: '#fffbeb', mid: '#d97706', road: '#fef3c7' },
  green:  { primary: '#22c55e', light: '#f0fdf4', mid: '#16a34a', road: '#dcfce7' },
  sky:    { primary: '#0ea5e9', light: '#f0f9ff', mid: '#0284c7', road: '#e0f2fe' },
};
const KEYS = Object.keys(PALETTES);
function getPalette(id: string) {
  return PALETTES[KEYS[Math.abs(id.charCodeAt(0)) % KEYS.length]]!;
}

// SVG constants — tall canvas
const W = 390;
const H = 900;
// Center spine control points (S-curve winding path)
// t=0 → bottom (base), t=1 → top (goal)
function spinePoint(t: number): { x: number; y: number } {
  const y = H - 60 - t * (H - 120);
  // Gentle S-wave: sin one full period
  const x = W / 2 + Math.sin(t * Math.PI * 1.6) * 55;
  return { x, y };
}

// Road half-width: thick at base (t=0), thin at tip (t=1)
function roadHW(t: number) {
  return 90 - t * 78; // 90px → 12px
}

// Build the filled road shape as a polygon
function buildRoadPath(steps = 60) {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = spinePoint(t);
    const hw = roadHW(t);
    // Tangent direction
    const dt = 0.01;
    const cNext = spinePoint(Math.min(1, t + dt));
    const dx = cNext.x - c.x;
    const dy = cNext.y - c.y;
    const len = Math.hypot(dx, dy) || 1;
    // Perpendicular
    const px = -dy / len;
    const py = dx / len;
    left.push(`${(c.x + px * hw).toFixed(1)},${(c.y + py * hw).toFixed(1)}`);
    right.unshift(`${(c.x - px * hw).toFixed(1)},${(c.y - py * hw).toFixed(1)}`);
  }
  return `M ${left.join(' L ')} L ${right.join(' L ')} Z`;
}

function buildSpinePath(steps = 60) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = spinePoint(t);
    pts.push(`${c.x.toFixed(1)},${c.y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
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
  onToggleTask?: (taskId: string, done: boolean) => void;
}) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [chatTaskId, setChatTaskId] = useState<string | null>(null);

  const tasks: any[] = leaf.tasks || [];
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                            onClick={e => { e.stopPropagation(); onToggleTask?.(task.id, !task.isCompleted); }}
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                            style={{ background: task.isCompleted ? palette.primary : 'white', border: `2px solid ${task.isCompleted ? palette.primary : '#cbd5e1'}` }}
                          >
                            {task.isCompleted && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </button>

                          <span className={`flex-1 text-sm font-semibold leading-snug ${ task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800' }`}>
                            {task.title}
                          </span>

                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
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

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex gap-3">
            <button
              onClick={onToggle}
              className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all"
              style={{ background: leaf.completed ? '#f1f5f9' : palette.primary, color: leaf.completed ? '#64748b' : 'white' }}
            >
              {leaf.completed ? 'Marcar pendiente' : '✓ Completar actividad'}
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-3 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
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
export function BranchDetailView({ branch, onClose, onDelete, onToggleAction, onDeleteAction, onLeafClick, onAddAction }: Props) {
  const palette = getPalette(branch.id);
  const [mounted, setMounted] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<Branch['leaves'][0] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [containerW, setContainerW] = useState(390);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  // Responsive: track container width
  useEffect(() => {
    if (!svgWrapRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setContainerW(Math.min(w, 600)); // cap at 600 for readability
    });
    ro.observe(svgWrapRef.current);
    return () => ro.disconnect();
  }, []);

  const completed = branch.leaves.filter(l => l.completed).length;
  const pct = branch.leaves.length > 0 ? Math.round((completed / branch.leaves.length) * 100) : 0;

  // Scale SVG geometry to container width
  const scale = containerW / W;
  const svgH = Math.round(H * scale);
  const roadPath = buildRoadPath();
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
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Tu Árbol
        </button>

        <div className="text-center max-w-[180px]">
          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: palette.primary }}>Meta</p>
          <p className="text-sm font-bold text-slate-900 truncate">{branch.goal}</p>
        </div>

        <div className="flex items-center gap-2">
          {onAddAction && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-all hover:scale-110 active:scale-95"
              style={{ background: palette.primary, color: 'white' }}
            >+</button>
          )}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="shrink-0 px-5 py-2 bg-white" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg,${palette.primary},${palette.mid})` }}
            />
          </div>
          <span className="text-xs font-black tabular-nums" style={{ color: palette.primary }}>{completed}/{branch.leaves.length}</span>
        </div>
      </div>

      {/* ── Scrollable SVG road ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div ref={svgWrapRef} className="w-full">
          <svg
            width="100%"
            height={svgH}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 0.15s' }}
          >
            <defs>
              {/* Road fill gradient — lighter toward horizon */}
              <linearGradient id={`roadGrad-${branch.id}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={palette.road} stopOpacity="1" />
                <stop offset="100%" stopColor={palette.road} stopOpacity="0.25" />
              </linearGradient>
              {/* Edge gradient for the outer border */}
              <linearGradient id={`edgeGrad-${branch.id}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={palette.primary} stopOpacity="0.5" />
                <stop offset="100%" stopColor={palette.primary} stopOpacity="0.08" />
              </linearGradient>
              {/* Soft drop shadow filter */}
              <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#00000018" />
              </filter>
              <filter id="goalGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Road fill */}
            <path d={roadPath} fill={`url(#roadGrad-${branch.id})`} />

            {/* Road border — slightly transparent color edges */}
            <path d={roadPath} fill="none" stroke={`url(#edgeGrad-${branch.id})`} strokeWidth="2.5" />

            {/* Center dashed lane line */}
            <path
              d={spinePath}
              fill="none"
              stroke={palette.primary}
              strokeWidth="2"
              strokeDasharray="10,8"
              opacity="0.25"
              strokeLinecap="round"
            />

            {/* ── Goal marker at top ── */}
            {(() => {
              const tip = spinePoint(1);
              return (
                <g filter="url(#goalGlow)">
                  <circle cx={tip.x} cy={tip.y - 22} r="22" fill={palette.primary} opacity="0.12" />
                  <circle cx={tip.x} cy={tip.y - 22} r="14" fill={palette.primary} opacity="0.25" />
                  <circle cx={tip.x} cy={tip.y - 22} r="7" fill={palette.primary} />
                  <text x={tip.x} y={tip.y - 18} textAnchor="middle" fontSize="8" fill="white" fontWeight="900">✦</text>
                  <text x={tip.x} y={tip.y - 52} textAnchor="middle" fontSize="10" fill={palette.primary} fontWeight="800" letterSpacing="1">
                    META
                  </text>
                </g>
              );
            })()}

            {/* ── Activity leaf cards ── */}
            {branch.leaves.map((leaf, i) => {
              const total = branch.leaves.length;
              // Distribute from t=0.08 (near base) to t=0.88 (near goal)
              const t = total === 1 ? 0.45 : 0.08 + (i / (total - 1)) * 0.80;
              const center = spinePoint(t);
              const hw = roadHW(t);
              const side = i % 2 === 0 ? 1 : -1; // right or left
              const cardW = 154;
              const cardH = 62;
              // Card X: just outside the road edge
              const cardX = center.x + side * (hw + 18);
              const cardY = center.y - cardH / 2;
              // Connector from road edge to card
              const connX1 = center.x + side * hw;
              const connX2 = side > 0 ? cardX : cardX + cardW;

              // Node on road spine
              const nodeR = 7 - t * 3.5; // shrinks with distance

              // Card scale for depth illusion
              const scaleF = 0.68 + (1 - t) * 0.32;

              return (
                <g
                  key={leaf.id}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transition: `opacity 0.5s ease ${0.2 + i * 0.07}s`,
                  }}
                >
                  {/* Connector line */}
                  <line
                    x1={connX1} y1={center.y}
                    x2={connX2} y2={center.y}
                    stroke={leaf.completed ? palette.primary : '#cbd5e1'}
                    strokeWidth={1.5 * scaleF}
                    strokeDasharray="4,3"
                    opacity="0.8"
                  />

                  {/* Spine node */}
                  <circle
                    cx={center.x} cy={center.y} r={nodeR}
                    fill={leaf.completed ? palette.primary : 'white'}
                    stroke={leaf.completed ? palette.mid : '#94a3b8'}
                    strokeWidth={1.5}
                  />
                  {leaf.completed && (
                    <text x={center.x} y={center.y + 3} textAnchor="middle" fontSize={nodeR * 1.1} fill="white" fontWeight="900" pointerEvents="none">✓</text>
                  )}

                  {/* Card */}
                  <g
                    transform={`translate(${side > 0 ? cardX : cardX - cardW * (1 - scaleF)}, ${cardY + cardH * (1 - scaleF) / 2}) scale(${scaleF})`}
                    style={{ transformOrigin: `${side > 0 ? '0' : `${cardW}px`} 50%`, cursor: 'pointer' }}
                    onClick={() => setSelectedLeaf(leaf)}
                    onPointerDown={e => e.stopPropagation()}
                  >
                    {/* Card bg */}
                    <rect
                      width={cardW} height={cardH / scaleF}
                      rx="14"
                      fill="white"
                      stroke={leaf.completed ? palette.primary : '#e2e8f0'}
                      strokeWidth={leaf.completed ? 2 : 1.5}
                      filter="url(#cardShadow)"
                    />
                    {/* Top accent bar if completed */}
                    {leaf.completed && (
                      <rect width={cardW} height="4" rx="2" fill={palette.primary} opacity="0.7" />
                    )}

                    {/* Status pill */}
                    <rect x="10" y="12" width={leaf.completed ? 56 : 52} height="14" rx="7"
                      fill={leaf.completed ? palette.light : '#f8fafc'}
                    />
                    <text x="15" y="22.5" fontSize="8" fill={leaf.completed ? palette.primary : '#94a3b8'} fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
                      {leaf.completed ? '✓ Listo' : 'Pendiente'}
                    </text>

                    {/* Title */}
                    <text x="10" y="42" fontSize="11" fill="#1e293b" fontWeight="700" fontFamily="sans-serif">
                      {leaf.name.length > 20 ? leaf.name.slice(0, 20) + '…' : leaf.name}
                    </text>

                    {/* Task count */}
                    {leaf.tasks && leaf.tasks.length > 0 && (
                      <text x="10" y="57" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">
                        {leaf.tasks.filter((t: any) => t.isCompleted).length}/{leaf.tasks.length} tareas
                      </text>
                    )}
                  </g>
                </g>
              );
            })}

            {/* Empty state */}
            {branch.leaves.length === 0 && (
              <g>
                <text x={W / 2} y={H / 2 - 12} textAnchor="middle" fontSize="13" fill="#cbd5e1" fontWeight="700" fontFamily="sans-serif">
                  Sin actividades aún
                </text>
                <text x={W / 2} y={H / 2 + 8} textAnchor="middle" fontSize="11" fill="#e2e8f0" fontFamily="sans-serif">
                  Toca + para añadir la primera
                </text>
              </g>
            )}

            {/* ── Base label ── */}
            {(() => {
              const base = spinePoint(0);
              return (
                <text x={base.x} y={base.y + 24} textAnchor="middle" fontSize="9" fill={palette.primary} fontWeight="700" fontFamily="sans-serif" opacity="0.5" letterSpacing="2">
                  INICIO
                </text>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* ── Hint bar ── */}
      <div className="shrink-0 py-2 text-center border-t border-slate-100">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Toca una actividad para ver detalle · Scroll para explorar</span>
      </div>

      {/* ── Leaf detail panel ── */}
      {selectedLeaf && (
        <LeafPanel
          leaf={selectedLeaf}
          palette={palette}
          onClose={() => setSelectedLeaf(null)}
          onToggleTask={async (taskId, done) => {
            // Re-use the task toggle API if available
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
