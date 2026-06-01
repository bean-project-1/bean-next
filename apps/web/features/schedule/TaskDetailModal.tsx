'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduledEvent } from './ScheduleView';
import { TaskCoachChat } from '../life-tree/TaskCoachChat';
import { MessageSquare, X, AlignLeft } from 'lucide-react';

interface Props {
  task: ScheduledEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isCompleted: boolean) => void;
  onUpdate?: (id: string, data: { title: string; description: string }) => void;
}

export function TaskDetailModal({ task, onClose, onDelete, onToggle, onUpdate }: Props) {
  const isCompleted = task.status === 'completed';
  const isManuallyCreated = task.type === 'daily';

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  // Tab & Bottom Sheet states
  const [activeTab, setActiveTab] = useState<'details' | 'coach'>('details');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => setMounted(true), []);

  const handleSave = () => {
    if (onUpdate && editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim(), description: editDescription.trim() });
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
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
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
        dragListener={false}
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
        animate={{ y: 0, height: isExpanded ? '100dvh' : '85dvh' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative w-full md:max-w-5xl md:h-[80vh] bg-stone-50 overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 md:!h-[80vh] md:!rounded-[40px] md:!translate-y-0 ${isExpanded ? 'rounded-none' : 'rounded-t-[32px]'}`}
      >
        
        {/* Mobile Drag Handle Indicator */}
        <div 
          className="w-full flex justify-center pt-3 pb-3 md:hidden bg-white shrink-0 cursor-grab active:cursor-grabbing touch-none border-b border-stone-100"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 bg-stone-200 rounded-full pointer-events-none" />
        </div>

        {/* Mobile Header with Tabs & Close */}
        <div className="flex md:hidden bg-white border-b border-stone-200 p-2 shrink-0 items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl flex-1">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'details' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              Detalles
            </button>
            <button 
              onClick={() => setActiveTab('coach')}
              className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'coach' ? 'bg-white text-violet-700 shadow-sm' : 'text-stone-400'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Coach
            </button>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl bg-stone-100 text-stone-500 shrink-0 active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left Side (Details): Hidden on mobile if 'coach' tab is active */}
        <div className={`flex-1 md:flex-1 bg-white border-b md:border-b-0 md:border-r border-stone-200/50 flex-col overflow-hidden ${activeTab === 'details' ? 'flex' : 'hidden md:flex'}`}>
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 md:px-10 pt-5 md:pt-10 pb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {isCompleted ? 'Completado' : 'Pendiente'}
                  </span>
                  {task.estimatedHours && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {task.estimatedHours}h est.
                    </span>
                  )}
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold text-violet-500 hover:text-violet-700 uppercase tracking-widest flex items-center gap-1 transition-colors">
                      ✎ Editar
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Título de la tarea"
                  />
                ) : (
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {task.title}
                  </h2>
                )}
              </div>
              <button onClick={onClose} className="hidden md:flex p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors shrink-0">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {task.goalTitle && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    Meta / Proyecto
                  </span>
                  <span className="text-xs font-bold text-stone-700 leading-tight">{task.goalTitle}</span>
                </div>
              )}
              {task.type && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    Fase
                  </span>
                  <span className="text-xs font-bold text-stone-700 leading-tight capitalize">{task.type}</span>
                </div>
              )}
              {task.itemType && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    Tipo
                  </span>
                  <span className="text-xs font-bold text-stone-700 leading-tight capitalize">{task.itemType}</span>
                </div>
              )}
              {task.startDate && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    Inicio
                  </span>
                  <span className="text-xs font-bold text-stone-700 leading-tight capitalize">{formatDateSafely(task.startDate)}</span>
                </div>
              )}
              {task.date && task.date !== task.startDate && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    Acción
                  </span>
                  <span className="text-xs font-bold text-stone-700 leading-tight capitalize">{formatDateSafely(task.date)}</span>
                </div>
              )}
              {(task.startTime || task.endTime) && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    Horario
                  </span>
                  <span className="text-xs font-bold text-stone-700 leading-tight">
                    {task.startTime || '??'} - {task.endTime || '??'}
                  </span>
                </div>
              )}
            </div>

            {/* Tags (Dimensions & Attributes) */}
            {(task.dimensions?.length || task.attributes?.length) ? (
              <div className="mb-8 flex flex-wrap gap-2">
                {task.dimensions?.map(dim => (
                  <span key={dim} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    ✦ {dim}
                  </span>
                ))}
                {task.attributes?.map(attr => (
                  <span key={attr} className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    ✧ {attr}
                  </span>
                ))}
              </div>
            ) : null}

            {isEditing ? (
              <div className="mb-6">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Descripción
                </h4>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full text-sm text-stone-600 font-medium bg-white border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-400 resize-none shadow-sm"
                  placeholder="Añade una descripción de los pasos o notas relevantes..."
                  rows={5}
                />
              </div>
            ) : task.description ? (
              <div className="mb-6 bg-stone-50 p-5 rounded-[24px] border border-stone-100 shadow-sm">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Descripción
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            ) : null}
          </div>

          {/* Fixed Actions Bottom Bar (Visible inside Details tab) */}
          <div className="shrink-0 p-5 md:px-10 md:py-6 border-t border-stone-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-6">
            <div className="grid grid-cols-1 gap-3">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-md active:scale-95"
                >
                  Guardar Cambios
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onToggle(task.id, !isCompleted)}
                    className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                      isCompleted 
                        ? 'bg-stone-100 text-stone-500 hover:bg-stone-200 shadow-none' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200/50'
                    }`}
                  >
                    {isCompleted ? 'Marcar como Pendiente' : 'Completar Tarea'}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres eliminar esta tarea? Esto no se puede deshacer.')) {
                        onDelete(task.id);
                      }
                    }}
                    className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all active:scale-95"
                  >
                    Eliminar Tarea
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side (Coach Chat): Hidden on mobile if 'details' tab is active */}
        <div className={`w-full md:w-[400px] xl:w-[450px] bg-stone-50 flex flex-col relative min-h-0 flex-1 md:flex-none md:shrink-0 ${activeTab === 'coach' ? 'flex' : 'hidden md:flex'}`}>
          <div className="hidden md:flex shrink-0 px-5 py-4 border-b border-stone-150 items-center justify-between bg-stone-100/50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="text-xs font-black text-stone-800 tracking-wider uppercase">Coach Asistente</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden relative min-h-0">
            <div className="absolute inset-0">
              <TaskCoachChat 
                taskId={task.id}
                taskTitle={task.title} 
                taskDescription={task.description} 
                fullHeight
              />
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
