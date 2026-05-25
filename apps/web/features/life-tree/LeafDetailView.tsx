'use client';

import React, { useState } from 'react';
import { Leaf } from './types';
import { TaskCoachChat } from './TaskCoachChat';

interface Props {
  action: Leaf;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, data: { completed?: boolean; targetDate?: string; dimensions?: string[] }) => void;
  onToggleTask?: (taskId: string, isCompleted: boolean) => void;
}

export function LeafDetailView({ action, onClose, onDelete, onToggle, onToggleTask }: Props) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [chatOpenTaskId, setChatOpenTaskId] = useState<string | null>(null);

  React.useEffect(() => {
    console.log('LeafDetailView mounted for action:', action.id);
  }, [action.id]);

  if (!action) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}>
      <div className="w-full h-full sm:h-[90vh] sm:max-w-5xl flex flex-col lg:flex-row bg-white sm:rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        onClick={e => e.stopPropagation()}>
        
        {/* Left Column (Main Detail) */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden ${chatOpenTaskId ? 'hidden lg:flex' : 'flex'}`}>
          {/* Sticky Header */}
          <div className="shrink-0 px-6 sm:px-10 pt-6 sm:pt-10 pb-4 sm:pb-6 border-b border-slate-50/50">
          <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                action.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {action.completed ? 'Completado' : 'Pendiente'}
              </span>
              {action.targetDate && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Para el {formatDate(action.targetDate)}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
              {action.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 bg-slate-50/30">
          {action.description && (
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {action.description}
            </p>
          </div>
        )}

        {action.tasks && action.tasks.length > 0 && (
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pasos / Tareas</h4>
            <div className="space-y-2">
              {action.tasks.map((task: any) => (
                <div key={task.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 transition-all">
                  <div 
                    className="flex items-center p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                  >
                    <div 
                      className="mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask?.(task.id, !task.isCompleted);
                      }}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                        {task.isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                    </div>
                    <span className={`text-sm font-semibold flex-1 ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                    <div className="text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  
                  {expandedTaskId === task.id && task.description && (
                    <div className="px-11 pb-4 pt-1">
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {task.description}
                      </p>
                      {(task.startDate || task.endDate || task.estimatedHours) && (
                        <div className="flex flex-wrap gap-3 mt-3">
                          {task.estimatedHours && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              {task.estimatedHours}h est.
                            </span>
                          )}
                          {task.endDate && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              Fin: {formatDate(task.endDate)}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Chat Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatOpenTaskId(chatOpenTaskId === task.id ? null : task.id);
                        }}
                        className={`mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                          chatOpenTaskId === task.id 
                            ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        🤖 {chatOpenTaskId === task.id ? 'Cerrar Chat' : 'Consultar con el Coach'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {action.dimensions && action.dimensions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Dimensiones impactadas</h4>
            <div className="flex flex-wrap gap-2">
              {action.dimensions.map(dim => (
                <span key={dim} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold border border-emerald-100">
                  {dim}
                </span>
              ))}
            </div>
          </div>
        )}

        {action.attributes && action.attributes.length > 0 && (
          <div className="mb-10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Atributos relacionados</h4>
            <div className="flex flex-wrap gap-2">
              {action.attributes.map(attr => (
                <span key={attr} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold border border-indigo-100">
                  {attr}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => onToggle(action.id, { completed: !action.completed })}
            className={`w-full py-5 rounded-[24px] text-sm font-bold transition-all shadow-lg ${
              action.completed 
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-slate-100' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'
            }`}
          >
            {action.completed ? 'Marcar como Pendiente' : 'Completar Actividad'}
          </button>
          
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
                onDelete(action.id);
              }
            }}
            className="w-full py-5 rounded-[24px] text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            Eliminar Actividad
          </button>
        </div>
        </div>
        </div>

        {/* Right Column (AI Coach Panel) */}
        <div className={`lg:w-[400px] xl:w-[450px] border-l border-slate-100 bg-slate-50 flex-col ${!chatOpenTaskId ? 'hidden' : 'flex flex-1 lg:flex-none'}`}>
          {chatOpenTaskId ? (() => {
            const openTask = action.tasks?.find(t => t.id === chatOpenTaskId);
            if (!openTask) return null;
            return (
              <TaskCoachChat 
                taskId={openTask.id}
                taskTitle={openTask.title} 
                taskDescription={openTask.description} 
                onCloseMobile={() => setChatOpenTaskId(null)}
              />
            );
          })() : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <span className="text-4xl mb-4 opacity-50">🤖</span>
              <p className="text-sm font-medium">Selecciona una tarea para iniciar el coach paso a paso.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
