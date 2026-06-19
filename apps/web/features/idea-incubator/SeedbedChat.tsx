'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Sprout, FileText, X, Download } from 'lucide-react';
import { useIncubator } from '../../hooks/useIncubator';
import { useLifeTree } from '../../hooks/useLifeTree';
import { SeedPot } from './SeedPot';

interface SeedbedChatProps {
  seedId: string;
  onBack: () => void;
  onPlanted: () => void;
}

export function SeedbedChat({ seedId, onBack, onPlanted }: SeedbedChatProps) {
  const { getSeed, addMessage, addCloud, removeCloud, updateScores, deleteSeed, updateProposal } = useIncubator();
  const { addGoal } = useLifeTree();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const seed = getSeed(seedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [seed?.messages, isTyping]);

  if (!seed) return null;

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend) return;
    
    if (!customMessage) setInput('');
    addMessage(seed.id, 'user', textToSend);
    
    setIsTyping(true);
    
    try {
      const res = await fetch('/api/ai/incubator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: seed.title,
          description: seed.description,
          messages: [...seed.messages, { role: 'user', content: textToSend }],
          currentScores: seed.scores,
          currentProposal: seed.proposal
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.reply) {
        updateScores(seed.id, data.newScores);
        addMessage(seed.id, 'assistant', data.reply);
        if (data.proposal) {
          updateProposal(seed.id, data.proposal);
        }
      } else {
        console.error('Error from AI:', data.error);
        addMessage(seed.id, 'assistant', 'Oops, parece que hubo un error evaluando tu idea. ¿Podrías repetirlo?');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      addMessage(seed.id, 'assistant', 'Lo siento, no pude conectarme al servidor. Intenta de nuevo.');
    } finally {
      setIsTyping(false);
    }
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

  const handleDropCloudToChat = (cloud: any) => {
    // Send the cloud text as a message
    handleSend(`Sobre la idea: "${cloud.text}"...`);
    // Optional: remove cloud after sending
    removeCloud(seed.id, cloud.id);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white relative overflow-hidden">
      {/* Top Mobile/Header Bar */}
      <header className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-stone-100 z-50 lg:hidden">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="p-2 -ml-2 mt-0.5 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-stone-800 line-clamp-2 leading-tight pr-4">{seed.title}</h2>
        </div>
      </header>

      {/* Left Area: Visual SeedPot */}
      <div className="w-full h-[45%] min-h-[300px] lg:min-h-0 lg:h-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-stone-200 relative mt-16 lg:mt-0 overflow-hidden">
        <div className="absolute top-6 left-6 z-50 hidden lg:flex items-start gap-4 pointer-events-none">
          <button onClick={onBack} className="p-2 mt-0.5 text-stone-400 hover:text-stone-700 transition-colors rounded-full bg-white shadow-sm border border-stone-100 hover:bg-stone-50 pointer-events-auto shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-stone-800 line-clamp-3 max-w-[250px] xl:max-w-sm leading-tight pr-2 drop-shadow-sm pointer-events-auto">{seed.title}</h2>
        </div>

        <SeedPot 
          seed={seed} 
          onAddCloud={(text) => addCloud(seed.id, text)}
          onDropCloudToChat={handleDropCloudToChat}
          onPlant={handlePlant}
        />
      </div>

      {/* Right Area: Chat */}
      <div className="w-full flex-1 lg:w-1/2 flex flex-col bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white via-white to-transparent z-10 pointer-events-none flex justify-end px-6 pt-6">
          <button 
            onClick={() => setShowProposal(true)}
            className="pointer-events-auto flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-emerald-100 hover:bg-emerald-100 hover:scale-105 transition-all"
          >
            <FileText className="w-4 h-4" />
            Ver Propuesta
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth pt-16">
          <div className="max-w-2xl mx-auto flex flex-col gap-6 pt-4">
            {seed.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-br-sm' 
                    : 'bg-white border border-stone-100 text-stone-700 rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1 text-emerald-600">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">BEAN AI</span>
                    </div>
                  )}
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
        <div className="p-4 bg-white border-t border-stone-100 pb-safe z-20">
          <div className="max-w-2xl mx-auto relative group">
            {/* Optional drop zone styling hint */}
            <div className="absolute -top-12 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Arrastra nubes aquí para discutir
              </span>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escribe tu respuesta o arrastra una nube..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-5 pr-14 py-4 outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100 transition-all resize-none min-h-[60px] max-h-32 text-[15px]"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-2 p-3 bg-stone-900 text-white rounded-xl disabled:opacity-50 disabled:bg-stone-300 transition-colors shadow-md"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Proposal Document Modal */}
        <AnimatePresence>
          {showProposal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-8"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-3xl h-full max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-stone-800 line-clamp-1">Documento de Propuesta</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => {
                        if (!seed.proposal) return;
                        const blob = new Blob([seed.proposal], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Pitch-${seed.title.replace(/\\s+/g, '-').substring(0, 20)}.md`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-1.5 flex items-center gap-2 text-sm font-bold bg-white text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 border border-stone-200 rounded-full transition-colors shadow-sm"
                      title="Descargar en formato Markdown (.md)"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Descargar</span>
                    </button>
                    <div className="w-px h-5 bg-stone-200 mx-1" />
                    <button 
                      onClick={() => setShowProposal(false)}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white">
                  <div className="prose prose-stone prose-emerald max-w-none">
                    {/* Render plain text with line breaks as fallback for markdown */}
                    {seed.proposal ? (
                      seed.proposal.split('\n').map((line, i) => {
                        if (line.startsWith('### ')) return <h4 key={i} className="text-lg font-bold mt-6 mb-2 text-stone-800">{line.replace('### ', '')}</h4>;
                        if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-black mt-8 mb-4 text-stone-900 border-b pb-2">{line.replace('## ', '')}</h3>;
                        if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-black mb-6 text-stone-900">{line.replace('# ', '')}</h2>;
                        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 mb-1 text-stone-600">{line.substring(2)}</li>;
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="mb-3 text-stone-600 leading-relaxed">{line}</p>;
                      })
                    ) : (
                      <p className="text-stone-400 text-center italic mt-10">El documento está vacío. Conversa con BEAN AI para que empiece a redactarlo.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
