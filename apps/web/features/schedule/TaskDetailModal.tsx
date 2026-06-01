'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduledEvent } from './ScheduleView';
import { TaskCoachChat } from '../life-tree/TaskCoachChat';

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}>
      <div className="w-full h-full sm:h-[90vh] sm:max-w-5xl flex flex-col lg:flex-row bg-white sm:rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto lg:overflow-hidden"
        onClick={e => e.stopPropagation()}>
        
        {/* Left Column (Main Detail) */}
        <div className="flex-none lg:flex-1 flex flex-col lg:h-full lg:overflow-hidden">
          {/* Sticky Header */}
          <div className="shrink-0 px-6 sm:px-10 pt-6 sm:pt-10 pb-4 sm:pb-6 border-b border-slate-50/50">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-3 mb-2">
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
                    <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold text-violet-500 hover:text-violet-700 uppercase tracking-widest flex items-center gap-1">
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
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 bg-slate-50/30 flex flex-col">
            
            {/* Metadata Grid */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {task.goalTitle && (
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    Meta / Proyecto
                  </span>
                  <span className="text-xs font-bold text-slate-700 leading-tight">{task.goalTitle}</span>
                </div>
              )}
              {task.type && (
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    Fase
                  </span>
                  <span className="text-xs font-bold text-slate-700 leading-tight capitalize">{task.type}</span>
                </div>
              )}
              {task.itemType && (
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    Tipo
                  </span>
                  <span className="text-xs font-bold text-slate-700 leading-tight capitalize">{task.itemType}</span>
                </div>
              )}
              {task.startDate && (
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Inicio
                  </span>
                  <span className="text-xs font-bold text-slate-700 leading-tight capitalize">{formatDateSafely(task.startDate)}</span>
                </div>
              )}
              {task.date && task.date !== task.startDate && (
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Fecha de Acción
                  </span>
                  <span className="text-xs font-bold text-slate-700 leading-tight capitalize">{formatDateSafely(task.date)}</span>
                </div>
              )}
              {(task.startTime || task.endTime) && (
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Horario
                  </span>
                  <span className="text-xs font-bold text-slate-700 leading-tight">
                    {task.startTime || '??'} - {task.endTime || '??'}
                  </span>
                </div>
              )}
            </div>

            {/* Tags (Dimensions & Attributes) */}
            {(task.dimensions?.length || task.attributes?.length) ? (
              <div className="mb-8 flex flex-wrap gap-2">
                {task.dimensions?.map(dim => (
                  <span key={dim} className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    ✦ {dim}
                  </span>
                ))}
                {task.attributes?.map(attr => (
                  <span key={attr} className="px-2 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    ✧ {attr}
                  </span>
                ))}
              </div>
            ) : null}

            {isEditing ? (
              <div className="mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                  Descripción
                </h4>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full text-sm text-slate-600 font-medium bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-400 resize-none shadow-sm"
                  placeholder="Añade una descripción de los pasos o notas relevantes..."
                  rows={5}
                />
              </div>
            ) : task.description ? (
              <div className="mb-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                  Descripción
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            ) : null}

            <div className="mt-auto pt-6">
              <div className="grid grid-cols-1 gap-4">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="w-full py-5 rounded-[24px] text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
                  >
                    Guardar Cambios
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onToggle(task.id, !isCompleted)}
                      className={`w-full py-5 rounded-[24px] text-sm font-bold transition-all shadow-lg ${
                        isCompleted 
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-slate-100' 
                          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'
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
                      className="w-full py-5 rounded-[24px] text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      Eliminar Tarea
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (AI Coach Panel) */}
        <div className="lg:w-[400px] xl:w-[450px] border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50 flex flex-col flex-none h-[600px] lg:h-auto lg:flex-none shrink-0">
          <TaskCoachChat 
            taskId={task.id}
            taskTitle={task.title} 
            taskDescription={task.description} 
            fullHeight
          />
        </div>
        
      </div>
    </div>
  );
}
