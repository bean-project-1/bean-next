'use client';

import React, { useState } from 'react';
import { PrimaryButton, InputField } from '@bean/ui';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function AICoachModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendMessage = async () => {
    if (!goalInput.trim()) return;

    const userMessage: Message = { role: 'user', content: goalInput };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setGoalInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/goal-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages([...newHistory, { role: 'assistant', content: data.reply }]);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setGeneratingPlan(true);
    try {
      const res = await fetch('/api/ai/goal-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          finalGoalInput: "Resumen de lo que quiero en base a la charla anterior.", // Realmente se deduce del chatHistory
          chatHistory: messages 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingPlan(false);
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

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🌳</div>
          <h2 className="text-2xl font-bold text-slate-800">¡Plan creado!</h2>
          <p className="text-slate-500 mt-2">La rama y las hojas se han añadido a tu Life Tree.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-2xl h-full sm:h-[80vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <h2 className="text-lg font-bold text-slate-800">BEAN Goal Coach</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 mt-10">
              <p>Hola, soy tu Coach basado en tu ADN. ¿Qué objetivo te gustaría trazar hoy?</p>
              <p className="text-sm mt-2">Por ejemplo: "Quiero ser Gerente de Tecnología"</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
                }`}
              >
                {renderFormattedText(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-tl-sm text-sm text-slate-500 animate-pulse">
                Escribiendo...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
                placeholder="Explícale tu meta..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
              />
              <PrimaryButton onClick={sendMessage} disabled={loading || !goalInput.trim()} className="px-6">
                Enviar
              </PrimaryButton>
            </div>
            
            {messages.length > 1 && (
              <button 
                onClick={generatePlan} 
                disabled={generatingPlan}
                className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 focus:ring-2 focus:ring-slate-900/20 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
              >
                {generatingPlan ? 'Generando tu plan en el árbol...' : 'Terminar charla y Crear Plan 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
