'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, MessageSquare, ChevronRight, ChevronLeft, ChevronDown, Trash2, Bot, BrainCircuit, GripVertical, PenTool, Flame, Timer, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../hooks/useUIStore';

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
  const parseInlineBold = (lineText: string) => {
    return lineText.split(/(\*\*.*?\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const lines = text.split('\n');
  return lines.map((line, i) => {
    // 1. Headers (### or ## or #)
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const parsed = parseInlineBold(content);
      if (level === 1) return <h1 key={i} className="text-xl font-bold mt-4 mb-2 text-slate-900">{parsed}</h1>;
      if (level === 2) return <h2 key={i} className="text-lg font-bold mt-3 mb-2 text-slate-900">{parsed}</h2>;
      return <h3 key={i} className="text-md font-bold mt-2.5 mb-1.5 text-slate-900">{parsed}</h3>;
    }

    // 2. Unordered Lists (- or * or •)
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      return (
        <li key={i} className="list-disc ml-5 mb-1 text-[14px] text-slate-700">
          {parseInlineBold(content)}
        </li>
      );
    }

    // 3. Ordered Lists (1.)
    const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      const content = numberMatch[2];
      return (
        <li key={i} className="list-decimal ml-5 mb-1 text-[14px] text-slate-700">
          {parseInlineBold(content)}
        </li>
      );
    }

    // Default paragraph or break
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return (
      <p key={i} className="mb-1 leading-relaxed text-[15px] text-slate-700">
        {parseInlineBold(line)}
      </p>
    );
  });
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
      {/* Semi-transparent blur backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs pointer-events-auto z-0 transition-opacity"
      />
      
      <motion.div 
        initial={{ y: '100%', opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col h-[85vh] md:h-auto md:max-h-[85vh] md:max-w-xl border-t border-stone-200 md:border border-stone-100 pointer-events-auto z-10"
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

        {type === 'task' && itemData.subTasks && itemData.subTasks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Sub-tareas Desgranadas</h4>
            <div className="bg-stone-50/50 rounded-2xl border border-stone-100 p-4 space-y-2.5 shadow-inner">
              {itemData.subTasks.map((st: any, sIdx: number) => (
                <div key={sIdx} className="flex items-start gap-2 text-xs text-stone-700 font-sans">
                  <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-stone-850">{st.name || st.title}</span>
                    {st.description && <p className="text-stone-500 mt-0.5">{st.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
  </div>
);
};

export function GlobalAIChat({ isOpen, onClose, initialMessage, context = 'global', existingGoalData }: GlobalAIChatProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingBranch, setPendingBranch] = useState<BranchData | null>(null);
  const [draftPlan, setDraftPlan] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftStep, setDraftStep] = useState<string>('');
  const [draftSteps, setDraftSteps] = useState<Array<{ step: number; label: string; status: 'pending' | 'active' | 'done' | 'failed' }>>([
    { step: 0, label: 'Inicializando parámetros y ADN...', status: 'pending' },
    { step: 1, label: 'Analizando punto de partida...', status: 'pending' },
    { step: 2, label: 'Diseñando fases y tareas...', status: 'pending' },
    { step: 3, label: 'Desgranando subtareas...', status: 'pending' },
  ]);
  const [draftDiagnosis, setDraftDiagnosis] = useState<any>(null);
  const [attachedContexts, setAttachedContexts] = useState<string[]>([]);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'draft'>('chat');
  const [selectedDraftItem, setSelectedDraftItem] = useState<{type: 'phase'|'task'|'subTask', pIdx: number, tIdx?: number, sIdx?: number} | null>(null);
  const [collapsedTasks, setCollapsedTasks] = useState<Record<string, boolean>>({});
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  
  const activeSpaceId = useUIStore(state => state.activeSpaceId);
  const isSpaceZoomed = useUIStore(state => state.isSpaceZoomed);
  
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
        setSessionId(null);
        setMessages([]);
        setAttachedContexts([]);
        
        // Map existing branch data to the draftPlan structure
        const allLeaves = existingGoalData.leaves || [];
        const phases = allLeaves.filter((l: any) => l.type === 'phase' || (!l.type && !l.parentId));
        const tasks = allLeaves.filter((l: any) => l.type === 'task');
        const milestones = allLeaves.filter((l: any) => l.type === 'milestone');

        const mappedDraft = {
          isExistingRefactor: true,
          goalId: existingGoalData.id,
          title: existingGoalData.goal || existingGoalData.title || '',
          description: existingGoalData.description || '',
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
        setMobileTab('draft');
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
    setMobileTab('chat');
  };

  const generateDraft = async (goalData: BranchData, revisionInstructions?: string) => {
    setIsDrafting(true);
    setMobileTab('draft');
    
    // Reset steps
    setDraftSteps([
      { step: 0, label: 'Inicializando parámetros y ADN...', status: 'active' },
      { step: 1, label: 'Analizando punto de partida...', status: 'pending' },
      { step: 2, label: 'Diseñando fases y tareas...', status: 'pending' },
      { step: 3, label: 'Desgranando subtareas...', status: 'pending' },
    ]);
    setDraftDiagnosis(null);
    setDraftStep('Inicializando parámetros y ADN...');

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

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      if (!res.body) {
        throw new Error('Response body is empty');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processEvent = (event: any) => {
        if (event.type === 'step') {
          setDraftSteps(prev => prev.map(s => {
            if (s.step === event.step) {
              return { ...s, label: event.label || s.label, status: event.status };
            }
            if (event.status === 'active' && s.step < event.step) {
              return { ...s, status: 'done' };
            }
            return s;
          }));
          if (event.status === 'active') {
            setDraftStep(event.label || 'Procesando...');
          }
        } else if (event.type === 'diagnosis') {
          setDraftDiagnosis(event.data);
        } else if (event.type === 'negotiation_needed') {
          const diagnosis = event.diagnosis;
          const renegotiationMsg: Message = {
            role: 'assistant',
            content: `⚠️ **Evaluación de Viabilidad (Meta No Viable Directamente)**:
            
* **Punto de partida**: ${diagnosis.origin}
* **Brechas identificadas**:
${(diagnosis.gaps || []).map((g: string) => `  - ${g}`).join('\n')}
* **Riesgos y Advertencias**:
${(diagnosis.warnings || []).map((w: string) => `  - ${w}`).join('\n')}
* **Duración estimada**: ${diagnosis.estimatedMonths} meses.

El plan no es viable actualmente con la disponibilidad de horas o el presupuesto indicado. ¿Cómo deseas proceder? Podemos:
1. Ajustar el presupuesto o tiempo semanal.
2. Extender el plazo.
3. Acotar el alcance.`
          };

          setMessages(prev => [...prev, renegotiationMsg]);
          setIsDrafting(false);
          return true; // halted
        } else if (event.type === 'complete') {
          setDraftPlan(event.draft);
        } else if (event.type === 'error') {
          throw new Error(event.error);
        }
        return false;
      };

      let halted = false;
      while (true) {
        const { value, done } = await reader.read();
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const event = JSON.parse(trimmed);
              if (processEvent(event)) {
                halted = true;
                break;
              }
            } catch (jsonErr) {
              console.error('Error parsing line:', trimmed, jsonErr);
            }
          }
        }

        if (halted) break;

        if (done) {
          const trimmed = buffer.trim();
          if (trimmed) {
            try {
              const event = JSON.parse(trimmed);
              processEvent(event);
            } catch (jsonErr) {
              console.error('Error parsing final line:', trimmed, jsonErr);
            }
          }
          break;
        }
      }
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Error al generar el borrador: ${e.message || 'Error de conexión'}`
      }]);
    } finally {
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
        
        if (data.triggerRevision && draftPlan) {
          const branchToUse: BranchData = pendingBranch || {
            goalTitle: draftPlan.title || 'Meta',
            dimensionName: 'skills',
            hoursPerWeek: 10,
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
          setPendingBranch(branchToUse);
          generateDraft(branchToUse, data.triggerRevision);
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
          setMobileTab('draft');
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
        className="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 transition-all duration-500 ease-in-out md:max-w-5xl"
        onClick={e => e.stopPropagation()}
      >
        {/* CONTAINER FOR CHAT AND DRAFT */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Lado Izquierdo: Chat */}
          <div className={`flex flex-col h-full z-10 ${
            isChatCollapsed
              ? 'md:hidden w-full'
              : (draftPlan || isDrafting)
                ? 'md:w-[35%] w-full border-r border-stone-200/80 shadow-[3px_0_12px_rgba(0,0,0,0.015)]'
                : 'w-full'
          } ${mobileTab === 'draft' && (draftPlan || isDrafting) ? 'hidden md:flex' : 'flex'} bg-stone-50/20`}>

          {/* Chat Sidebar Header */}
          <div className="h-[60px] md:h-[72px] px-4 border-b border-stone-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs md:text-sm text-stone-800">Asistente IA</h3>
                <p className="text-[10px] text-stone-500">Planificador & Guía</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                onClick={handleReset} 
                className="p-1.5 text-stone-400 hover:text-stone-750 hover:bg-stone-150 rounded-full transition-colors flex items-center justify-center" 
                title="Reiniciar chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              {(draftPlan || isDrafting) && (
                <button 
                  onClick={() => setIsChatCollapsed(true)} 
                  className="hidden md:flex p-1.5 text-stone-400 hover:text-stone-750 hover:bg-stone-150 rounded-full transition-colors items-center justify-center"
                  title="Ocultar Asistente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-400" title="Cerrar Asistente">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] flex items-center justify-center text-white text-[10px] mr-2 mt-1 flex-shrink-0">💡</div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#0B462C] to-[#1B7A4E] text-white rounded-br-none shadow-sm font-medium'
                    : 'bg-white/80 backdrop-blur-md border border-stone-200/40 text-stone-850 rounded-bl-none shadow-sm'
                }`}>
                  {renderFormattedText(msg.content)}
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">💡</div>
              <div className="bg-white/80 backdrop-blur-md border border-stone-200/40 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-150" />
              </div>
            </div>
          )}

          {isDrafting && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] flex items-center justify-center text-white text-[10px] mr-2 mt-1 flex-shrink-0">💡</div>
              <div className="bg-white/80 backdrop-blur-md border border-[#EAD4C5] rounded-2xl rounded-bl-none px-4 py-3.5 shadow-sm flex flex-col gap-2.5 max-w-[85%] min-w-[240px]">
                <div className="space-y-1.5">
                  {draftSteps.map((s) => (
                    <div key={s.step} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span>{s.step === 0 ? '🔍' : s.step === 1 ? '🧠' : s.step === 2 ? '🏗️' : '🔬'}</span>
                        <span className={s.status === 'active' ? 'text-stone-850 font-bold text-stone-900' : s.status === 'done' ? 'text-stone-400 line-through' : 'text-stone-450 text-stone-400'}>
                          {s.label}
                        </span>
                      </div>
                      <div className="shrink-0 flex items-center justify-center">
                        {s.status === 'active' && <div className="w-2.5 h-2.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
                        {s.status === 'done' && <span className="text-emerald-500 font-bold">✓</span>}
                        {s.status === 'pending' && <span className="text-stone-300">○</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-[9px] text-stone-450 border-t border-stone-200/60 pt-1.5 mt-0.5 text-stone-500 block">
                  Puedes ver el avance en tiempo real en la **Mesa de Dibujo** al lado derecho.
                </span>
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
            className={`p-3 border-t transition-all duration-300 bg-white flex flex-col gap-2 shrink-0 ${
              isDraggingOver ? 'border-dashed border-2 border-emerald-500 bg-emerald-50/40 rounded-2xl m-2' : 'border-stone-100'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              const text = e.dataTransfer.getData('text/plain');
              if (text && !attachedContexts.includes(text)) {
                setAttachedContexts(prev => [...prev, text]);
              }
            }}
          >
            {isDraggingOver && (
              <div className="flex items-center justify-center py-3 text-emerald-800 font-bold text-xs gap-1.5 animate-pulse bg-emerald-100/30 rounded-xl">
                <span>📥</span> Suelta el elemento aquí para añadirlo como contexto
              </div>
            )}
            {!isDraggingOver && attachedContexts.length > 0 && (
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
            <div className="flex gap-2 items-center relative">
              {/* Menu Plus Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowToolsMenu(v => !v)}
                  disabled={isSending || creatingBranch}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                    showToolsMenu
                      ? 'bg-stone-200 border-stone-300 text-stone-700 rotate-45'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-500 hover:text-stone-700'
                  }`}
                  aria-label="Acciones rápidas"
                >
                  <Plus className="w-5 h-5 transition-transform" />
                </button>

                {/* Popover Menu */}
                <AnimatePresence>
                  {showToolsMenu && (
                    <>
                      {/* Transparent overlay clickaway blocker */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowToolsMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-14 left-0 w-44 bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl rounded-2xl p-1.5 flex flex-col gap-1 z-50 origin-bottom-left"
                      >
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2.5 py-1.5 border-b border-stone-100">
                          Herramientas
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-notes-modal'));
                            setShowToolsMenu(false);
                            onClose(); // Cerrar el chat al abrir la herramienta
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 hover:bg-stone-50 rounded-xl text-stone-700 hover:text-stone-900 transition-colors text-xs font-bold"
                        >
                          <span className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-650 shrink-0">
                            <PenTool className="w-3.5 h-3.5" />
                          </span>
                          Bloc de Notas
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-pomodoro'));
                            setShowToolsMenu(false);
                            onClose(); // Cerrar el chat al abrir la herramienta
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 hover:bg-stone-50 rounded-xl text-stone-700 hover:text-stone-900 transition-colors text-xs font-bold"
                        >
                          <span className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                            <Timer className="w-3.5 h-3.5" />
                          </span>
                          Temporizador
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-daily-warmup'));
                            setShowToolsMenu(false);
                            onClose(); // Cerrar el chat al abrir la herramienta
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 hover:bg-stone-50 rounded-xl text-stone-700 hover:text-stone-900 transition-colors text-xs font-bold"
                        >
                          <span className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                          Calentar Enfoque
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

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
        {/* Lado Derecho: Mesa de Dibujo — solo se monta cuando hay draft o se está generando */}
        {(draftPlan || isDrafting) && <div className={`${mobileTab === 'chat' ? 'hidden md:flex' : 'flex'} flex-col h-full ${isChatCollapsed ? 'w-full' : 'md:w-[65%] w-full'} bg-[#F4F1EA] overflow-y-auto border-l border-stone-200`}>
          <div className="px-4 md:px-6 py-4 border-b border-[#E6E1D6] bg-[#FAF9F6] sticky top-0 z-10 flex items-center justify-between gap-3 shadow-sm min-h-[60px] md:min-h-[72px]">
            <div className="flex items-center gap-3">
              {isChatCollapsed && (
                <button 
                  onClick={() => setIsChatCollapsed(false)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-100 shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" /> Mostrar Asistente
                </button>
              )}
              {(draftPlan || isDrafting) && (
                <div className="flex md:hidden bg-stone-100 p-0.5 rounded-xl border border-stone-200 shrink-0">
                  <button type="button" onClick={() => setMobileTab('chat')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${mobileTab === 'chat' ? 'bg-white text-stone-850 shadow-sm' : 'text-stone-500'}`}>💬 Chat</button>
                  <button type="button" onClick={() => setMobileTab('draft')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${mobileTab === 'draft' ? 'bg-white text-stone-850 shadow-sm' : 'text-stone-500'}`}>📋 Borrador</button>
                </div>
              )}
              <div className="hidden md:block">
                <h3 className="text-sm md:text-base font-black text-stone-800 flex items-center gap-1.5">
                  📋 Mesa de Dibujo
                </h3>
                <p className="text-[10px] md:text-xs font-medium text-stone-500">Planifica y edita tu borrador aquí.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {draftPlan && (
                <button
                  onClick={handleCreateBranch}
                  disabled={creatingBranch || isDrafting}
                  className="px-4 py-2 bg-gradient-to-r from-[#0B462C] to-[#1B7A4E] hover:from-[#083622] hover:to-[#145D3B] text-white text-xs font-black rounded-xl transition-all shadow-[0_4px_14px_rgba(27,122,78,0.25)] hover:shadow-[0_6px_20px_rgba(27,122,78,0.35)] active:scale-[0.98] disabled:opacity-40"
                >
                  {creatingBranch ? 'Guardando...' : (draftPlan?.isExistingRefactor ? 'Aplicar Cambios' : 'Aceptar Plan Definitivo')}
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-start">
              {isDrafting ? (
                <div className="flex flex-col items-center justify-center my-auto py-12 px-6 max-w-sm mx-auto">
                  <div className="text-5xl animate-bounce mb-6 select-none animate-pulse-slow">🌱</div>
                  <h4 className="text-sm font-bold text-stone-850 text-stone-800 mb-4 text-center">Construyendo borrador con IA...</h4>
                  <div className="w-full space-y-3 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                    {draftSteps.map((s) => (
                      <div key={s.step} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span>{s.step === 0 ? '🔍' : s.step === 1 ? '🧠' : s.step === 2 ? '🏗️' : '🔬'}</span>
                          <span className={s.status === 'active' ? 'text-stone-850 font-bold text-stone-900' : s.status === 'done' ? 'text-stone-400 line-through' : 'text-stone-450 text-stone-400'}>
                            {s.label}
                          </span>
                        </div>
                        <div className="shrink-0 flex items-center justify-center">
                          {s.status === 'active' && <div className="w-2.5 h-2.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
                          {s.status === 'done' && <span className="text-emerald-500 font-bold">✓</span>}
                          {s.status === 'pending' && <span className="text-stone-300">○</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : draftPlan ? (
                <div className="space-y-6">
                  {draftDiagnosis && (
                    <div className="bg-[#FDF5F0]/90 border border-[#EAD4C5] rounded-2xl p-4 shadow-xs space-y-3 text-stone-800">
                      <div className="flex items-center gap-2 border-b border-[#EAD4C5]/60 pb-2">
                        <span className="text-[#A0522D] text-sm">🧠</span>
                        <h5 className="font-black text-xs text-[#8B4513]">Diagnóstico de Viabilidad (Agente IA)</h5>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ml-auto border ${
                          draftDiagnosis.feasibility === 'possible' 
                            ? 'bg-[#EAF5EC] text-[#1B7A4E] border-[#CDE5D2]' 
                            : 'bg-[#FDF5F0] text-[#A0522D] border-[#EAD4C5]'
                        }`}>
                          {draftDiagnosis.feasibility === 'possible' ? 'Viable' : 'Desafiante'}
                        </span>
                      </div>
                      
                      <div className="text-xs space-y-2">
                        <p><strong>Punto de Partida (ADN):</strong> {draftDiagnosis.origin}</p>
                        
                        {draftDiagnosis.gaps && draftDiagnosis.gaps.length > 0 && (
                          <div>
                            <span className="font-bold text-stone-700 block mb-0.5">Brechas a Cerrar:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                              {draftDiagnosis.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
                            </ul>
                          </div>
                        )}
                        
                        {draftDiagnosis.warnings && draftDiagnosis.warnings.length > 0 && (
                          <div className="bg-[#FAF0E6] border border-[#EAD4C5]/60 rounded-xl p-2.5 mt-1.5 text-[#A0522D]">
                            <span className="font-bold text-[#8B4513] block mb-0.5">⚠️ Advertencias / Recomendaciones:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-[#A0522D]/90">
                              {draftDiagnosis.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                            </ul>
                          </div>
                        )}

                        <div className="text-stone-500 text-[9px] flex justify-between items-center mt-1.5 pt-1.5 border-t border-[#EAD4C5]/40">
                          <span>Duración sugerida: {draftDiagnosis.estimatedMonths} meses</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {draftPlan.phases?.map((phase: any, pIdx: number) => (
                    <div 
                      key={pIdx} 
                      className="bg-white border border-[#E6E1D6] rounded-2xl p-5 shadow-xs hover:border-[#1B7A4E]/50 hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing relative group"
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

                      <div className="flex gap-2 items-start">
                        <div className="mt-1 text-stone-300 group-hover:text-[#1B7A4E]/70 transition-colors shrink-0">
                          <GripVertical className="w-4 h-4 cursor-grab" />
                        </div>
                        <div className="flex-1 pr-12 pointer-events-none">
                          <span className="font-black text-stone-800 text-base mb-1 block">
                            {phase.title || <span className="text-stone-300 italic">Sin título...</span>}
                          </span>
                          {phase.description && (
                            <p className="text-xs text-stone-500 mb-4 line-clamp-2">{phase.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
                        {phase.tasks?.map((task: any, tIdx: number) => (
                          <div 
                            key={tIdx} 
                            className="bg-[#FAF9F6] border border-[#E6E1D6]/70 rounded-xl p-3 flex flex-col gap-1 hover:bg-white hover:border-[#1B7A4E]/30 hover:shadow-xs transition-all duration-200 cursor-grab active:cursor-grabbing relative"
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              e.dataTransfer.setData('text/plain', `[Tarea: ${task.name} (en Fase: ${phase.title})]`);
                            }}
                            onClick={() => !task.isCompleted && setSelectedDraftItem({type: 'task', pIdx, tIdx})}
                          >
                            <div className="flex justify-between items-start pr-14 pointer-events-none">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <GripVertical className="w-3.5 h-3.5 text-stone-300 shrink-0 pointer-events-auto" />
                                <button onClick={(e) => { e.stopPropagation(); toggleCollapse(`task-${pIdx}-${tIdx}`); }} className="text-stone-400 hover:text-stone-600 p-0.5 rounded-md hover:bg-stone-200 transition-colors pointer-events-auto shrink-0">
                                  {collapsedTasks[`task-${pIdx}-${tIdx}`] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                                <span className="text-sm font-bold text-stone-700 flex-1 truncate block">
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
                                    <div className="flex-1 flex items-center gap-1.5 pointer-events-none min-w-0">
                                      <GripVertical className="w-3 h-3 text-stone-300 shrink-0 pointer-events-auto" />
                                      <span className="w-full flex-1 truncate block">
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
              ) : (
                <div className="flex flex-col items-center justify-center my-auto py-12 px-6 max-w-sm mx-auto text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] flex items-center justify-center text-white text-3xl mx-auto shadow-md">
                    🌱
                  </div>
                  <h3 className="font-display font-black text-base text-stone-800">Sembrando tu Meta</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Conversa con el Asistente IA a la izquierda para diseñar tu camino de vida y estructurar tu plan paso a paso aquí.
                  </p>
                  <div className="pt-2">
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#1B7A4E] bg-emerald-100/60 px-3.5 py-1 rounded-full border border-emerald-250/20">
                      Mesa de Dibujo Lista
                    </span>
                  </div>
                </div>
              )}
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
        }
        </div>
      </motion.div>
    </div>
  );
}
