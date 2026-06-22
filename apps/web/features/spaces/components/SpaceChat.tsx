'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, MessageSquare } from 'lucide-react';
import useSWR from 'swr';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface SpaceChatProps {
  spaceId: string;
  spaceName: string;
  onRefreshTree: () => void;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function SpaceChat({ spaceId, spaceName, onRefreshTree }: SpaceChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for new messages every 3 seconds
  const { data: messages, mutate } = useSWR<Message[]>(
    isOpen ? `/api/spaces/${spaceId}/chat` : null, 
    fetcher, 
    { refreshInterval: 3000 }
  );

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input;
    setInput('');
    setIsSending(true);

    // Optimistic update
    const tempId = Date.now().toString();
    mutate((current) => [...(current || []), {
      id: tempId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
      user: { name: 'Tú', avatarUrl: null }
    }], false);

    // Detect if we mention @bean
    const mentions: string[] = [];
    if (text.toLowerCase().includes('@bean')) mentions.push('bean');

    try {
      await fetch(`/api/spaces/${spaceId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, mentions })
      });
      
      // If AI was triggered, it might have created a branch, so we refresh the tree
      if (mentions.includes('bean')) {
        setTimeout(() => {
          onRefreshTree();
          mutate(); // Fetch the AI response
        }, 1500);
      } else {
        mutate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-12 sm:right-12 w-12 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center z-[9999] transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>
      )}

      {/* Chat Sidebar / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-[10000] flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Chat del Árbol
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{spaceName}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
              {messages?.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4">
                  <Bot className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No hay mensajes aún.</p>
                  <p className="text-xs mt-1">Escribe @bean para que la IA te ayude a crear ramas nuevas.</p>
                </div>
              )}
              
              {messages?.map((msg) => {
                const isAI = msg.role === 'assistant' || msg.role === 'system';
                
                return (
                  <div key={msg.id} className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isAI ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                        {isAI ? 'BEAN' : msg.user?.name || 'Usuario'}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl max-w-[260px] text-[13px] leading-relaxed shadow-sm ${
                        isAI 
                          ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm' 
                          : 'bg-emerald-600 text-white rounded-tr-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un mensaje o etiqueta a @bean..."
                  className="w-full bg-slate-100 text-slate-800 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all border border-transparent focus:border-emerald-500/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
