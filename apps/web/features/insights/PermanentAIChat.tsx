'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface BranchData {
  goal: string;
  dimensionName: string;
  activities: { title: string; description: string }[];
}

interface PermanentAIChatProps {
  context: string;
  placeholder?: string;
  emptyStateMessage?: string;
  initialMessage?: string; // Pre-injects a message when chat is empty
  onBranchCreated?: (goalId: string) => void;
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

export function PermanentAIChat({
  context,
  placeholder = 'Escribe tu mensaje...',
  emptyStateMessage = 'Hola, ¿en qué te puedo ayudar hoy?',
  initialMessage,
  onBranchCreated
}: PermanentAIChatProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [pendingBranch, setPendingBranch] = useState<BranchData | null>(null);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);
  const [didAutoSend, setDidAutoSend] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load session and history on mount
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/ai/chat?context=${encodeURIComponent(context)}`);
        const data = await res.json();
        if (data.success) {
          setSessionId(data.data.id);
          setMessages(data.data.messages.filter((m: any) => m.role !== 'system'));
        }
      } catch (e) {
        console.error('Failed to load chat session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, [context]);

  // Auto-send initialMessage if chat is empty
  useEffect(() => {
    if (!isLoading && sessionId && initialMessage && messages.length === 0 && !didAutoSend) {
      setDidAutoSend(true);
      setInput(initialMessage);
      // slight delay so UI settles before sending
      setTimeout(() => {
        setInput('');
        const userMsg = initialMessage;
        const optimisticMsg: Message = { role: 'user', content: userMsg };
        setMessages([optimisticMsg]);
        setIsSending(true);
        fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, message: userMsg })
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
              if (data.branchData) setPendingBranch(data.branchData);
            }
          })
          .catch(console.error)
          .finally(() => setIsSending(false));
      }, 300);
    }
  }, [isLoading, sessionId, initialMessage, messages.length, didAutoSend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending || !sessionId) return;

    const userMsg = input.trim();
    setInput('');
    const optimisticMsg: Message = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMsg })
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: Message = { role: 'assistant', content: data.reply };
        setMessages(prev => [...prev, assistantMsg]);
        if (data.branchData) {
          setPendingBranch(data.branchData);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Ocurrió un error. Por favor intenta de nuevo.' }]);
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
      const res = await fetch('/api/ai/create-branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingBranch)
      });
      const data = await res.json();
      if (data.success) {
        setBranchCreated(true);
        setPendingBranch(null);
        onBranchCreated?.(data.goalId);
        const confirmMsg: Message = { role: 'assistant', content: `🌳 ¡Perfecto! He creado la meta **"${pendingBranch.goal}"** en tu Árbol de Vida con ${pendingBranch.activities.length} actividades. ¡Ve a tu árbol para verla!` };
        setMessages(prev => [...prev, confirmMsg]);
      }
    } catch (e) {
      console.error('Failed to create branch:', e);
    } finally {
      setCreatingBranch(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Cargando conversación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
              🧠
            </div>
            <div>
              <p className="text-slate-700 font-semibold text-lg">{emptyStateMessage}</p>
              <p className="text-slate-400 text-sm mt-2 max-w-sm">
                Puedo analizar tu ADN y proyectar caminos de vida posibles, o ayudarte a construir un plan concreto paso a paso.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['¿Qué caminos de vida se alinean con mi perfil?', 'Analiza mi estado actual', 'Quiero explorar una nueva meta'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">🧠</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-violet-600 text-white rounded-br-none'
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
            }`}>
              {renderFormattedText(msg.content)}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">🧠</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce delay-150" />
            </div>
          </div>
        )}

        {/* Pending Branch Banner */}
        {pendingBranch && !branchCreated && (
          <div className="mx-auto max-w-sm bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-2xl mb-2">🌳</div>
            <p className="text-sm font-bold text-emerald-800 mb-1">{pendingBranch.goal}</p>
            <p className="text-xs text-emerald-600 mb-3">{pendingBranch.activities.length} actividades listas para crear en tu árbol</p>
            <button
              onClick={handleCreateBranch}
              disabled={creatingBranch}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 active:scale-95"
            >
              {creatingBranch ? 'Creando rama...' : '🚀 Agregar al Árbol de Vida'}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isSending}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
