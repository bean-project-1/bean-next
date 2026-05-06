'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Rocket, Lightbulb, Dumbbell, Globe, Target, Trash2 } from 'lucide-react';

interface NodeSidePanelProps {
  node: any; // Can be dimension or branch/goal
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const NodeSidePanel = ({ node, onClose, onDelete }: NodeSidePanelProps) => {
  if (!node) return null;

  const getIcon = () => {
    // If it's a branch/goal
    if (node.goal) return <Target />;
    
    // If it's a dimension
    switch (node.id || node.key) {
      case 'career': return <Rocket />;
      case 'physical_health': return <Dumbbell />;
      case 'impact': return <Globe />;
      default: return <Lightbulb />;
    }
  };

  const title = node.goal || node.label || node.data?.label || 'Detail';
  const description = node.description || node.data?.description;
  const isGoal = !!node.goal;

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="w-[350px] h-full bg-white border-l border-gray-100 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] flex flex-col z-50 overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 text-white rounded-lg">
                {getIcon()}
              </div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{title}</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 group"
            >
              <X size={20} className="group-hover:text-gray-900" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Descripción</h4>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {description || `Explora tu trayectoria en ${title}. Esta dimensión cubre el crecimiento e impacto que has tenido en tu camino.`}
              </p>
            </section>

            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recommended Actions</h4>
              <div className="space-y-3">
                {[
                  { label: "Reflect on latest progress", icon: BookOpen },
                  { label: "Set next milestone", icon: Target },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all text-sm font-semibold text-gray-700">
                    <action.icon size={16} className="text-gray-500" />
                    {action.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Learning Resources</h4>
              <div className="space-y-3">
                {[
                  "Mastery by Robert Greene",
                  "Atomic Habits Guide"
                ].map((resource, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {resource}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-auto p-6 space-y-3 border-t border-gray-50">
            {isGoal && onDelete && (
              <button 
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
                    onDelete(node.id);
                  }
                }}
                className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Eliminar Meta
              </button>
            )}
            <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-colors">
              {isGoal ? 'Ver Progreso' : 'Ver Dimensión'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NodeSidePanel;
