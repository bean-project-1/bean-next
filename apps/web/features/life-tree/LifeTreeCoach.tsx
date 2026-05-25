import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LifeTreeCoachProps {
  onPlanGenerated: () => void;
  onPlantingStateChange?: (isPlanting: boolean) => void;
}

export function LifeTreeCoach({ onPlanGenerated, onPlantingStateChange }: LifeTreeCoachProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    
    const userMessage: Message = { role: 'user', content: trimmed };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/goal-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...next, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const generate = async () => {
    setIsGenerating(true);
    onPlantingStateChange?.(true);
    try {
      const res = await fetch('/api/ai/goal-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatHistory: messages }),
      });
      if (res.ok) {
        onPlanGenerated();
        setIsOpen(false);
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
      onPlantingStateChange?.(false);
    }
  };

  return (
    <div className="fixed bottom-24 left-3 sm:bottom-10 sm:left-[264px] z-50 flex flex-col items-start gap-4 pointer-events-auto">
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-[350px] max-w-[380px] h-[420px] sm:h-[450px] bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌳</span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Planificador de Vida</span>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button 
                  onClick={() => setMessages([])} 
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  title="Reiniciar conversación"
                >
                  ↻
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-500 transition-colors text-sm">✕</button>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm font-bold text-slate-700">¿Qué quieres sembrar hoy?</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Basado en tu ADN, puedo ayudarte a trazar un plan para tu próxima meta.
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl text-[10px] text-slate-300 animate-pulse">Escribiendo...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Actions */}
          <div className="p-3 bg-white border-t border-slate-100 space-y-2">
            {messages.some(m => m.role === 'assistant' && m.content.includes('Plantar Meta')) && (
              <button 
                onClick={generate}
                disabled={isGenerating}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
              >
                {isGenerating ? 'Plantando...' : '¡Plantar Meta! 🚀'}
              </button>
            )}
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Dime tu objetivo..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-slate-200"
              />
              <button type="submit" disabled={!input.trim() || isLoading} className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs disabled:opacity-30">
                ↑
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-white border border-slate-100 px-5 py-4 rounded-[32px] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xl shadow-md group-hover:rotate-12 transition-transform">
            🧠
          </div>
          <div className="text-left pr-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Nueva Rama</p>
            <p className="text-sm font-black text-slate-800 leading-none">Habla con tu Coach</p>
          </div>
        </button>
      )}
    </div>
  );
}
