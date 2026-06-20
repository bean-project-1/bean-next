'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, MessageSquare, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface BranchData {
  goalTitle: string;
  dimensionName: string;
  hoursPerWeek: number;
  targetDate: string;
  budget?: number;
}

interface GlobalAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  context?: string;
}

function renderFormattedText(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
      {i !== arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function GlobalAIChat({ isOpen, onClose, initialMessage, context = 'global' }: GlobalAIChatProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingBranch, setPendingBranch] = useState<BranchData | null>(null);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/ai/chat?context=${context}`);
      const data = await res.json();
      if (data.success) {
        setSessionId(data.data.id);
        setMessages(data.data.messages.filter((m: any) => m.role !== 'system'));
      } else {
        if (data.error === 'Not authenticated') {
          setLoadError('Tu sesión ha expirado. Por favor recarga la página.');
        }
      }
    } catch (e) {
      console.error('Failed to load chat session:', e);
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  useEffect(() => {
    if (isOpen) {
      loadSession();
    }
  }, [isOpen, loadSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle initial message auto-send when chat is opened
  useEffect(() => {
    if (isOpen && initialMessage && !isLoading && !isSending) {
      // Small timeout to allow UI to settle
      const timer = setTimeout(() => {
        handleSubmit(undefined, initialMessage);
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage, isLoading]);

  const handleReset = () => {
    setSessionId(null);
    setMessages([]);
    setPendingBranch(null);
    setBranchCreated(false);
    // Realistically, to truly reset, we might want to generate a new session ID by not passing it in POST
  };

  const handleSubmit = async (e?: React.FormEvent, overrideMsg?: string) => {
    e?.preventDefault();
    const userMsg = (overrideMsg || input).trim();
    if (!userMsg || isSending) return;

    if (!overrideMsg) setInput('');
    
    const optimisticMsg: Message = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          context,
          message: userMsg
        })
      });

      const data = await res.json();
      if (data.success) {
        if (!sessionId && data.sessionId) setSessionId(data.sessionId);
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.branchData) {
          setPendingBranch(data.branchData);
          setBranchCreated(false);
        }
      } else {
        const errorMsg = data.error === 'Not authenticated'
          ? 'Tu sesión ha expirado. Por favor recarga la página.'
          : `Error: ${data.detail ?? data.error ?? 'Intenta de nuevo.'}`;
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de red. Intenta de nuevo.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!pendingBranch) return;
    setCreatingBranch(true);
    try {
      const res = await fetch('/api/ai/goal-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalGoalInput: pendingBranch.goalTitle,
          branchData: pendingBranch,
          chatHistory: messages
        })
      });
      const data = await res.json();
      if (data.success) {
        setBranchCreated(true);
        setPendingBranch(null);
        const confirmMsg: Message = { role: 'assistant', content: `🌳 ¡Perfecto! He creado la meta **"${pendingBranch.goalTitle}"** respetando tu límite de ${pendingBranch.hoursPerWeek} horas. ¡Ve a tu árbol para verla!` };
        setMessages(prev => [...prev, confirmMsg]);
      } else {
        console.error('Failed to create branch:', data.error);
        const errorMsg: Message = { role: 'assistant', content: `❌ Hubo un error al crear la meta: ${data.error}` };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (e) {
      console.error('Failed to create branch:', e);
    } finally {
      setCreatingBranch(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end bg-stone-900/20 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-stone-800">El Guía BEAN</h2>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Explorador & Arquitecto</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors" title="Reiniciar Chat">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-stone-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <p className="text-stone-700 font-bold text-lg">¿En qué nos enfocamos hoy?</p>
                <p className="text-stone-400 text-sm mt-2 max-w-[250px]">
                  Puedo ayudarte a explorar caminos de vida o diseñar un plan paso a paso.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] mr-2 mt-1 flex-shrink-0">💡</div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white border border-stone-200/50 text-stone-800 rounded-bl-none shadow-sm'
                }`}>
                  {renderFormattedText(msg.content)}
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">💡</div>
              <div className="bg-white border border-stone-200/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-150" />
              </div>
            </div>
          )}

          {/* Pending Branch Action */}
          {pendingBranch && !branchCreated && !isSending && (
            <div className="mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-2xl mb-2">🌳</div>
              <p className="text-sm font-bold text-emerald-800 mb-1">{pendingBranch.goalTitle}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4 text-[10px] font-black uppercase text-emerald-600">
                <span className="bg-white px-2 py-1 rounded-md border border-emerald-100">{pendingBranch.hoursPerWeek}h / sem</span>
                <span className="bg-white px-2 py-1 rounded-md border border-emerald-100">{pendingBranch.targetDate}</span>
              </div>
              <button
                onClick={handleCreateBranch}
                disabled={creatingBranch}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 active:scale-95"
              >
                {creatingBranch ? 'Diseñando Plan...' : 'Crear en mi Árbol'}
              </button>
            </div>
          )}

          {branchCreated && (
            <div className="flex flex-col items-center gap-2 mt-4 animate-in fade-in duration-500">
              <button onClick={() => { onClose(); router.push('/home'); router.refresh(); }} className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-stone-200 transition-colors">
                Ir al Árbol de Vida <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        {loadError ? (
          <div className="p-4 bg-red-50 text-center">
            <p className="text-xs text-red-600 font-medium">{loadError}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-3 border-t border-stone-100 bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isSending || creatingBranch}
              className="flex-1 bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-stone-700 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending || creatingBranch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
