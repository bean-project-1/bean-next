'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Branch as BranchType } from './types';
import { Leaf } from './Leaf';

interface BranchProps {
  branch: BranchType;
  index: number;
  totalBranches: number;
  onClick: (leafId: string, name: string) => void;
  onHover: (name: string | null) => void;
}

export const Branch = ({ branch, index, totalBranches, onClick, onHover }: BranchProps) => {
  // Calculate angle based on index (fan distribution in the upper semi-circle)
  const angle = useMemo(() => {
    const startAngle = -160;
    const endAngle = -20;
    const step = totalBranches > 1 ? (endAngle - startAngle) / (totalBranches - 1) : 0;
    return startAngle + index * step;
  }, [index, totalBranches]);

  const length = 180 + (branch.progress / 100) * 120;
  const rad = (angle * Math.PI) / 180;
  
  // Calculate end point for the organic path (Cubic Bezier)
  const endX = 400 + Math.cos(rad) * length;
  const endY = 400 + Math.sin(rad) * length;
  
  // Control points for a more organic curve
  const cp1x = 400 + Math.cos(rad) * (length * 0.3);
  const cp1y = 400 + Math.sin(rad) * (length * 0.1); 
  const cp2x = 400 + Math.cos(rad) * (length * 0.7);
  const cp2y = 400 + Math.sin(rad) * (length * 0.8);

  const path = `M 400,400 C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

  return (
    <motion.g style={{ originX: "400px", originY: "400px" }}>
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
        x={endX + (endX > 400 ? 10 : -10)}
        y={endY - 10}
        textAnchor={endX > 400 ? "start" : "end"}
        className="text-[10px] font-bold fill-slate-500 uppercase tracking-tighter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2 }}
      >
        {branch.goal}
      </motion.text>

      {/* Render Leaves along the branch */}
      {branch.leaves.map((leaf, i) => {
        const t = 0.4 + (i / (branch.leaves.length || 1)) * 0.5;
        const lx = 400 + (endX - 400) * t + Math.sin(i * 10) * 10;
        const ly = 400 + (endY - 400) * t + Math.cos(i * 10) * 8;
        
        return (
          <Leaf
            key={leaf.id}
            leaf={leaf}
            x={lx}
            y={ly}
            angle={angle + 90 + (i % 2 === 0 ? 30 : -30)}
            delay={1.5 + index * 0.1 + i * 0.1}
            onHover={onHover}
            onClick={(id) => onClick(id, leaf.name)}
          />
        );
      })}
    </motion.g>
  );
};
