'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  
  // Use consistent multipliers for control points to avoid calculation drift
  const cp1x = startX + Math.cos(rad) * (length * 0.4);
  const cp1y = startY + Math.sin(rad) * (length * 0.1); 
  const cp2x = startX + Math.cos(rad) * (length * 0.6);
  const cp2y = startY + Math.sin(rad) * (length * 0.9);

  const path = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

  // Formula for cubic Bezier point: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
  const getBezierPoint = (t: number) => {
    const mt = 1 - t;
    const x = mt * mt * mt * startX + 
              3 * mt * mt * t * cp1x + 
              3 * mt * t * t * cp2x + 
              t * t * t * endX;
    
    const y = mt * mt * mt * startY + 
              3 * mt * mt * t * cp1y + 
              3 * mt * t * t * cp2y + 
              t * t * t * endY;
    
    return { x, y };
  };

  return (
    <motion.g>
      <motion.path
        d={path}
        stroke="#475569"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
      />
      
      {/* Branch Label */}
      <motion.text
        x={endX + (endX > startX ? 20 : -20)}
        y={endY - 15}
        textAnchor={endX > startX ? "start" : "end"}
        className="text-[12px] font-bold fill-slate-500 uppercase tracking-tighter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2 }}
      >
        {branch.goal}
      </motion.text>

      {/* Render Leaves precisely along the branch curve */}
      {branch.leaves.map((leaf, i) => {
        // Distribute leaves along the curve (t from 0.3 to 0.95)
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
    </motion.g>
  );
};
