'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, MessageSquare, ChevronRight, ChevronDown, Trash2, Bot, BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../../hooks/useUIStore';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface BranchData {
  goalTitle: string;
  dimensionName: string;
  hoursPerWeek: number;
  targetDate: string;
  budget?: number;
}

interface GlobalAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  context?: string;
  existingGoalData?: any;
}

function renderFormattedText(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
      {i !== arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

const EditableField = ({ value, onChange, className, isMultiline = false, isCompleted = false, placeholder = '' }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  if (isCompleted) return <span className={className}>{value}</span>;

  if (isEditing) {
    const commonProps = {
      value: tempValue,
      onChange: (e: any) => setTempValue(e.target.value),
      onBlur: () => { 
        setIsEditing(false); 
        if (tempValue !== value) onChange(tempValue); 
      },
      onKeyDown: (e: any) => { 
        if (e.key === 'Enter' && !isMultiline) { 
          setIsEditing(false); 
          if (tempValue !== value) onChange(tempValue); 
        } 
      },
      autoFocus: true,
      className: `${className} border-b border-emerald-500 outline-none bg-emerald-50/50 block w-full px-1 -ml-1 rounded-sm shadow-inner`
    };
    return isMultiline ? (
      <textarea {...commonProps} rows={2} className={`${commonProps.className} resize-none`} />
    ) : (
      <input type="text" {...commonProps} />
    );
  }

  return (
    <span 
      className={`${className} ${!isCompleted ? 'cursor-text hover:bg-stone-100' : ''} rounded px-1 -ml-1 transition-colors block`} 
      onClick={(e) => { 
        if (isCompleted) return;
        e.stopPropagation();
        setTempValue(value || ''); 
        setIsEditing(true); 
      }}
    >
      {value || <span className="text-stone-300 italic">{placeholder}</span>}
    </span>
  );
};

const DraftItemDetailSheet = ({ itemData, selection, parentPhase, parentTask, onClose, updateDraftPlanItem, handleDeleteDraftItem, handleAddDraftItem, handleAddContextToChat }: any) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const { type, pIdx, tIdx, sIdx } = selection;

  const handleDownloadNotes = () => {
    if (!itemData.notes) return;
    const element = document.createElement("a");
    const file = new Blob([itemData.notes], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${itemData.title || itemData.name || 'notas'}.md`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const titlePrefix = type === 'phase' ? 'Fase' : type === 'task' ? 'Tarea' : 'Subtarea';
  const breadcrumb = type === 'task' ? `en Fase: ${parentPhase?.title}` : type === 'subTask' ? `de la Tarea: ${parentTask?.name}` : '';

  return (
    <motion.div 
      initial={{ y: '100%', opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-50 bg-white md:rounded-t-3xl shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col h-[85vh] md:h-[70vh] border-t border-x border-stone-200"
    >
      <div className="flex justify-between items-start p-5 border-b border-stone-100">
        <div className="flex-1 pr-4">
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-1 flex items-center gap-1">
            {titlePrefix} <span className="text-stone-400 font-medium normal-case">{breadcrumb}</span>
          </p>
          <EditableField 
            value={itemData.title || itemData.name} 
            onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, type === 'phase' ? 'title' : 'name', val)}
            isCompleted={itemData.isCompleted}
            className="text-xl font-black text-stone-800" 
            placeholder={`Nombre de la ${titlePrefix}...`}
          />
        </div>
        <button onClick={onClose} className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Descripción</h4>
          <EditableField 
            value={itemData.description} 
            onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, 'description', val)}
            isCompleted={itemData.isCompleted}
            isMultiline={true}
            className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100 w-full min-h-[80px]" 
            placeholder="Añade una descripción detallada..."
          />
        </div>

        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Parámetros</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Inicio Tentativo</span>
              <input 
                type="date" 
                value={itemData.startDate ? new Date(itemData.startDate).toISOString().split('T')[0] : ''} 
                onChange={(e) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, 'startDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                disabled={itemData.isCompleted}
                className="bg-transparent font-bold text-sm text-stone-700 outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Fecha Límite</span>
              <input 
                type="date" 
                value={itemData.targetDate ? new Date(itemData.targetDate).toISOString().split('T')[0] : (itemData.endDate ? new Date(itemData.endDate).toISOString().split('T')[0] : '')} 
                onChange={(e) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, type === 'subTask' ? 'endDate' : 'targetDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                disabled={itemData.isCompleted}
                className="bg-transparent font-bold text-sm text-stone-700 outline-none w-full"
              />
            </div>
            
            {(type === 'task' || type === 'subTask') && (
              <>
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Esfuerzo Estimado</span>
                  <div className="flex items-center">
                    <EditableField 
                      value={itemData.estimatedHours?.toString()} 
                      onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, 'estimatedHours', parseFloat(val) || 0)}
                      isCompleted={itemData.isCompleted}
                      className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded text-center min-w-[2.5rem]" 
                      placeholder="0"
                    />
                    <span className="text-[10px] font-black uppercase text-stone-400 ml-1.5">horas</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Energía Requerida</span>
                  <select
                    value={itemData.effort || 3}
                    onChange={(e) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, 'effort', parseInt(e.target.value))}
                    disabled={itemData.isCompleted}
                    className="bg-transparent font-bold text-sm text-stone-700 outline-none w-full cursor-pointer"
                  >
                    <option value={1}>Baja (Cualquier hora)</option>
                    <option value={3}>Media</option>
                    <option value={5}>Alta (Hacer en la mañana)</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {(type === 'phase' || type === 'task') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => setIsNotesCollapsed(!isNotesCollapsed)}
                className="flex items-center gap-1 hover:bg-stone-100 px-1.5 py-0.5 rounded transition-colors"
              >
                {isNotesCollapsed ? <ChevronRight className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Mis Notas / Apuntes</h4>
              </button>
              
              {!isNotesCollapsed && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                    className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${isEditingNotes ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}
                  >
                    {isEditingNotes ? 'Vista Previa' : 'Editar Markdown'}
                  </button>
                  {itemData.notes && (
                    <button 
                      onClick={handleDownloadNotes}
                      className="text-[10px] font-bold text-stone-500 hover:text-stone-700 px-2 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded transition-colors"
                      title="Descargar como Markdown"
                    >
                      Descargar .md
                    </button>
                  )}
                </div>
              )}
            </div>

            {!isNotesCollapsed && (
              <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-xl">
                {isEditingNotes ? (
                  <EditableField 
                    value={itemData.notes} 
                    onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, sIdx, 'notes', val)}
                    isCompleted={itemData.isCompleted}
                    isMultiline={true}
                    className="text-sm text-amber-900 leading-relaxed min-h-[120px] font-medium w-full" 
                    placeholder="Escribe notas aquí en formato Markdown o pídele al Coach que las guarde por ti..."
                  />
                ) : (
                  <div 
                    className="text-sm text-amber-900 leading-relaxed min-h-[120px] max-w-none prose prose-sm prose-amber"
                    onClick={() => { if (!itemData.isCompleted) setIsEditingNotes(true); }}
                  >
                    {itemData.notes ? (
                      renderFormattedText(itemData.notes)
                    ) : (
                      <span className="text-amber-700/50 italic cursor-text hover:text-amber-700/70">No hay notas. Haz clic para empezar a editar el markdown.</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-stone-100 space-y-3 pb-8">
          <button 
            onClick={() => {
              const contextStr = type === 'phase' ? `[Fase: ${itemData.title}]` : type === 'task' ? `[Tarea: ${itemData.name} (en Fase: ${parentPhase?.title})]` : `[Sub-tarea: ${itemData.name} (de la Tarea: ${parentTask?.name})]`;
              handleAddContextToChat(contextStr);
              onClose();
            }}
            className="w-full bg-stone-900 text-white hover:bg-stone-800 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquare className="w-5 h-5" /> Consultar al Coach
          </button>
          
          <div className="flex gap-2">
            {!itemData.isCompleted && (type === 'phase' || type === 'task') && (
              <button 
                onClick={() => {
                  handleAddDraftItem(type === 'phase' ? 'task' : 'subTask', pIdx, tIdx);
                  onClose();
                }}
                className="flex-1 bg-stone-100 text-stone-700 hover:bg-stone-200 py-3.5 rounded-xl font-bold text-sm transition-colors border border-stone-200"
              >
                + Añadir {type === 'phase' ? 'Tarea' : 'Subtarea'}
              </button>
            )}

            {!itemData.isCompleted && (
              showDeleteConfirm ? (
                <div className="flex gap-2 flex-1">
                  <button onClick={() => { handleDeleteDraftItem(type, pIdx, tIdx, sIdx); onClose(); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">¡Confirmar!</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 py-3.5 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 py-3.5 rounded-xl font-bold text-sm transition-colors border border-red-100 ${type === 'phase' || type === 'task' ? 'px-5' : 'flex-1'}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function GlobalAIChat({ isOpen, onClose, initialMessage, context = 'global', existingGoalData }: GlobalAIChatProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingBranch, setPendingBranch] = useState<BranchData | null>(null);
  const [draftPlan, setDraftPlan] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftStep, setDraftStep] = useState<string>('');
  const [attachedContexts, setAttachedContexts] = useState<string[]>([]);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'draft'>('chat');
  const [selectedDraftItem, setSelectedDraftItem] = useState<{type: 'phase'|'task'|'subTask', pIdx: number, tIdx?: number, sIdx?: number} | null>(null);
  const [collapsedTasks, setCollapsedTasks] = useState<Record<string, boolean>>({});
  
  const activeSpaceId = useUIStore(state => state.activeSpaceId);
  const isSpaceZoomed = useUIStore(state => state.isSpaceZoomed);
  const isPersonalTree = isSpaceZoomed && (activeSpaceId === 'personal' || activeSpaceId === null);
  
  const toggleCollapse = (id: string) => {
    setCollapsedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/ai/chat?context=${context}`);
      const data = await res.json();
      if (data.success) {
        setSessionId(data.data.id);
        setMessages(data.data.messages.filter((m: any) => m.role !== 'system'));
      } else {
        if (data.error === 'Not authenticated') {
          setLoadError('Tu sesión ha expirado. Por favor recarga la página.');
        }
      }
    } catch (e) {
      console.error('Failed to load chat session:', e);
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  useEffect(() => {
    if (isOpen) {
      loadSession();
      if (existingGoalData) {
        // Map existing branch data to the draftPlan structure
        const allLeaves = existingGoalData.leaves || [];
        const phases = allLeaves.filter((l: any) => l.type === 'phase' || (!l.type && !l.parentId));
        const tasks = allLeaves.filter((l: any) => l.type === 'task');
        const milestones = allLeaves.filter((l: any) => l.type === 'milestone');

        const mappedDraft = {
          isExistingRefactor: true,
          goalId: existingGoalData.id,
          phases: phases.map((phase: any) => {
            const phaseTasks = tasks.filter((t: any) => t.parentId === phase.id);
            const phaseMilestone = milestones.find((m: any) => m.parentId === phase.id);

            return {
              id: phase.id,
              isCompleted: phase.completed,
              title: phase.name,
              description: phase.description,
              targetDate: phase.targetDate,
              milestone: phaseMilestone ? {
                title: phaseMilestone.name,
                description: phaseMilestone.description,
                evaluationType: phaseMilestone.impact?.evaluationType,
                evaluationInstructions: phaseMilestone.impact?.evaluationInstructions
              } : undefined,
              tasks: phaseTasks.map((t: any) => ({
                id: t.id,
                isCompleted: t.completed ?? t.isCompleted,
                name: t.title || t.name,
                description: t.description,
                targetDate: t.targetDate,
                estimatedHours: t.estimatedHours,
                notes: t.notes || '',
                subTasks: (t.tasks || []).map((st: any) => ({
                  id: st.id,
                  isCompleted: st.isCompleted,
                  name: st.title || st.name,
                  description: st.description,
                  estimatedHours: st.estimatedHours
                }))
              }))
            };
          }),
          habits: [],
          continuousProjects: []
        };
        setDraftPlan(mappedDraft);
      }
    }
  }, [isOpen, loadSession, existingGoalData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle initial message auto-send when chat is opened
  useEffect(() => {
    if (isOpen && initialMessage && !isLoading && !isSending) {
      // Small timeout to allow UI to settle
      const timer = setTimeout(() => {
        handleSubmit(undefined, initialMessage);
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage, isLoading]);

  const handleReset = () => {
    setSessionId(null);
    setMessages([]);
    setPendingBranch(null);
    setDraftPlan(null);
    setAttachedContexts([]);
    setBranchCreated(false);
  };

  const generateDraft = async (goalData: BranchData, revisionInstructions?: string) => {
    setIsDrafting(true);
    setDraftStep(revisionInstructions ? 'Repensando el plan...' : 'Analizando agenda...');
    let timer: any;
    if (!revisionInstructions) {
      timer = setTimeout(() => setDraftStep('Diseñando tu plan estructurado...'), 4000);
    }
    try {
      const res = await fetch('/api/ai/draft-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalData,
          previousDraft: draftPlan,
          revisionInstructions
        })
      });
      const data = await res.json();
      if (data.success) {
        setDraftPlan(data.draft);
      } else if (data.auditFailed) {
        setPendingBranch(null);
        setDraftPlan(null);
        setMessages(prev => [...prev, { role: 'assistant', content: data.renegotiationMessage }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error al diseñar el borrador: ${data.error || 'Error interno'}` }]);
      }
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error de conexión al generar el borrador.` }]);
    } finally {
      if (timer) clearTimeout(timer);
      setIsDrafting(false);
      setDraftStep('');
    }
  };

  const handleSubmit = async (e?: React.FormEvent, overrideMsg?: string) => {
    e?.preventDefault();
    const userMsg = (overrideMsg || input).trim();
    if ((!userMsg && attachedContexts.length === 0) || isSending) return;

    if (!overrideMsg) setInput('');
    
    let finalMsgToSend = userMsg;
    if (attachedContexts.length > 0) {
      finalMsgToSend = `${attachedContexts.join('\n')}\n\n${userMsg}`.trim();
    }
    
    const optimisticMsg: Message = { role: 'user', content: finalMsgToSend };
    setMessages(prev => [...prev, optimisticMsg]);
    setAttachedContexts([]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          context,
          message: finalMsgToSend,
          draftPlan // Send the current draft so the AI knows what we are looking at
        })
      });

      const data = await res.json();
      if (data.success) {
        if (!sessionId && data.sessionId) setSessionId(data.sessionId);
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        
        if (data.triggerRevision && draftPlan && pendingBranch) {
          generateDraft(pendingBranch, data.triggerRevision);
        } else if (data.branchData) {
          setPendingBranch(data.branchData);
          setBranchCreated(false);
          generateDraft(data.branchData);
        } else if (data.saveNote && draftPlan) {
          const newDraft = { ...draftPlan };
          // Localizar la tarea y actualizar la nota
          const targetId = String(data.saveNote.taskNameOrId).toLowerCase();
          
          let found = false;
          newDraft.phases.forEach((p: any, pIdx: number) => {
            p.tasks?.forEach((t: any, tIdx: number) => {
              if (t.id === targetId || t.name.toLowerCase().includes(targetId)) {
                if (!found) {
                  updateDraftPlanItem('task', pIdx, tIdx, undefined, 'notes', data.saveNote.content);
                  found = true;
                }
              }
            });
          });
        }
      } else {
        const errorMsg = data.error === 'Not authenticated'
          ? 'Tu sesión ha expirado. Por favor recarga la página.'
          : `Error: ${data.detail ?? data.error ?? 'Intenta de nuevo.'}`;
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de red. Intenta de nuevo.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddContextToChat = (ctx: string) => {
    if (!attachedContexts.includes(ctx)) {
      setAttachedContexts(prev => [...prev, ctx]);
    }
    setMobileTab('chat');
  };

  const updateDraftPlanItem = (type: 'phase' | 'task' | 'subTask', phaseIdx: number, taskIdx?: number, subTaskIdx?: number, field?: string, newValue?: any) => {
    if (!draftPlan) return;
    const newPlan = { ...draftPlan };
    
    if (type === 'phase') {
      newPlan.phases[phaseIdx] = { ...newPlan.phases[phaseIdx], [field!]: newValue };
    } else if (type === 'task' && taskIdx !== undefined) {
      newPlan.phases[phaseIdx].tasks[taskIdx] = { ...newPlan.phases[phaseIdx].tasks[taskIdx], [field!]: newValue };
    } else if (type === 'subTask' && taskIdx !== undefined && subTaskIdx !== undefined) {
      newPlan.phases[phaseIdx].tasks[taskIdx].subTasks[subTaskIdx] = { ...newPlan.phases[phaseIdx].tasks[taskIdx].subTasks[subTaskIdx], [field!]: newValue };
    }
    
    setDraftPlan(newPlan);
  };

  const handleDeleteDraftItem = (type: 'phase' | 'task' | 'subTask', pIdx: number, tIdx?: number, sIdx?: number) => {
    if (!draftPlan) return;
    const newPlan = { ...draftPlan };
    if (type === 'phase') {
      newPlan.phases.splice(pIdx, 1);
    } else if (type === 'task' && tIdx !== undefined) {
      newPlan.phases[pIdx].tasks.splice(tIdx, 1);
    } else if (type === 'subTask' && tIdx !== undefined && sIdx !== undefined) {
      newPlan.phases[pIdx].tasks[tIdx].subTasks.splice(sIdx, 1);
    }
    setDraftPlan(newPlan);
  };

  const handleAddDraftItem = (type: 'task' | 'subTask', pIdx: number, tIdx?: number) => {
    if (!draftPlan) return;
    const newPlan = { ...draftPlan };
    if (type === 'task') {
      if (!newPlan.phases[pIdx].tasks) newPlan.phases[pIdx].tasks = [];
      newPlan.phases[pIdx].tasks.push({
        name: '',
        description: '',
        estimatedHours: 0,
        subTasks: []
      });
    } else if (type === 'subTask' && tIdx !== undefined) {
      if (!newPlan.phases[pIdx].tasks[tIdx].subTasks) newPlan.phases[pIdx].tasks[tIdx].subTasks = [];
      newPlan.phases[pIdx].tasks[tIdx].subTasks.push({
        name: ''
      });
    }
    setDraftPlan(newPlan);
  };

  const handleCreateBranch = async () => {
    if (!pendingBranch && !draftPlan?.isExistingRefactor) return;
    setCreatingBranch(true);
    try {
      const isRefactor = draftPlan?.isExistingRefactor;
      const endpoint = isRefactor ? '/api/ai/goal-update' : '/api/ai/goal-generate';
      
      const payload = isRefactor ? {
        goalId: draftPlan.goalId,
        draftPlan: draftPlan
      } : {
        finalGoalInput: pendingBranch?.goalTitle,
        branchData: pendingBranch,
        draftPlan: draftPlan,
        chatHistory: messages,
        sessionId: sessionId
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBranchCreated(true);
        setPendingBranch(null);
        const confirmMsg: Message = { 
          role: 'assistant', 
          content: isRefactor 
            ? `🌳 ¡He actualizado tu meta con éxito! Los cambios ya están reflejados en tu árbol.` 
            : `🌳 ¡Perfecto! He creado la meta **"${pendingBranch?.goalTitle}"** respetando tu límite de ${pendingBranch?.hoursPerWeek} horas. ¡Ve a tu árbol para verla!` 
        };
        setMessages(prev => [...prev, confirmMsg]);
      } else if (data.auditFailed) {
        setCreatingBranch(false);
        setPendingBranch(null);
        const renegotiationMsg: Message = { role: 'assistant', content: data.message };
        setMessages(prev => [...prev, renegotiationMsg]);
      } else {
        console.error('Failed to save branch:', data.error);
        const errorMsg: Message = { role: 'assistant', content: `❌ Hubo un error al guardar la meta: ${data.error}` };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (e) {
      console.error('Failed to create/update branch:', e);
    } finally {
      setCreatingBranch(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex justify-center sm:justify-end bg-stone-900/40 backdrop-blur-sm p-2 sm:p-6" onClick={onClose}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 transition-all duration-500 ease-in-out ${
          draftPlan || isDrafting ? 'w-full md:max-w-6xl' : 'max-w-md'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col border-b border-stone-200 bg-white z-10 shrink-0">
          <div className="h-[60px] md:h-[72px] px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-stone-800">Coach BEAN</h3>
                <p className="text-[10px] md:text-xs text-stone-500">Planificador & Guía Estratégica</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {(draftPlan || isDrafting) && (
                <div className="flex md:hidden bg-stone-100 p-1 rounded-xl shrink-0 mr-2">
                  <button onClick={() => setMobileTab('chat')} className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${mobileTab === 'chat' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>💬</button>
                  <button onClick={() => setMobileTab('draft')} className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${mobileTab === 'draft' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>📝</button>
                </div>
              )}
              <button 
                type="button" 
                onClick={handleReset} 
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors flex items-center justify-center" 
                title="Nueva Sesión (Reiniciar)"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          
          {/* TABS (Solo si estamos en el árbol personal) */}
          {isPersonalTree && (
            <div className="flex border-t border-slate-100 p-2 gap-2 bg-slate-50/50">
              <button 
                onClick={() => onClose()}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat Árbol
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-emerald-700 shadow-sm border border-emerald-100 transition-colors">
                <BrainCircuit className="w-3.5 h-3.5" />
                Coach Global
              </button>
            </div>
          )}
        </div>

        {/* CONTAINER FOR CHAT AND DRAFT */}
        <div className={`flex flex-1 overflow-hidden ${draftPlan || isDrafting ? 'flex-col md:flex-row' : 'flex-col'}`}>
          
        {/* Lado Izquierdo: Chat */}
        <div className={`flex flex-col h-full border-r border-stone-100 ${draftPlan || isDrafting ? 'md:w-5/12 w-full' : 'w-full'} ${mobileTab === 'draft' && (draftPlan || isDrafting) ? 'hidden md:flex' : 'flex'}`}>

        {/* Messages */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-stone-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <p className="text-stone-700 font-bold text-lg">¿En qué nos enfocamos hoy?</p>
                <p className="text-stone-400 text-sm mt-2 max-w-[250px]">
                  Puedo ayudarte a explorar caminos de vida o diseñar un plan paso a paso.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] mr-2 mt-1 flex-shrink-0">💡</div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white border border-stone-200/50 text-stone-800 rounded-bl-none shadow-sm'
                }`}>
                  {renderFormattedText(msg.content)}
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">💡</div>
              <div className="bg-white border border-stone-200/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-150" />
              </div>
            </div>
          )}

          {/* Pending Branch Action */}
          {pendingBranch && !draftPlan && !isDrafting && !branchCreated && !isSending && (
            <div className="mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-2xl mb-2">🌳</div>
              <p className="text-sm font-bold text-emerald-800 mb-1">{pendingBranch.goalTitle}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4 text-[10px] font-black uppercase text-emerald-600">
                <span className="bg-white px-2 py-1 rounded-md border border-emerald-100">{pendingBranch.hoursPerWeek}h / sem</span>
              </div>
            </div>
          )}

          {branchCreated && (
            <div className="flex flex-col items-center gap-2 mt-4 animate-in fade-in duration-500">
              <button onClick={() => { onClose(); router.push('/home'); router.refresh(); }} className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-stone-200 transition-colors">
                Ir al Árbol de Vida <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {loadError ? (
          <div className="p-4 bg-red-50 text-center">
            <p className="text-xs text-red-600 font-medium">{loadError}</p>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit} 
            className="p-3 border-t border-stone-100 bg-white flex flex-col gap-2 shrink-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const text = e.dataTransfer.getData('text/plain');
              if (text && !attachedContexts.includes(text)) {
                setAttachedContexts(prev => [...prev, text]);
              }
            }}
          >
            {attachedContexts.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1">
                {attachedContexts.map((ctx, i) => (
                  <div key={i} className="flex items-center gap-1 bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-600 px-2 py-1 rounded-md">
                    <span>{ctx}</span>
                    <button type="button" onClick={() => setAttachedContexts(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu mensaje... (Puedes soltar tareas aquí)"
                disabled={isSending || creatingBranch}
                className="flex-1 bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-stone-700 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={(!input.trim() && attachedContexts.length === 0) || isSending || creatingBranch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-sm shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        )}
        </div>
        {/* Lado Derecho: Borrador del Plan */}
        {(draftPlan || isDrafting) && (
          <div className={`${mobileTab === 'chat' ? 'hidden md:flex' : 'flex'} flex-col h-full md:w-7/12 w-full bg-stone-50 overflow-y-auto`}>
            <div className="px-4 md:px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-3 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-stone-800">Mesa de Dibujo</h3>
                <p className="text-[11px] md:text-xs font-medium text-stone-500">Arrastra elementos al chat para dar feedback.</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleCreateBranch}
                  disabled={creatingBranch || isDrafting}
                  className="w-full md:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 shadow-sm"
                >
                  {creatingBranch ? 'Guardando...' : (draftPlan?.isExistingRefactor ? 'Aplicar Cambios a la Meta' : 'Aceptar Plan Definitivo')}
                </button>
              </div>
            </div>

            <div className="p-6">
              {isDrafting ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-60">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold text-stone-700 animate-pulse">{draftStep}</p>
                </div>
              ) : draftPlan ? (
                <div className="space-y-6">
                  {draftPlan.phases?.map((phase: any, pIdx: number) => (
                    <div 
                      key={pIdx} 
                      className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-colors cursor-grab active:cursor-grabbing relative group"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', `[Fase: ${phase.title}]`);
                      }}
                      onClick={() => !phase.isCompleted && setSelectedDraftItem({type: 'phase', pIdx})}
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddContextToChat(`[Fase: ${phase.title}]`); }}
                        className="md:hidden absolute top-4 right-4 bg-stone-100 text-stone-600 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm"
                      >
                        + Chat
                      </button>

                      <div className="pr-12 pointer-events-none">
                        <span className="font-black text-stone-800 text-base mb-1 block">
                          {phase.title || <span className="text-stone-300 italic">Sin título...</span>}
                        </span>
                        {phase.description && (
                          <p className="text-xs text-stone-500 mb-4 line-clamp-2">{phase.description}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
                        {phase.tasks?.map((task: any, tIdx: number) => (
                          <div 
                            key={tIdx} 
                            className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex flex-col gap-1 hover:bg-stone-100 cursor-grab relative"
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              e.dataTransfer.setData('text/plain', `[Tarea: ${task.name} (en Fase: ${phase.title})]`);
                            }}
                            onClick={() => !task.isCompleted && setSelectedDraftItem({type: 'task', pIdx, tIdx})}
                          >
                            <div className="flex justify-between items-start pr-14 pointer-events-none">
                              <div className="flex items-center gap-1 flex-1">
                                <button onClick={(e) => { e.stopPropagation(); toggleCollapse(`task-${pIdx}-${tIdx}`); }} className="text-stone-400 hover:text-stone-600 p-0.5 rounded-md hover:bg-stone-200 transition-colors pointer-events-auto">
                                  {collapsedTasks[`task-${pIdx}-${tIdx}`] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                                <span className="text-sm font-bold text-stone-700 flex-1 block">
                                  {task.name || <span className="text-stone-300 italic">Sin título...</span>}
                                </span>
                              </div>
                              <div className="flex items-center ml-2 shrink-0">
                                <span className="text-[10px] font-black uppercase text-stone-400 bg-stone-200/50 px-1.5 py-0.5 rounded text-center min-w-[1.5rem] inline-block">
                                  {task.estimatedHours || '0'}
                                </span>
                                <span className="text-[10px] font-black uppercase text-stone-400 ml-0.5">h</span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleAddContextToChat(`[Tarea: ${task.name} (en Fase: ${phase.title})]`); }}
                              className="md:hidden absolute top-3 right-3 bg-white border border-stone-200 text-stone-600 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm z-10"
                            >
                              + Chat
                            </button>

                            {task.notes && (
                              <div className="absolute top-3 right-14 md:right-3 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm pointer-events-none">
                                📝
                              </div>
                            )}

                            {!collapsedTasks[`task-${pIdx}-${tIdx}`] && (
                              <div className="animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
                                {task.description && (
                                  <p className="text-[11px] text-stone-500 leading-snug pr-8 mt-1 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                            
                            {task.subTasks && task.subTasks.length > 0 && (
                              <div className="mt-2 pl-3 border-l-2 border-stone-200 space-y-1 pointer-events-auto">
                                {task.subTasks.map((sub: any, sIdx: number) => (
                                  <div 
                                    key={sIdx} 
                                    className="text-[11px] text-stone-600 flex justify-between items-start gap-2 cursor-grab py-1 hover:bg-stone-200/50 rounded px-1 -mx-1"
                                    draggable
                                    onDragStart={(e) => {
                                      e.stopPropagation();
                                      e.dataTransfer.setData('text/plain', `[Sub-tarea: ${sub.name} (de la Tarea: ${task.name})]`);
                                    }}
                                    onClick={(e) => { e.stopPropagation(); !sub.isCompleted && setSelectedDraftItem({type: 'subTask', pIdx, tIdx, sIdx}); }}
                                  >
                                    <div className="flex-1 flex items-start pointer-events-none">
                                      <span className="text-emerald-500 mr-1 shrink-0 mt-[2px]">•</span>
                                      <span className="w-full flex-1 block">
                                        {sub.name || <span className="text-stone-300 italic">Sin título...</span>}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleAddContextToChat(`[Sub-tarea: ${sub.name} (de la Tarea: ${task.name})]`); }}
                                        className="md:hidden bg-white border border-stone-200 text-stone-500 hover:text-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm whitespace-nowrap shrink-0"
                                      >
                                        + Chat
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            </div>
                          )}
                        </div>
                      ))}
                      </div>
                    </div>
                  ))}
                  
                  {draftPlan.habits && draftPlan.habits.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-black text-stone-400 uppercase tracking-wider mb-3 px-1">Hábitos de Soporte</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {draftPlan.habits.map((habit: any, hIdx: number) => (
                          <div 
                            key={hIdx} 
                            className="bg-white border border-stone-200 rounded-xl p-3 cursor-grab hover:border-blue-300 transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', `[Hábito: ${habit.title}]`);
                            }}
                          >
                            <span className="text-xs font-bold text-stone-700 block mb-1">{habit.title}</span>
                            <span className="text-[10px] text-stone-400">{habit.frequency?.type || 'Rutina'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            
            <AnimatePresence>
              {selectedDraftItem && draftPlan && (
                <DraftItemDetailSheet
                  selection={selectedDraftItem}
                  itemData={
                    selectedDraftItem.type === 'phase' 
                      ? draftPlan?.phases[selectedDraftItem.pIdx]
                      : selectedDraftItem.type === 'task'
                      ? draftPlan?.phases[selectedDraftItem.pIdx]?.tasks[selectedDraftItem.tIdx!]
                      : draftPlan?.phases[selectedDraftItem.pIdx]?.tasks[selectedDraftItem.tIdx!]?.subTasks[selectedDraftItem.sIdx!]
                  }
                  parentPhase={draftPlan?.phases[selectedDraftItem.pIdx]}
                  parentTask={selectedDraftItem.type === 'subTask' ? draftPlan?.phases[selectedDraftItem.pIdx]?.tasks[selectedDraftItem.tIdx!] : null}
                  onClose={() => setSelectedDraftItem(null)}
                  updateDraftPlanItem={updateDraftPlanItem}
                  handleDeleteDraftItem={handleDeleteDraftItem}
                  handleAddDraftItem={handleAddDraftItem}
                  handleAddContextToChat={handleAddContextToChat}
                />
              )}
            </AnimatePresence>
            
          </div>
        )}
        </div>
      </motion.div>
    </div>
  );
}
