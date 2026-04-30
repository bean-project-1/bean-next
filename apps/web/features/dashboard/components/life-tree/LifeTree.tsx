'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

    // 3. Set roots initial state (hidden)
    if (rootsRef.current) {
      const roots = rootsRef.current.querySelectorAll('path');
      roots.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(rootsRef.current, { opacity: 0 });
    }


    // 4. Seed appear with a soft pop
    if (seedRef.current) {
      tl.fromTo(seedRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.7)" },
        0.8
      );


      // 5. Fade in the seed label ("Tu BEAN!")
      tl.to("#seed-label-group", { opacity: 1, duration: 1.5, ease: "power2.out" }, ">");
    }
  }, { scope: containerRef });

  // Debugging log for branch count
  console.log("Number of branches:", data.branches.length);

  const handleLeafClickHandler = (id: string, name: string) => {
    setClickedLeafId(id === clickedLeafId ? null : id);
    onLeafClick?.(id);
  };

  const getQualitativeState = (score: number) => {
    if (score < 30) return 'Brotando';
    if (score < 70) return 'Creciendo';
    return 'Floreciendo';
  };

  const lifeState = getQualitativeState(data.growthScore);

  return (
    <div ref={containerRef} className="w-full min-h-screen flex items-center justify-center bg-white relative font-sans overflow-visible pb-32 pt-20">
      {/* Top Score Indicator */}
      <div 
        ref={scoreRef}
        className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 cursor-pointer group"
        onClick={onScoreClick}
      >
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-100 px-6 py-3 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-50/50">
            <span className="text-xl">🌱</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Life Growth</span>
            <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest">{lifeState}</span>
          </div>
        </div>
      </div>

      {/* Global Status (if no leaf selected) */}
      {!clickedLeafId && (
        <div className="fixed bottom-24 sm:bottom-16 right-4 sm:right-10 flex flex-col items-end pointer-events-none transition-opacity duration-300 z-30">
          <span className="text-2xl sm:text-3xl font-light text-slate-400 tracking-tight uppercase">
            {lifeState}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">ESTADO ACTUAL</span>
        </div>
      )}

      {hoveredLeafName && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/10 backdrop-blur-sm rounded-full pointer-events-none shadow-sm">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">{hoveredLeafName}</span>
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
          
        </defs>

        {/* 1. Ground / Soil Mound */}
        <ellipse 
          cx="400" cy="454" rx="70" ry="12" 
          fill="#2d1a0e" 
          opacity="0.6" 
          filter="blur(6px)"
        />
        <ellipse 
          cx="400" cy="452" rx="50" ry="8" 
          fill="#1a0f08" 
          opacity="0.8" 
        />

        {/* 2. Realistic Roots - Wood textured */}
        <g 
          ref={rootsRef} 
          className="pointer-events-none"
        >
          {/* Identity Root (Brown with Golden Shading) */}
          <path d="M 400,450 C 380,550 320,600 250,700" stroke="#f59e0b" strokeWidth="22" fill="none" opacity="0.35" filter="blur(10px)" />
          <path d="M 400,454 C 385,550 325,600 250,700" stroke="#4a2810" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 400,454 C 385,550 325,600 250,700" stroke="#7c4a1e" strokeWidth="4" fill="none" strokeLinecap="round" />
          <text x="250" y="730" className="text-[12px] font-bold fill-slate-400 uppercase tracking-[0.2em] opacity-0" textAnchor="middle">Identidad</text>
          
          {/* Human Capital Root (Brown with Blue Shading) */}
          <path d="M 400,450 C 400,580 410,620 400,750" stroke="#3b82f6" strokeWidth="22" fill="none" opacity="0.35" filter="blur(10px)" />
          <path d="M 400,454 C 400,580 410,620 400,750" stroke="#4a2810" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 400,454 C 400,580 410,620 400,750" stroke="#7c4a1e" strokeWidth="5" fill="none" strokeLinecap="round" />
          <text x="400" y="780" className="text-[12px] font-bold fill-slate-400 uppercase tracking-[0.2em] opacity-0" textAnchor="middle">Capital Humano</text>

          {/* Experience Root (Brown with Emerald Shading) */}
          <path d="M 400,450 C 420,550 480,600 550,700" stroke="#10b981" strokeWidth="22" fill="none" opacity="0.35" filter="blur(10px)" />
          <path d="M 400,454 C 415,550 475,600 550,700" stroke="#4a2810" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 400,454 C 415,550 475,600 550,700" stroke="#7c4a1e" strokeWidth="4" fill="none" strokeLinecap="round" />
          <text x="550" y="730" className="text-[12px] font-bold fill-slate-400 uppercase tracking-[0.2em] opacity-0" textAnchor="middle">Experiencia</text>
        </g>

        {/* 3. Realistic Trunk */}
        <g ref={trunkRef} className="pointer-events-none">
          <path d="M 382,454 C 380,430 384,400 388,350 L 412,350 C 416,400 420,430 418,454 Z" fill="url(#trunkGrad)" />
          <path d="M 382,454 C 380,430 384,400 388,350 L 412,350 C 416,400 420,430 418,454 Z" fill="url(#trunkSheen)" />
          <path d="M 392,445 C 391,425 390,405 392,362" stroke="#2e1505" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
          <path d="M 400,450 C 399,425 400,400 400,355" stroke="#5a320f" strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" />
          <path d="M 408,445 C 409,425 410,405 408,362" stroke="#2e1505" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
          <ellipse cx="402" cy="408" rx="5" ry="3.5" fill="#2e1505" opacity="0.25" />
          <ellipse cx="402" cy="408" rx="2.5" ry="1.5" fill="#1a0d02" opacity="0.3" />
        </g>

        {/* 4. The Seed (BEAN) */}
        <g 
          ref={seedRef} 
          transform="translate(400, 450)" 
          className="cursor-pointer group"
          onClick={() => router.push('/dna')}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget.querySelector('path'), { scale: 1.1, duration: 0.3, ease: 'power2.out' });
            
            // Deploy roots
            if (rootsRef.current) {
              gsap.to(rootsRef.current, { opacity: 1, duration: 0.5 });
              const paths = rootsRef.current.querySelectorAll('path');
              const labels = rootsRef.current.querySelectorAll('text');
              
              paths.forEach((path, i) => {
                gsap.to(path, { 
                  strokeDashoffset: 0, 
                  duration: 1.5, 
                  delay: i * 0.1, 
                  ease: "power2.out" 
                });
              });
              
              labels.forEach((label, i) => {
                gsap.to(label, { opacity: 0.6, duration: 0.8, delay: 0.5 + i * 0.2 });
              });
            }
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget.querySelector('path'), { scale: 1, duration: 0.3, ease: 'power2.out' });
            
            // Retract roots
            if (rootsRef.current) {
              const paths = rootsRef.current.querySelectorAll('path');
              const labels = rootsRef.current.querySelectorAll('text');
              
              paths.forEach((path) => {
                const length = (path as SVGPathElement).getTotalLength();
                gsap.to(path, { strokeDashoffset: length, duration: 0.8, ease: "power2.in" });
              });
              
              labels.forEach((label) => {
                gsap.to(label, { opacity: 0, duration: 0.4 });
              });
              gsap.to(rootsRef.current, { opacity: 0, duration: 0.8, delay: 0.4 });
            }
          }}
        >
          <path 
            d="M-8,0 C-8,-10 8,-10 8,0 C8,10 2,12 -8,10 Z" 
            fill="url(#seedGrad)"
            stroke="#059669"
            strokeWidth="0.5"
          />
          <ellipse cx="-2" cy="-3" rx="2" ry="1.5" fill="white" fillOpacity="0.3" />
        </g>

        {/* 6. Interaction Hint / Label - Tu BEAN! */}
        <g 
          className="cursor-default select-none pointer-events-none opacity-0"
          id="seed-label-group"
        >
          <text 
            x="485" y="432" 
            className="text-[17px] font-black fill-orange-500 italic tracking-tighter"
            style={{ 
              filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.4))',
              textShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
            }}
          >
            Tu BEAN!
          </text>
          <path d="M 480,442 C 465,445 445,448 425,449" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead)" opacity="0.8" />
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#f97316" />
            </marker>
          </defs>
        </g>


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
            onBranchClick={(b) => onBranchClick?.(b)}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="fixed bottom-24 sm:bottom-10 left-4 sm:left-64 flex flex-col gap-2 bg-white/50 p-3 sm:p-4 rounded-xl backdrop-blur-sm border border-slate-100 pointer-events-none z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3 h-1.5 sm:w-4 sm:h-2 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-widest">Completado</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3 h-1.5 sm:w-4 sm:h-2 rounded-full bg-slate-200 shadow-sm" />
          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-widest">Pendiente</span>
        </div>
      </div>

      {/* Branch Labels HTML Overlay (Zoom Resilient) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <div className="relative w-full h-full max-w-[800px] aspect-square mx-auto">
          {data.branches.map((branch, i) => {
            const startAngle = -160;
            const endAngle = -20;
            const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
            const angle = startAngle + i * step;
            const length = 180 + (branch.progress / 100) * 120;
            const rad = (angle * Math.PI) / 180;
            const endX = 400 + Math.cos(rad) * length;
            const endY = 350 + Math.sin(rad) * length;
            
            return (
              <div 
                key={branch.id}
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${(endX / 800) * 100}%`, 
                  top: `${(endY / 800) * 100}%`,
                  transform: `translate(${endX > 400 ? '20px' : '-100%'}, -20px)`
                }}
              >
                <span className="text-[10px] font-black text-slate-500 bg-white/60 px-2 py-0.5 rounded shadow-sm whitespace-nowrap uppercase tracking-tighter">
                  {branch.goal}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
