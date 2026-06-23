'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGlobalChat } from '../chat/GlobalChatProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TaskCoachChatProps {
  taskId: string;
  taskTitle: string;
  taskDescription?: string;
  notes?: string;
  subtasks?: Array<{ id: string; title: string; isCompleted: boolean }>;
  goalTitle?: string;
  goalId?: string;
  onCloseMobile?: () => void;
  fullHeight?: boolean;
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

function ContextMessageContent({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const cleanText = content.replace('Aquí tienes el contexto de la actividad para ayudarte a guiarme:\n\n', '');
  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className="bg-stone-100 hover:bg-stone-150 border border-stone-250/60 rounded-2xl px-4 py-3 text-[12px] font-medium text-stone-605 max-w-[82%] shadow-sm cursor-pointer transition-colors select-none"
    >
      <span className="font-black text-[9px] text-stone-500 uppercase tracking-widest block mb-1 flex items-center gap-1">
        📎 Contexto de Actividad Añadido
      </span>
      <div className={`whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>
        {cleanText}
      </div>
      <span className="text-[9px] text-stone-400 block mt-1.5 font-bold uppercase tracking-wider">
        {expanded ? '▲ Contraer' : '▼ Ver todo'}
      </span>
    </div>
  );
}

export function TaskCoachChat({ 
  taskId, 
  taskTitle, 
  taskDescription, 
  notes,
  subtasks,
  goalTitle, 
  goalId, 
  onCloseMobile, 
  fullHeight 
}: TaskCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hook into the global planner chat provider defensively
  let globalChat: any = null;
  try {
    globalChat = useGlobalChat();
  } catch (e) {
    // Graceful fallback if context is not loaded
  }

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
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
        body: JSON.stringify({ taskTitle, taskDescription, goalTitle, messages: next }),
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

  const handleRedirectToPlanner = () => {
    if (globalChat) {
      if (onCloseMobile) onCloseMobile();
      const targetName = goalTitle || taskTitle;
      const preFilledMsg = `Hola BEAN, me gustaría ajustar la planificación y las tareas de mi meta "${targetName}".`;
      globalChat.openChat(preFilledMsg);
    } else {
      alert("El panel de planificación no está disponible en este momento.");
    }
  };

  const handleAddContextToChat = () => {
    let contextStr = `Aquí tienes el contexto de la actividad para ayudarte a guiarme:`;
    if (taskDescription) {
      contextStr += `\n\n- Descripción/Instrucción: ${taskDescription}`;
    }
    if (notes) {
      contextStr += `\n\n- Notas: ${notes}`;
    }
    if (subtasks && subtasks.length > 0) {
      contextStr += `\n\n- Subtareas/Pasos:\n` + subtasks.map(t => `  * [${t.isCompleted ? 'x' : ' '}] ${t.title}`).join('\n');
    }
    if (!taskDescription && !notes && (!subtasks || subtasks.length === 0)) {
      contextStr += `\n\nNo hay descripción, notas ni subtareas cargadas para esta actividad.`;
    }
    
    send(contextStr);
  };

  return (
    <div className={`w-full flex flex-col bg-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden ${fullHeight ? 'flex-1 h-full min-h-0 border-none rounded-none' : 'h-[450px] my-4'}`}>
      
      {/* Header */}
      <div className="shrink-0 px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-violet-50/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg shadow-sm shrink-0">
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest">Tutor de Ejecución</p>
          </div>
          <p className="text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">{taskTitle}</p>
          {goalTitle && (
            <p className="text-[10px] text-slate-400 truncate leading-tight">Meta: {goalTitle}</p>
          )}
        </div>
        
        {/* Quick redirect button in Header for ease of use */}
        {globalChat && (
          <button
            onClick={handleRedirectToPlanner}
            title="Reestructurar o reprogramar plan"
            className="hidden sm:flex text-[10px] font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200/85 px-2.5 py-1.5 rounded-xl transition-all items-center gap-1 shrink-0 active:scale-95"
          >
            ✎ Planificar
          </button>
        )}
        
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/60">
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center pt-8 pb-4 px-4 gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl shadow-sm">
              💬
            </div>
            
            <div className="max-w-[280px]">
              <p className="font-bold text-slate-800 text-sm mb-1">Tutor de Ejecución</p>
              <p className="text-xs text-slate-505 leading-relaxed">
                Pregúntame cómo arrancar, qué pasos seguir o aclara cualquier duda para completarla.
              </p>
            </div>

            {/* Quick suggestions in clean wrapping pills */}
            <div className="flex flex-wrap gap-1.5 justify-center max-w-[340px] mt-2">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600 font-semibold hover:border-violet-300 hover:text-violet-750 transition-all shadow-sm active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isContextMsg = msg.content.startsWith('Aquí tienes el contexto de la actividad');
          return (
            <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs shrink-0 mb-0.5 shadow-sm">🤖</div>
              )}
              {isContextMsg ? (
                <ContextMessageContent content={msg.content} />
              ) : (
                <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  {renderFormatted(msg.content)}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs shrink-0 shadow-sm">🤖</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
              {[0, 75, 150].map(d => (
                <div key={d} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Context Button Bar */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
        <button
          type="button"
          onClick={handleAddContextToChat}
          className="w-full text-center py-2 text-[10px] font-black text-violet-600 bg-violet-50 hover:bg-violet-100 border border-dashed border-violet-200 hover:border-violet-300 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
        >
          📎 Añadir notas y subtareas como contexto
        </button>
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); send(input); }}
        className="shrink-0 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-100 flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe una pregunta para el Tutor..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 rounded-xl px-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-violet-600 hover:bg-violet-705 text-white px-4 py-2 rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center shadow-sm active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
