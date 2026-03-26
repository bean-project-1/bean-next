'use client';

import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TreeData, Branch as BranchData } from './types';
import { Branch } from './Branch';

interface LifeTreeProps {
  data: TreeData;
  onLeafClick?: (leafId: string) => void;
  onScoreClick?: () => void;
  onBranchClick?: (branch: BranchData) => void;
}

export const LifeTree = ({ data, onLeafClick, onScoreClick, onBranchClick }: LifeTreeProps) => {
  const [hoveredLeafName, setHoveredLeafName] = useState<string | null>(null);
  const [clickedLeafId, setClickedLeafId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<SVGGElement>(null);
  const trunkRef = useRef<SVGGElement>(null);
  const seedRef = useRef<SVGGElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    // 1. Initial UI fade-ins
    tl.fromTo(scoreRef.current, 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // 2. Trunk growth from root upward
    if (trunkRef.current) {
      tl.fromTo(trunkRef.current,
        { scaleY: 0, transformOrigin: "400px 452px", opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
        "-=0.5"
      );
    }

    // 3. Roots growth sequentially
    if (rootsRef.current) {
      const roots = rootsRef.current.querySelectorAll('path');
      roots.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength();
        tl.fromTo(path,
          { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 2, ease: "power2.out" },
          0.8 + i * 0.3
        );
      });
    }

    // 4. Seed appear with a soft pop
    if (seedRef.current) {
      tl.fromTo(seedRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.7)" },
        0.8
      );

      // Soft breathing effect for the seed
      gsap.to(".seed-glow", {
        scale: 1.2,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, { scope: containerRef });

  // Debugging log for branch count
  console.log("Number of branches:", data.branches.length);

  const handleLeafClickHandler = (id: string, name: string) => {
    setClickedLeafId(id === clickedLeafId ? null : id);
    onLeafClick?.(id);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-white relative font-sans overflow-hidden">
      {/* Top Score Indicator */}
      <div 
        ref={scoreRef}
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
      </div>

      {/* Global Status (if no leaf selected) */}
      {!clickedLeafId && (
        <div className="absolute bottom-16 right-16 flex flex-col items-end pointer-events-none transition-opacity duration-300">
          <span className="text-[32px] font-light text-slate-300 tracking-tighter uppercase tabular-nums">
            {data.growthScore}<span className="text-sm ml-1">%</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BEAN VITALITY</span>
        </div>
      )}

      <svg
        viewBox="0 0 800 800"
        className="w-full h-full max-w-[800px] max-h-[800px] cursor-default"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wood gradient: darker edges, light center highlight */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b1f0a" />
            <stop offset="25%" stopColor="#7c4a1e" />
            <stop offset="50%" stopColor="#a0632e" />
            <stop offset="75%" stopColor="#7c4a1e" />
            <stop offset="100%" stopColor="#3b1f0a" />
          </linearGradient>
          {/* Soft center highlight */}
          <linearGradient id="trunkSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="rgba(255,210,160,0.12)" />
            <stop offset="60%" stopColor="rgba(255,210,160,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Seed Gradient: Organic Emerald Glow */}
          <radialGradient id="seedGrad" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>
          
          <radialGradient id="seedHaze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </radialGradient>
        </defs>

        {/* Organic Roots - Thicker for foundation */}
        <g ref={rootsRef} className="opacity-10 pointer-events-none">
          <path d="M 400,450 C 380,550 320,600 250,700" stroke="#8b5cf6" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 400,450 C 400,580 410,620 400,750" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 400,450 C 420,550 480,600 550,700" stroke="#10b981" strokeWidth="8" fill="none" strokeLinecap="round" />
          
          <text x="250" y="720" textAnchor="middle" className="text-[10px] fill-slate-300 font-bold uppercase tracking-widest">Identidad</text>
          <text x="400" y="770" textAnchor="middle" className="text-[10px] fill-slate-300 font-bold uppercase tracking-widest">Capital Humano</text>
          <text x="550" y="720" textAnchor="middle" className="text-[10px] fill-slate-300 font-bold uppercase tracking-widest">Experiencia</text>
        </g>

        {/* Realistic Trunk - tapered, wood gradient, bark texture */}
        <g ref={trunkRef} className="pointer-events-none">
          {/* Main tapered body: wider at base, narrower at top */}
          <path
            d="M 382,454 C 380,430 384,400 388,350 L 412,350 C 416,400 420,430 418,454 Z"
            fill="url(#trunkGrad)"
          />
          {/* Center sheen overlay */}
          <path
            d="M 382,454 C 380,430 384,400 388,350 L 412,350 C 416,400 420,430 418,454 Z"
            fill="url(#trunkSheen)"
          />
          {/* Bark texture lines */}
          <path d="M 392,445 C 391,425 390,405 392,362" stroke="#2e1505" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
          <path d="M 400,450 C 399,425 400,400 400,355" stroke="#5a320f" strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" />
          <path d="M 408,445 C 409,425 410,405 408,362" stroke="#2e1505" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
          {/* Knot detail */}
          <ellipse cx="402" cy="408" rx="5" ry="3.5" fill="#2e1505" opacity="0.25" />
          <ellipse cx="402" cy="408" rx="2.5" ry="1.5" fill="#1a0d02" opacity="0.3" />
        </g>

        {/* The Seed (BEAN) - Aesthetic & Organic */}
        <g ref={seedRef} transform="translate(400, 450)" className="pointer-events-none">
          {/* External soft glow */}
          <circle r="25" fill="url(#seedHaze)" className="seed-glow" />
          
          {/* Animated Bean Shape */}
          <path 
            d="M-8,0 C-8,-10 8,-10 8,0 C8,10 2,12 -8,10 Z" 
            fill="url(#seedGrad)"
            stroke="#059669"
            strokeWidth="0.5"
          />
          
          {/* Small internal highlight for "glossy" look */}
          <ellipse cx="-2" cy="-3" rx="2" ry="1.5" fill="white" fillOpacity="0.3" />

          <text y="35" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600/60 uppercase tracking-widest">BEAN</text>
        </g>        {/* Dynamic Branches */}
        {data.branches.map((branch, i) => (
          <Branch
            key={branch.id}
            branch={branch}
            index={i}
            totalBranches={data.branches.length}
            clickedLeafId={clickedLeafId}
            onClick={handleLeafClickHandler}
            onHover={setHoveredLeafName}
            onBranchClick={(b) => onBranchClick?.(b)}
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
