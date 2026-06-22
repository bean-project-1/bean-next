'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, FileText, Download, RefreshCcw, LayoutDashboard, Sprout } from 'lucide-react';
import { useIncubator, SeedDocument } from '../../hooks/useIncubator';
import { useLifeTree } from '../../hooks/useLifeTree';
import { SeedPot } from './SeedPot';
import { IdeaDocument } from './IdeaDocument';

interface SeedbedChatProps {
  seedId: string;
  activeSpaceId: string;
  onBack: () => void;
  onPlanted: () => void;
}

export function SeedbedChat({ seedId, activeSpaceId, onBack, onPlanted }: SeedbedChatProps) {
  const { getSeed, addMessage, addCloud, removeCloud, updateScores, deleteSeed, updateDocument, restartChat, evaluateSeed } = useIncubator();
  const { addGoal } = useLifeTree();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'pot' | 'document'>('chat');
  const [desktopLeftTab, setDesktopLeftTab] = useState<'pot' | 'document'>('pot');
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
        addMessage(seed.id, 'assistant', data.reply);
        if (data.proposal) {
          updateDocument(seed.id, data.proposal);
          evaluateSeed(seed.id, data.proposal);
        }
      } else {
        console.error('Error from AI:', data.error);
        addMessage(seed.id, 'assistant', `Oops, parece que hubo un error: ${data.error || 'Desconocido'}. ¿Podrías repetirlo?`);
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
    
    const res = await addGoal({
      title: seed.title,
      description: seed.description,
      spaceId: activeSpaceId,
      dimensions: [
        seed.scores.sun > 50 ? 'impact' : 'career',
      ],
      purpose: seed.analysis || ''
    });
    
    if (res.success) {
      deleteSeed(seed.id);
      onPlanted();
    } else {
      alert('Error al plantar: ' + res.error);
    }
  };

  const handleDropCloudToChat = (cloud: any) => {
    handleSend(`Sobre la idea: "${cloud.text}"...`);
    removeCloud(seed.id, cloud.id);
  };

  const handleAskAI = (topic: string) => {
    setDesktopLeftTab('document'); // Switch to document view implicitly
    setMobileView('chat');
    handleSend(topic);
  };

  const handleDownloadDoc = () => {
    const doc = seed.proposal as SeedDocument | null;
    if (!doc) return;
    const content = `# ${seed.title}\n\n## Resumen Ejecutivo\n${doc.executiveSummary || ''}\n\n## Anatomía del Problema\n${doc.problemAnatomy || ''}\n\n## Arquitectura de la Solución\n${doc.solutionArchitecture || ''}\n\n## Viabilidad Técnica\n${doc.technicalViability || ''}\n\n## Modelo de Negocio (Viabilidad Financiera)\n${doc.sustainability || ''}\n\n## Matriz de Riesgos\n${doc.riskMatrix || ''}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BusinessCase-${seed.title.replaceAll(' ', '-').substring(0, 20)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white relative overflow-hidden">
      {/* Top Mobile/Header Bar */}
      <header className="absolute top-0 inset-x-0 flex items-center justify-center px-2 sm:px-4 py-3 bg-white border-b border-stone-100 z-50 lg:hidden h-16">
        <button onClick={onBack} className="absolute left-2 sm:left-4 p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full hover:bg-stone-50 z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex bg-stone-100 p-1 rounded-full border border-stone-200">
            <button 
              onClick={() => setMobileView('chat')}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${mobileView === 'chat' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => setMobileView('pot')}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${mobileView === 'pot' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500'}`}
            >
              Matera
            </button>
            <button 
              onClick={() => setMobileView('document')}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${mobileView === 'document' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500'}`}
            >
              Doc
            </button>
          </div>
      </header>

      {/* Left Area (Desktop): Tabs for Pot / Document */}
      <div className={`w-full lg:w-1/2 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-stone-200 relative pt-16 lg:pt-0 overflow-hidden ${(mobileView === 'pot' || mobileView === 'document') ? 'block' : 'hidden lg:flex'}`}>
        
        <div className="absolute top-6 left-6 z-50 hidden lg:flex items-start gap-4 pointer-events-none">
          <button onClick={onBack} className="p-2 mt-0.5 text-stone-400 hover:text-stone-700 transition-colors rounded-full bg-white shadow-sm border border-stone-100 hover:bg-stone-50 pointer-events-auto shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="pointer-events-auto flex bg-stone-100/80 backdrop-blur p-1 rounded-full border border-stone-200 mt-1">
            <button 
              onClick={() => setDesktopLeftTab('pot')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 ${desktopLeftTab === 'pot' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <Sprout className="w-4 h-4" /> Matera
            </button>
            <button 
              onClick={() => setDesktopLeftTab('document')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 ${desktopLeftTab === 'document' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Documento
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative mt-0 lg:mt-20">
          {(mobileView === 'pot' || (desktopLeftTab === 'pot' && mobileView !== 'document')) && (
            <SeedPot 
              seed={seed} 
              onAddCloud={(text) => addCloud(seed.id, text)}
              onDropCloudToChat={handleDropCloudToChat}
              onPlant={handlePlant}
              onAskAI={handleAskAI}
            />
          )}
          
          {(mobileView === 'document' || (desktopLeftTab === 'document' && mobileView !== 'pot')) && (
            <div className="absolute inset-0 flex flex-col bg-[#FAFAFA]">
               <div className="flex justify-end p-4 lg:hidden">
                 <button onClick={handleDownloadDoc} className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100"><Download className="w-4 h-4"/> Descargar</button>
               </div>
               <IdeaDocument 
                 document={seed.proposal as SeedDocument | null} 
                 onUpdate={(partial) => {
                   updateDocument(seed.id, partial);
                   const updatedDoc = { ...(seed.proposal || {}), ...partial } as SeedDocument;
                   evaluateSeed(seed.id, updatedDoc);
                 }}
                 onAskAI={handleAskAI}
               />
               <div className="hidden lg:flex justify-end p-6 border-t border-stone-100 bg-white">
                 <button onClick={handleDownloadDoc} className="flex items-center gap-2 text-white font-bold text-sm bg-stone-900 hover:bg-stone-800 px-6 py-3 rounded-full transition-colors shadow-sm">
                   <Download className="w-4 h-4"/> Exportar a Markdown
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Chat */}
      <div className={`w-full flex-1 min-h-0 lg:w-1/2 flex-col bg-white relative overflow-hidden ${(mobileView === 'pot' || mobileView === 'document') ? 'hidden lg:flex' : 'flex'}`}>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth pt-16 lg:pt-6">
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
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white border border-stone-100 shadow-sm rounded-2xl rounded-bl-sm px-5 py-3.5 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs font-bold text-stone-400 animate-pulse">Analizando y buscando en la web...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-stone-100 pb-safe z-20">
          <div className="max-w-2xl mx-auto flex items-end gap-2">
            <button 
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres reiniciar el chat? La propuesta actual se mantendrá como contexto para la nueva conversación.')) {
                  restartChat(seed.id);
                }
              }}
              className="p-3 mb-1 bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-full transition-colors shrink-0"
              title="Reiniciar chat usando la propuesta como contexto"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            
            <div className="relative group w-full">
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
              className="w-full bg-stone-50 border border-stone-200 rounded-3xl pl-5 pr-14 py-3.5 outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100 transition-all resize-none min-h-[52px] max-h-32 text-[15px] leading-relaxed flex items-center"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="absolute right-2.5 bottom-1.5 p-2 bg-stone-900 text-white rounded-full disabled:opacity-50 disabled:bg-stone-300 transition-colors shadow-sm flex items-center justify-center w-10 h-10"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
