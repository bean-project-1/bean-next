'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, MessageSquare, ChevronRight, ChevronDown, Trash2, Plus, RotateCcw, Search, Target, CheckSquare, ChevronLeft, GripVertical } from 'lucide-react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import { useLifeTree } from '../../../hooks/useLifeTree';
import { getSpaces } from '../actions/spaces';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface Member {
  userId: string;
  name: string;
  avatarUrl: string | null;
  role: string;
}

interface SpaceChatProps {
  spaceId: string;
  spaceName: string;
  members?: Member[];
  onRefreshTree: () => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  onChangeOpenExternal?: (val: boolean) => void;
  initialMessage?: string;
  existingGoalData?: any;
  hideFloatingButton?: boolean;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

const EditableField = ({ value, onChange, isCompleted, className = '', placeholder = '', isMultiline = false }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value || '');

  useEffect(() => {
    setVal(value || '');
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== value) {
      onChange(val);
    }
  };

  const handleKeyDown = (e: any) => {
    if (!isMultiline && e.key === 'Enter') {
      handleBlur();
    }
  };

  if (isCompleted) {
    return <span className={className}>{value}</span>;
  }

  if (isEditing) {
    return isMultiline ? (
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        className="w-full bg-stone-50 border border-emerald-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm resize-y text-slate-800"
        autoFocus
        placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-stone-50 border-b border-emerald-400 outline-none px-1 text-sm font-semibold text-slate-800"
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`${className} cursor-text border-b border-dashed border-stone-300 hover:border-emerald-400 transition-colors inline-block min-w-[3rem]`}
    >
      {value || <span className="text-stone-300 italic">{placeholder || 'Haga clic para editar...'}</span>}
    </span>
  );
};

