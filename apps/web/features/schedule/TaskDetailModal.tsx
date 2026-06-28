'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduledEvent } from './ScheduleView';
import { TaskCoachChat } from '../life-tree/TaskCoachChat';
import { MessageSquare, X, AlignLeft, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  task: ScheduledEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isCompleted: boolean) => void;
  onUpdate?: (id: string, data: { title: string; description?: string; notes?: string }) => void;
  onToggleTask?: (taskId: string, isCompleted: boolean) => void;
}

export function TaskDetailModal({ task, onClose, onDelete, onToggle, onUpdate, onToggleTask }: Props) {
  const isCompleted = task.status === 'completed';
  const isManuallyCreated = task.type === 'daily';
  const subtasksTotal = task.tasks?.length ?? 0;
  const subtasksDone = task.tasks?.filter((t: any) => t.isCompleted).length ?? 0;
  const hasSubtasks = subtasksTotal > 0;
  const subtasksPct = hasSubtasks ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');

  // Tab & Bottom Sheet states
  const [activeTab, setActiveTab] = useState<'steps' | 'notes' | 'coach'>('steps');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const dragControls = useDragControls();

  // Subtasks/steps states
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [chatOpenTaskId, setChatOpenTaskId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setEditTitle(task.title);
    setEditNotes(task.notes || '');
    setExpandedTaskId(null);
    setChatOpenTaskId(null);
  }, [task.id, task.title, task.notes]);

  useEffect(() => {
    if (chatOpenTaskId) {
      setActiveTab('coach');
    }
  }, [chatOpenTaskId]);

  const handleSave = () => {
    if (onUpdate && editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim(), notes: editNotes.trim() });
      setIsEditing(false);
    }
  };

  const formatDateSafely = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch (e) {
      return '';
    }
  };

  const content = (
    <div className={`fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden transition-all duration-300 ${
      isExpanded 
        ? 'p-0 md:p-0 md:items-stretch md:justify-stretch' 
        : 'p-0 md:p-6 md:items-center md:justify-center'
    }`}>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Container: Draggable Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, info) => {
          // If swiped down past threshold, close it
          if (info.offset.y > 100 && !isExpanded) onClose();
          else if (info.offset.y > 150 && isExpanded) setIsExpanded(false);
          // If swiped up, expand to full screen
          else if (info.offset.y < -50 && !isExpanded) setIsExpanded(true);
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0, height: isExpanded ? (isDesktop ? '100vh' : '100dvh') : (isDesktop ? '80vh' : '80dvh') }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.8 }}
        className={`relative w-full bg-[#FAF9F6] overflow-hidden shadow-2xl flex flex-col md:!translate-y-0 transition-[border-radius] duration-300 ${
          isExpanded
            ? 'rounded-none md:w-screen md:h-screen md:max-w-none md:rounded-none'
            : 'rounded-t-[32px] md:max-w-4xl md:h-[80vh] md:!rounded-[32px]'
        }`}
      >
        
        {/* Mobile Drag Handle Indicator */}
        <div 
          className="w-full flex justify-center pt-3 pb-3 md:hidden bg-[#FAF9F6] shrink-0 cursor-grab active:cursor-grabbing touch-none border-b border-[#E6E1D6]"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 bg-[#E6E1D6] rounded-full pointer-events-none" />
        </div>

        {/* Unified Header */}
        <div className="bg-[#FAF9F6] border-b border-[#E6E1D6] px-6 py-5 shrink-0 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {hasSubtasks ? (
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    subtasksPct === 100 ? 'bg-[#EAF5EC] text-[#1B7A4E] border-[#CDE5D2]' : 'bg-[#FDF5F0] text-[#A0522D] border-[#EAD4C5]'
                  }`}>
                    {subtasksDone}/{subtasksTotal} pasos{subtasksPct === 100 ? ' ✓' : ''}
                  </span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    isCompleted ? 'bg-[#EAF5EC] text-[#1B7A4E] border-[#CDE5D2]' : 'bg-[#FDF5F0] text-[#A0522D] border-[#EAD4C5]'
                  }`}>
                    {isCompleted ? 'Completado' : 'Pendiente'}
                  </span>
                )}
                {task.estimatedHours && (
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                    ⏱️ {task.estimatedHours}h est.
                  </span>
                )}
              </div>
              {isEditing && activeTab === 'notes' ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-none bg-white border border-[#E6E1D6] rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#1B7A4E]/30"
                  placeholder="Título de la tarea"
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-tight truncate">
                  {task.title}
                </h2>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
                title={isExpanded ? 'Reducir' : 'Expandir'}
              >
                {isExpanded
                  ? <Minimize2 className="w-4 h-4 text-stone-500" />
                  : <Maximize2 className="w-4 h-4 text-stone-500" />
                }
              </button>
              <button onClick={onClose} className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
          </div>
        </div>

        {/* SPLIT LAYOUT BODY */}
        <div className="flex-1 flex overflow-hidden flex-col md:flex-row bg-[#F4F1EA]">
          
          {/* Columna Izquierdo: Detalles estáticos (Solo en Escritorio) */}
          <div className="hidden md:flex flex-col w-[35%] border-r border-[#E6E1D6] bg-[#FAF9F6] p-6 overflow-y-auto space-y-6 shrink-0">
            {/* Metadata (Goal, Assignee, Schedule, Date) */}
            <div className="space-y-4">
              {task.goalTitle && (
                <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                    Meta / Proyecto
                  </span>
                  <span className="text-xs font-bold text-stone-800 leading-tight truncate">{task.goalTitle}</span>
                </div>
              )}
              
              <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                  Asignado a
                </span>
                {task.assignee ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {task.assignee.image ? (
                      <img 
                        src={task.assignee.image} 
                        alt={task.assignee.name || ''} 
                        className="w-4 h-4 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-600">
                        {(task.assignee.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold text-stone-850 leading-tight truncate">
                      {task.assignee.name || task.assignee.email || 'Asignado'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-stone-400 leading-tight italic">
                    Sin asignar
                  </span>
                )}
              </div>

              {task.type && (
                <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                    Fase
                  </span>
                  <span className="text-xs font-bold text-stone-800 leading-tight capitalize truncate">{task.type}</span>
                </div>
              )}

              {task.startDate && (
                <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                    Inicio
                  </span>
                  <span className="text-xs font-bold text-stone-800 leading-tight capitalize truncate">{formatDateSafely(task.startDate)}</span>
                </div>
              )}

              {task.date && task.date !== task.startDate && (
                <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                    Fecha Acción
                  </span>
                  <span className="text-xs font-bold text-stone-800 leading-tight capitalize truncate">{formatDateSafely(task.date)}</span>
                </div>
              )}

              {(task.startTime || task.endTime) && (
                <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                    Horario
                  </span>
                  <span className="text-xs font-bold text-stone-850 leading-tight truncate">
                    {task.startTime || '??'} - {task.endTime || '??'}
                  </span>
                </div>
              )}
            </div>

            {/* Dimensions / Attributes */}
            {(task.dimensions?.length || task.attributes?.length) ? (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {task.dimensions?.map(dim => (
                  <span key={dim} className="px-2.5 py-1 bg-[#FAF0E6] border border-[#EAD4C5] text-[#A0522D] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-2xs">
                    ✦ {dim}
                  </span>
                ))}
                {task.attributes?.map(attr => (
                  <span key={attr} className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-850 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-2xs">
                    ✧ {attr}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Description */}
            {task.description && (
              <div className="bg-[#FDF5F0]/90 border border-[#EAD4C5] p-4 rounded-2xl shadow-2xs">
                <span className="text-[9px] font-black text-[#8B4513] uppercase tracking-widest mb-1.5 block">
                  Descripción / Enfoque
                </span>
                <p className="text-xs text-stone-700 leading-relaxed font-semibold whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}
          </div>

          {/* Columna Derecha: Pestañas Dinámicas (Pasos, Notas, Coach) */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            {/* Tab Navigation (Pushed inside right column for desktop) */}
            <div className="bg-white border-b border-[#E6E1D6] px-6 py-3.5 shrink-0">
              <div className="flex bg-[#F4F1EA] p-1 rounded-2xl w-full relative">
                <button 
                  onClick={() => setActiveTab('steps')}
                  className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 relative z-10 ${activeTab === 'steps' ? 'text-stone-855 font-black' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  Pasos
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 relative z-10 ${activeTab === 'notes' ? 'text-stone-855 font-black' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  📝 Notas
                </button>
                <button 
                  onClick={() => setActiveTab('coach')}
                  className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 relative z-10 ${activeTab === 'coach' ? 'text-[#1B7A4E] font-black' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Coach
                </button>
                
                {/* Sliding active tab indicator */}
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute top-1 bottom-1 bg-white rounded-xl shadow-xs"
                  style={{
                    width: 'calc(33.333% - 4px)',
                    left: activeTab === 'steps' ? '4px' : activeTab === 'notes' ? '33.333%' : '66.666%'
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                />
              </div>
            </div>

            {/* Tab Scroll Content */}
            <div 
              className="flex-1 overflow-y-auto relative min-h-0 bg-[#FAF9F6]"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {activeTab === 'steps' && (
                <div className="px-6 py-6 space-y-6">
                  
                  {/* Mobile-only Metadata (Hidden on desktop) */}
                  <div className="grid grid-cols-2 gap-3 md:hidden">
                    {task.goalTitle && (
                      <div className="bg-white p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                          Meta / Proyecto
                        </span>
                        <span className="text-xs font-bold text-stone-850 leading-tight truncate">{task.goalTitle}</span>
                      </div>
                    )}
                    <div className="bg-white p-3 rounded-2xl border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                        Asignado a
                      </span>
                      {task.assignee ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {task.assignee.image ? (
                            <img 
                              src={task.assignee.image} 
                              alt={task.assignee.name || ''} 
                              className="w-4 h-4 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center text-[9px] font-bold text-stone-600">
                              {(task.assignee.name || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-bold text-stone-850 leading-tight truncate">
                            {task.assignee.name || task.assignee.email || 'Asignado'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-stone-400 leading-tight italic">
                          Sin asignar
                        </span>
                      )}
                    </div>
                    {task.type && (
                      <div className="bg-white p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                          Fase
                        </span>
                        <span className="text-xs font-bold text-stone-850 leading-tight capitalize truncate">{task.type}</span>
                      </div>
                    )}
                    {task.startDate && (
                      <div className="bg-white p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                          Inicio
                        </span>
                        <span className="text-xs font-bold text-stone-850 leading-tight capitalize truncate">{formatDateSafely(task.startDate)}</span>
                      </div>
                    )}
                    {task.date && task.date !== task.startDate && (
                      <div className="bg-white p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                          Fecha Acción
                        </span>
                        <span className="text-xs font-bold text-stone-850 leading-tight capitalize truncate">{formatDateSafely(task.date)}</span>
                      </div>
                    )}
                    {(task.startTime || task.endTime) && (
                      <div className="bg-white p-3 rounded-2xl border border-[#E6E1D6]/70 shadow-xs flex flex-col justify-center">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
                          Horario
                        </span>
                        <span className="text-xs font-bold text-stone-850 leading-tight truncate">
                          {task.startTime || '??'} - {task.endTime || '??'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mobile-only Tags (Hidden on desktop) */}
                  {(task.dimensions?.length || task.attributes?.length) ? (
                    <div className="flex flex-wrap gap-2 md:hidden">
                      {task.dimensions?.map(dim => (
                        <span key={dim} className="px-2.5 py-1 bg-[#FAF0E6] border border-[#EAD4C5] text-[#A0522D] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                          ✦ {dim}
                        </span>
                      ))}
                      {task.attributes?.map(attr => (
                        <span key={attr} className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-850 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                          ✧ {attr}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Mobile-only Description (Hidden on desktop) */}
                  {task.description && (
                    <div className="bg-white p-4 rounded-2xl border border-[#E6E1D6]/70 md:hidden">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5 block">
                        Descripción / Enfoque
                      </span>
                      <p className="text-xs text-stone-600 leading-relaxed font-semibold whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  )}

                  {/* Subtasks checklist */}
                  {task.tasks && task.tasks.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-1 flex items-center gap-2">
                        Pasos / Tareas
                      </h4>
                      <div className="space-y-2">
                        {task.tasks.map((t: any) => (
                          <div key={t.id} className="border border-[#E6E1D6]/70 rounded-2xl overflow-hidden bg-white hover:border-[#1B7A4E]/30 hover:shadow-xs transition-all duration-200">
                            <div 
                              className="flex items-center p-3 cursor-pointer"
                              onClick={() => setExpandedTaskId(expandedTaskId === t.id ? null : t.id)}
                            >
                              <div 
                                className="mr-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleTask?.(t.id, !t.isCompleted);
                                }}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${t.isCompleted ? 'bg-[#1B7A4E] border-[#1B7A4E]' : 'bg-[#F4F1EA] border-stone-300 hover:border-[#1B7A4E]'}`}>
                                  {t.isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                </div>
                              </div>
                              <span className={`text-sm font-bold flex-1 ${t.isCompleted ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                                {t.title}
                              </span>
                              <div className="text-stone-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedTaskId === t.id ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                              </div>
                            </div>
                            
                            {expandedTaskId === t.id && (
                              <div className="px-11 pb-4 pt-1 border-t border-[#E6E1D6]/50 bg-[#FAF9F6]/50">
                                {t.description && (
                                  <p className="text-xs text-stone-500 font-medium leading-relaxed mb-3 whitespace-pre-wrap">
                                    {t.description}
                                  </p>
                                )}
                                {(t.startDate || t.endDate || t.estimatedHours) && (
                                  <div className="flex flex-wrap gap-3 mt-1 mb-3">
                                    {t.estimatedHours && (
                                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                        ⏱️ {t.estimatedHours}h est.
                                      </span>
                                    )}
                                    {t.endDate && (
                                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                        📅 Fin: {formatDateSafely(t.endDate)}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setChatOpenTaskId(chatOpenTaskId === t.id ? null : t.id);
                                  }}
                                  className={`mt-2 text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                                    chatOpenTaskId === t.id 
                                      ? 'bg-stone-200 text-stone-600' 
                                      : 'text-white bg-[#1B7A4E] hover:bg-[#0B462C]'
                                  }`}
                                >
                                  🤖 {chatOpenTaskId === t.id ? 'Cerrar Chat' : 'Consultar con el Coach'}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#E6E1D6]">
                      <p className="text-xs text-stone-400 font-bold">Sin subtareas o pasos adicionales.</p>
                    </div>
                  )}

                  {/* Action Buttons inside scrollable steps */}
                  {!isEditing && (
                    <div className="pt-4 border-t border-[#E6E1D6]/80 flex flex-col gap-2">
                      {(task as any).baseCommitmentTitle ? (
                        (() => {
                          const completed = (task as any).completedCount || 0;
                          const total = (task as any).totalSessions || 1;
                          const progressPercent = Math.min(100, Math.round((completed / total) * 100));
                          return (
                            <div className="bg-white p-4 rounded-2xl border border-[#E6E1D6] flex flex-col gap-3 shadow-xs text-left">
                              <div className="flex justify-between items-center text-[11px] font-bold text-stone-500">
                                <span className="flex items-center gap-1">🔄 Hábito: <strong>{(task as any).baseCommitmentTitle}</strong></span>
                                <span>{progressPercent}%</span>
                              </div>
                              {/* Progress Bar Container */}
                              <div className="w-full bg-[#F4F1EA] h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-[#1B7A4E] h-full transition-all duration-500" 
                                  style={{ width: `${progressPercent}%` }} 
                                />
                              </div>
                              <div className="flex justify-between text-[9px] font-black text-stone-400 uppercase tracking-wider">
                                <span>{completed} sesiones realizadas</span>
                                <span>{total} sesiones requeridas</span>
                              </div>
                              
                              {/* Quick session logger */}
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const res = await fetch(`/api/profile/commitments/${(task as any).baseCommitmentId}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'complete' })
                                  }).then(r => r.json());
                                  if (res.success) {
                                    window.dispatchEvent(new CustomEvent('refresh-life-tree'));
                                    onToggle(task.id, res.commitment.completedCount >= total);
                                  } else {
                                    alert('Error al registrar la sesión: ' + (res.error || 'Inténtalo de nuevo.'));
                                  }
                                }}
                                className="w-full py-2.5 bg-[#FAF0E6] text-[#1B7A4E] hover:bg-[#1B7A4E]/10 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs border border-[#1B7A4E]/20"
                              >
                                <span>🔥</span> Registrar Sesión de Hoy
                              </button>

                              <p className="text-[10px] text-stone-400 font-bold leading-normal border-t border-[#E6E1D6]/60 pt-2 mt-0.5">
                                💡 Este hábito se completa registrando el progreso de tu hábito diario desde tu Agenda o haciendo clic en el botón superior.
                              </p>
                            </div>
                          );
                        })()
                      ) : hasSubtasks ? (
                        <div className="bg-white p-4 rounded-2xl border border-[#E6E1D6] flex flex-col gap-3 shadow-xs">
                          <div className="flex justify-between items-center text-[11px] font-bold text-stone-500">
                            <span>Progreso de subtareas</span>
                            <span>{subtasksPct}%</span>
                          </div>
                          <div className="w-full bg-[#F4F1EA] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#1B7A4E] h-full transition-all duration-500"
                              style={{ width: `${subtasksPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-black text-stone-400 uppercase tracking-wider">
                            <span>{subtasksDone} completadas</span>
                            <span>{subtasksTotal} en total</span>
                          </div>
                          {subtasksPct === 100 && (
                            <p className="text-[10px] text-[#1B7A4E] font-bold leading-normal border-t border-[#E6E1D6]/60 pt-2">
                              ✓ Todas las subtareas completadas. Esta tarea se marca como completada automáticamente.
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => onToggle(task.id, !isCompleted)}
                          className={`w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 ${
                            isCompleted
                              ? 'bg-stone-100 text-stone-500 hover:bg-stone-200 shadow-none'
                              : 'bg-[#1B7A4E] text-white hover:bg-[#0B462C]'
                          }`}
                        >
                          {isCompleted ? 'Marcar como Pendiente' : 'Completar Tarea'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de que quieres eliminar esta tarea? Esto no se puede deshacer.')) {
                            onDelete(task.id);
                          }
                        }}
                        className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all active:scale-95"
                      >
                        Eliminar Tarea
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="px-6 py-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-stone-455 uppercase tracking-widest flex items-center gap-2">
                      Notas de Ejecución
                    </h4>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-[10px] font-black text-[#1B7A4E] hover:text-[#0B462C] uppercase tracking-wider flex items-center gap-1"
                      >
                        ✎ Editar Notas
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        className="w-full text-sm text-stone-600 font-medium bg-white border border-[#E6E1D6] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#1B7A4E]/30 resize-none shadow-sm"
                        placeholder="Escribe tus notas, reflexiones o detalles sobre la ejecución de esta actividad..."
                        rows={8}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#1B7A4E] hover:bg-[#0B462C] transition-all shadow-md active:scale-95"
                        >
                          Guardar Notas
                        </button>
                        <button
                          onClick={() => {
                            setEditNotes(task.notes || '');
                            setEditTitle(task.title);
                            setIsEditing(false);
                          }}
                          className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-stone-500 bg-stone-100 hover:bg-stone-200 transition-all active:scale-95"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : task.notes ? (
                    <div className="bg-white p-5 rounded-[24px] border border-[#E6E1D6] shadow-xs">
                      <p className="text-sm text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                        {task.notes}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white rounded-[24px] border border-dashed border-[#E6E1D6] flex flex-col items-center gap-2">
                      <span className="text-2xl">📝</span>
                      <p className="text-xs text-stone-400 font-bold">No hay notas escritas aún.</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="mt-1 text-[10px] font-black uppercase tracking-wider text-[#1B7A4E] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all border border-[#1B7A4E]/10"
                      >
                        + Agregar Notas
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'coach' && (
                <div className="h-full w-full relative min-h-[50dvh] bg-white">
                  <div className="absolute inset-0">
                    {chatOpenTaskId ? (() => {
                      const openTask = task.tasks?.find((t: any) => t.id === chatOpenTaskId);
                      if (!openTask) return null;
                      return (
                        <TaskCoachChat 
                          taskId={openTask.id}
                          taskTitle={openTask.title} 
                          taskDescription={openTask.description} 
                          notes={openTask.notes}
                          subtasks={[]}
                          goalTitle={task.goalTitle}
                          goalId={task.goalId}
                          onCloseMobile={onClose}
                          fullHeight
                        />
                      );
                    })() : (
                      <TaskCoachChat 
                        taskId={task.id}
                        taskTitle={task.title} 
                        taskDescription={task.description} 
                        notes={task.notes}
                        subtasks={task.tasks}
                        goalTitle={task.goalTitle}
                        goalId={task.goalId}
                        onCloseMobile={onClose}
                        fullHeight
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
