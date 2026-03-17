'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf as LeafType } from './types';

interface LeafProps {
  leaf: LeafType;
  x: number;
  y: number;
  angle: number;
  delay: number;
  onHover: (name: string | null) => void;
  onClick: (id: string) => void;
}

export const Leaf = ({ leaf, x, y, angle, delay, onHover, onClick }: LeafProps) => {
  // Randomized sway for natural look
  const swayDuration = 3 + Math.random() * 2;
  const swayAmount = 5 + Math.random() * 5;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: [angle, angle + swayAmount, angle - swayAmount, angle]
      }}
      transition={{ 
        scale: { delay, type: 'spring', stiffness: 260, damping: 20 },
        opacity: { delay },
        rotate: {
          duration: swayDuration,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="cursor-pointer"
      onMouseEnter={() => onHover(leaf.name)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(leaf.id);
      }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <motion.path
        d="M 0,0 C 4,-8 16,-8 20,0 C 16,8 4,8 0,0"
        fill={leaf.completed ? "#22c55e" : "#cbd5e1"}
        initial={false}
        animate={{ 
          fill: leaf.completed ? "#22c55e" : "#cbd5e1"
        }}
        whileHover={{ scale: 1.2, fill: leaf.completed ? "#16a34a" : "#94a3b8" }}
        transform={`translate(${x},${y})`}
      />
    </motion.g>
  );
};
