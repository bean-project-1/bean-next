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

export function TaskCoachChat({ taskId, taskTitle, taskDescription, onCloseMobile }: TaskCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from sessionStorage on mount or taskId change
  useEffect(() => {
    const saved = sessionStorage.getItem(`coach-chat-${taskId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([]);
    }
  }, [taskId]);

  // Save to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`coach-chat-${taskId}`, JSON.stringify(messages));
    }
  }, [messages, taskId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/task-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle,
          taskDescription,
          messages: newMessages
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        const err = await res.json();
        console.error('Error from AI:', err);
        setMessages([...newMessages, { role: 'assistant', content: 'Lo siento, hubo un error de conexión con mi cerebro. Intenta de nuevo.' }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Error de red. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
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
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Coach de Tarea</span>
            <span className="text-sm font-bold text-slate-700 leading-tight line-clamp-1">{taskTitle}</span>
          </div>
        </div>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="lg:hidden p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="text-center text-xs text-slate-400 italic mt-4">
            Pregúntame cómo empezar o pídemelo paso a paso.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-br-none' 
                : 'bg-white border border-slate-100 text-slate-600 rounded-bl-none shadow-sm'
            }`}>
              {renderFormattedText(msg.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 text-slate-400 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu duda o pide los pasos..."
          className="flex-1 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 outline-none transition-all"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  );
}
