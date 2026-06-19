'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Branch } from './types';
import { TaskCoachChat } from './TaskCoachChat';
import { motion, useDragControls } from 'framer-motion';

interface Props {
  branch: Branch;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onToggleAction?: (id: string, data: { completed?: boolean; targetDate?: string }) => Promise<void>;
  onDeleteAction?: (id: string) => Promise<void>;
  onLeafClick?: (id: string | null) => void;
  onUpdateGoal?: (id: string, data: { goal?: string; description?: string }) => Promise<void>;
  onAddAction?: (goalId: string, name: string, data?: { targetDate?: string }) => Promise<any>;
  zoomedPhaseId?: string | null;
  activeLeafId?: string | null;
  onPhaseSelect?: (phaseId: string | null) => void;
}


// ── Milestone Evidence Panel ─────────────────────────────
function MilestoneEvidencePanel({
  leaf,
  palette,
  onVerified,
}: {
  leaf: any;
  palette: { primary: string; light: string };
  onVerified: () => Promise<void>;
}) {
  const impact = leaf.impact || {};
  const evaluationType: string = impact.evaluationType || 'text';
  const instructions: string = impact.evaluationInstructions || '';

  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ verified: boolean; feedback: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept =
    evaluationType === 'image' ? 'image/*' :
    evaluationType === 'document' ? '.pdf,.doc,.docx,.txt,image/*' :
    'image/*,.pdf,.txt';

  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      alert('El archivo debe pesar menos de 5 MB.');
      return;
    }
    setFile(f);
    setResult(null);

    if (f.type.startsWith('image/')) {
      // Compress image via canvas before preview
      const img = new Image();
      const url = URL.createObjectURL(f);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round(height * MAX_DIM / width); width = MAX_DIM; }
          else { width = Math.round(width * MAX_DIM / height); height = MAX_DIM; }
        }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(compressed);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else {
      setPreview(null);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setResult(null);
    try {
      let submission: string;

      if (evaluationType === 'text' || (!file && textInput)) {
        submission = textInput;
      } else if (file && preview) {
        submission = preview; // compressed base64
      } else if (file) {
        // Non-image file — just send file name as text evidence (V1)
        submission = `El usuario ha subido el archivo: "${file.name}" (${(file.size / 1024).toFixed(0)} KB)`;
      } else {
        submission = textInput;
      }

      const res = await fetch('/api/ai/verify-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneTitle: leaf.name,
          milestoneDescription: leaf.description,
          evaluationType,
          evaluationInstructions: instructions,
          submission,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.verified) {
        await onVerified();
      }
    } catch {
      setResult({ verified: false, feedback: 'Hubo un error al verificar. Intenta de nuevo.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const canSubmit = evaluationType === 'text' ? textInput.trim().length > 10 : !!file || textInput.trim().length > 10;

  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-amber-200 bg-amber-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-amber-200 flex items-center gap-2">
        <span className="text-lg">🍎</span>
        <div>
          <p className="text-xs font-black text-amber-900">Demostrar logro</p>
          {instructions && (
            <p className="text-[11px] text-amber-700 leading-snug mt-0.5">{instructions}</p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Text input — always visible for text type or as a fallback */}
        {(evaluationType === 'text' || evaluationType === 'questionnaire') && (
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Escribe tu reflexión, resumen o respuesta aquí…"
            className="w-full text-xs text-slate-700 font-medium bg-white border border-amber-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
            rows={3}
            disabled={isVerifying}
          />
        )}

        {/* File upload for image/document types */}
        {(evaluationType === 'image' || evaluationType === 'document' || evaluationType === 'none') && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
              disabled={isVerifying}
            />
            {!file ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-xl border-2 border-dashed border-amber-300 bg-white flex flex-col items-center gap-1 hover:border-amber-400 hover:bg-amber-50 transition-colors"
                disabled={isVerifying}
              >
                <span className="text-2xl">📎</span>
                <span className="text-[11px] font-bold text-amber-700">Toca para subir evidencia</span>
                <span className="text-[10px] text-amber-500">Imagen, PDF, documento — max 5 MB</span>
              </button>
            ) : (
              <div className="relative">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full rounded-xl max-h-40 object-cover border border-amber-200" />
                ) : (
                  <div className="w-full p-3 rounded-xl bg-white border border-amber-200 flex items-center gap-2">
                    <span className="text-xl">📄</span>
                    <span className="text-xs font-bold text-slate-700 truncate flex-1">{file.name}</span>
                  </div>
                )}
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40 text-white text-xs flex items-center justify-center hover:bg-black/60"
                >✕</button>
              </div>
            )}
          </div>
        )}

        {/* Also allow text alongside document upload */}
        {evaluationType !== 'text' && evaluationType !== 'questionnaire' && (
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="También puedes agregar un comentario (opcional)…"
            className="w-full text-xs text-slate-600 bg-white border border-amber-100 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
            rows={2}
            disabled={isVerifying}
          />
        )}

        {/* AI Feedback */}
        {result && (
          <div className={`p-3 rounded-xl text-xs font-semibold leading-relaxed ${result.verified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            <span className="font-black">{result.verified ? '✅ Verificado — ' : '❌ No verificado — '}</span>
            {result.feedback}
          </div>
        )}

        {/* Verify button */}
        {!result?.verified && (
          <button
            onClick={handleVerify}
            disabled={!canSubmit || isVerifying}
            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: canSubmit && !isVerifying ? palette.primary : undefined, color: canSubmit && !isVerifying ? '#fff' : undefined, backgroundColor: !canSubmit || isVerifying ? '#e2e8f0' : undefined }}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" /></svg>
                Analizando evidencia…
              </span>
            ) : '🤖 Verificar con IA'}
          </button>
        )}
      </div>
    </div>
  );
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frecuencia</p>
                    <p className="text-sm font-bold text-slate-700">
                      {leaf.frequency?.type === 'daily' ? `Cada ${leaf.frequency.value} día(s)` : 'Semanal'}
                    </p>
                  </div>
                  {(leaf as any).estimatedHours > 0 && (
                    <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                      <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Tiempo por sesión</p>
                      <p className="text-sm font-bold text-violet-700 flex items-center gap-1">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {(leaf as any).estimatedHours < 1
                          ? `${Math.round((leaf as any).estimatedHours * 60)} min`
                          : `${(leaf as any).estimatedHours}h`}
                      </p>
                    </div>
                  )}
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
              taskTitle={chatTask.name}
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
export function BranchDetailView({ branch, zoomedPhaseId, activeLeafId, onClose, onDelete, onUpdateGoal, onToggleAction, onDeleteAction, onLeafClick, onAddAction, onPhaseSelect }: Props) {
  const palette = getPalette(branch.id);
  const [mounted, setMounted] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<Branch['leaves'][0] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const renderActionCard = (child: any) => {
    const isExpandedLeaf = expandedLeafId === child.id;
    return (
      <div key={child.id} id={`leaf-${child.id}`} className="border border-slate-100 rounded-[20px] sm:rounded-3xl overflow-hidden bg-white shadow-sm transition-all duration-300">
        <div 
          className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer transition-colors ${isExpandedLeaf ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
          onClick={() => {
            const newId = isExpandedLeaf ? null : child.id;
            setExpandedLeafId(newId);
            onLeafClick?.(newId);
          }}
        >
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              const next = !child.completed;
              setLocalLeaves(prev => prev.map(l => l.id === child.id ? { ...l, completed: next } : l));
              await onToggleAction?.(child.id, { completed: next });
            }}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${child.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-400'}`}
          >
            {child.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <p className={`text-xs sm:text-sm font-bold truncate ${child.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {child.name}
            </p>
            {child.type === 'milestone' && (
              <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Entregable Final
              </span>
            )}
          </div>
          {/* Time badge */}
          {(child as any).estimatedHours > 0 && (
            <span className="shrink-0 text-[9px] font-black px-2 py-1 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 flex items-center gap-0.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {(child as any).estimatedHours < 1
                ? `${Math.round((child as any).estimatedHours * 60)} min`
                : `${(child as any).estimatedHours}h`}
            </span>
          )}
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              if (confirm('¿Eliminar actividad?')) {
                await onDeleteAction?.(child.id);
              }
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      
        {isExpandedLeaf && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-50">
            {(child as any).description && (
              <div className="mt-3 sm:mt-4 mb-3 sm:mb-4">
                <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Descripción</h4>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">{(child as any).description}</p>
              </div>
            )}

            {/* ── MILESTONE EVIDENCE PANEL ── */}
            {child.type === 'milestone' && !child.completed && (
              <MilestoneEvidencePanel
                leaf={child as any}
                palette={palette}
                onVerified={async () => {
                  setLocalLeaves(prev => prev.map(l => l.id === child.id ? { ...l, completed: true } : l));
                  await onToggleAction?.(child.id, { completed: true });
                }}
              />
            )}
            {child.type === 'milestone' && child.completed && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-xs font-black text-amber-800">¡Hito completado!</p>
                  <p className="text-[11px] text-amber-600 font-medium">Has superado esta fase. El fruto de tu esfuerzo ya está en tu árbol.</p>
                </div>
              </div>
            )}
      
            {(child as any).tasks && (child as any).tasks.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Pasos / Tareas</h4>
                <div className="space-y-2">
                  {(child as any).tasks.map((task: any) => (
                    <div key={task.id} className="border border-slate-100 rounded-[16px] sm:rounded-2xl overflow-hidden bg-slate-50/50">
                      <div 
                        className="flex items-center p-2 sm:p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                      >
                        <div className="mr-2 sm:mr-3">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center transition-all ${task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                            {task.isCompleted && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs sm:text-sm font-semibold block ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {task.title}
                          </span>
                          {task.targetDate && (
                            <p className="text-[9px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                              <span className="text-[8px]">📅</span> {new Date(task.targetDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="text-slate-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                      
                      {expandedTaskId === task.id && (
                        <div className="px-8 sm:px-11 pb-3 sm:pb-4 pt-1">
                          {task.description && (
                            <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed mb-3">
                              {task.description}
                            </p>
                          )}
                          
                          <button
                            onClick={() => setChatOpenTaskId(chatOpenTaskId === task.id ? null : task.id)}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                              chatOpenTaskId === task.id 
                                ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            🤖 {chatOpenTaskId === task.id ? 'Cerrar Coach' : 'Consultar tarea con el Coach'}
                          </button>
                          
                          {chatOpenTaskId === task.id && (
                            <TaskCoachChat 
                              taskId={task.id}
                              taskTitle={task.title} 
                              taskDescription={task.description}
                              onCloseMobile={() => setChatOpenTaskId(null)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
      
            {/* Activity-level Coach Chat */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center">
              <button
                onClick={() => setChatOpenTaskId(chatOpenTaskId === child.id ? null : child.id)}
                className={`w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  chatOpenTaskId === child.id 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                🤖 {chatOpenTaskId === child.id ? 'Ocultar Coach' : 'Consultar actividad con el Coach'}
              </button>
              
              {chatOpenTaskId === child.id && (
                <TaskCoachChat 
                  taskId={child.id}
                  taskTitle={child.name} 
                  taskDescription={(child as any).description}
                  onCloseMobile={() => setChatOpenTaskId(null)}
                />
              )}
            </div>
          </div>
        )}
    </div>
    );
  };

  const [editGoal, setEditGoal] = useState(branch.goal);
  const [editDesc, setEditDesc] = useState(branch.description || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(zoomedPhaseId || null);
  
  // Inline Leaf state
  const [expandedLeafId, setExpandedLeafId] = useState<string | null>(activeLeafId || null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [chatOpenTaskId, setChatOpenTaskId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const touchStartY = useRef(0);
  
  // Local copy of leaves — persists task state across panel open/close
  const [localLeaves, setLocalLeaves] = useState(() => branch.leaves);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  // Sync localLeaves if branch prop changes (e.g. full data reload from parent)
  useEffect(() => { setLocalLeaves(branch.leaves); }, [branch.leaves]);

  // Sync expanded phase with external zoom clicks
  useEffect(() => {
    if (zoomedPhaseId) {
      setExpandedPhaseId(zoomedPhaseId);
      // Wait for the accordion to animate open, then scroll smoothly
      setTimeout(() => {
        const el = document.getElementById(`phase-${zoomedPhaseId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [zoomedPhaseId]);

  useEffect(() => {
    if (activeLeafId) {
      setExpandedLeafId(activeLeafId);
      setTimeout(() => {
        const el = document.getElementById(`leaf-${activeLeafId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150); // slight delay for accordion animation
    }
  }, [activeLeafId]);

  // Update a single task across localLeaves
  const updateTaskInLeaves = (taskId: string, done: boolean) => {
    setLocalLeaves(prev => prev.map(leaf => ({
      ...leaf,
      tasks: leaf.tasks?.map((t: any) => t.id === taskId ? { ...t, isCompleted: done } : t),
    })));
  };

  // Filter hierarchical components
  const phases = localLeaves.filter(l => l.type === 'phase' || (!l.type && !l.parentId));
  const completed = phases.filter(l => l.completed).length;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (diff > 50) {
      setIsFullScreen(true); // swiped up
    } else if (diff < -50) {
      if (isFullScreen) setIsFullScreen(false); // swiped down
      else onClose(); // close if already half
    }
  };

  return (
    <div className={`fixed inset-x-0 bottom-0 w-full z-[9999] block sm:flex sm:items-center sm:p-6 sm:top-0 sm:bottom-0 sm:left-auto sm:right-0 sm:w-auto sm:h-full pointer-events-none m-0 p-0 transition-all duration-300 ${isFullScreen ? 'h-[100dvh]' : 'h-[calc(65vh-72px)]'}`}>
      <motion.div 
        drag={isDesktop}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        initial={isDesktop ? { x: 50, opacity: 0 } : { y: 50, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full h-full flex-1 sm:flex-none sm:w-[450px] bg-white sm:rounded-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] sm:shadow-2xl flex flex-col overflow-hidden pointer-events-auto border-t sm:border border-slate-100 m-0 ${isFullScreen ? 'rounded-none' : 'rounded-t-[32px]'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div 
          className="w-full flex items-center justify-center pt-4 pb-2 sm:hidden cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          <div className="w-12 h-1.5 bg-slate-200 hover:bg-slate-300 transition-colors rounded-full" />
        </div>

        {/* ── Header ── */}
        <div 
          className="shrink-0 px-5 sm:px-8 pb-5 sm:pb-6 pt-2 sm:pt-6 bg-white border-b border-slate-100 flex items-center justify-between sm:cursor-move"
          onPointerDown={(e) => {
            if (isDesktop) dragControls.start(e);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                Gestión de Meta
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">
                {completed}/{phases.length} Fases
              </span>
            </div>
            {isEditingTitle ? (
              <input
                autoFocus
                className="w-full text-xl sm:text-2xl font-black text-slate-900 bg-slate-50 border-b-2 border-emerald-500 focus:outline-none"
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
              <div>
                <h2 
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl sm:text-2xl font-black text-slate-900 truncate hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {editGoal}
                </h2>
                {(() => {
                  let dateStr = branch.deadline;
                  if (!dateStr) {
                    const phasesWithDates = branch.leaves.filter(l => l.type === 'phase' && l.targetDate);
                    if (phasesWithDates.length > 0) {
                      const maxDate = new Date(Math.max(...phasesWithDates.map(p => new Date(p.targetDate!).getTime())));
                      dateStr = maxDate.toISOString();
                    }
                  }
                  return dateStr ? (
                    <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                      <span className="text-[10px]">📅</span> Estimado para: {new Date(dateStr).toLocaleDateString()}
                    </p>
                  ) : null;
                })()}
              </div>
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
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-slate-50/30 custom-scrollbar">
          <section className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción del Proyecto</p>
              {!isEditingDesc && (
                <button onClick={() => setIsEditingDesc(true)} className="text-[9px] sm:text-[10px] font-bold text-emerald-600 hover:underline">Editar</button>
              )}
            </div>
            {isEditingDesc ? (
              <div className="space-y-3">
                <textarea
                  autoFocus
                  className="w-full p-3 sm:p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500/20"
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

          <section className="space-y-3">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Planificación por Fases</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                + Nueva Fase
              </button>
            </div>

            <div className="space-y-3">
              {phases.map((phase) => {
                const isExpanded = expandedPhaseId === phase.id;
                const children = localLeaves.filter(l => l.parentId === phase.id).sort((a, b) => {
                  if (a.type === 'milestone' && b.type !== 'milestone') return 1;
                  if (b.type === 'milestone' && a.type !== 'milestone') return -1;
                  return 0;
                });
                
                return (
                  <div 
                    key={phase.id} 
                    id={`phase-${phase.id}`}
                    className={`rounded-[24px] sm:rounded-[28px] border transition-all duration-300 ${isExpanded ? 'bg-white border-emerald-100 shadow-xl' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}
                  >
                    <div 
                      className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer"
                      onClick={() => {
                        const newId = isExpanded ? null : phase.id;
                        setExpandedPhaseId(newId);
                        onPhaseSelect?.(newId);
                      }}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-colors ${phase.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {phase.completed ? '✓' : '⏳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm sm:text-base font-bold leading-tight ${phase.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {phase.name}
                        </h4>
                        {phase.targetDate && (
                          <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                            <span className="text-[8px]">📅</span> {new Date(phase.targetDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                        className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 sm:pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="border-t border-slate-50 pt-4 sm:pt-5 space-y-3">
                          {children.length > 0 ? (
                            children.map(child => renderActionCard(child))
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

          {(() => {
            const independentLeaves = localLeaves.filter(l => !l.parentId && l.type !== 'phase');
            return independentLeaves.length > 0 && (
              <section className="space-y-3 mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Hitos y Tareas Sueltas</p>
                </div>
                <div className="space-y-3">
                  {independentLeaves.map(child => renderActionCard(child))}
                </div>
              </section>
            );
          })()}
        </div>

        {/* Footer Area */}
        <div className="shrink-0 px-8 py-4 bg-white border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Usa el Coach en cada tarea para obtener ayuda detallada
          </p>
        </div>
      </motion.div>



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
