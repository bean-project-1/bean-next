'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SeedDocument } from '../../hooks/useIncubator';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';

interface IdeaDocumentProps {
  document: SeedDocument | null | undefined;
  onUpdate: (partial: Partial<SeedDocument>) => void;
  onAskAI?: (topic: string) => void;
}

const SECTIONS = [
  {
    key: 'executiveSummary',
    title: 'Resumen Ejecutivo y Tesis',
    description: 'La definición ultra-concisa de la idea y por qué tiene sentido hoy.',
    icon: '🎯'
  },
  {
    key: 'problemAnatomy',
    title: 'Anatomía del Problema',
    description: 'Datos que prueban que el problema existe y análisis de alternativas.',
    icon: '🔍'
  },
  {
    key: 'solutionArchitecture',
    title: 'Arquitectura de la Solución',
    description: 'Propuesta de valor core y definición del MVP.',
    icon: '🏗️'
  },
  {
    key: 'technicalViability',
    title: 'Viabilidad Técnica',
    description: 'Stack tecnológico, infraestructura de datos y riesgos técnicos.',
    icon: '⚙️'
  },
  {
    key: 'sustainability',
    title: 'Modelo de Negocio',
    description: '¿Cómo generará ingresos o se mantendrá viva esta iniciativa financieramente?',
    icon: '💸'
  },
  {
    key: 'riskMatrix',
    title: 'Matriz de Riesgos',
    description: 'Análisis de pre-mortem y cómo mitigar los riesgos principales.',
    icon: '🛡️'
  }
] as const;

function AutoResizeTextarea({ 
  value, 
  onChange, 
  onBlur, 
  placeholder 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  onBlur: () => void;
  placeholder: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full min-h-[100px] p-5 outline-none resize-none text-[15px] leading-relaxed text-stone-700 bg-transparent placeholder:text-stone-300 overflow-hidden"
    />
  );
}

export function IdeaDocument({ document, onUpdate, onAskAI }: IdeaDocumentProps) {
  const [localDoc, setLocalDoc] = useState<Partial<SeedDocument>>(document || {});

  // Sync from props if updated externally (by AI)
  useEffect(() => {
    if (document) {
      setLocalDoc(document);
    }
  }, [document]);

  const handleChange = (key: keyof SeedDocument, value: string) => {
    setLocalDoc(prev => ({ ...prev, [key]: value }));
  };

  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Autosave when localDoc changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if there's a difference between localDoc and document
      let hasChanges = false;
      const updates: Partial<SeedDocument> = {};
      
      for (const key of Object.keys(localDoc) as Array<keyof SeedDocument>) {
        if (localDoc[key] !== document?.[key]) {
          hasChanges = true;
          updates[key] = localDoc[key];
        }
      }
      
      if (hasChanges) {
        onUpdateRef.current(updates);
      }
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timer);
  }, [localDoc, document]);

  const handleBlur = (key: keyof SeedDocument) => {
    if (localDoc[key] !== document?.[key]) {
      onUpdate({ [key]: localDoc[key] });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <header className="mb-8">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Business Case</h2>
          <p className="text-stone-500 mt-1 text-sm">Este documento se actualiza automáticamente con tus respuestas en el chat, pero también puedes editarlo manualmente.</p>
        </header>

        {SECTIONS.map((section) => {
          const value = localDoc[section.key as keyof SeedDocument] || '';
          const hasContent = value.trim().length > 0;

          return (
            <motion.div 
              key={section.key}
              layout
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 border-b border-stone-100 bg-stone-50">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <h3 className="font-bold text-stone-800 text-[15px] leading-none">{section.title}</h3>
                    <p className="text-stone-500 text-xs mt-1">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {onAskAI && (
                    <button
                      onClick={() => onAskAI(`Por favor, ayúdame a definir: ${section.title}`)}
                      className="text-emerald-600 bg-white border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageSquareText className="w-3.5 h-3.5" /> Consultar IA
                    </button>
                  )}
                  {hasContent ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-stone-200" />
                  )}
                </div>
              </div>
              <div className="p-0">
                <AutoResizeTextarea
                  value={value}
                  onChange={(e) => handleChange(section.key as keyof SeedDocument, e.target.value)}
                  onBlur={() => handleBlur(section.key as keyof SeedDocument)}
                  placeholder="La IA llenará esto o puedes escribir aquí..."
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
