'use client';

import React, { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Branch as BranchType } from './types';
import { Leaf } from './Leaf';

interface BranchProps {
  branch: BranchType;
  index: number;
  totalBranches: number;
  clickedLeafId: string | null;
  onClick: (leafId: string, name: string) => void;
  onHover: (name: string | null) => void;
  onBranchClick: (branch: BranchType) => void;
  onPhaseClick: (phaseId: string, x: number, y: number, angle?: number, startX?: number, startY?: number, branchId?: string, len?: number) => void;
  isZoomed?: boolean;
  opacity?: number;
  zoomedPhaseId?: string | null;
  currentRotation?: number;
}

export const Branch = ({ 
  branch, index, totalBranches, clickedLeafId, onClick, onHover, 
  onBranchClick, onPhaseClick, isZoomed, opacity, zoomedPhaseId,
  currentRotation = 0
}: BranchProps) => {
  const groupRef = useRef<SVGGElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  // Trunk end point MUST match LifeTree (400, 350)
  const startX = 400;
  const startY = 350;

  const angle = useMemo(() => {
    const startAngle = -160;
    const endAngle = -20;
    const step = totalBranches > 1 ? (endAngle - startAngle) / (totalBranches - 1) : 0;
    return startAngle + index * step;
  }, [index, totalBranches]);

  // --- NEW LOGIC: Grouping by Phase ---
  const { phases, phaseMap, orphans } = useMemo(() => {
    // Get all phases and initialize them with an empty activities array
    const p = branch.leaves.filter(l => l.type === 'phase').map(ph => ({ ...ph, activities: [] as typeof branch.leaves }));
    const m: Record<string, typeof branch.leaves> = {};
    const o: typeof branch.leaves = [];

    branch.leaves.forEach(l => {
      if (l.type === 'phase') return;
      const targetPhase = p.find(ph => ph.id === l.parentId);
      if (l.parentId && targetPhase) {
        targetPhase.activities.push(l);
        if (!m[l.parentId]) m[l.parentId] = [];
        m[l.parentId].push(l);
      } else {
        o.push(l);
      }
    });
    return { phases: p, phaseMap: m, orphans: o };
  }, [branch.leaves]);

  const length = 180 + (branch.progress / 100) * 100;
  const rad = (angle * Math.PI) / 180;

  const endX = startX + Math.cos(rad) * length;
  const endY = startY + Math.sin(rad) * length;

  // Natural control points: bulge slightly upward for organic feel
  const cp1x = startX + Math.cos(rad) * (length * 0.35) + Math.sin(rad) * -20;
  const cp1y = startY + Math.sin(rad) * (length * 0.1) + Math.cos(rad) * -15;
  const cp2x = startX + Math.cos(rad) * (length * 0.65) + Math.sin(rad) * -15;
  const cp2y = startY + Math.sin(rad) * (length * 0.85) + Math.cos(rad) * -10;

  const pathContent = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

  const getBezierPoint = (t: number) => {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * startX + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * endX,
      y: mt * mt * mt * startY + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * endY,
    };
  };

  // Helper for sub-branches
  const getSubBranchData = (phaseIdx: number, totalPhases: number, activityCount: number = 0) => {
    // Distribute along the main branch from 0.3 to 0.85
    const t = totalPhases > 0 ? 0.3 + (phaseIdx / totalPhases) * 0.55 : 0.6;
    const start = getBezierPoint(t);
    
    // Direction: alternating sides or consistent offset
    const side = phaseIdx % 2 === 0 ? 1 : -1;
    const subRad = rad + (0.5 * side); 
    
    // Dynamic sub-branch length based on leaf count
    const minLeafSpace = 10;
    const subLen = 30 + (activityCount * minLeafSpace);
    
    const sEndX = start.x + Math.cos(subRad) * subLen;
    const sEndY = start.y + Math.sin(subRad) * subLen;
    const sCpX = start.x + Math.cos(subRad) * subLen * 0.5 + Math.sin(subRad) * (-10 * side);
    const sCpY = start.y + Math.sin(subRad) * subLen * 0.5 + Math.cos(subRad) * (-8 * side);
    
    return {
      start,
      end: { x: sEndX, y: sEndY },
      cp: { x: sCpX, y: sCpY },
      path: `M ${start.x},${start.y} Q ${sCpX},${sCpY} ${sEndX},${sEndY}`,
      rad: subRad,
      len: subLen
    };
  };

  const branchColor = '#7c4a1e';
  const branchColorDark = '#4a2810';

  useGSAP(() => {
    const group = groupRef.current;
    if (!group) return;

    // Grow branches from root outward
    const paths = group.querySelectorAll('path.branch-stroke');
    paths.forEach((path, i) => {
      const svgPath = path as SVGPathElement;
      const pLen = svgPath.getTotalLength();
      gsap.fromTo(svgPath,
        { strokeDasharray: pLen, strokeDashoffset: pLen, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.8,
          duration: 2,
          delay: 1.2 + index * 0.2,
          ease: 'power2.inOut',
        }
      );
    });

    // Subtle sway
    gsap.to(group, {
      rotate: index % 2 === 0 ? '0.3deg' : '-0.3deg',
      duration: 8 + (index * 1.5),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: `${startX}px ${startY}px`,
    });
  }, [index]);

  return (
    <g ref={groupRef} style={{ opacity: opacity ?? 1, pointerEvents: (opacity ?? 1) < 0.1 ? 'none' : 'auto' }}>
      {/* 0. HITBOX (Rendered first so it's at the bottom) */}
      <path
        d={pathContent}
        stroke="transparent"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
        className="cursor-pointer"
        onClick={() => onBranchClick(branch)}
      />

      {/* 1. LAYER: BRANCH PATHS */}
      <g className="branch-paths-layer">
        {/* Single Main branch path for reliability */}
        <path 
          className="branch-stroke transition-all duration-700" 
          d={pathContent} 
          stroke={branchColor} 
          strokeWidth={isZoomed ? "10" : "6"} 
          fill="none" 
          strokeLinecap="round" 
        />
        
        {/* Sub-branch paths for phases */}
        {phases.map((phase, pIdx) => {
          if (zoomedPhaseId && zoomedPhaseId !== phase.id) return null;
          const sub = getSubBranchData(pIdx, phases.length, phase.activities?.length || 0);
          const tPos = 0.3 + (pIdx / phases.length) * 0.55;
          let pScale = isZoomed ? (1.2 - tPos * 0.5) : 1;
          if (zoomedPhaseId === phase.id) pScale *= 1.5;

          return (
            <path 
              key={`path-${phase.id}`}
              className="branch-stroke cursor-pointer transition-all duration-700" 
              d={sub.path} 
              stroke={branchColor} 
              strokeWidth={(2.5 * pScale) + (zoomedPhaseId === phase.id ? 2 : 0)} 
              fill="none" 
              strokeLinecap="round" 
              transform={isZoomed ? `scale(${pScale})` : undefined}
              style={isZoomed ? { transformOrigin: `${sub.start.x}px ${sub.start.y}px` } : undefined}
              onClick={(e) => {
                e.stopPropagation();
                const midX = (sub.start.x + sub.end.x) / 2;
                const midY = (sub.start.y + sub.end.y) / 2;
                onPhaseClick(phase.id, midX, midY, sub.rad, sub.start.x, sub.start.y, branch.id, sub.len);
              }}
            />
          );
        })}
      </g>

      {/* 2. LAYER: LEAVES (Rendered last to stay on top) */}
      <g className="branch-leaves-layer">
        {/* Phase Leaves */}
        {phases.map((phase, pIdx) => {
          if (zoomedPhaseId && zoomedPhaseId !== phase.id) return null;
          const sub = getSubBranchData(pIdx, phases.length, phase.activities?.length || 0);
          const tPos = 0.3 + (pIdx / phases.length) * 0.55;
          let pScale = isZoomed ? (1.2 - tPos * 0.5) : 1;
          if (zoomedPhaseId === phase.id) pScale *= 1.5;

          return (
            <g key={`leaves-group-${phase.id}`} transform={isZoomed ? `scale(${pScale})` : undefined} style={isZoomed ? { transformOrigin: `${sub.start.x}px ${sub.start.y}px` } : undefined}>
              {/* Phase Leaf at the end of sub-branch */}
              <Leaf
                leaf={phase}
                x={sub.end.x}
                y={sub.end.y}
                angle={(sub.rad * 180) / Math.PI + (60 * (pIdx % 2 === 0 ? 1 : -1))}
                delay={2.5 + index * 0.1 + pIdx * 0.2}
                isSelected={clickedLeafId === phase.id}
                onHover={onHover}
                onClick={onClick}
              />

              {/* Phase name label when zoomed into branch */}
              {isZoomed && !zoomedPhaseId && (
                <g transform={`translate(${sub.end.x}, ${sub.end.y - 12}) rotate(${-currentRotation})`}>
                  <text
                    textAnchor="middle"
                    className="fill-slate-800 font-black pointer-events-none select-none"
                    style={{ fontSize: '3px', textTransform: 'uppercase', letterSpacing: '0.05em', filter: 'drop-shadow(0 0 1.5px white)' }}
                  >
                    {phase.name}
                  </text>
                </g>
              )}

              {/* Actions belonging to this phase */}
              {phase.activities?.map((leaf, lIdx) => {
                // Distribute along the sub-branch from 0.1 to 0.95
                const t = 0.1 + (lIdx / (phase.activities.length || 1)) * 0.85;
                const mt = 1 - t;
                const px = mt * mt * sub.start.x + 2 * mt * t * sub.cp.x + t * t * sub.end.x;
                const py = mt * mt * sub.start.y + 2 * mt * t * sub.cp.y + t * t * sub.end.y;
                
                const side = lIdx % 2 === 0 ? 1 : -1;
                const offsetDist = 10 * pScale;
                const lx = px + Math.cos(sub.rad + Math.PI/2) * offsetDist * side;
                const ly = py + Math.sin(sub.rad + Math.PI/2) * offsetDist * side;

                const leafPScale = pScale * (1.1 - t * 0.4);

                return (
                  <React.Fragment key={leaf.id}>
                    {/* Stem connecting leaf to sub-branch (drawn in phase context) */}
                    {/* Natural curved stem (petiole) */}
                    <path 
                      d={`M ${px},${py} Q ${(px+lx)/2 + Math.cos(sub.rad)*2},${(py+ly)/2 + Math.sin(sub.rad)*2} ${lx},${ly}`}
                      stroke={branchColor} 
                      strokeWidth={0.4} 
                      fill="none"
                      opacity="0.5"
                    />
                    <g>
                      <Leaf
                        leaf={leaf}
                        x={lx}
                        y={ly}
                        angle={(sub.rad * 180) / Math.PI + (60 * side)}
                        delay={3 + index * 0.1 + lIdx * 0.1}
                        isSelected={clickedLeafId === leaf.id}
                        onHover={onHover}
                        onClick={onClick}
                      />
                      {/* Activity name label when zoomed into phase */}
                      {zoomedPhaseId === phase.id && (
                        <g transform={`translate(${lx + (side > 0 ? 8 : -8)}, ${ly}) rotate(${-currentRotation})`}>
                          <text
                            x={side > 0 ? 17.5 : -17.5}
                            y={1}
                            textAnchor="middle"
                            className="fill-slate-600 font-black pointer-events-none select-none"
                            style={{ fontSize: '1.8px', textTransform: 'uppercase', letterSpacing: '0.02em', filter: 'drop-shadow(0 0 1px white)' }}
                          >
                            {leaf.name.length > 25 ? leaf.name.substring(0, 22) + '...' : leaf.name}
                          </text>
                        </g>
                      )}
                    </g>
                  </React.Fragment>
                );
              })}
            </g>
          );
        })}

        {/* Orphan actions on main branch */}
        {!zoomedPhaseId && orphans.map((leaf, oIdx) => {
          const t = 0.4 + (oIdx / orphans.length) * 0.5;
          const pos = getBezierPoint(t);
          
          const side = oIdx % 2 === 0 ? 1 : -1;
          const offsetDist = 14;
          const radAngle = (angle * Math.PI) / 180;
          const lx = pos.x + Math.cos(radAngle + Math.PI/2) * offsetDist * side;
          const ly = pos.y + Math.sin(radAngle + Math.PI/2) * offsetDist * side;

          const leafPScale = isZoomed ? (1.3 - t * 0.6) : 1;

          return (
            <React.Fragment key={leaf.id}>
              {/* Stem connecting orphan leaf to main branch */}
              {/* Natural curved stem (petiole) for orphan */}
              <path 
                d={`M ${pos.x},${pos.y} Q ${(pos.x+lx)/2 + Math.cos(radAngle)*3},${(pos.y+ly)/2 + Math.sin(radAngle)*3} ${lx},${ly}`}
                stroke={branchColor} 
                strokeWidth={0.5} 
                fill="none"
                opacity="0.5"
              />
              <g transform={isZoomed ? `scale(${leafPScale})` : undefined} style={isZoomed ? { transformOrigin: `${lx}px ${ly}px` } : undefined}>
                <Leaf
                  leaf={leaf}
                  x={lx}
                  y={ly}
                  angle={angle + (60 * side)}
                  delay={2.5 + index * 0.1 + oIdx * 0.1}
                  isSelected={clickedLeafId === leaf.id}
                  onHover={onHover}
                  onClick={onClick}
                />
              </g>
            </React.Fragment>
          );
        })}
      </g>
    </g>
  );
};
