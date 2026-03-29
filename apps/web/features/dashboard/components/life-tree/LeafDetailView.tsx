'use client';

import React from 'react';
import { Leaf } from './types';

interface Props {
  action: Leaf;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, data: { completed?: boolean; targetDate?: string; dimensions?: string[] }) => void;
}

export function LeafDetailView({ action, onClose, onDelete, onToggle }: Props) {
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-start mb-8">
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {action.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

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
  );
}
