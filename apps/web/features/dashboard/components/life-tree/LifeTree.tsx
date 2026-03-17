'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeData } from './types';
import { Branch } from './Branch';

interface LifeTreeProps {
  data: TreeData;
  onLeafClick?: (leafId: string) => void;
  onScoreClick?: () => void;
}

export const LifeTree = ({ data, onLeafClick, onScoreClick }: LifeTreeProps) => {
  const [hoveredLeafName, setHoveredLeafName] = useState<string | null>(null);
  const [clickedLeafId, setClickedLeafId] = useState<string | null>(null);

  const handleLeafClickHandler = (id: string, name: string) => {
    setClickedLeafId(id === clickedLeafId ? null : id);
    onLeafClick?.(id);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative font-sans overflow-hidden">
      {/* Top Score Indicator */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 cursor-pointer group"
        onClick={onScoreClick}
      >
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-100 px-6 py-3 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-50/50">
            <span className="text-sm font-bold text-slate-800">{data.growthScore}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Life Growth</span>
            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">Bean Vitality</span>
          </div>
        </div>
      </motion.div>

      {/* Global Status (if no leaf selected) */}
      <AnimatePresence>
        {!clickedLeafId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-16 flex flex-col items-end pointer-events-none"
          >
            <span className="text-[32px] font-light text-slate-300 tracking-tighter uppercase tabular-nums">
              {data.growthScore}<span className="text-sm ml-1">%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BEAN VITALITY</span>
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 800 800"
        className="w-full h-full max-w-[800px] max-h-[800px] cursor-default"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Organic Roots */}
        <g className="opacity-20 pointer-events-none">
          <motion.path
            d="M 400,450 C 380,550 320,600 250,700"
            stroke="#8b5cf6"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <motion.path
            d="M 400,450 C 400,580 410,620 400,750"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.2 }}
          />
          <motion.path
            d="M 400,450 C 420,550 480,600 550,700"
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.4 }}
          />
          
          <text x="250" y="720" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest">Identidad</text>
          <text x="400" y="770" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest">Capital Humano</text>
          <text x="550" y="720" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest">Experiencia</text>
        </g>

        {/* The Simple Trunk */}
        <motion.path
          d="M 400,450 L 400,350"
          stroke="#475569"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="opacity-10 pointer-events-none"
        />

        {/* The Seed (BEAN) */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
          className="pointer-events-none"
        >
          <motion.circle
            cx="400"
            cy="450"
            r="15"
            fill="rgba(16, 185, 129, 0.2)"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx="400" cy="450" r="8" fill="#10b981" />
          <text x="400" y="475" textAnchor="middle" className="text-[9px] font-bold fill-emerald-600 uppercase tracking-widest">Your BEAN</text>
        </motion.g>

        {/* Dynamic Branches */}
        {data.branches.map((branch, i) => (
          <Branch
            key={branch.id}
            branch={branch}
            index={i}
            totalBranches={data.branches.length}
            clickedLeafId={clickedLeafId}
            onClick={handleLeafClickHandler}
            onHover={setHoveredLeafName}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2 bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-slate-100 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-4 h-2 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Completado</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-2 rounded-full bg-slate-200 shadow-sm" />
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Pendiente</span>
        </div>
      </div>
    </div>
  );
};
