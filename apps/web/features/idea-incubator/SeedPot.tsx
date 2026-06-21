import React, { useState } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { Seed, IdeaCloud, SeedDocument } from '../../hooks/useIncubator';
import { Plus, MessageSquareText } from 'lucide-react';

interface SeedPotProps {
  seed: Seed;
  onDropCloudToChat: (cloud: IdeaCloud) => void;
  onAddCloud: (text: string) => void;
  onPlant: () => void;
  onAskAI: (topic: string) => void;
}

export function SeedPot({ seed, onDropCloudToChat, onAddCloud, onPlant, onAskAI }: SeedPotProps) {
  const [newCloudText, setNewCloudText] = useState('');
  const [isAddingCloud, setIsAddingCloud] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Growth calculation based on scores
  const totalScore = (seed.scores.sun + seed.scores.earth + seed.scores.water) / 3; // 0 to 100
  
  // Visual factors
  const leafColor = totalScore > 80 ? '#10B981' : totalScore > 40 ? '#34D399' : '#A7F3D0';

  const handleDragEnd = (cloud: IdeaCloud, event: any, info: PanInfo) => {
    // If dragged to the right side significantly, assume dropped to chat
    if (info.offset.x > 150) {
      onDropCloudToChat(cloud);
    }
  };

  const handleAddCloudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCloudText.trim()) {
      onAddCloud(newCloudText.trim());
      setNewCloudText('');
      setIsAddingCloud(false);
    }
  };

  const doc = seed.proposal as SeedDocument | undefined;
  
  const isFilled = (field?: string) => field && field.trim().length > 10;

  const getMissingForPillar = (pillar: 'sun' | 'earth' | 'water') => {
    const missing = [];
    if (pillar === 'sun') {
      if (!isFilled(doc?.executiveSummary)) missing.push({ id: 'executiveSummary', label: 'Resumen Ejecutivo y Tesis' });
      if (!isFilled(doc?.problemAnatomy)) missing.push({ id: 'problemAnatomy', label: 'Anatomía del Problema' });
    } else if (pillar === 'earth') {
      if (!isFilled(doc?.solutionArchitecture)) missing.push({ id: 'solutionArchitecture', label: 'Arquitectura de la Solución' });
      if (!isFilled(doc?.technicalViability)) missing.push({ id: 'technicalViability', label: 'Viabilidad Técnica' });
    } else if (pillar === 'water') {
      if (!isFilled(doc?.sustainability)) missing.push({ id: 'sustainability', label: 'Modelo de Negocio' });
      if (!isFilled(doc?.riskMatrix)) missing.push({ id: 'riskMatrix', label: 'Matriz de Riesgos (Pre-mortem)' });
    }
    return missing;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#FAFAFA] overflow-hidden lg:rounded-l-[2rem]">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#10B981_0%,_transparent_60%)]" />

      {/* Floating Idea Clouds */}
      {seed.clouds?.map((cloud, index) => (
        <motion.div
          key={cloud.id}
          drag
          dragConstraints={{ left: -200, right: 300, top: -200, bottom: 200 }}
          onDragEnd={(e, info) => handleDragEnd(cloud, e, info)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, x: cloud.x || 0, y: cloud.y || 0 }}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
          className="absolute z-10 cursor-grab bg-white border border-stone-200 shadow-md rounded-2xl px-4 py-3 max-w-[180px] text-center group"
          style={{
            left: `calc(50% + ${Math.sin(index) * 120}px)`,
            top: `calc(20% + ${Math.cos(index) * 100}px)`,
          }}
        >
          <p className="text-sm text-stone-700 font-medium">{cloud.text}</p>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-stone-400 font-bold tracking-wider whitespace-nowrap pointer-events-none">
            Arrastra al chat →
          </div>
        </motion.div>
      ))}

      {/* Add Cloud Button */}
      <div className="absolute bottom-6 left-6 z-20">
        <button
          onClick={() => setIsAddingCloud(true)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-stone-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-sm font-bold text-stone-600"
        >
          <Plus className="w-4 h-4" />
          Añadir Nube
        </button>
      </div>

      {/* Add Cloud Bottom Sheet */}
      <AnimatePresence>
        {isAddingCloud && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 lg:bg-white/60 backdrop-blur-sm z-[100] flex flex-col justify-end lg:justify-center lg:p-6"
            onClick={() => setIsAddingCloud(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[2rem] lg:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-2xl border-t lg:border border-stone-200 w-full lg:max-w-md mx-auto p-6 pt-8 pb-10 lg:pb-6 relative flex flex-col"
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full lg:hidden" />
              <h3 className="text-xl font-bold text-stone-800 mb-4">Nueva Nube de Idea</h3>
              <form onSubmit={handleAddCloudSubmit} className="flex flex-col gap-4">
                <textarea
                  autoFocus
                  value={newCloudText}
                  onChange={(e) => setNewCloudText(e.target.value)}
                  placeholder="Escribe un concepto, característica o pregunta..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-2xl p-4 text-[15px] outline-none resize-none min-h-[120px]"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setIsAddingCloud(false)} className="px-5 py-2.5 text-stone-500 font-bold hover:bg-stone-100 rounded-full transition-colors">Cancelar</button>
                  <button type="submit" disabled={!newCloudText.trim()} className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-full disabled:opacity-50 disabled:bg-stone-300 transition-colors">Añadir</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Pot and Plant Visualization */}
      <div 
        className="relative z-0 mt-0 lg:mt-16 flex flex-col items-center cursor-pointer group"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap z-50 pointer-events-none">
          Clic para ver detalles y progreso
        </div>

        {/* Plant System */}
        <div className="relative flex flex-col items-center justify-end h-48 pb-1 z-20">
          <motion.div 
            initial={false}
            animate={{ scale: seed.status === 'ready' ? 1 : 0, y: seed.status === 'ready' ? 0 : 20 }}
            className="z-30 mb-[-12px] pointer-events-auto"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onPlant(); }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-[13px] font-bold shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all flex items-center gap-2 border-2 border-white/20 whitespace-nowrap"
            >
              ✨ Plantar al Árbol
            </button>
          </motion.div>

          <div className="relative flex flex-col items-center justify-end pointer-events-none">
            <motion.div 
              initial={{ height: 10 }}
              animate={{ height: Math.max(10, totalScore * 1.5) }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="w-3.5 bg-emerald-600 rounded-t-full shadow-inner"
            />
            
            <motion.div 
              initial={false}
              animate={{ scale: seed.scores.sun >= 30 ? 1 : 0 }}
              className="absolute bottom-6 -right-8 origin-bottom-left"
            >
              <div className="w-10 h-6 rounded-tr-full rounded-bl-full rotate-12" style={{ backgroundColor: leafColor }} />
            </motion.div>
            
            <motion.div 
              initial={false}
              animate={{ scale: seed.scores.earth >= 30 ? 1 : 0 }}
              className="absolute bottom-16 -left-8 origin-bottom-right"
            >
              <div className="w-10 h-6 rounded-tl-full rounded-br-full -rotate-12" style={{ backgroundColor: leafColor }} />
            </motion.div>

            <motion.div 
              initial={false}
              animate={{ scale: seed.scores.water >= 30 ? 1 : 0 }}
              className="absolute bottom-24 -right-6 origin-bottom-left"
            >
              <div className="w-8 h-5 rounded-tr-full rounded-bl-full rotate-[30deg]" style={{ backgroundColor: leafColor }} />
            </motion.div>
          </div>
        </div>

        {/* The Pot */}
        <div className="relative w-40 h-32 mt-[-10px] z-10 transition-transform group-hover:scale-105 pointer-events-none">
          <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="15" rx="70" ry="10" fill="#B45309" />
            <ellipse cx="80" cy="15" rx="60" ry="8" fill="#451A03" />
            <path d="M10,15 L30,110 Q80,130 130,110 L150,15 Z" fill="#D97706" />
            <path d="M5,15 Q80,35 155,15 L150,25 Q80,45 10,25 Z" fill="#F59E0B" />
          </svg>

          {/* Indicators on the pot */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 pt-6 pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-200 font-black mb-0.5">{seed.scores.sun}%</span>
              <div className="w-6 h-6 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-300 text-xs shadow-inner">☀️</div>
            </div>
            <div className="flex flex-col items-center translate-y-3">
              <span className="text-[10px] text-emerald-200 font-black mb-0.5">{seed.scores.earth}%</span>
              <div className="w-6 h-6 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-300 text-xs shadow-inner">🌍</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-blue-200 font-black mb-0.5">{seed.scores.water}%</span>
              <div className="w-6 h-6 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-300 text-xs shadow-inner">💧</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal/Bottom Sheet */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 lg:bg-white/60 backdrop-blur-sm z-[100] flex flex-col justify-end lg:justify-center lg:p-6"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[2rem] lg:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-2xl border-t lg:border border-stone-200 w-full lg:max-w-md mx-auto p-6 pt-8 pb-10 lg:pb-6 relative flex flex-col"
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full lg:hidden" />
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full w-8 h-8 flex items-center justify-center hidden lg:flex"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">🌱</span> Estado de tu Idea
              </h3>
              
              <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
                {/* Deseable */}
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg shrink-0">☀️</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-stone-800 text-sm">Deseable</h4>
                        <span className="text-amber-600 font-bold">{seed.scores.sun}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${seed.scores.sun}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="pl-11">
                    {seed.scores.sunFeedback ? (
                      <div className="space-y-3 mt-3">
                        <p className="text-xs text-amber-800 leading-relaxed font-medium bg-white/60 p-3 rounded-xl border border-amber-100/50">
                          {seed.scores.sunFeedback}
                        </p>
                        {seed.scores.sunQuestions && seed.scores.sunQuestions.length > 0 && (
                          <div className="space-y-1 mt-2">
                            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Preguntas para mejorar:</p>
                            {seed.scores.sunQuestions.map((q, i) => (
                              <div key={i} className="flex gap-2 text-xs text-stone-600 bg-white/40 p-2 rounded-lg border border-amber-100/30">
                                <span className="text-amber-500 font-bold">•</span> {q}
                              </div>
                            ))}
                          </div>
                        )}
                        {seed.scores.sun < 100 && (
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={() => { 
                                const sunQuestionsStr = seed.scores.sunQuestions && seed.scores.sunQuestions.length > 0 ? ` Además, me sugirió responder estas preguntas para mejorar mi puntaje: ${seed.scores.sunQuestions.join(' ')}` : '';
                                onAskAI(`Actúa como mi consultor experto y ayúdame a mejorar el pilar Deseable (Problema y Audiencia). Esta fue la crítica del auditor: ${seed.scores.sunFeedback}.${sunQuestionsStr}`); 
                                setShowInfo(false); 
                              }}
                              className="text-amber-600 bg-amber-100 hover:bg-amber-200 px-4 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <MessageSquareText className="w-3.5 h-3.5" /> Consultar IA
                            </button>
                          </div>
                        )}
                      </div>
                    ) : getMissingForPillar('sun').length > 0 ? (
                      <div className="space-y-2 mt-3">
                        <p className="text-xs font-medium text-amber-700">Falta completar:</p>
                        {getMissingForPillar('sun').map(m => (
                          <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/60 p-2 rounded-xl text-xs">
                            <span className="text-stone-600 font-medium">{m.label}</span>
                            <button 
                              onClick={() => { onAskAI(`Por favor, ayúdame a definir: ${m.label}`); setShowInfo(false); }}
                              className="text-amber-600 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <MessageSquareText className="w-3 h-3" /> Consultar IA
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 mt-2 font-medium">✅ Tesis y problema definidos.</p>
                    )}
                  </div>
                </div>

                {/* Factible */}
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0">🌍</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-stone-800 text-sm">Factible</h4>
                        <span className="text-emerald-600 font-bold">{seed.scores.earth}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${seed.scores.earth}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="pl-11">
                    {seed.scores.earthFeedback ? (
                      <div className="space-y-3 mt-3">
                        <p className="text-xs text-emerald-800 leading-relaxed font-medium bg-white/60 p-3 rounded-xl border border-emerald-100/50">
                          {seed.scores.earthFeedback}
                        </p>
                        {seed.scores.earthQuestions && seed.scores.earthQuestions.length > 0 && (
                          <div className="space-y-1 mt-2">
                            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Preguntas para mejorar:</p>
                            {seed.scores.earthQuestions.map((q, i) => (
                              <div key={i} className="flex gap-2 text-xs text-stone-600 bg-white/40 p-2 rounded-lg border border-emerald-100/30">
                                <span className="text-emerald-500 font-bold">•</span> {q}
                              </div>
                            ))}
                          </div>
                        )}
                        {seed.scores.earth < 100 && (
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={() => { 
                                const earthQuestionsStr = seed.scores.earthQuestions && seed.scores.earthQuestions.length > 0 ? ` Además, me sugirió responder estas preguntas para mejorar mi puntaje: ${seed.scores.earthQuestions.join(' ')}` : '';
                                onAskAI(`Actúa como mi CTO/Arquitecto y ayúdame a mejorar el pilar Factible (Solución y Tecnología). Esta fue la crítica del auditor: ${seed.scores.earthFeedback}.${earthQuestionsStr}`); 
                                setShowInfo(false); 
                              }}
                              className="text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <MessageSquareText className="w-3.5 h-3.5" /> Consultar IA
                            </button>
                          </div>
                        )}
                      </div>
                    ) : getMissingForPillar('earth').length > 0 ? (
                      <div className="space-y-2 mt-3">
                        <p className="text-xs font-medium text-emerald-700">Falta completar:</p>
                        {getMissingForPillar('earth').map(m => (
                          <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/60 p-2 rounded-xl text-xs">
                            <span className="text-stone-600 font-medium">{m.label}</span>
                            <button 
                              onClick={() => { onAskAI(`Por favor, ayúdame a definir: ${m.label}`); setShowInfo(false); }}
                              className="text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-full font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <MessageSquareText className="w-3 h-3" /> Consultar IA
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-700 mt-2 font-medium">✅ Arquitectura y viabilidad técnica definidas.</p>
                    )}
                  </div>
                </div>

                {/* Viable */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg shrink-0">💧</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-stone-800 text-sm">Viable</h4>
                        <span className="text-blue-600 font-bold">{seed.scores.water}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-blue-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${seed.scores.water}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="pl-11">
                    {seed.scores.waterFeedback ? (
                      <div className="space-y-3 mt-3">
                        <p className="text-xs text-blue-800 leading-relaxed font-medium bg-white/60 p-3 rounded-xl border border-blue-100/50">
                          {seed.scores.waterFeedback}
                        </p>
                        {seed.scores.waterQuestions && seed.scores.waterQuestions.length > 0 && (
                          <div className="space-y-1 mt-2">
                            <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Preguntas para mejorar:</p>
                            {seed.scores.waterQuestions.map((q, i) => (
                              <div key={i} className="flex gap-2 text-xs text-stone-600 bg-white/40 p-2 rounded-lg border border-blue-100/30">
                                <span className="text-blue-500 font-bold">•</span> {q}
                              </div>
                            ))}
                          </div>
                        )}
                        {seed.scores.water < 100 && (
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={() => { 
                                const waterQuestionsStr = seed.scores.waterQuestions && seed.scores.waterQuestions.length > 0 ? ` Además, me sugirió responder estas preguntas para mejorar mi puntaje: ${seed.scores.waterQuestions.join(' ')}` : '';
                                onAskAI(`Actúa como mi CFO/Socio Estratégico y ayúdame a mejorar el pilar Viable (Negocio y Riesgos). Esta fue la crítica del auditor: ${seed.scores.waterFeedback}.${waterQuestionsStr}`); 
                                setShowInfo(false); 
                              }}
                              className="text-blue-600 bg-blue-100 hover:bg-blue-200 px-4 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <MessageSquareText className="w-3.5 h-3.5" /> Consultar IA
                            </button>
                          </div>
                        )}
                      </div>
                    ) : getMissingForPillar('water').length > 0 ? (
                      <div className="space-y-2 mt-3">
                        <p className="text-xs font-medium text-blue-700">Falta completar:</p>
                        {getMissingForPillar('water').map(m => (
                          <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/60 p-2 rounded-xl text-xs">
                            <span className="text-stone-600 font-medium">{m.label}</span>
                            <button 
                              onClick={() => { onAskAI(`Actúa como el Abogado del Diablo y ayúdame a definir: ${m.label}`); setShowInfo(false); }}
                              className="text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <MessageSquareText className="w-3 h-3" /> Consultar IA
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-blue-700 mt-2 font-medium">✅ Modelo de Negocio y riesgos definidos.</p>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
