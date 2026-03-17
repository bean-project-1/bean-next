'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, CheckCircle2, ChevronRight } from 'lucide-react';

const PATH_STEPS = [
  { id: 1, label: 'Definir Valores Core', status: 'completed' },
  { id: 2, label: 'Hábitos Atómicos', status: 'completed' },
  { id: 3, label: 'Aprender Python', status: 'completed' },
  { id: 4, label: 'Proyecto Portfolio', status: 'current' },
  { id: 5, label: 'Certificación AI', status: 'future' },
  { id: 6, label: 'Lanzar Startup', status: 'future' },
];

export default function MyPathPage() {
  return (
    <div className="min-h-screen bg-white p-8 sm:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 tracking-tight">Mi <span className="font-semibold text-green-600">Camino</span></h1>
        <p className="text-gray-500 mt-2">Secuencia de actividades para alimentar tu crecimiento.</p>
      </header>

      <div className="max-w-3xl mx-auto space-y-6 relative ml-12 border-l-2 border-gray-50 pl-12">
        {PATH_STEPS.map((step, idx) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative flex items-center p-6 rounded-3xl border transition-all ${
              step.status === 'completed' 
                ? 'bg-green-50/30 border-green-100 text-green-900' 
                : step.status === 'current'
                  ? 'bg-white border-blue-200 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20'
                  : 'bg-white border-gray-50 text-gray-400 opacity-60'
            }`}
          >
            {/* Step marker */}
            <div className={`absolute -left-[57px] w-10 h-10 rounded-full border-4 border-white flex items-center justify-center transition-all ${
              step.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step.status === 'completed' ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{step.id}</span>}
            </div>

            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">Paso {step.id}</span>
              <h3 className="text-lg font-semibold tracking-tight">{step.label}</h3>
            </div>

            <div className="p-3 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={18} />
            </div>

            {/* Sprout visual indicator */}
            {step.status === 'current' && (
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg border border-blue-50 text-green-500">
                <Sprout size={24} className="animate-pulse" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
