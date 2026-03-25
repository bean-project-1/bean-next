'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function MyFuturePage() {
  return (
    <div className="min-h-screen bg-white relative flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100 mb-8">
          <Sparkles size={14} /> VISUALIZACIÓN 2027
        </span>
        
        <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-6">
          Tu <span className="font-semibold text-gray-900 italic">Árbol del Futuro</span>
        </h1>
        
        <p className="text-lg text-gray-500 leading-relaxed mb-12">
          Esta es la representación de tu vida al completar tus objetivos actuales.
          Un árbol frondoso que refleja la estabilidad financiera, el impacto social y el bienestar físico alcanzado.
        </p>

        {/* Future Tree Placeholder Visual */}
        <div className="relative w-80 h-80 mx-auto mb-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl">🌳</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all group">
          Explorar Trayectoria Directa <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
