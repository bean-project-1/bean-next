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
}

export const Branch = ({ branch, index, totalBranches, clickedLeafId, onClick, onHover }: BranchProps) => {
  const pathRef = useRef<SVGPathElement>(null);
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

  const length = 180 + (branch.progress / 100) * 120;
  const rad = (angle * Math.PI) / 180;
  
  const endX = startX + Math.cos(rad) * length;
  const endY = startY + Math.sin(rad) * length;
  
  const cp1x = startX + Math.cos(rad) * (length * 0.4);
  const cp1y = startY + Math.sin(rad) * (length * 0.1); 
  const cp2x = startX + Math.cos(rad) * (length * 0.6);
  const cp2y = startY + Math.sin(rad) * (length * 0.9);

  const pathContent = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

  const getBezierPoint = (t: number) => {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * startX + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * endX,
      y: mt * mt * mt * startY + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * endY
    };
  };

  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    
    // Growth animation with organic build
    gsap.fromTo(path,
      { strokeDasharray: length, strokeDashoffset: length, opacity: 0, strokeWidth: 1 },
      { 
        strokeDashoffset: 0, 
        opacity: 0.3, 
        strokeWidth: 3,
        duration: 2.5, 
        delay: 1.2 + index * 0.2, 
        ease: "power2.inOut" 
      }
    );

    // Subtle branch sway
    gsap.to(path, {
      rotate: index % 2 === 0 ? "1deg" : "-1deg",
      duration: 5 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: `${startX}px ${startY}px`
    });

    // Fade in text
    gsap.fromTo(textRef.current,
      { opacity: 0, x: endX > startX ? -10 : 10 },
      { opacity: 0.6, x: 0, duration: 1.5, delay: 3, ease: "power2.out" }
    );
  }, [index]);

  return (
    <g>
      <path
        ref={pathRef}
        d={pathContent}
        stroke="#475569"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Branch Label */}
      <text
        ref={textRef}
        x={endX + (endX > startX ? 20 : -20)}
        y={endY - 15}
        textAnchor={endX > startX ? "start" : "end"}
        className="text-[12px] font-bold fill-slate-500 uppercase tracking-tighter"
      >
        {branch.goal}
      </text>

      {/* Render Leaves */}
      {branch.leaves.map((leaf, i) => {
        const t = 0.3 + (i / (branch.leaves.length || 1)) * 0.6;
        const pos = getBezierPoint(t);
        
        return (
          <Leaf
            key={leaf.id}
            leaf={leaf}
            x={pos.x}
            y={pos.y}
            angle={angle + 90 + (i % 2 === 0 ? 30 : -30)}
            delay={1.5 + index * 0.1 + i * 0.1}
            isSelected={clickedLeafId === leaf.id}
            onHover={onHover}
            onClick={onClick}
          />
        );
      })}
    </g>
  );
};
