'use client';

import React, { useState } from 'react';
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
                  {isManuallyCreated && !isEditing && (
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
            {isEditing ? (
              <div className="mb-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</h4>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full text-sm text-slate-600 font-medium bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="Añade una descripción..."
                  rows={4}
                />
              </div>
            ) : task.description ? (
              <div className="mb-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
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