const DraftItemDetailSheet = ({ itemData, selection, onClose, updateDraftPlanItem, handleDeleteDraftItem, handleAddDraftItem, handleAddContextToChat, members = [], isPersonal }: any) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { type, pIdx, tIdx } = selection;

  const titlePrefix = type === 'phase' ? 'Fase' : 'Tarea';

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
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-1">
            Detalle de {titlePrefix}
          </p>
          <EditableField 
            value={itemData.title || itemData.name} 
            onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, type === 'phase' ? 'title' : 'name', val)}
            className="text-xl font-black text-stone-800" 
            placeholder={`Nombre de la ${titlePrefix}...`}
          />
        </div>
        <button onClick={onClose} className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Descripción</h4>
          <EditableField 
            value={itemData.description} 
            onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, 'description', val)}
            isMultiline={true}
            className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100 w-full min-h-[80px]" 
            placeholder="Añade una descripción detallada..."
          />
        </div>

        {type === 'task' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Horas Est.</span>
                <div className="flex items-center">
                  <EditableField 
                    value={itemData.estimatedHours?.toString() || '0'} 
                    onChange={(val: string) => updateDraftPlanItem(type, pIdx, tIdx, 'estimatedHours', parseFloat(val) || 0)}
                    className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded text-center min-w-[2.5rem]" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {type === 'task' && !isPersonal && (
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Responsable en el Equipo</h4>
                <select
                  value={itemData.assigneeId || ''}
                  onChange={(e) => updateDraftPlanItem(type, pIdx, tIdx, 'assigneeId', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-stone-700 cursor-pointer"
                >
                  <option value="">Seleccionar responsable...</option>
                  {members.map((m: any) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {type === 'task' && itemData.subTasks && itemData.subTasks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Sub-tareas Desgranadas</h4>
            <div className="bg-stone-50/50 rounded-2xl border border-stone-100 p-4 space-y-2.5 shadow-inner">
              {itemData.subTasks.map((st: any, sIdx: number) => (
                <div key={sIdx} className="flex items-start gap-2 text-xs text-stone-700">
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

        <div className="pt-4 border-t border-stone-100 space-y-3 pb-8">
          <button 
            onClick={() => {
              const contextStr = type === 'phase' ? `[Fase: ${itemData.title}]` : `[Tarea: ${itemData.name} (en Fase: ${itemData.parentTitle || ''})]`;
              handleAddContextToChat(contextStr);
              onClose();
            }}
            className="w-full bg-stone-900 text-white hover:bg-stone-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" /> Preguntar a {isPersonal ? 'Guía BEAN' : '@bean'} sobre esto
          </button>
          
          <div className="flex gap-2">
            {type === 'phase' && (
              <button 
                onClick={() => {
                  handleAddDraftItem('task', pIdx);
                  onClose();
                }}
                className="flex-1 bg-stone-100 text-stone-700 hover:bg-stone-200 py-3 rounded-xl font-bold text-sm transition-colors border border-stone-200"
              >
                + Añadir Tarea
              </button>
            )}

            {showDeleteConfirm ? (
              <div className="flex gap-2 flex-1">
                <button onClick={() => { handleDeleteDraftItem(type, pIdx, tIdx); onClose(); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">Confirmar</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 py-3 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className={`flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-650 py-3 rounded-xl font-bold text-sm transition-colors border border-red-100 ${type === 'phase' ? 'px-5' : 'flex-1'}`}
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);
};

function renderFormattedText(text: string, isAI: boolean) {
  const parseInlineBold = (lineText: string) => {
    return lineText.split(/(\*\*.*?\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong 
            key={j} 
            className={`font-black ${isAI ? 'text-slate-900' : 'text-white'}`}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const lines = text.split('\n');
  const textClassName = isAI ? 'text-slate-700' : 'text-white/90';
  const headerClassName = isAI ? 'text-slate-900' : 'text-white';

  return lines.map((line, i) => {
    // 1. Headers (### or ## or #)
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const parsed = parseInlineBold(content);
      if (level === 1) return <h1 key={i} className={`text-xl font-bold mt-4 mb-2 ${headerClassName}`}>{parsed}</h1>;
      if (level === 2) return <h2 key={i} className={`text-lg font-bold mt-3 mb-2 ${headerClassName}`}>{parsed}</h2>;
      return <h3 key={i} className={`text-md font-bold mt-2.5 mb-1.5 ${headerClassName}`}>{parsed}</h3>;
    }

    // 2. Unordered Lists (- or * or •)
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      return (
        <li key={i} className={`list-disc ml-5 mb-1 text-[14px] ${textClassName}`}>
          {parseInlineBold(content)}
        </li>
      );
    }

    // 3. Ordered Lists (1.)
    const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      const content = numberMatch[2];
      return (
        <li key={i} className={`list-decimal ml-5 mb-1 text-[14px] ${textClassName}`}>
          {parseInlineBold(content)}
        </li>
      );
    }

    // Default paragraph or break
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return (
      <p key={i} className={`mb-1 leading-relaxed text-[15px] ${textClassName}`}>
        {parseInlineBold(line)}
      </p>
    );
  });
}

export function SpaceChat({ spaceId, spaceName, members = [], onRefreshTree, isOpenExternal, onCloseExternal, onChangeOpenExternal, initialMessage, existingGoalData, hideFloatingButton = false }: SpaceChatProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;
  const setIsOpen = (val: boolean) => {
    if (onChangeOpenExternal) {
      onChangeOpenExternal(val);
    } else if (onCloseExternal && !val) {
      onCloseExternal();
    } else {
      setIsOpenInternal(val);
    }
  };
  const [activeSpaceId, setActiveSpaceId] = useState(spaceId);
  const [activeSpaceName, setActiveSpaceName] = useState(spaceName);
  const [userSpaces, setUserSpaces] = useState<{ id: string; name: string }[]>([
    { id: spaceId, name: spaceName }
  ]);
  const [selectedGoalForTasks, setSelectedGoalForTasks] = useState<any | null>(null);

  const isPersonal = activeSpaceId === 'personal' || activeSpaceName === 'Árbol Personal';

  const [input, setInput] = useState('');
  const [attachedContext, setAttachedContext] = useState<{ id: string; name: string; type: 'goal' | 'task' | 'habit' } | null>(null);
  const [showContextPopover, setShowContextPopover] = useState(false);
  const [popoverTab, setPopoverTab] = useState<'goals' | 'tasks'>('goals');
  const [searchQuery, setSearchQuery] = useState('');

  // Clear search query when changing views
  useEffect(() => {
    setSearchQuery('');
  }, [popoverTab, selectedGoalForTasks, showContextPopover]);

  const { treeData, loading: loadingTree } = useLifeTree(isPersonal ? undefined : activeSpaceId);

  const goalsList = treeData?.branches || [];
  const tasksList = treeData 
    ? treeData.branches.flatMap((branch: any) => 
        (branch.leaves || []).map((leaf: any) => ({
          id: leaf.id,
          name: leaf.name,
          type: leaf.type,
          completed: leaf.completed,
          parentName: branch.goal
        }))
      )
    : [];

  // Sync state with props
  useEffect(() => {
    setActiveSpaceId(spaceId);
  }, [spaceId]);

  useEffect(() => {
    setActiveSpaceName(spaceName);
  }, [spaceName]);

  // Load spaces list
  useEffect(() => {
    getSpaces()
      .then((data) => {
        setUserSpaces([
          { id: 'personal', name: 'Árbol Personal' },
          ...data.map((s) => ({ id: s.id, name: s.name }))
        ]);
      })
      .catch((err) => {
        console.error('Failed to load user spaces:', err);
        setUserSpaces([
          { id: 'personal', name: 'Árbol Personal' }
        ]);
      });
  }, []);

  // Reset drill-down context when popover closes
  useEffect(() => {
    if (!showContextPopover) {
      setSelectedGoalForTasks(null);
    }
  }, [showContextPopover]);

  // Reset drill-down context when switching tabs
  useEffect(() => {
    setSelectedGoalForTasks(null);
  }, [popoverTab]);

  // Listen for Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle initialMessage
  useEffect(() => {
    if (initialMessage && isOpen) {
      setInput(initialMessage);
    }
  }, [initialMessage, isOpen]);

  // When opened with an existing goal, pre-load it as a draft plan and go to draft tab
  useEffect(() => {
    if (isOpen && existingGoalData) {
      try {
        if (isPersonal) {
          mutateSession((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: {
                ...prev.data,
                messages: []
              }
            };
          }, false);
        } else {
          mutateSpaceMessages([], false);
        }
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
    } catch (e) {
      console.error('[SpaceChat] draftPlan mapping error', e);
    }
    }
  }, [isOpen, existingGoalData]);
  const [isSending, setIsSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef<number>(0);
  const notificationPermissionGranted = useRef<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on input content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const [draftPlan, setDraftPlan] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftStep, setDraftStep] = useState('');
  const [draftSteps, setDraftSteps] = useState<Array<{ step: number; label: string; status: 'pending' | 'active' | 'done' | 'failed' }>>([
    { step: 0, label: 'Inicializando parámetros y ADN...', status: 'pending' },
    { step: 1, label: 'Analizando punto de partida...', status: 'pending' },
    { step: 2, label: 'Diseñando fases y tareas...', status: 'pending' },
    { step: 3, label: 'Desgranando subtareas...', status: 'pending' },
  ]);
  const [draftDiagnosis, setDraftDiagnosis] = useState<any>(null);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [selectedDraftItem, setSelectedDraftItem] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'draft'>('chat');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSpaceDropdownOpen, setIsSpaceDropdownOpen] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [pendingBranch, setPendingBranch] = useState<any>(null);
  const [branchCreated, setBranchCreated] = useState(false);



  const updateDraftPlanItem = (type: 'phase' | 'task' | 'subTask', phaseIdx: number, taskIdx?: number, subTaskIdx?: number, field?: string, newValue?: any) => {
    if (!draftPlan) return;
    const newPlan = { ...draftPlan };
    if (type === 'phase') {
      newPlan.phases[phaseIdx][field!] = newValue;
    } else if (type === 'task') {
      newPlan.phases[phaseIdx].tasks[taskIdx!][field!] = newValue;
    }
    setDraftPlan(newPlan);
  };

  const handleDeleteDraftItem = (type: 'phase' | 'task' | 'subTask', phaseIdx: number, taskIdx?: number, subTaskIdx?: number) => {
    if (!draftPlan) return;
    const newPlan = { ...draftPlan };
    if (type === 'phase') {
      newPlan.phases.splice(phaseIdx, 1);
    } else if (type === 'task') {
      newPlan.phases[phaseIdx].tasks.splice(taskIdx!, 1);
    }
    setDraftPlan(newPlan);
  };

  const handleAddDraftItem = (type: 'task' | 'subTask', phaseIdx: number, taskIdx?: number) => {
    if (!draftPlan) return;
    const newPlan = { ...draftPlan };
    if (type === 'task') {
      if (!newPlan.phases[phaseIdx].tasks) newPlan.phases[phaseIdx].tasks = [];
      newPlan.phases[phaseIdx].tasks.push({
        name: 'Nueva Tarea',
        description: '',
        estimatedHours: 1,
        assigneeId: members?.[0]?.userId || ''
      });
    }
    setDraftPlan(newPlan);
  };

  const handleAddContextToChat = (ctx: string) => {
    setInput(prev => `${ctx}\n${prev}`.trim());
  };

  // Fetch SWR dynamically
  const { data: sessionData, mutate: mutateSession } = useSWR<any>(
    isPersonal ? `/api/ai/chat?context=global` : null, 
    fetcher, 
    { refreshInterval: 3000 }
  );

  const { data: spaceMessages, mutate: mutateSpaceMessages } = useSWR<Message[]>(
    isPersonal ? null : `/api/spaces/${activeSpaceId}/chat`, 
    fetcher, 
    { refreshInterval: 3000 }
  );

  const messages = isPersonal 
    ? (sessionData?.success ? sessionData.data.messages : []) 
    : spaceMessages;

  const mutate = (data?: any, options?: any) => {
    if (isPersonal) {
      if (typeof data === 'function') {
        mutateSession((current: any) => {
          if (!current?.success) return current;
          const dummyMsg = data([]);
          const newMsgs = dummyMsg.filter((m: any) => !current.data.messages.some((existing: any) => existing.id === m.id));
          return {
            ...current,
            data: {
              ...current.data,
              messages: [...(current.data.messages || []), ...newMsgs]
            }
          };
        }, options);
      } else {
        mutateSession(data, options);
      }
    } else {
      mutateSpaceMessages(data, options);
    }
  };

  const generateDraft = async (goalData: any, revisionInstructions?: string) => {
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
          revisionInstructions,
          spaceId: activeSpaceId
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
            id: Date.now().toString() + '_reneg',
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
3. Acotar el alcance.`,
            createdAt: new Date().toISOString()
          };

          if (isPersonal) {
            mutateSession((current: any) => {
              if (!current?.success) return current;
              return {
                ...current,
                data: {
                  ...current.data,
                  messages: [...(current.data.messages || []), renegotiationMsg]
                }
              };
            }, false);
          } else {
            mutateSpaceMessages((current) => [...(current || []), renegotiationMsg], false);
          }
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
      const connErrorMsg: Message = {
        id: Date.now().toString() + '_err_conn',
        role: 'assistant',
        content: `❌ Error al generar el borrador del plan: ${e.message || 'Error de conexión'}`,
        createdAt: new Date().toISOString()
      };
      if (isPersonal) {
        mutateSession((current: any) => {
          if (!current?.success) return current;
          return {
            ...current,
            data: {
              ...current.data,
              messages: [...(current.data.messages || []), connErrorMsg]
            }
          };
        }, false);
      } else {
        mutateSpaceMessages((current) => [...(current || []), connErrorMsg], false);
      }
    } finally {
      setIsDrafting(false);
      setDraftStep('');
    }
  };

  const handleCreateBranch = async () => {
    if (!draftPlan) return;
    setCreatingBranch(true);
    try {
      const payload = {
        finalGoalInput: draftPlan.title,
        branchData: {
          goalTitle: draftPlan.title,
          description: draftPlan.description,
          hoursPerWeek: 10,
          targetDate: new Date().toISOString()
        },
        draftPlan: draftPlan,
        chatHistory: messages,
        spaceId: isPersonal ? null : activeSpaceId
      };

      const res = await fetch('/api/ai/goal-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setDraftPlan(null);
        setBranchCreated(true);
        setPendingBranch(null);
        const confirmMsg: Message = {
          id: Date.now().toString() + '_sys',
          role: 'assistant',
          content: isPersonal 
            ? `🌳 ¡Perfecto! He plantado tu meta **"${draftPlan.title}"** en tu árbol. ¡Ya puedes verla!`
            : `🌳 ¡Perfecto! He plantado la meta colaborativa **"${draftPlan.title}"** en el árbol del equipo. ¡Ya pueden verla!`,
          createdAt: new Date().toISOString()
        };
        if (isPersonal) {
          mutateSession((current: any) => {
            if (!current?.success) return current;
            return {
              ...current,
              data: {
                ...current.data,
                messages: [...(current.data.messages || []), confirmMsg]
              }
            };
          }, false);
        } else {
          mutateSpaceMessages((current) => [...(current || []), confirmMsg], false);
        }
        onRefreshTree();
        setIsOpen(false);
      } else {
        alert(`Error al plantar la rama: ${data.error || 'Error interno'}`);
      }
    } catch (e) {
      console.error('Failed to save branch:', e);
      alert('Error de red al plantar la rama.');
    } finally {
      setCreatingBranch(false);
    }
  };

  const [isResetting, setIsResetting] = useState(false);

  const handleResetChat = async () => {
    setIsResetting(true);
    try {
      const url = isPersonal 
        ? `/api/ai/chat?context=global` 
        : `/api/spaces/${activeSpaceId}/chat`;
        
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (isPersonal) {
          mutateSession((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: {
                ...prev.data,
                messages: []
              }
            };
          }, false);
          mutateSession();
        } else {
          mutateSpaceMessages([], false);
          mutateSpaceMessages();
        }
      } else {
        alert('Error al reiniciar el chat.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al reiniciar el chat.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input;
    setInput('');
    setIsSending(true);

    // Optimistic update
    const tempId = Date.now().toString();
    if (isPersonal) {
      mutateSession((current: any) => {
        if (!current?.success) return current;
        return {
          ...current,
          data: {
            ...current.data,
            messages: [
              ...(current.data.messages || []),
              {
                id: tempId,
                role: 'user',
                content: text,
                createdAt: new Date().toISOString(),
                user: { name: 'Tú', avatarUrl: null }
              }
            ]
          }
        };
      }, false);
    } else {
      mutateSpaceMessages((current) => [...(current || []), {
        id: tempId,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
        user: { name: 'Tú', avatarUrl: null }
      }], false);
    }

    const isAiTarget = isPersonal || text.toLowerCase().includes('@bean');
    const mentions: string[] = [];
    if (text.toLowerCase().includes('@bean')) {
      mentions.push('bean');
    }
    if (isAiTarget) {
      setIsAiTyping(true);
    }

    try {
      let res;
      if (isPersonal) {
        res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            context: 'global',
            sessionId: sessionData?.data?.id || undefined,
            draftPlan,
            attachedContext: attachedContext ? {
              id: attachedContext.id,
              name: attachedContext.name,
              type: attachedContext.type
            } : undefined
          })
        });
      } else {
        res = await fetch(`/api/spaces/${activeSpaceId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content: text, 
            mentions, 
            draftPlan,
            attachedContext: attachedContext ? {
              id: attachedContext.id,
              name: attachedContext.name,
              type: attachedContext.type
            } : undefined
          })
        });
      }

      const data = await res.json();
      
      if (data.success) {
        setAttachedContext(null);
        const aiResponse = isPersonal ? data : data.aiResponse;
        
        if (aiResponse) {
          if (aiResponse.triggerRevision && draftPlan) {
            const branchToUse = pendingBranch || {
              goalTitle: draftPlan.title || 'Meta',
              dimensionName: 'skills',
              hoursPerWeek: 10,
              targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            setPendingBranch(branchToUse);
            generateDraft(branchToUse, aiResponse.triggerRevision);
          } else if (aiResponse.branchData) {
            setPendingBranch(aiResponse.branchData);
            setBranchCreated(false);
            generateDraft(aiResponse.branchData);
          } else if (aiResponse.saveNote && draftPlan) {
            const newDraft = { ...draftPlan };
            const targetId = String(aiResponse.saveNote.taskNameOrId).toLowerCase();
            let found = false;
            newDraft.phases.forEach((p: any, pIdx: number) => {
              p.tasks?.forEach((t: any, tIdx: number) => {
                if (t.id === targetId || t.name.toLowerCase().includes(targetId)) {
                  if (!found) {
                    updateDraftPlanItem('task', pIdx, tIdx, undefined, 'notes', aiResponse.saveNote.content);
                    found = true;
                  }
                }
              });
            });
            setMobileTab('draft');
          }
        }

        if (isPersonal) {
          mutateSession();
        } else {
          mutateSpaceMessages();
        }

        if (isAiTarget) {
          setTimeout(() => {
            onRefreshTree();
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
      setIsAiTyping(false);
    }
  };

  const filteredGoals = (goalsList || []).filter((g: any) => 
    g.goal?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = selectedGoalForTasks
    ? (selectedGoalForTasks.leaves || []).filter((t: any) => 
        t.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const content = (
    <>

      {/* Floating Toggle Button — hidden when the dock handles opening */}
      {!isOpen && !hideFloatingButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-44 right-4 sm:bottom-6 sm:right-6 z-[9990] w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </motion.button>
      )}

      {/* Centered Global Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 md:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-white shadow-2xl flex flex-col border border-slate-100 overflow-hidden rounded-3xl transition-all duration-300 max-h-[85vh] ${
                (draftPlan || isDrafting) ? 'w-full max-w-6xl h-[85vh]' : 'w-full max-w-3xl h-[80vh] md:h-[75vh]'
              }`}
            >
            
            {/* Split content */}
            <div className={`flex-1 flex overflow-hidden ${(draftPlan || isDrafting) ? 'flex-col md:flex-row' : 'flex-col'}`}>
              
              {/* Left Column: Chat */}
              <div className={`flex flex-col h-full border-r border-slate-200/80 shadow-[3px_0_12px_rgba(0,0,0,0.015)] z-10 ${
                (draftPlan || isDrafting) ? (isChatCollapsed ? 'md:hidden w-full' : 'md:w-[35%] w-full') : 'w-full'
              } ${mobileTab === 'draft' && (draftPlan || isDrafting) ? 'hidden md:flex' : 'flex'} bg-slate-50/20`}>
                
                {/* Chat Sidebar Header */}
                <div className="h-[60px] md:h-[72px] px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                  <div className="relative inline-block w-full max-w-[200px]">
                    <button
                      onClick={() => setIsSpaceDropdownOpen(!isSpaceDropdownOpen)}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer transition-all shadow-sm"
                    >
                      <span className="truncate">
                        {activeSpaceId === 'personal' ? '🌳' : '👥'} {activeSpaceName}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isSpaceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isSpaceDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsSpaceDropdownOpen(false)} />
                        <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          {userSpaces.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setActiveSpaceId(s.id);
                                setActiveSpaceName(s.name);
                                setIsSpaceDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                                activeSpaceId === s.id 
                                  ? 'bg-emerald-50 text-emerald-800' 
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{s.id === 'personal' ? '🌳' : '👥'}</span>
                              <span className="truncate">{s.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <button 
                      onClick={handleResetChat}
                      disabled={isResetting}
                      title="Reiniciar chat"
                      className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-650 disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                    </button>
                    {(draftPlan || isDrafting) && (
                      <button 
                        onClick={() => setIsChatCollapsed(true)} 
                        className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-750 hover:bg-slate-150 rounded-full transition-colors items-center justify-center"
                        title="Ocultar Asistente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-450" title="Cerrar Asistente">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
                  {messages?.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4">
                      <Bot className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="text-sm font-medium">No hay mensajes aún.</p>
                      <p className="text-xs mt-1">
                        {isPersonal 
                          ? "Escribe qué meta te gustaría planificar para empezar." 
                          : "Escribe @bean para que la IA te ayude a crear ramas nuevas."}
                      </p>
                    </div>
                  )}
                  
                  {messages?.map((msg) => {
                    const isAI = msg.role === 'assistant' || msg.role === 'system';
                    
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          isAI ? 'bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`flex flex-col max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
                          <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                            {isAI ? 'BEAN' : msg.user?.name || 'Usuario'}
                          </span>
                          <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                            isAI 
                              ? 'bg-white/80 backdrop-blur-md border border-stone-200/40 text-stone-850 rounded-tl-sm' 
                              : 'bg-gradient-to-r from-[#0B462C] to-[#1B7A4E] text-white rounded-tr-sm font-medium'
                          }`}>
                            {renderFormattedText(msg.content, isAI)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isAiTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] text-white">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col max-w-[85%] items-start">
                        <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">BEAN</span>
                        <div className="px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200/40 rounded-tl-sm flex items-center gap-1.5 shadow-sm min-h-[44px]">
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  {isDrafting && (
                    <div className="flex gap-3 animate-in fade-in duration-200">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-[#0B462C] to-[#1B7A4E] text-white">
                        <Bot className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="flex flex-col max-w-[85%] items-start">
                        <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">Planificador BEAN</span>
                        <div className="px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#EAD4C5] rounded-tl-sm flex flex-col gap-2.5 shadow-sm min-w-[240px]">
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
                          <span className="text-[9px] text-stone-450 border-t border-[#EAD4C5]/60 pt-1.5 mt-0.5 text-stone-500 block">
                            Puedes ver el avance en tiempo real en la **Mesa de Dibujo** al lado derecho.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  {/* Attached Context Badge */}
                  {attachedContext && (
                    <div className="mb-2 flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-xl border border-emerald-100 w-fit font-semibold shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-150">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="max-w-[200px] truncate">
                        Contexto: {attachedContext.name} ({attachedContext.type === 'goal' ? 'Meta' : 'Tarea/Hábito'})
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setAttachedContext(null)} 
                        className="ml-1 p-0.5 hover:bg-emerald-100 rounded-full text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <form 
                    onSubmit={handleSend} 
                    className={`relative flex items-end gap-2 p-1.5 transition-all duration-300 ${
                      isDraggingOver ? 'border-dashed border-2 border-emerald-500 bg-emerald-50/40 rounded-2xl m-1' : ''
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const text = e.dataTransfer.getData('text/plain');
                      if (text) {
                        setAttachedContext({ id: 'dragged', name: text, type: 'task' });
                      }
                    }}
                  >
                    {/* Add Context Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowContextPopover(!showContextPopover)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors border shrink-0 ${
                          showContextPopover 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-600' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        <Plus className={`w-5 h-5 transition-transform ${showContextPopover ? 'rotate-45' : ''}`} />
                      </button>

                      {/* Context Popover Dropdown */}
                      {showContextPopover && (
                        <div className="absolute bottom-12 left-0 z-50 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                          {/* Title */}
                          <div className="flex justify-between items-center px-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Adjuntar contexto</h4>
                            <button 
                              type="button" 
                              onClick={() => setShowContextPopover(false)}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {/* Search Input */}
                          <div className="relative px-0.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={
                                popoverTab === 'goals' 
                                  ? "Buscar meta..." 
                                  : selectedGoalForTasks 
                                    ? "Buscar tarea..." 
                                    : "Buscar meta..."
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-slate-800"
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          
                          {/* Tabs */}
                          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => setPopoverTab('goals')}
                              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                                popoverTab === 'goals' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              Metas
                            </button>
                            <button
                              type="button"
                              onClick={() => setPopoverTab('tasks')}
                              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                                popoverTab === 'tasks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              Tareas
                            </button>
                          </div>

                          {/* List container */}
                          <div className="max-h-48 overflow-y-auto mt-0.5 space-y-1 pr-0.5">
                            {popoverTab === 'goals' && (
                              loadingTree ? (
                                <p className="text-xs text-slate-400 p-3 text-center">Cargando metas...</p>
                              ) : filteredGoals.length === 0 ? (
                                <p className="text-xs text-slate-400 p-3 text-center">No se encontraron metas</p>
                              ) : (
                                filteredGoals.map((g: any) => (
                                  <button
                                    key={g.id}
                                    type="button"
                                    onClick={() => {
                                      setAttachedContext({ id: g.id, name: g.goal, type: 'goal' });
                                      setShowContextPopover(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all text-slate-700 hover:text-emerald-950 text-xs font-semibold flex items-start gap-2"
                                  >
                                    <Target className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <div className="truncate font-bold text-slate-800">{g.goal}</div>
                                      <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">{g.description || 'Sin descripción'}</div>
                                    </div>
                                  </button>
                                ))
                              )
                            )}

                            {popoverTab === 'tasks' && (
                              loadingTree ? (
                                <p className="text-xs text-slate-400 p-3 text-center">Cargando...</p>
                              ) : selectedGoalForTasks === null ? (
                                <>
                                  <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                                    Selecciona una meta:
                                  </p>
                                  {filteredGoals.length === 0 ? (
                                    <p className="text-xs text-slate-400 p-3 text-center">No se encontraron metas</p>
                                  ) : (
                                    filteredGoals.map((g: any) => (
                                      <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => setSelectedGoalForTasks(g)}
                                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all text-slate-700 hover:text-emerald-950 text-xs font-semibold flex items-center gap-2"
                                      >
                                        <Target className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="truncate flex-1 font-bold text-slate-800">🌳 {g.goal}</span>
                                      </button>
                                    ))
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100 px-1">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedGoalForTasks(null)}
                                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 flex items-center"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Ver tareas en</p>
                                      <p className="text-xs font-bold text-slate-700 truncate">{selectedGoalForTasks.goal}</p>
                                    </div>
                                  </div>
                                  
                                  {filteredTasks.length === 0 ? (
                                    <p className="text-xs text-slate-400 p-3 text-center">No se encontraron tareas</p>
                                  ) : (
                                    filteredTasks.map((t: any) => (
                                      <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                          setAttachedContext({ id: t.id, name: t.name, type: t.type === 'task' ? 'task' : 'habit' });
                                          setSelectedGoalForTasks(null);
                                          setShowContextPopover(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all text-slate-700 hover:text-emerald-950 text-xs font-semibold flex items-center gap-2"
                                      >
                                        <CheckSquare className={`w-4 h-4 shrink-0 ${t.completed ? 'text-slate-350' : 'text-emerald-500'}`} />
                                        <span className={`truncate flex-1 font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                          {t.name}
                                        </span>
                                      </button>
                                    ))
                                  )}
                                </>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Text Input */}
                    {isDraggingOver ? (
                      <div className="flex-1 flex items-center justify-center py-3 text-emerald-800 font-bold text-xs gap-1.5 animate-pulse bg-emerald-100/30 rounded-xl">
                        <span>📥</span> Suelta el elemento aquí para añadirlo como contexto
                      </div>
                    ) : (
                      <div className="relative flex-1">
                        <textarea
                          ref={textareaRef}
                          rows={1}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleTextareaKeyDown}
                          placeholder={isPersonal ? "Escribe un mensaje a tu Guía BEAN..." : "Escribe un mensaje o etiqueta a @bean..."}
                          className="w-full bg-slate-100 text-slate-800 text-sm rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all border border-transparent focus:border-emerald-500/30 resize-none min-h-[44px] max-h-40 overflow-y-auto align-bottom block"
                        />
                        <button
                          type="submit"
                          disabled={!input.trim() || isSending}
                          className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Right Column: Mesa de Dibujo — solo se monta cuando hay draft o se está generando */}
              {(draftPlan || isDrafting) && <div className={`${mobileTab === 'chat' ? 'hidden md:flex' : 'flex'} flex-col h-full ${isChatCollapsed ? 'w-full' : 'md:w-[65%] w-full'} bg-[#F4F1EA] overflow-y-auto border-l border-stone-200`}>
                {/* Draft Header */}
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
                      <p className="text-[10px] md:text-xs font-medium text-stone-500">Borrador colaborativo del plan.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {draftPlan && (
                      <>
                        <button
                          onClick={() => setDraftPlan(null)}
                          disabled={isDrafting}
                          className="px-4 py-2.5 border border-stone-200 text-stone-600 hover:text-stone-850 hover:border-stone-300 text-xs font-bold rounded-xl bg-white hover:bg-stone-50 transition-all active:scale-[0.98] disabled:opacity-40"
                        >
                          Descartar
                        </button>
                        <button
                          onClick={handleCreateBranch}
                          disabled={creatingBranch || isDrafting || !draftPlan}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#0B462C] to-[#1B7A4E] hover:from-[#083622] hover:to-[#145D3B] text-white text-xs font-black rounded-xl transition-all shadow-[0_4px_14px_rgba(27,122,78,0.25)] hover:shadow-[0_6px_20px_rgba(27,122,78,0.35)] active:scale-[0.98] disabled:opacity-40 animate-in"
                        >
                          {creatingBranch ? 'Plantando...' : 'Plantar Árbol'}
                        </button>
                      </>
                    )}
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-600 ml-1">
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>

                {/* Draft Content */}
                <div className="p-6 space-y-6 flex-1 flex flex-col justify-start">
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
                      <>
                        {draftDiagnosis && (
                          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 shadow-sm space-y-3 text-stone-850">
                            <div className="flex items-center gap-2 border-b border-emerald-100/60 pb-2">
                              <span className="text-emerald-700 text-sm">🧠</span>
                              <h5 className="font-bold text-xs text-emerald-800">Diagnóstico de Viabilidad (Agente 1)</h5>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black uppercase px-2 py-0.5 rounded ml-auto">
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
                                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 mt-1.5 text-amber-900">
                                  <span className="font-bold text-amber-800 block mb-0.5">⚠️ Advertencias / Recomendaciones:</span>
                                  <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                                    {draftDiagnosis.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                  </ul>
                                </div>
                              )}

                              <div className="text-stone-500 text-[9px] flex justify-between items-center mt-1.5 pt-1.5 border-t border-stone-100">
                                <span>Duración sugerida: {draftDiagnosis.estimatedMonths} meses</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Meta</span>
                          </div>
                          <h4 className="text-lg font-black text-stone-800 mb-1">
                            <EditableField 
                              value={draftPlan.title} 
                              onChange={(val: string) => setDraftPlan({ ...draftPlan, title: val })}
                              placeholder="Nombre de la meta..."
                            />
                          </h4>
                          <p className="text-sm text-stone-505 text-slate-500">
                            <EditableField 
                              value={draftPlan.description} 
                              onChange={(val: string) => setDraftPlan({ ...draftPlan, description: val })}
                              placeholder="Descripción general..."
                              isMultiline={true}
                            />
                          </p>
                        </div>

                        <div className="space-y-4">
                          {draftPlan.phases?.map((phase: any, pIdx: number) => (
                            <div 
                              key={pIdx} 
                              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-colors relative cursor-grab active:cursor-grabbing group"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', `[Fase: ${phase.title}]`);
                              }}
                              onClick={() => setSelectedDraftItem({ type: 'phase', pIdx })}
                            >
                              <div className="flex gap-2 items-start">
                                <div className="mt-1 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0">
                                  <GripVertical className="w-4 h-4 cursor-grab" />
                                </div>
                                <div className="flex-1 pr-12 pointer-events-none">
                                  <span className="font-black text-stone-800 text-base mb-1 block">
                                    {phase.title || <span className="text-stone-300 italic">Sin título...</span>}
                                  </span>
                                  {phase.description && (
                                    <p className="text-xs text-stone-500">{phase.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
                                {phase.tasks?.map((task: any, tIdx: number) => {
                                  const assignee = members.find(m => m.userId === task.assigneeId);
                                  
                                  return (
                                    <div 
                                      key={tIdx} 
                                      className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex flex-col gap-1 hover:bg-stone-100 cursor-grab active:cursor-grabbing relative"
                                      draggable
                                      onDragStart={(e) => {
                                        e.stopPropagation();
                                        e.dataTransfer.setData('text/plain', `[Tarea: ${task.name} (en Fase: ${phase.title})]`);
                                      }}
                                      onClick={() => setSelectedDraftItem({ type: 'task', pIdx, tIdx })}
                                    >
                                      <div className="flex justify-between items-start pointer-events-none">
                                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                          <GripVertical className="w-3.5 h-3.5 text-stone-300 shrink-0 pointer-events-auto" />
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

                                      {task.subTasks && task.subTasks.length > 0 && (
                                        <div className="mt-2 pl-3 border-l-2 border-emerald-500/20 space-y-1 pointer-events-auto">
                                          {task.subTasks.map((st: any, sIdx: number) => (
                                            <div 
                                              key={sIdx} 
                                              className="flex items-center gap-1.5 text-[11px] text-stone-500 cursor-grab hover:bg-stone-250 hover:bg-stone-200/35 rounded px-1 py-0.5 -mx-1"
                                              draggable
                                              onDragStart={(e) => {
                                                e.stopPropagation();
                                                e.dataTransfer.setData('text/plain', `[Sub-tarea: ${st.name} (de la Tarea: ${task.name})]`);
                                              }}
                                            >
                                              <GripVertical className="w-2.5 h-2.5 text-stone-300 shrink-0 pointer-events-auto" />
                                              <span className="line-clamp-1">{st.name || st.title}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {!isPersonal && (
                                        assignee ? (
                                          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600 pointer-events-none">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            <span>Asignado a: {assignee.name}</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-amber-600 pointer-events-none">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                            <span>Sin responsable asignado</span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
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
                </div>}

              {/* Draft Detail Modal Sheet */}
              <AnimatePresence>
                {selectedDraftItem && draftPlan && (
                  <DraftItemDetailSheet
                    selection={selectedDraftItem}
                    itemData={
                      selectedDraftItem.type === 'phase'
                        ? draftPlan.phases[selectedDraftItem.pIdx]
                        : draftPlan.phases[selectedDraftItem.pIdx]?.tasks[selectedDraftItem.tIdx!]
                    }
                    members={members}
                    onClose={() => setSelectedDraftItem(null)}
                    updateDraftPlanItem={updateDraftPlanItem}
                    handleDeleteDraftItem={handleDeleteDraftItem}
                    handleAddDraftItem={handleAddDraftItem}
                    handleAddContextToChat={handleAddContextToChat}
                    isPersonal={isPersonal}
                  />
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
    </>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
