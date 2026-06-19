'use client';

import React, { useMemo, useRef, useEffect } from 'react';
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
  onEdit?: (branch: BranchType) => void;
  onDelete?: (branch: BranchType) => void;
  isZoomed?: boolean;
  zoomedPhaseId?: string | null;
  activeLeafId?: string | null;
  activePhaseId?: string | null;
  currentRotation?: number;
  opacity?: number;
}

export const Branch = ({ 
  branch, index, totalBranches, clickedLeafId, onClick, onHover, 
  onBranchClick, onPhaseClick, onEdit, onDelete, isZoomed, opacity, zoomedPhaseId,
  activeLeafId, activePhaseId, currentRotation = 0
}: BranchProps) => {
  const groupRef = useRef<SVGGElement>(null);

  // Trunk end point MUST match LifeTree (400, 350)
  const startX = 400;
  const startY = 350;

  const angle = useMemo(() => {
    const startAngle = -160;
    const endAngle = -20;
    const step = totalBranches > 1 ? (endAngle - startAngle) / (totalBranches - 1) : 0;
    return startAngle + index * step;
  }, [index, totalBranches]);

  // --- Grouping by Phase ---
  const { phases, orphans } = useMemo(() => {
    const p = branch.leaves.filter(l => l.type === 'phase').map(ph => ({ ...ph, activities: [] as typeof branch.leaves }));
    const o: typeof branch.leaves = [];

    branch.leaves.forEach(l => {
      if (l.type === 'phase') return;
      
      const targetPhase = p.find(ph => ph.id === l.parentId);
      
      if (l.parentId && targetPhase) {
        if (l.tasks && l.tasks.length > 0) {
          l.tasks.forEach((subtask: any) => {
            targetPhase.activities.push({
              ...l,
              id: `${l.id}-sub-${subtask.id}`,
              originalId: l.id,
              name: subtask.title || subtask.name,
              completed: subtask.isCompleted || subtask.completed,
              tasks: []
            });
          });
        } else {
          targetPhase.activities.push(l);
        }
      } else {
        if (l.tasks && l.tasks.length > 0) {
          l.tasks.forEach((subtask: any) => {
            o.push({
              ...l,
              id: `${l.id}-sub-${subtask.id}`,
              originalId: l.id,
              name: subtask.title || subtask.name,
              completed: subtask.isCompleted || subtask.completed,
              tasks: []
            });
          });
        } else {
          o.push(l);
        }
      }
    });
    return { phases: p, orphans: o };
  }, [branch.leaves]);

  const length = 180 + (branch.progress / 100) * 100;
  const rad = (angle * Math.PI) / 180;

  const endX = startX + Math.cos(rad) * length;
  const endY = startY + Math.sin(rad) * length;

  // Natural control points
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
    const t = totalPhases > 0 ? 0.3 + (phaseIdx / totalPhases) * 0.55 : 0.6;
    const start = getBezierPoint(t);
    
    const side = phaseIdx % 2 === 0 ? 1 : -1;
    const subRad = rad + (0.5 * side); 
    
    const minLeafSpace = 8; // Increased space for easier clicking
    const subLen = 40 + (activityCount * minLeafSpace);
    
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

  // Auto-focus camera on phase if requested by UI
  useEffect(() => {
    if (activePhaseId && activePhaseId !== zoomedPhaseId) {
      const phaseIdx = phases.findIndex(p => p.id === activePhaseId);
      if (phaseIdx !== -1) {
        const phase = phases[phaseIdx];
        const sub = getSubBranchData(phaseIdx, phases.length, phase.activities?.length || 0);
        const midX = (sub.start.x + sub.end.x) / 2;
        const midY = (sub.start.y + sub.end.y) / 2;
        onPhaseClick(phase.id, midX, midY, sub.rad, sub.start.x, sub.start.y, branch.id, sub.len);
      }
    }
  }, [activePhaseId, zoomedPhaseId, phases]);

  const branchColor = '#7c4a1e';

  useGSAP(() => {
    const group = groupRef.current;
    if (!group) return;

    // Grow branches from root outward
    const paths = group.querySelectorAll('path.branch-stroke');
    paths.forEach((path) => {
      const svgPath = path as SVGPathElement;
      const pLen = svgPath.getTotalLength();
      gsap.fromTo(svgPath,
        { strokeDasharray: pLen, strokeDashoffset: pLen, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 0.8,
          duration: 2,
          delay: 0.8 + index * 0.15,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(svgPath, { clearProps: 'strokeDasharray,strokeDashoffset' });
          }
        }
      );
    });

    // Animate leaf stems (petioles) to appear with leaves
    const stems = group.querySelectorAll('path.leaf-stem');
    stems.forEach((stem) => {
      gsap.fromTo(stem,
        { opacity: 0, scale: 0 },
        { opacity: 0.5, scale: 1, duration: 0.8, delay: 2.8, ease: "back.out(1.2)" }
      );
    });
  }, [index, branch.leaves.length]);

  return (
    <g 
      ref={groupRef}
      style={{ opacity: opacity ?? 1, pointerEvents: (opacity ?? 1) < 0.2 ? 'none' : 'auto', transition: 'opacity 0.7s ease' }}
    >
      {/* 1. MAIN BRANCH */}
      <g 
        className="group/main-branch cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onBranchClick(branch);
        }}
        onMouseEnter={() => onHover(branch.goal)}
        onMouseLeave={() => onHover(null)}
      >
        {/* MASSIVE INVISIBLE HITBOX FOR EASY CLICKING */}
        <path
          d={pathContent}
          stroke="transparent"
          strokeWidth="40"
          fill="none"
          strokeLinecap="round"
          style={{ pointerEvents: 'visibleStroke' }}
        />
        
        {/* VISUAL MAIN BRANCH */}
        <path 
          className="branch-stroke transition-all duration-300 ease-out group-hover/main-branch:stroke-[12] group-hover/main-branch:opacity-100" 
          d={pathContent} 
          stroke={branchColor} 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
        />
      </g>

      {/* 2. PHASES (SUB-BRANCHES) */}
      {phases.map((phase, pIdx) => {
        const sub = getSubBranchData(pIdx, phases.length, phase.activities?.length || 0);
        // Fade out other phases when one is focused
        const phaseOpacity = (zoomedPhaseId && zoomedPhaseId !== phase.id) ? 0.15 : 1;

        return (
          <g 
            key={`phase-${phase.id}`} 
            className="group/phase cursor-pointer"
            style={{ 
              opacity: phaseOpacity, 
              pointerEvents: phaseOpacity < 0.2 ? 'none' : 'auto',
              transition: 'opacity 0.6s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              const midX = (sub.start.x + sub.end.x) / 2;
              const midY = (sub.start.y + sub.end.y) / 2;
              onPhaseClick(phase.id, midX, midY, sub.rad, sub.start.x, sub.start.y, branch.id, sub.len);
            }}
            onMouseEnter={() => onHover(phase.name)}
            onMouseLeave={() => onHover(null)}
          >
            {/* MASSIVE INVISIBLE HITBOX FOR SUB-BRANCH */}
            <path 
              d={sub.path} 
              stroke="transparent" 
              strokeWidth="40" 
              fill="none" 
              strokeLinecap="round" 
              style={{ pointerEvents: 'visibleStroke' }}
            />
            
            {/* VISUAL SUB-BRANCH */}
            <path 
              className="branch-stroke transition-all duration-300 ease-out group-hover/phase:stroke-[6] group-hover/phase:opacity-100" 
              d={sub.path} 
              stroke={branchColor} 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
            />

            {/* PHASE CULMINATION LEAF (AT THE END) */}
            {(() => {
              const phaseMilestone = phase.activities?.find(a => a.type === 'milestone');
              const tipLeaf = phaseMilestone || phase;
              return (
                <Leaf
                  leaf={tipLeaf}
                  x={sub.end.x}
                  y={sub.end.y}
                  angle={tipLeaf.type === 'milestone' ? (80 + (pIdx % 3) * 10) : ((sub.rad * 180) / Math.PI + (60 * (pIdx % 2 === 0 ? 1 : -1)))}
                  delay={2.8 + index * 0.1 + pIdx * 0.1}
                  isSelected={clickedLeafId === tipLeaf.id}
                  isActive={activeLeafId === tipLeaf.id}
                  onHover={onHover}
                  onClick={onClick}
                />
              );
            })()}

            {/* ACTIVITIES IN THIS PHASE (EXCLUDING MILESTONE) */}
            {phase.activities?.filter(a => a.type !== 'milestone').map((leaf, lIdx, filteredArr) => {
              const t = 0.1 + (lIdx / (filteredArr.length || 1)) * 0.85;
              const mt = 1 - t;
              const px = mt * mt * sub.start.x + 2 * mt * t * sub.cp.x + t * t * sub.end.x;
              const py = mt * mt * sub.start.y + 2 * mt * t * sub.cp.y + t * t * sub.end.y;
              
              const side = lIdx % 2 === 0 ? 1 : -1;
              const offsetDist = 12; // Fixed offset
              const lx = px + Math.cos(sub.rad + Math.PI/2) * offsetDist * side;
              const ly = py + Math.sin(sub.rad + Math.PI/2) * offsetDist * side;

              return (
                <React.Fragment key={leaf.id}>
                  <path 
                    className="leaf-stem"
                    d={`M ${px},${py} Q ${(px+lx)/2 + Math.cos(sub.rad)*2},${(py+ly)/2 + Math.sin(sub.rad)*2} ${lx},${ly}`}
                    stroke={branchColor} 
                    strokeWidth={0.5} 
                    fill="none"
                    opacity="0.6"
                  />
                  <Leaf
                    leaf={leaf}
                    x={lx}
                    y={ly}
                    angle={(sub.rad * 180) / Math.PI + (60 * side)}
                    delay={3.0 + index * 0.1 + lIdx * 0.1}
                    isSelected={clickedLeafId === leaf.id}
                    isActive={activeLeafId === leaf.id}
                    onHover={onHover}
                    onClick={onClick}
                  />
                </React.Fragment>
              );
            })}
          </g>
        );
      })}

      {/* 3. ORPHANS (LEAVES ON MAIN BRANCH) */}
      <g style={{ opacity: zoomedPhaseId ? 0.15 : 1, pointerEvents: zoomedPhaseId ? 'none' : 'auto', transition: 'opacity 0.6s ease' }}>
        {orphans.map((leaf, oIdx) => {
          const t = 0.4 + (oIdx / orphans.length) * 0.5;
          const pos = getBezierPoint(t);
          const side = oIdx % 2 === 0 ? 1 : -1;
          const offsetDist = 16;
          const radAngle = (angle * Math.PI) / 180;
          const lx = pos.x + Math.cos(radAngle + Math.PI/2) * offsetDist * side;
          const ly = pos.y + Math.sin(radAngle + Math.PI/2) * offsetDist * side;

          return (
            <React.Fragment key={leaf.id}>
              <path 
                className="leaf-stem"
                d={`M ${pos.x},${pos.y} Q ${(pos.x+lx)/2 + Math.cos(radAngle)*3},${(pos.y+ly)/2 + Math.sin(radAngle)*3} ${lx},${ly}`}
                stroke={branchColor} 
                strokeWidth={0.6} 
                fill="none"
                opacity="0.6"
              />
              <Leaf
                leaf={leaf}
                x={lx}
                y={ly}
                angle={angle + (60 * side)}
                delay={2.8 + index * 0.1 + oIdx * 0.1}
                isSelected={clickedLeafId === leaf.id}
                isActive={activeLeafId === leaf.id}
                onHover={onHover}
                onClick={onClick}
              />
            </React.Fragment>
          );
        })}
      </g>
    </g>
  );
};
