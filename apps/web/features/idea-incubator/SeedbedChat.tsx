'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Sprout } from 'lucide-react';
import { Seed, useIncubator } from '../../hooks/useIncubator';
import { useLifeTree } from '../../hooks/useLifeTree';

interface SeedbedChatProps {
  seedId: string;
  onBack: () => void;
  onPlanted: () => void;
}

export function SeedbedChat({ seedId, onBack, onPlanted }: SeedbedChatProps) {
  const { getSeed, addMessage, updateScores, deleteSeed } = useIncubator();
  const { addGoal } = useLifeTree();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const seed = getSeed(seedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [seed?.messages]);

  if (!seed) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    addMessage(seed.id, 'user', userMsg);
    
    // Simulate AI thinking and responding
    setIsTyping(true);
    
    setTimeout(() => {
      // Simulate AI logic increasing scores
      const newSun = Math.min(100, seed.scores.sun + 25);
      const newEarth = seed.scores.sun >= 50 ? Math.min(100, seed.scores.earth + 20) : seed.scores.earth;
      const newWater = seed.scores.earth >= 50 ? Math.min(100, seed.scores.water + 15) : seed.scores.water;
      
      updateScores(seed.id, { sun: newSun, earth: newEarth, water: newWater });
      
      let aiResponse = '';
      if (newSun >= 80 && newEarth >= 80 && newWater >= 80) {
        aiResponse = '¡Excelente! Tenemos luz verde. ☀️🌍💧 Hay demanda, sabemos cómo construirlo y los recursos cuadran. ¿Plantamos esta idea en el Árbol?';
      } else if (newSun >= 80 && newEarth >= 80) {
        aiResponse = 'La ejecución técnica (🌍 Factible) la tenemos clara. Pero hablemos de Viabilidad (💧 Agua). ¿Qué modelo de negocio o qué recursos financieros/tiempo a largo plazo se necesitan para sostener esto?';
      } else if (newSun >= 80) {
        aiResponse = 'El problema está súper claro y es Deseable (☀️ Sol). Ahora pasemos a lo Factible (🌍 Tierra). ¿Qué tecnologías, equipo o primeros pasos lógicos necesitamos para construir el prototipo?';
      } else {
        aiResponse = 'Interesante. Para asegurar que es Deseable (☀️ Sol), cuéntame: ¿Quién sufre este problema exactamente y qué alternativas usan hoy en día?';
      }
      
      addMessage(seed.id, 'assistant', aiResponse);
      setIsTyping(false);
    }, 1500);
  };

  const handlePlant = async () => {
    if (!addGoal) return;
    
    // Plant in LifeTree
    const res = await addGoal({
      title: seed.title,
      description: seed.description,
      purpose: 'Idea incubada en el Semillero',
      dimensions: ['personal'] // default
    });
    
    if (res.success) {
      deleteSeed(seed.id);
      onPlanted(); // will close chat and potentially switch back to tree view
    } else {
      alert('Error al plantar: ' + res.error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-stone-800">{seed.title}</h2>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2 group cursor-help" title="Deseable (Problema y Audiencia)">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${seed.scores.sun >= 80 ? 'bg-amber-100 text-amber-600' : seed.scores.sun > 0 ? 'bg-amber-50 text-amber-300' : 'bg-stone-50 text-stone-300'}`}>☀️</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Deseable</span>
                  <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                    <motion.div className="h-full bg-amber-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${seed.scores.sun}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 group cursor-help" title="Factible (Solución y Tecnología)">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${seed.scores.earth >= 80 ? 'bg-emerald-100 text-emerald-600' : seed.scores.earth > 0 ? 'bg-emerald-50 text-emerald-300' : 'bg-stone-50 text-stone-300'}`}>🌍</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Factible</span>
                  <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                    <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${seed.scores.earth}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 group cursor-help" title="Viable (Sostenibilidad y Recursos)">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${seed.scores.water >= 80 ? 'bg-blue-100 text-blue-600' : seed.scores.water > 0 ? 'bg-blue-50 text-blue-300' : 'bg-stone-50 text-stone-300'}`}>💧</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Viable</span>
                  <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden mt-0.5">
                    <motion.div className="h-full bg-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${seed.scores.water}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {seed.status === 'ready' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handlePlant}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Sprout className="w-4 h-4" />
            Plantar en el Árbol
          </motion.button>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {seed.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                msg.role === 'user' 
                  ? 'bg-stone-900 text-white rounded-br-sm' 
                  : 'bg-white border border-stone-100 shadow-sm text-stone-700 rounded-bl-sm'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1 text-emerald-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">BEAN AI</span>
                  </div>
                )}
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white border border-stone-100 shadow-sm rounded-2xl rounded-bl-sm px-5 py-4 flex gap-1">
                <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-100">
        <div className="max-w-2xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Escribe tu respuesta..."
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-5 pr-14 py-3.5 outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100 transition-all resize-none min-h-[56px] max-h-32 text-[15px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 bg-stone-900 text-white rounded-xl disabled:opacity-50 disabled:bg-stone-300 transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
