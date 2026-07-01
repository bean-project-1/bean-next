'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Branch } from './types';
import { motion, useDragControls } from 'framer-motion';
import { useGlobalChat } from '../chat/GlobalChatProvider';

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
  onOpenTaskModal?: (item: any, itemType: 'action' | 'task') => void;
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
  leaf, branch, openChat, palette, onClose, onToggle, onDelete, onToggleTask, allLeaves, onToggleSubAction
}: {
  leaf: Branch['leaves'][0];
  branch: Branch;
  openChat: (msg?: string, ctx?: string, goal?: any) => void;
  palette: ReturnType<typeof getPalette>;
  onClose: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
  onToggleTask?: (taskId: string, done: boolean) => Promise<void> | void;
  allLeaves: Branch['leaves'];
  onToggleSubAction?: (id: string, data: { completed: boolean }) => Promise<void>;
}) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  // Find sub-actions (tasks/milestones) if this is a phase
  const children = allLeaves ? allLeaves.filter(l => l.parentId === leaf.id) : [];
  const tasks = children.filter(c => c.type === 'task');
  const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
  const milestones = children.filter(c => c.type === 'milestone');

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
        <div className={`flex-1 flex flex-col overflow-hidden flex`}>
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
                    return (
                      <div
                        key={task.id ?? i}
                        className="rounded-2xl border bg-white overflow-hidden transition-all shadow-sm"
                        style={{ borderColor: task.completed ? palette.primary + '44' : '#e8edf2' }}
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
                            onClick={(e) => { e.stopPropagation(); openChat(`Necesito ayuda con la Tarea: "${task.name}". ¿Me puedes dar contexto o sugerencias de cómo abordarla?`, 'tree', branch); }}
                            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-slate-400 hover:bg-emerald-50 hover:text-emerald-600`}
                            title="Consultar en Mesa de Dibujo"
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

      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(40px) scale(0.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ── Main View ────────────────────────────────────
export function BranchDetailView({ branch, zoomedPhaseId, activeLeafId, onClose, onDelete, onUpdateGoal, onToggleAction, onDeleteAction, onLeafClick, onAddAction, onPhaseSelect, onOpenTaskModal }: Props) {
  const palette = getPalette(branch.id);
  const [mounted, setMounted] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<Branch['leaves'][0] | null>(null);

  const [commitments, setCommitments] = useState<any[]>([]);
  const [loadingCommitments, setLoadingCommitments] = useState(false);

  useEffect(() => {
    if (!branch.id) return;
    setLoadingCommitments(true);
    fetch('/api/profile/commitments')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const associated = json.commitments.filter((c: any) => c.goalId === branch.id);
          setCommitments(associated);
        }
      })
      .catch(e => console.error('Error fetching commitments in BranchDetailView:', e))
      .finally(() => setLoadingCommitments(false));
  }, [branch.id]);
  const renderActionCard = (child: any) => {
    const isExpandedLeaf = expandedLeafId === child.id;
    return (
      <div key={child.id} id={`leaf-${child.id}`} className="border border-[#E6E1D6]/70 rounded-[20px] sm:rounded-3xl overflow-hidden bg-[#FAF9F6] shadow-xs hover:border-[#1B7A4E]/30 hover:shadow-sm transition-all duration-300">
        <div 
          className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer transition-colors ${isExpandedLeaf ? 'bg-white' : 'hover:bg-white/80'}`}
          onClick={() => {
            const newId = isExpandedLeaf ? null : child.id;
            setExpandedLeafId(newId);
            onLeafClick?.(newId);
          }}
        >
          {child.baseCommitmentTitle ? (
            <button 
              onClick={async (e) => {
                e.stopPropagation();
                const res = await fetch(`/api/profile/commitments/${child.baseCommitmentId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'complete' })
                }).then(r => r.json());
                if (res.success) {
                  window.dispatchEvent(new CustomEvent('refresh-life-tree'));
                } else {
                  alert('Error al registrar la sesión: ' + (res.error || 'Inténtalo de nuevo.'));
                }
              }}
              className="w-12 h-6 rounded-full bg-emerald-50 hover:bg-[#1B7A4E]/10 border border-[#1B7A4E]/20 flex items-center justify-center text-[9px] font-black text-[#1B7A4E] shrink-0 transition-all active:scale-95 shadow-sm"
              title="Registrar sesión realizada hoy"
            >
              🔥 {child.completedCount || 0}/{child.totalSessions || 1}
            </button>
          ) : (() => {
            const childTasks = (child as any).tasks as any[] | undefined;
            if (childTasks && childTasks.length > 0) {
              const done = childTasks.filter(t => t.isCompleted).length;
              const total = childTasks.length;
              return (
                <span
                  onClick={e => e.stopPropagation()}
                  className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border select-none ${
                    done === total ? 'bg-[#EAF5EC] text-[#1B7A4E] border-[#CDE5D2]' : 'bg-[#F4F1EA] text-stone-500 border-[#E6E1D6]'
                  }`}
                >
                  {done}/{total}
                </span>
              );
            }
            return (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const next = !child.completed;
                  setLocalLeaves(prev => prev.map(l => l.id === child.id ? { ...l, completed: next } : l));
                  await onToggleAction?.(child.id, { completed: next });
                }}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${child.completed ? 'bg-[#1B7A4E] border-[#1B7A4E]' : 'bg-white border-stone-250 hover:border-[#1B7A4E]'}`}
              >
                {child.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            );
          })()}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <p className={`text-xs sm:text-sm font-bold truncate ${child.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {child.name}
              </p>
              {child.type === 'milestone' && (
                <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  Entregable Final
                </span>
              )}
            </div>
            {child.baseCommitmentTitle && (
              <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate flex items-center gap-1">
                <span>🔄</span> Hábito: <span className="text-slate-600">{child.baseCommitmentTitle}</span>
              </p>
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
                          
                          <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenTaskModal?.(task, 'task');
                              }}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-stone-600 bg-stone-100 hover:bg-stone-200"
                            >
                              📝 Detalles y notas
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openChat(`Necesito ayuda con la Tarea: "${task.title}". ¿Me puedes dar contexto o sugerencias de cómo abordarla?`, 'tree', branch);
                              }}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-white bg-gradient-to-r from-[#0B462C] to-[#1B7A4E] hover:from-[#083622] hover:to-[#145D3B]"
                            >
                              🤖 Mesa de Dibujo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
      
            {/* Activity-level Coach Chat */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => onOpenTaskModal?.(child, 'action')}
                className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-white border border-[#E6E1D6] text-stone-700 hover:bg-[#FAF9F6]"
              >
                📝 Ver detalles y notas
              </button>
              <button
                onClick={() => openChat(`Necesito consejos generales para abordar la Fase completa: "${child.name}".`, 'tree', branch)}
                className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-[#0B462C] to-[#1B7A4E] hover:from-[#083622] hover:to-[#145D3B] text-white shadow-xs"
              >
                🤖 Consultar en Mesa de Dibujo
              </button>
            </div>
          </div>
        )}
    </div>
    );
  };

  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(zoomedPhaseId || null);
  
  // Inline Leaf state
  const [expandedLeafId, setExpandedLeafId] = useState<string | null>(activeLeafId || null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [drawerState, setDrawerState] = useState<'peek' | 'half' | 'full'>('half');
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const { openChat, openDraft } = useGlobalChat();

  // Close menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Force expand when phase or leaf is clicked only if currently collapsed (in peek state)
  useEffect(() => {
    if ((zoomedPhaseId || activeLeafId) && drawerState === 'peek') {
      setDrawerState('half');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedPhaseId, activeLeafId]);

  // Reset drawer when branch changes
  useEffect(() => {
    if (branch.id) {
      setDrawerState('half');
    }
  }, [branch.id]);

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
    const diff = touchStartY.current - touchEndY; // Positive = swipe up, Negative = swipe down
    if (diff > 50) {
      if (drawerState === 'peek') setDrawerState('half');
      else if (drawerState === 'half') setDrawerState('full');
    } else if (diff < -50) {
      if (drawerState === 'full') setDrawerState('half');
      else if (drawerState === 'half') setDrawerState('peek');
      else if (drawerState === 'peek') onClose();
    }
  };

  const isFullScreen = drawerState === 'full';

  return (
    <div className={`fixed inset-0 z-[9999] flex items-end overflow-hidden transition-all duration-300 ${
      isDesktop 
        ? (drawerState === 'full' 
            ? 'md:items-stretch md:justify-stretch p-0 md:p-0 pointer-events-auto' 
            : 'md:items-stretch md:justify-end p-0 md:p-6 pointer-events-none') 
        : 'p-0 pointer-events-none'
    }`}>
      {/* Backdrop: Visible on both mobile and desktop when drawer is in 'full' state. */}
      {drawerState === 'full' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto z-0"
          onClick={() => setDrawerState('half')}
        />
      )}

      <motion.div 
        id="tour-goal-roadmap"
        initial={isDesktop ? { x: '100%', opacity: 0 } : { y: '100%' }}
        animate={{ x: 0, opacity: 1, y: 0 }}
        transition={{ 
          type: 'tween', 
          ease: [0.16, 1, 0.3, 1], // premium cubic-bezier easeOut
          duration: 0.3 
        }}
        className={`relative w-full bg-white shadow-2xl flex flex-col overflow-hidden pointer-events-auto border-t md:border border-[#E6E1D6] transition-[width,height,max-width,max-height] duration-300 ease-out z-10 ${
          isDesktop 
            ? (drawerState === 'full'
                ? 'md:w-screen md:h-screen md:max-w-none md:rounded-none'
                : 'md:w-[500px] md:h-[calc(100vh-48px)] md:rounded-[32px] md:self-center md:mr-6')
            : (drawerState === 'full' 
                ? 'h-[95dvh] rounded-t-[32px]' 
                : drawerState === 'half' 
                  ? 'h-[50dvh] rounded-t-[32px]' 
                  : 'h-[110px] rounded-t-[32px]')
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div 
          className="w-full flex items-center justify-center pt-4 pb-2 md:hidden cursor-pointer bg-[#FAF9F6] select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (drawerState === 'peek') setDrawerState('half');
            else if (drawerState === 'half') setDrawerState('full');
            else setDrawerState('half');
          }}
        >
          <div className="w-12 h-1.5 bg-[#E6E1D6] hover:bg-stone-300 transition-colors rounded-full" />
        </div>

        {/* Accent line at the very top of the modal representing the trunk */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#A0522D] to-[#8B5A2B]" />

        {/* ── Header ── */}
        <div 
          className="shrink-0 px-5 sm:px-8 pb-5 sm:pb-6 pt-3 sm:pt-6 bg-[#FAF9F6] border-b border-[#E6E1D6] flex flex-col gap-3"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Row 1: Badges / Info on the left, Buttons on the right */}
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#A0522D] border border-[#EAD4C5] text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0">
                Gestión de Meta
              </span>
              {branch.status === 'paused' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0">
                  ⏸ Pausada
                </span>
              )}
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums truncate">
                • {completed}/{phases.length} Fases
              </span>
            </div>

            {/* Actions: Expand, Menu, Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  if (drawerState === 'full') setDrawerState('half');
                  else setDrawerState('full');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
                title={drawerState === 'full' ? 'Reducir' : 'Expandir'}
              >
                {drawerState === 'full' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                    <path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 8V5a2 2 0 0 1 2-2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/>
                    <path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/>
                  </svg>
                )}
              </button>
              
              <div className="relative" ref={menuRef}>
                {/* Trigger */}
                <button
                  onClick={() => setIsMenuOpen(v => !v)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
                  title="Opciones"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-10 z-50 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openDraft(branch);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-[#FAF0E6] hover:text-[#A0522D] transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Editar plan
                    </button>

                    <div className="mx-4 border-t border-slate-100" />

                    {/* Close */}
                    <button
                      onClick={() => { setIsMenuOpen(false); onClose(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Cerrar
                    </button>

                    <div className="mx-4 border-t border-slate-100" />

                    {/* Delete — destructive, at bottom */}
                    <button
                      onClick={async () => {
                        setIsMenuOpen(false);
                        if (confirm('¿Eliminar esta meta completa? Esta acción no se puede deshacer.')) {
                          await onDelete?.(branch.id);
                          onClose();
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      Eliminar meta
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E6E1D6]/40 hover:bg-[#E6E1D6]/70 text-[#5c4033] flex items-center justify-center transition-colors shrink-0"
                title="Cerrar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Row 2: Title and Dates (Spanning full width) */}
          <div className="w-full mt-1 flex flex-col gap-1.5">
            <h2 className="text-lg sm:text-xl font-black text-[#5c4033] leading-snug whitespace-normal break-words" title={branch.goal}>
              {branch.goal}
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
              return (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {dateStr && (
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <span className="text-[10px]">📅</span> Estimado para: {new Date(dateStr).toLocaleDateString()}
                    </p>
                  )}
                  {branch.status === 'paused' && branch.resumeDate && (
                    <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <span className="text-[10px]">⏳</span> Retomar el: {new Date(branch.resumeDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── Content ── */}
        <div className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 bg-[#F4F1EA] custom-scrollbar ${(!isDesktop && drawerState === 'peek') ? 'hidden' : 'block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start space-y-0">
            {/* Columna Izquierda: Descripción y Ritmos */}
            <div className={`${isDesktop && drawerState === 'full' ? 'md:col-span-5' : 'md:col-span-12'} space-y-6`}>
              <section className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-[#E6E1D6] shadow-sm">
                <div className="mb-2">
                  <p className="text-[9px] sm:text-[10px] font-black text-stone-500 uppercase tracking-widest">Descripción del Proyecto</p>
                </div>
                <p className="text-sm font-medium text-stone-600 leading-relaxed">
                  {branch.description || 'Sin descripción detallada.'}
                </p>
              </section>

              {/* Ritmos y Rutinas vinculados */}
              <section className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-[#E6E1D6] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] sm:text-[10px] font-black text-stone-500 uppercase tracking-widest">Ritmos y Rutinas de la Meta</p>
                  <span className="text-[10px] font-black text-stone-500 bg-[#F4F1EA] px-2.5 py-0.5 rounded-full border border-[#E6E1D6]/60">
                    {commitments.length}
                  </span>
                </div>
                {loadingCommitments ? (
                  <div className="h-10 bg-[#FAF9F6] animate-pulse rounded-xl" />
                ) : commitments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic font-bold">Sin rutinas o hábitos fijos programados para esta meta.</p>
                ) : (
                  <div className="space-y-2">
                    {commitments.map((c) => {
                      const icons: Record<string, string> = { work: '💼', study: '🎓', routine: '🔄' };
                      const labels: Record<string, string> = { work: 'Trabajo', study: 'Estudio', routine: 'Rutina' };
                      return (
                        <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1D6]/70 bg-[#FAF9F6]/80 hover:bg-[#FAF9F6] transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm">{icons[c.type] || '🔄'}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-850 truncate">{c.title}</p>
                              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter mt-0.5">
                                {labels[c.type] || 'Rutina'} • {c.startTime && c.endTime ? `${c.startTime} - ${c.endTime} (${c.hoursPerDay}h)` : `${c.hoursPerDay}h/día`}
                              </p>
                            </div>
                          </div>
                          {c.streakCount > 0 && (
                            <span className="shrink-0 text-[9px] font-extrabold text-[#A0522D] bg-[#FDF5F0] border border-[#EAD4C5] px-2 py-0.5 rounded-full">
                              🔥 {c.streakCount}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Columna Derecha: Planificación por Fases */}
            <div className={`${isDesktop && drawerState === 'full' ? 'md:col-span-7' : 'md:col-span-12'} space-y-6`}>
              <section className="space-y-3">
                <div className="mb-2">
                  <p className="text-[9px] sm:text-[10px] font-black text-stone-500 uppercase tracking-widest">Planificación por Fases</p>
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
                        className={`rounded-[24px] sm:rounded-[28px] border transition-all duration-300 ${isExpanded ? 'bg-white border-[#1B7A4E]/30 shadow-md' : 'bg-white border-[#E6E1D6] shadow-xs hover:border-stone-300'}`}
                      >
                        <div 
                          className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer"
                          onClick={() => {
                            const newId = isExpanded ? null : phase.id;
                            setExpandedPhaseId(newId);
                            onPhaseSelect?.(newId);
                          }}
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-colors ${phase.completed ? 'bg-[#1B7A4E] text-white' : 'bg-[#F4F1EA] text-[#A0522D] border border-[#EAD4C5]/40'}`}>
                            {phase.completed ? '✓' : '⏳'}
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-sm sm:text-base font-bold leading-tight ${phase.completed ? 'text-slate-400 line-through' : 'text-slate-800'} truncate`}>
                                {phase.name}
                              </h4>
                              {phase.targetDate && (
                                <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                  <span className="text-[8px]">📅</span> {new Date(phase.targetDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenTaskModal?.(phase, 'action');
                              }}
                              className="shrink-0 p-1.5 text-stone-400 hover:text-stone-600 transition-colors text-xs hover:bg-stone-50 rounded-lg"
                              title="Detalles y notas de la fase"
                            >
                              📝
                            </button>
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
                  <section className="space-y-3 mt-8 pt-6 border-t border-[#E6E1D6]">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <p className="text-[9px] sm:text-[10px] font-black text-stone-500 uppercase tracking-widest">Hitos y Tareas Sueltas</p>
                    </div>
                    <div className="space-y-3">
                      {independentLeaves.map(child => renderActionCard(child))}
                    </div>
                  </section>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="shrink-0 px-8 py-4 bg-[#FAF9F6] border-t border-[#E6E1D6] text-center">
          <p className="text-[10px] font-bold text-[#A0522D] uppercase tracking-widest">
            Usa el Coach en cada tarea para obtener ayuda detallada
          </p>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F4F1EA;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E6E1D6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #BFBAB0;
        }
      `}</style>
    </div>
  );
}
