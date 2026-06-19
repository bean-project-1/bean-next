'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sprout, ChevronRight } from 'lucide-react';
import { useIncubator } from '../../hooks/useIncubator';
import { SeedbedChat } from './SeedbedChat';

export function SeedbedDashboard() {
  const { seeds, createSeed, deleteSeed } = useIncubator();
  const [activeSeedId, setActiveSeedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newIdea, setNewIdea] = useState('');

  if (activeSeedId) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-3 pt-24 pb-32 sm:p-8 sm:pt-24 sm:pb-28">
        <div className="w-full h-full max-w-7xl bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col">
          <SeedbedChat 
            seedId={activeSeedId} 
            onBack={() => setActiveSeedId(null)} 
            onPlanted={() => setActiveSeedId(null)} 
          />
        </div>
      </div>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    const id = await createSeed(newIdea.trim());
    setNewIdea('');
    setIsCreating(false);
    setActiveSeedId(id);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-3 pt-24 pb-32 sm:p-8 sm:pt-24 sm:pb-28">
      <div className="w-full h-full max-w-7xl bg-[#FAFAFA] rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 pt-8 sm:pt-12">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm mx-auto">
            🌱
          </div>
          <h2 className="text-3xl font-bold text-stone-800 mb-3 tracking-tight">Tu Semillero</h2>
          <p className="text-stone-500 max-w-lg mx-auto leading-relaxed">
            Un espacio seguro para explorar, rebotar y madurar tus ideas con la IA antes de plantarlas en tu Árbol.
          </p>
        </header>

        {isCreating ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm mb-8"
          >
            <h3 className="text-lg font-bold text-stone-800 mb-4">¿Qué tienes en mente?</h3>
            <form onSubmit={handleCreate}>
              <textarea
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="Escribe tu idea aquí, aunque sea un borrador..."
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all resize-none min-h-[120px] mb-4 text-[15px]"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 text-stone-500 font-medium hover:text-stone-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newIdea.trim()}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  Empezar a madurar
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="flex justify-center mb-10">
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Plantar nueva semilla
            </button>
          </div>
        )}

        {seeds.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4 px-2">Semillas en progreso</h3>
            <div className="grid gap-4">
              {seeds.map((seed) => (
                <motion.div
                  key={seed.id}
                  whileHover={{ y: -2 }}
                  className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                  onClick={() => setActiveSeedId(seed.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 shrink-0 flex items-end justify-center pb-2 bg-gradient-to-b from-stone-50 to-stone-100 rounded-xl border border-stone-100 overflow-hidden">
                      {/* Mini Pot SVG */}
                      <svg viewBox="0 0 160 120" className="w-10 h-8 absolute bottom-1" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="80" cy="15" rx="70" ry="10" fill="#B45309" />
                        <ellipse cx="80" cy="15" rx="60" ry="8" fill="#451A03" />
                        <path d="M10,15 L30,110 Q80,130 130,110 L150,15 Z" fill="#D97706" />
                        <path d="M5,15 Q80,35 155,15 L150,25 Q80,45 10,25 Z" fill="#F59E0B" />
                      </svg>
                      
                      {/* Mini Plant */}
                      <div className="absolute bottom-6 flex flex-col items-center">
                        {seed.scores.sun + seed.scores.earth + seed.scores.water > 50 && (
                          <div className="w-4 h-3 bg-emerald-400 rounded-full mb-[-2px] shadow-sm" />
                        )}
                        <div className="w-1 h-4 bg-emerald-600 rounded-full" />
                      </div>

                      {/* Ready Sparkles */}
                      {seed.status === 'ready' && (
                        <div className="absolute top-1 right-1">✨</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-[17px] mb-1 group-hover:text-emerald-700 transition-colors line-clamp-1">{seed.title}</h4>
                      <p className="text-stone-500 text-sm line-clamp-1 mb-3">{seed.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm" title="Deseable (Problema/Audiencia)">☀️</span>
                          <div className="w-8 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${seed.scores.sun}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm" title="Factible (Solución/Técnico)">🌍</span>
                          <div className="w-8 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${seed.scores.earth}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm" title="Viable (Recursos/Sostenibilidad)">💧</span>
                          <div className="w-8 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${seed.scores.water}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
      </div>
    </div>
  );
}
