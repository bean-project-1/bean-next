'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TaskCoachChatProps {
  taskId: string;
  taskTitle: string;
  taskDescription?: string;
  onCloseMobile?: () => void;
}

const QUICK_QUESTIONS = [
  '¿Cómo empiezo?',
  'Dame los pasos concretos',
  '¿Cuánto tiempo me tomará?',
  'Tengo dudas, ayúdame',
];

function renderFormatted(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>
          : part
      )}
      {i !== arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function TaskCoachChat({ taskId, taskTitle, taskDescription, onCloseMobile }: TaskCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`coach-chat-${taskId}`);
    setMessages(saved ? JSON.parse(saved) : []);
  }, [taskId]);

  // Persist on change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`coach-chat-${taskId}`, JSON.stringify(messages));
    }
  }, [messages, taskId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    const next: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/task-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, taskDescription, messages: next }),
      });
      const data = await res.json();
      const reply = res.ok ? data.reply : 'Lo siento, hubo un error. Intenta de nuevo.';
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Error de red. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="w-full h-[450px] flex flex-col bg-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden my-4">
      {/* Header */}
      <div className="shrink-0 px-5 py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg shadow-sm shrink-0">
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Coach — Guía de tarea</p>
          <p className="text-sm font-bold text-slate-800 truncate leading-tight">{taskTitle}</p>
          {taskDescription && (
            <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{taskDescription}</p>
          )}
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/60">
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center pt-6 pb-2 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-3xl">
              💬
            </div>
            <div>
              <p className="font-bold text-slate-700 text-sm mb-1">¿En qué te ayudo?</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                Puedo explicarte cómo hacer esta tarea, darte un plan paso a paso o resolver tus dudas.
              </p>
            </div>
            {/* Quick suggestions */}
            <div className="flex flex-col gap-2 w-full">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-left px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 font-medium hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs shrink-0 mb-0.5">🤖</div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-violet-600 text-white rounded-br-none shadow-sm'
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
            }`}>
              {renderFormatted(msg.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs shrink-0">🤖</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
              {[0, 75, 150].map(d => (
                <div key={d} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); send(input); }}
        className="shrink-0 p-3 bg-white border-t border-slate-100 flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
