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
  const [loadError, setLoadError] = useState<string | null>(null);
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
      setLoadError(null);
      try {
        const res = await fetch(`/api/ai/chat?context=${encodeURIComponent(context)}`);
        const data = await res.json();
        if (data.success) {
          setSessionId(data.data.id);
          setMessages(data.data.messages.filter((m: any) => m.role !== 'system'));
        } else {
          // Non-fatal: we can still send, POST will create session
          console.warn('Could not pre-load session:', data.error);
          if (data.error === 'Not authenticated') {
            setLoadError('Tu sesión ha expirado. Por favor recarga la página.');
          }
        }
      } catch (e) {
        console.error('Failed to load chat session:', e);
        // Non-fatal: continue without pre-loaded session
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, [context]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;

    const userMsg = input.trim();
    setInput('');
    const optimisticMsg: Message = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,       // may be null — server will create one
          context,         // passed so server can create session with correct context
          message: userMsg
        })
      });

      const data = await res.json();
      if (data.success) {
        if (!sessionId && data.sessionId) setSessionId(data.sessionId);
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.branchData) setPendingBranch(data.branchData);
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
        <div className="flex flex-col items-center gap-3 text-stone-400">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10">
              💡
            </div>
            <div>
              <p className="text-stone-700 font-bold text-lg">{emptyStateMessage}</p>
              <p className="text-stone-400 text-sm mt-2 max-w-sm">
                Puedo analizar tu ADN y proyectar caminos de vida posibles, o ayudarte a construir un plan concreto paso a paso.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {initialMessage && (
                <button
                  onClick={() => { setInput(initialMessage); }}
                  className="px-4 py-2.5 bg-emerald-600 border border-emerald-500 text-white rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-sm font-bold animate-in zoom-in-95 duration-500"
                >
                  🚀 {initialMessage}
                </button>
              )}
              {['¿Qué caminos de vida se alinea con mi perfil?', 'Analiza mi estado actual'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-xl text-xs font-bold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
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
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] mr-2 mt-1 flex-shrink-0">💡</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                : 'bg-white border border-stone-200/50 text-stone-800 rounded-bl-none shadow-sm'
            }`}>
              {renderFormattedText(msg.content)}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">💡</div>
            <div className="bg-white border border-stone-200/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-150" />
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
      {loadError ? (
        <div className="p-4 bg-red-50 border-t border-red-100 text-center">
          <p className="text-xs text-red-600 font-medium">{loadError}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-xs font-bold text-red-700 underline">Recargar página</button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-stone-100 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isSending}
          className="flex-1 bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-stone-700 placeholder-stone-400 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
      )}
    </div>
  );
}
