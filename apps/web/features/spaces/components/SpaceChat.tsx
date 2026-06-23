'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, MessageSquare, ChevronRight, ChevronDown, Trash2, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';

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

const DraftItemDetailSheet = ({ itemData, selection, onClose, updateDraftPlanItem, handleDeleteDraftItem, handleAddDraftItem, handleAddContextToChat, members = [] }: any) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { type, pIdx, tIdx } = selection;

  const titlePrefix = type === 'phase' ? 'Fase' : 'Tarea';

  return (
    <motion.div 
      initial={{ y: '100%', opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 z-50 bg-white md:rounded-t-3xl shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col h-[70vh] border-t border-x border-stone-200"
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
            <MessageSquare className="w-4 h-4" /> Preguntar a @bean sobre esto
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
  );
};

export function SpaceChat({ spaceId, spaceName, members = [], onRefreshTree }: SpaceChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLengthRef = useRef<number>(0);
  const notificationPermissionGranted = useRef<boolean>(false);

  const [draftPlan, setDraftPlan] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftStep, setDraftStep] = useState('');
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [selectedDraftItem, setSelectedDraftItem] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'draft'>('chat');

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
        spaceId: spaceId
      };

      const res = await fetch('/api/ai/goal-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setDraftPlan(null);
        const confirmMsg: Message = {
          id: Date.now().toString() + '_sys',
          role: 'assistant',
          content: `🌳 ¡Perfecto! He plantado la meta colaborativa **"${draftPlan.title}"** en el árbol del equipo. ¡Ya pueden verla!`,
          createdAt: new Date().toISOString()
        };
        mutate((current) => [...(current || []), confirmMsg], false);
        onRefreshTree();
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

  const isPersonal = spaceId === 'personal' || spaceName === 'Árbol Personal';

  useEffect(() => {
    setMounted(true);
    // Request notification permission on mount
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          notificationPermissionGranted.current = true;
        }
      });
    }
  }, []);

  // Fetch messages all the time so we can get notifications when closed
  const { data: messages, mutate } = useSWR<Message[]>(
    isPersonal ? null : `/api/spaces/${spaceId}/chat`, 
    fetcher, 
    { refreshInterval: 3000 }
  );

  useEffect(() => {
    if (messages) {
      const prevLen = previousMessagesLengthRef.current;
      const curLen = messages.length;
      
      if (prevLen > 0 && curLen > prevLen) {
        // We have new messages!
        const newMessages = messages.slice(prevLen);
        
        // If chat is closed, increment unread count and trigger system notifications
        if (!isOpen) {
          setUnreadCount(prev => prev + newMessages.length);
          
          if (notificationPermissionGranted.current) {
            newMessages.forEach(msg => {
              // Don't notify for our own messages (optimistic or synced)
              if (msg.user?.name !== 'Tú' && msg.role !== 'user') {
                const title = msg.role === 'assistant' ? 'BEAN (Asistente)' : (msg.user?.name || 'Nuevo Mensaje');
                new Notification(title, {
                  body: msg.content,
                  icon: '/favicon.ico'
                });
              }
            });
          }
        }
      }
      previousMessagesLengthRef.current = curLen;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input;
    setInput('');
    setIsSending(true);

    // Optimistic update
    const tempId = Date.now().toString();
    mutate((current) => [...(current || []), {
      id: tempId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
      user: { name: 'Tú', avatarUrl: null }
    }], false);

    // Detect if we mention @bean
    const mentions: string[] = [];
    if (text.toLowerCase().includes('@bean')) {
      mentions.push('bean');
      setIsAiTyping(true);
    }

    try {
      const res = await fetch(`/api/spaces/${spaceId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, mentions, draftPlan })
      });
      
      const data = await res.json();
      
      if (data.success && data.aiResponse?.branchData) {
        setDraftPlan(data.aiResponse.branchData);
        setMobileTab('draft');
      }
      
      if (mentions.includes('bean')) {
        setTimeout(() => {
          onRefreshTree();
          mutate();
        }, 1500);
      } else {
        mutate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
      setIsAiTyping(false);
    }
  };

  if (isPersonal) return null;

  const content = (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[9990] w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </motion.button>
      )}

      {/* Chat Sidebar / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 h-full bg-white shadow-2xl z-[10000] flex flex-col border-l border-slate-200 transition-all duration-300 ${
              draftPlan ? 'w-full md:max-w-6xl' : 'w-full sm:w-96'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    Chat del Árbol
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{spaceName}</p>
                </div>

                {draftPlan && (
                  <div className="flex md:hidden bg-slate-100 p-0.5 rounded-full border border-slate-200">
                    <button
                      onClick={() => setMobileTab('chat')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        mobileTab === 'chat' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setMobileTab('draft')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        mobileTab === 'draft' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Borrador
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split content */}
            <div className={`flex-1 flex overflow-hidden ${draftPlan ? 'flex-col md:flex-row' : 'flex-col'}`}>
              
              {/* Left Column: Chat */}
              <div className={`flex flex-col h-full border-r border-slate-100 ${
                draftPlan ? 'md:w-5/12 w-full' : 'w-full'
              } ${mobileTab === 'draft' && draftPlan ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
                  {messages?.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4">
                      <Bot className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="text-sm font-medium">No hay mensajes aún.</p>
                      <p className="text-xs mt-1">Escribe @bean para que la IA te ayude a crear ramas nuevas.</p>
                    </div>
                  )}
                  
                  {messages?.map((msg) => {
                    const isAI = msg.role === 'assistant' || msg.role === 'system';
                    
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          isAI ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                          <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                            {isAI ? 'BEAN' : msg.user?.name || 'Usuario'}
                          </span>
                          <div className={`px-4 py-2.5 rounded-2xl max-w-[260px] text-[13px] leading-relaxed shadow-sm ${
                            isAI 
                              ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm' 
                              : 'bg-emerald-600 text-white rounded-tr-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isAiTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-emerald-100 text-emerald-600">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">BEAN</span>
                        <div className="px-4 py-3.5 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-1.5 shadow-sm min-h-[44px]">
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3, ease: "easeInOut" }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <form onSubmit={handleSend} className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Escribe un mensaje o etiqueta a @bean..."
                      className="w-full bg-slate-100 text-slate-800 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all border border-transparent focus:border-emerald-500/30"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isSending}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Mesa de Dibujo */}
              {draftPlan && (
                <div className={`${mobileTab === 'chat' ? 'hidden md:flex' : 'flex'} flex-1 flex-col h-full bg-stone-50 overflow-y-auto`}>
                  {/* Draft Header */}
                  <div className="px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm">
                    <div>
                      <h3 className="text-lg font-black text-stone-800">Mesa de Dibujo</h3>
                      <p className="text-xs font-medium text-stone-500">Borrador colaborativo del plan.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDraftPlan(null)}
                        className="px-4 py-2 border border-stone-200 text-stone-600 text-sm font-bold rounded-xl bg-white hover:bg-stone-50 transition-all shadow-sm"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={handleCreateBranch}
                        disabled={creatingBranch}
                        className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 shadow-sm"
                      >
                        {creatingBranch ? 'Plantando...' : 'Plantar Árbol'}
                      </button>
                    </div>
                  </div>

                  {/* Draft Content */}
                  <div className="p-6 space-y-6">
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
                          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-colors relative cursor-pointer"
                          onClick={() => setSelectedDraftItem({ type: 'phase', pIdx })}
                        >
                          <div className="pr-12 pointer-events-none">
                            <span className="font-black text-stone-800 text-base mb-1 block">
                              {phase.title || <span className="text-stone-300 italic">Sin título...</span>}
                            </span>
                            {phase.description && (
                              <p className="text-xs text-stone-500">{phase.description}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
                            {phase.tasks?.map((task: any, tIdx: number) => {
                              const assignee = members.find(m => m.userId === task.assigneeId);
                              
                              return (
                                <div 
                                  key={tIdx} 
                                  className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex flex-col gap-1 hover:bg-stone-100 cursor-pointer relative"
                                  onClick={() => setSelectedDraftItem({ type: 'task', pIdx, tIdx })}
                                >
                                  <div className="flex justify-between items-start pointer-events-none">
                                    <div className="flex items-center gap-1 flex-1">
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

                                  {assignee ? (
                                    <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600 pointer-events-none">
                                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                      <span>Asignado a: {assignee.name}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-amber-600 pointer-events-none">
                                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                      <span>Sin responsable asignado</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Draft Detail Modal Sheet */}
                  <AnimatePresence>
                    {selectedDraftItem && (
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
                      />
                    )}
                  </AnimatePresence>

                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
