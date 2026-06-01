'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Leaf } from './types';
import { TaskCoachChat } from './TaskCoachChat';
import { MessageSquare, X, AlignLeft } from 'lucide-react';

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

  // Tab & Bottom Sheet states
  const [activeTab, setActiveTab] = useState<'details' | 'coach'>('details');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // If a chat is opened for a specific task, automatically switch to coach tab on mobile
    if (chatOpenTaskId) {
      setActiveTab('coach');
    }
  }, [chatOpenTaskId]);

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

      {/* Modal Container */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 && !isExpanded) onClose();
          else if (info.offset.y > 150 && isExpanded) setIsExpanded(false);
          else if (info.offset.y < -50 && !isExpanded) setIsExpanded(true);
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0, height: isExpanded ? '100dvh' : '85dvh' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.8 }}
        className={`relative w-full md:max-w-5xl md:h-[80vh] bg-stone-50 overflow-hidden shadow-2xl flex flex-col md:flex-row md:!h-[80vh] md:!rounded-[40px] md:!translate-y-0 ${isExpanded ? 'rounded-none' : 'rounded-t-[32px]'}`}
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

        {/* Left Side (Details) */}
        <div 
          className={`flex-1 overflow-y-auto relative min-h-0 ${activeTab === 'details' ? 'block' : 'hidden md:block'} md:flex md:flex-col border-r border-stone-200/50`}
          onPointerDown={(e) => e.stopPropagation()}
          onScroll={(e) => {
            if (!isExpanded && e.currentTarget.scrollTop > 5) {
              setIsExpanded(true);
            }
          }}
        >
          <div className="flex-1 px-5 md:px-10 pt-5 md:pt-10 pb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    action.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {action.completed ? 'Completado' : 'Pendiente'}
                  </span>
                  {action.targetDate && (
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      Para el {formatDate(action.targetDate)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-none">
                  {action.name}
                </h2>
              </div>
              <button onClick={onClose} className="hidden md:flex p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors shrink-0">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {action.description && (
              <div className="mb-6 bg-stone-50 p-5 rounded-[24px] border border-stone-100 shadow-sm">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Descripción</h4>
                <p className="text-sm text-stone-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {action.description}
                </p>
              </div>
            )}

            {action.tasks && action.tasks.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Pasos / Tareas</h4>
                <div className="space-y-2">
                  {action.tasks.map((task: any) => (
                    <div key={task.id} className="border border-stone-100 rounded-2xl overflow-hidden bg-stone-50/50 transition-all">
                      <div 
                        className="flex items-center p-3 cursor-pointer hover:bg-white transition-colors"
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                      >
                        <div 
                          className="mr-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask?.(task.id, !task.isCompleted);
                          }}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-stone-300'}`}>
                            {task.isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                        </div>
                        <span className={`text-sm font-bold flex-1 ${task.isCompleted ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                          {task.title}
                        </span>
                        <div className="text-stone-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                      
                      {expandedTaskId === task.id && task.description && (
                        <div className="px-11 pb-4 pt-1">
                          <p className="text-xs text-stone-500 font-medium leading-relaxed">
                            {task.description}
                          </p>
                          {(task.startDate || task.endDate || task.estimatedHours) && (
                            <div className="flex flex-wrap gap-3 mt-3">
                              {task.estimatedHours && (
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                  {task.estimatedHours}h est.
                                </span>
                              )}
                              {task.endDate && (
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                  Fin: {formatDate(task.endDate)}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatOpenTaskId(chatOpenTaskId === task.id ? null : task.id);
                            }}
                            className={`mt-4 text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors active:scale-95 shadow-sm ${
                              chatOpenTaskId === task.id 
                                ? 'bg-stone-200 text-stone-600' 
                                : 'text-violet-600 bg-violet-100 hover:bg-violet-200'
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
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Dimensiones impactadas</h4>
                <div className="flex flex-wrap gap-2">
                  {action.dimensions.map(dim => (
                    <span key={dim} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                      {dim}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {action.attributes && action.attributes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Atributos relacionados</h4>
                <div className="flex flex-wrap gap-2">
                  {action.attributes.map(attr => (
                    <span key={attr} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Actions Bottom Bar */}
          <div className="shrink-0 p-5 md:px-10 md:py-6 border-t border-stone-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-6">
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => onToggle(action.id, { completed: !action.completed })}
                className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                  action.completed 
                    ? 'bg-stone-100 text-stone-500 hover:bg-stone-200 shadow-none' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200/50'
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
                className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all active:scale-95"
              >
                Eliminar Actividad
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (Coach Chat) */}
        <div className={`w-full md:w-[400px] xl:w-[450px] bg-stone-50 flex flex-col relative min-h-0 flex-1 md:flex-none md:shrink-0 ${activeTab === 'coach' ? 'flex' : 'hidden md:flex'}`}>
          <div className="hidden md:flex shrink-0 px-5 py-4 border-b border-stone-150 items-center justify-between bg-stone-100/50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="text-xs font-black text-stone-800 tracking-wider uppercase">Coach Asistente</span>
            </div>
          </div>
          
          <div 
            className="flex-1 overflow-hidden relative min-h-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex flex-col">
              {chatOpenTaskId ? (() => {
                const openTask = action.tasks?.find(t => t.id === chatOpenTaskId);
                if (!openTask) return null;
                return (
                  <TaskCoachChat 
                    taskId={openTask.id}
                    taskTitle={openTask.title} 
                    taskDescription={openTask.description} 
                    fullHeight
                  />
                );
              })() : (
                <TaskCoachChat 
                  taskId={action.id}
                  taskTitle={action.title} 
                  taskDescription={action.description || 'Sin descripción'} 
                  fullHeight
                />
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
