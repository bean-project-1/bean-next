'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TreeData, Branch as BranchData } from './types';
import { Branch } from './Branch';
import { LifeTreeCoach } from './LifeTreeCoach';

interface LifeTreeProps {
  data: TreeData;
  onLeafClick?: (leafId: string) => void;
  onScoreClick?: () => void;
  onBranchClick?: (branch: BranchData) => void;
  onRefresh?: () => void;
}

export const LifeTree = ({ data, onLeafClick, onScoreClick, onBranchClick, onRefresh }: LifeTreeProps) => {
  const router = useRouter();
  const [hoveredLeafName, setHoveredLeafName] = useState<string | null>(null);
  const [clickedLeafId, setClickedLeafId] = useState<string | null>(null);
  const [zoomedBranchId, setZoomedBranchId] = useState<string | null>(null);
  const [zoomedPhaseId, setZoomedPhaseId] = useState<string | null>(null);
  const [isPlanting, setIsPlanting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trunkRef = useRef<SVGGElement>(null);
  const seedRef = useRef<SVGGElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 800 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  useGSAP(() => {
    const tl = gsap.timeline();
    // 1. Initial UI fade-ins
    tl.fromTo(scoreRef.current, 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // 3. Trunk growth from root upward
    if (trunkRef.current) {
      tl.fromTo(trunkRef.current,
        { scaleY: 0, transformOrigin: "400px 452px", opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1.5, ease: "power2.out" },
        "-=0.5"
      );
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

  // Animation for "Planting" state
  useGSAP(() => {
    if (isPlanting && seedRef.current) {
      gsap.to(seedRef.current, {
        scale: 1.3,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      // Add a glow effect
      gsap.to(seedRef.current.querySelector('path'), {
        filter: "drop-shadow(0 0 20px #10b981)",
        duration: 0.8,
        repeat: -1,
        yoyo: true,
      });
    } else if (seedRef.current) {
      gsap.killTweensOf(seedRef.current);
      gsap.to(seedRef.current, { scale: 1, duration: 0.5 });
      gsap.to(seedRef.current.querySelector('path'), { filter: "none", duration: 0.5 });
    }
  }, [isPlanting]);

  const handleBranchClick = (branch: BranchData) => {
    if (zoomedBranchId === branch.id) {
      resetZoom();
    } else {
      setZoomedBranchId(branch.id);
      
      // Hide trunk smoothly
      gsap.to([trunkRef.current, seedRef.current, "#seed-label-group"], { 
        opacity: 0, 
        duration: 0.5, 
        ease: "power2.out" 
      });

      const startAngle = -160;
      const endAngle = -20;
      const index = data.branches.findIndex(b => b.id === branch.id);
      const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
      const angle = startAngle + index * step;
      const length = 180 + (branch.progress / 100) * 120;
      const rad = (angle * Math.PI) / 180;
      
      const midX = 400 + Math.cos(rad) * (length * 0.6);
      const midY = 350 + Math.sin(rad) * (length * 0.6);
      
      const zoomSize = 220;
      const targetX = midX - zoomSize / 2;
      const targetY = midY - zoomSize / 2;
      
      gsap.to(viewBox, {
        x: targetX,
        y: targetY,
        w: zoomSize,
        h: zoomSize,
        duration: 1.5,
        ease: "power4.inOut",
        onUpdate: () => setViewBox({ ...viewBox })
      });
    }
    onBranchClick?.(branch);
  };

  const handlePhaseClick = (phaseId: string, x: number, y: number) => {
    if (zoomedPhaseId === phaseId) {
      setZoomedPhaseId(null);
      const branch = data.branches.find(b => b.id === zoomedBranchId);
      if (branch) handleBranchClick(branch);
    } else {
      setZoomedPhaseId(phaseId);
      const zoomSize = 120;
      const targetX = x - zoomSize / 2;
      const targetY = y - zoomSize / 2;
      
      const v = { ...viewBox };
      gsap.to(v, {
        x: targetX,
        y: targetY,
        w: zoomSize,
        h: zoomSize,
        duration: 1.5,
        ease: "power4.inOut",
        onUpdate: () => setViewBox({ ...v })
      });
    }
  };

  const resetZoom = () => {
    setZoomedBranchId(null);
    setZoomedPhaseId(null);
    
    // Show trunk smoothly
    gsap.to([trunkRef.current, seedRef.current, "#seed-label-group"], { 
      opacity: 1, 
      duration: 1, 
      ease: "power2.inOut",
      delay: 0.2
    });

    const v = { ...viewBox };
    gsap.to(v, {
      x: 0,
      y: 0,
      w: 800,
      h: 800,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => setViewBox({ ...v })
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const factor = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
    
    // Zoom relative to current view center or mouse position?
    // Let's do simple center zoom for now
    const newW = Math.max(100, Math.min(2000, viewBox.w * factor));
    const newH = Math.max(100, Math.min(2000, viewBox.h * factor));
    const dx = (viewBox.w - newW) / 2;
    const dy = (viewBox.h - newH) / 2;

    setViewBox({
      x: viewBox.x + dx,
      y: viewBox.y + dy,
      w: newW,
      h: newH
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click for pan
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const dx = (e.clientX - panStart.current.x) * (viewBox.w / (svgRef.current?.clientWidth || 800));
    const dy = (e.clientY - panStart.current.y) * (viewBox.h / (svgRef.current?.clientHeight || 800));

    setViewBox({
      ...viewBox,
      x: viewBox.x - dx,
      y: viewBox.y - dy
    });
    
    panStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsPanning(false);

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
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-white font-sans overflow-hidden z-10">
      {/* Top Score Indicator */}
      <div 
        ref={scoreRef}
        className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-50 cursor-pointer group"
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
        <div className="fixed bottom-10 right-10 flex flex-col items-end pointer-events-none transition-opacity duration-300 z-50">
          <span className="text-3xl font-light text-slate-400 tracking-tight uppercase">
            {lifeState}
          </span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">ESTADO ACTUAL</span>
        </div>
      )}

      {(zoomedBranchId || viewBox.w !== 800) && (
        <button 
          onClick={resetZoom}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-black transition-all z-50 animate-in fade-in slide-in-from-bottom-4"
        >
          🔍 Ver Árbol Completo
        </button>
      )}

      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'} transition-all duration-300`}
        xmlns="http://www.w3.org/2000/svg"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
        {!zoomedBranchId && (
          <>
            <ellipse cx="400" cy="454" rx="70" ry="12" fill="#2d1a0e" opacity="0.6" filter="blur(6px)" />
            <ellipse cx="400" cy="452" rx="50" ry="8" fill="#1a0f08" opacity="0.8" />
          </>
        )}

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
        {!zoomedBranchId && (
          <g 
            ref={seedRef} 
            transform="translate(400, 450)" 
            className="cursor-pointer group"
            onClick={() => router.push('/dna')}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget.querySelector('path'), { scale: 1.1, duration: 0.3, ease: 'power2.out' });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget.querySelector('path'), { scale: 1, duration: 0.3, ease: 'power2.out' });
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
        )}

        {/* 6. Interaction Hint / Label - Tu BEAN! */}
        {!zoomedBranchId && (
          <g className="cursor-default select-none pointer-events-none opacity-0" id="seed-label-group">
            <text x="485" y="432" className="text-[17px] font-black fill-orange-500 italic tracking-tighter"
              style={{ filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.4))', textShadow: '0 0 20px rgba(249, 115, 22, 0.2)' }}>
              Tu BEAN!
            </text>
            <path d="M 480,442 C 465,445 445,448 425,449" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead)" opacity="0.8" />
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#f97316" />
              </marker>
            </defs>
          </g>
        )}


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
            onBranchClick={handleBranchClick}
            onPhaseClick={handlePhaseClick}
            isZoomed={zoomedBranchId === branch.id}
            hide={zoomedBranchId !== null && zoomedBranchId !== branch.id}
            zoomedPhaseId={zoomedPhaseId}
          />
        ))}

        {/* Branch Labels inside SVG - Zoom Resilient */}
        {!zoomedBranchId && data.branches.map((branch, i) => {
          const startAngle = -160;
          const endAngle = -20;
          const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
          const angle = startAngle + i * step;
          const length = 180 + (branch.progress / 100) * 120;
          const rad = (angle * Math.PI) / 180;
          const endX = 400 + Math.cos(rad) * length;
          const endY = 350 + Math.sin(rad) * length;
          
          return (
            <g key={branch.id} className="pointer-events-none">
              <rect 
                x={endX + (endX > 400 ? 5 : -105)} 
                y={endY - 25} 
                width="100" 
                height="20" 
                rx="4" 
                fill="white" 
                fillOpacity="0.8" 
                className="shadow-sm"
              />
              <text 
                x={endX + (endX > 400 ? 55 : -55)} 
                y={endY - 10} 
                textAnchor="middle" 
                dominantBaseline="middle"
                className="text-[10px] font-black fill-slate-500 uppercase tracking-tighter"
                fontSize="10"
              >
                {branch.goal.length > 15 ? branch.goal.substring(0, 15) + '...' : branch.goal}
              </text>
            </g>
          );
        })}

      </svg>

      {/* Integrated Coach */}
      <LifeTreeCoach 
        onPlanGenerated={() => onRefresh?.()} 
        onPlantingStateChange={setIsPlanting}
      />

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


    </div>
  );
};
