'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  onRefresh?: () => void;
  onDeleteBranch?: (branch: BranchData) => void;
  onEditBranch?: (branch: BranchData | null) => void;
  onPhaseClick?: (phaseId: string | null) => void;
  onTrunkClick?: () => void;
  activePhaseId?: string | null;
  activeLeafId?: string | null;
  isInteractive?: boolean;
  spaceName?: string;
}

export const LifeTree = ({ data, onLeafClick, onScoreClick, onBranchClick, onRefresh, onDeleteBranch, onEditBranch, onPhaseClick, onTrunkClick, activePhaseId, activeLeafId, isInteractive = true, spaceName }: LifeTreeProps) => {
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
  const seedLabelRef = useRef<SVGGElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  // We adjust the initial viewBox to 1000x1000 to ensure wide branches and labels are never cut off by SVG boundaries.
  const [viewBox, setViewBox] = useState({ x: -100, y: -100, w: 1000, h: 1000 });
  const [rotation, setRotation] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // No more offset needed.
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    // 1. Initial UI fade-ins
    if (scoreRef.current) {
      tl.fromTo(scoreRef.current, 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }

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
      if (seedLabelRef.current) {
        tl.to(seedLabelRef.current, { opacity: 1, duration: 1.5, ease: "power2.out" }, ">");
      }
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
    onEditBranch?.(branch); // Always trigger the UI to open the panel
    
    if (zoomedBranchId !== branch.id) {
      setZoomedBranchId(branch.id);
      
      const startAngle = -160;
      const endAngle = -20;
      const index = data.branches.findIndex(b => b.id === branch.id);
      const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
      const angle = startAngle + index * step;
      
      // Sync with Branch.tsx lengths
      const length = 180 + (branch.progress / 100) * 100;
      
      let targetRot = -90 - angle;
      
      // Pivot is (400, 350). Since we rotate around it, the pivot's position doesn't change relative to the SVG.
      // We want (400, 350) to be at the bottom-center of the zoomed view.
      // Dynamic zoom based on branch length
      const zoomSize = length * 1.5; // Increased slightly for better view
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      
      // Desktop: Shift camera right by 20% (branch moves left). Mobile: Center X.
      const targetX = isMobile ? 400 - zoomSize / 2 : (400 - zoomSize / 2) + (zoomSize * 0.2);
      // Desktop: Center Y. Mobile: Shift camera down significantly so branch is at the top of the screen (visible area).
      const targetY = isMobile ? 350 - zoomSize * 0.25 : 350 - zoomSize * 0.85;

      gsap.to(viewBox, {
        x: targetX,
        y: targetY,
        w: zoomSize,
        h: zoomSize,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => setViewBox({ ...viewBox })
      });

      // Normalize target rotation to shortest path
      const currentRot = rotation;
      const diff = ((targetRot - currentRot + 180) % 360 + 360) % 360 - 180;
      targetRot = currentRot + diff;

      const rotObj = { r: currentRot };
      gsap.to(rotObj, {
        r: targetRot,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => setRotation(rotObj.r)
      });
    }
    onBranchClick?.(branch);
  };

  const handlePhaseClick = (phaseId: string, x: number, y: number, angle?: number, startX?: number, startY?: number, branchId?: string, len?: number) => {
    onPhaseClick?.(phaseId); // Always sync with sidebar
    if (branchId) {
      const branch = data.branches.find(b => b.id === branchId);
      if (branch) onEditBranch?.(branch); // Always trigger management UI
    }

    if (zoomedPhaseId === phaseId) {
      setZoomedPhaseId(null);
      const branch = data.branches.find(b => b.id === zoomedBranchId);
      if (branch) handleBranchClick(branch);
    } else {
      setZoomedPhaseId(phaseId);
      
      // If we clicked directly from full tree, we must also set the zoomed branch
      if (branchId && zoomedBranchId !== branchId) {
        setZoomedBranchId(branchId);
      }

      if (angle !== undefined && startX !== undefined && startY !== undefined) {
        const angleDeg = (angle * 180) / Math.PI;
        let targetRot = -90 - angleDeg;
        
        // Target zoom area centered around the rotated start point
        const zoomSize = len ? (len * 2.5) : 420;
        
        // To keep the point centered after rotation, we must focus the viewBox 
        // on where the point WILL BE after rotating around (400, 350).
        const targetRad = (targetRot * Math.PI) / 180;
        const px = 400, py = 350;
        
        // Target rotated position of (startX, startY)
        const rx = Math.cos(targetRad) * (startX - px) - Math.sin(targetRad) * (startY - py) + px;
        const ry = Math.sin(targetRad) * (startX - px) + Math.cos(targetRad) * (startY - py) + py;

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

        // Desktop: Shift camera right by 20% (phase moves left). Mobile: Center X.
        const targetX = isMobile ? rx - zoomSize / 2 : (rx - zoomSize / 2) + (zoomSize * 0.2);
        // Desktop: Center Y. Mobile: Shift camera down significantly so phase is at the top of the screen (visible area).
        const targetY = isMobile ? ry - zoomSize * 0.2 : ry - zoomSize * 0.9;

        gsap.to(viewBox, {
          x: targetX,
          y: targetY,
          w: zoomSize,
          h: zoomSize,
          duration: 0.6,
          ease: "power3.out",
          onUpdate: () => setViewBox({ ...viewBox })
        });

        const currentRot = rotation;
        const diff = ((targetRot - currentRot + 180) % 360 + 360) % 360 - 180;
        targetRot = currentRot + diff;

        const rotObj = { r: currentRot };
        gsap.to(rotObj, {
          r: targetRot,
          duration: 0.6,
          ease: "power3.out",
          onUpdate: () => setRotation(rotObj.r)
        });
      }
    }
  };

  const resetZoom = () => {
    setZoomedBranchId(null);
    setZoomedPhaseId(null);
    onEditBranch?.(null); // Notify parent to close the panel
    onPhaseClick?.(null); // Clear phase selection

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    gsap.to(viewBox, {
      x: -100,
      y: -100,
      w: 1000,
      h: 1000,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => setViewBox({ ...viewBox })
    });

    const rotObj = { r: rotation };
    
    // Normalize current rotation so it always takes the shortest path to 0
    let currentRot = rotation;
    const diff = ((0 - currentRot + 180) % 360 + 360) % 360 - 180;
    const targetRot = currentRot + diff;

    gsap.to(rotObj, {
      r: targetRot,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => setRotation(rotObj.r)
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isInteractive) return;
    e.preventDefault();
    const zoomFactor = 1.05; // Smoother manual zoom step
    const factor = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
    
    const newW = Math.max(100, Math.min(2000, viewBox.w * factor));
    const newH = Math.max(100, Math.min(2000, viewBox.h * factor));
    
    // If scrolling out while focused on a branch
    if (zoomedBranchId && e.deltaY > 0) {
      // 1. Auto-reset completely if they zoom out wide enough
      if (newW >= 650) {
        resetZoom();
        return;
      }
      
      // 2. Smoothly "relax" the rotation towards upright (0 degrees)
      const currentRot = rotation;
      const diff = ((0 - currentRot + 180) % 360 + 360) % 360 - 180;
      // Move 10% towards zero per scroll tick
      setRotation(currentRot + (diff * 0.1));
    }

    const dx = (viewBox.w - newW) / 2;
    const dy = (viewBox.h - newH) / 2;

    setViewBox({
      x: viewBox.x + dx,
      y: viewBox.y + dy,
      w: newW,
      h: newH
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return; // Only left click for pan if using mouse
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
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

  const handlePointerUp = () => setIsPanning(false);

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

  // Note: We use CSS transitions based on zoomedBranchId instead of dynamicOpacity
  // so manual mouse wheel scrolling doesn't accidentally fade out the tree.

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-transparent font-sans overflow-hidden z-10">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className={`w-full h-full ${isInteractive ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-auto'} transition-all duration-300`}
        style={{ touchAction: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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

        <g transform={`rotate(${rotation}, 400, 350)`}>
          {/* 1. Ground / Soil Mound */}
          {!zoomedBranchId && (
            <>
              <ellipse cx="400" cy="454" rx="70" ry="12" fill="#2d1a0e" opacity="0.6" filter="blur(6px)" />
              <ellipse cx="400" cy="452" rx="50" ry="8" fill="#1a0f08" opacity="0.8" />
            </>
          )}

          {/* 3. Realistic Trunk */}
          <g 
            ref={trunkRef} 
            className={`transition-opacity duration-700 ease-out ${onTrunkClick ? 'cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'pointer-events-none'}`}
            style={{ opacity: zoomedBranchId ? 0 : 1 }}
            onClick={onTrunkClick}
          >
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
            <g ref={seedLabelRef} className="cursor-default select-none pointer-events-none opacity-0" id="seed-label-group">
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

          {/* 7. Tree Name Label (Perfectly aligned below roots) */}
          {spaceName && (
            <text 
              x="400" 
              y="540" 
              textAnchor="middle" 
              className={`text-[42px] font-black uppercase tracking-widest transition-opacity duration-500`}
              style={{ fill: '#1e293b', textShadow: '0px 2px 15px rgba(255,255,255,0.9), 0px -2px 15px rgba(255,255,255,0.9)', opacity: isInteractive ? 0 : 1 }}
            >
              {spaceName}
            </text>
          )}

          {/* Dynamic Branches */}
          {data.branches.map((branch, i) => {
            // Fade out other branches smoothly when focused on one
            const branchOpacity = (zoomedBranchId && zoomedBranchId !== branch.id) ? 0 : 1;

            return (
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
                onEdit={onEditBranch}
                onDelete={onDeleteBranch}
                isZoomed={zoomedBranchId === branch.id}
                opacity={branchOpacity}
                zoomedPhaseId={zoomedBranchId === branch.id ? zoomedPhaseId : null}
                activeLeafId={activeLeafId}
                activePhaseId={activePhaseId}
                currentRotation={rotation}
              />
            );
          })}

          {/* Branch Labels inside SVG - Zoom Resilient */}
          {data.branches.map((branch, i) => {
            const startAngle = -160;
            const endAngle = -20;
            const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
            const angle = startAngle + i * step;
            const length = 240 + (branch.progress / 100) * 150; // Sync with Branch.tsx
            const rad = (angle * Math.PI) / 180;
            const endX = 400 + Math.cos(rad) * length;
            const endY = 350 + Math.sin(rad) * length;
            
            let labelOpacity = 1;
            if (zoomedBranchId !== null) {
              const threshold = 600;
              const range = 800 - threshold;
              labelOpacity = Math.max(0, Math.min(1, (viewBox.w - threshold) / range));
            }

            if (labelOpacity <= 0) return null;

            // Split long names into lines
            const words = branch.goal.split(' ');
            const lines: string[] = [];
            let currentLine = '';
            
            // Use narrower text blocks on mobile so they don't hit the screen edges
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            const maxChars = isMobile ? 12 : 20;

            words.forEach(word => {
              if ((currentLine + word).length > maxChars) {
                if (currentLine) lines.push(currentLine.trim());
                currentLine = word + ' ';
              } else {
                currentLine += word + ' ';
              }
            });
            if (currentLine) lines.push(currentLine.trim());

            return (
              <g 
                key={`label-${branch.id}`} 
                className="pointer-events-none transition-opacity duration-300" 
                style={{ opacity: labelOpacity }}
                transform={`rotate(${-rotation}, ${endX}, ${endY})`}
              >
                <text 
                  x={endX + (endX > 400 ? 15 : -15)} 
                  y={endY - (lines.length - 1) * 6} 
                  textAnchor={endX > 400 ? "start" : "end"} 
                  dominantBaseline="middle"
                  className="text-[11px] font-black fill-slate-600 uppercase tracking-tight"
                  style={{ textShadow: '0px 2px 4px rgba(255,255,255,0.9), 0px -2px 4px rgba(255,255,255,0.9), 2px 0px 4px rgba(255,255,255,0.9), -2px 0px 4px rgba(255,255,255,0.9), 0px 0px 8px rgba(255,255,255,1)' }}
                >
                  {lines.map((line, lIdx) => (
                    <tspan 
                      key={lIdx} 
                      x={endX + (endX > 400 ? 15 : -15)} 
                      dy={lIdx === 0 ? 0 : 12}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>

      </svg>

      {/* Interaction Hints - Floating Cursor Tooltip */}
      {hoveredLeafName && (
        <div 
          className="fixed pointer-events-none bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-100 z-[9999] animate-in fade-in zoom-in duration-200"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y + 20,
            maxWidth: '280px'
          }}
        >
          <p className="text-slate-700 font-bold tracking-tight text-xs leading-snug">
            {hoveredLeafName}
          </p>
        </div>
      )}

      {(() => {
        if (!isInteractive) return null;
        const isDefaultView = 
          Math.abs(viewBox.w - 1000) < 1 && 
          Math.abs(viewBox.x - (-100)) < 1 && 
          Math.abs(viewBox.y - (-100)) < 1 && 
          Math.abs(rotation) < 1;
          
        return (zoomedBranchId || !isDefaultView) ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              resetZoom();
            }}
            className="absolute top-24 left-4 sm:top-8 sm:left-8 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 rounded-full shadow-xl hover:bg-slate-900 hover:text-white hover:scale-105 transition-all z-[9999] animate-in fade-in slide-in-from-top-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        ) : null;
      })()}

    </div>
  );
};
