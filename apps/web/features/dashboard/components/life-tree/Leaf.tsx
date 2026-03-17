'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf as LeafType } from './types';

interface LeafProps {
  leaf: LeafType;
  x: number;
  y: number;
  angle: number;
  delay: number;
  isSelected?: boolean;
  onHover: (name: string | null) => void;
  onClick: (id: string, name: string) => void;
}

export const Leaf = ({ leaf, x, y, angle, delay, isSelected, onHover, onClick }: LeafProps) => {
  // Randomized sway for natural look
  const swayDuration = 3 + Math.random() * 2;
  const swayAmount = 4 + Math.random() * 4;

  return (
    <motion.g
      initial={{ x, y, scale: 0, opacity: 0 }}
      animate={{ 
        x,
        y,
        scale: isSelected ? 1.6 : 1, 
        opacity: 1,
        rotate: [angle, angle + swayAmount, angle - swayAmount, angle]
      }}
      transition={{ 
        scale: { delay: isSelected ? 0 : delay, type: 'spring', stiffness: 260, damping: 20 },
        opacity: { delay },
        rotate: {
          duration: swayDuration,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      style={{ originX: "0px", originY: "0px" }}
      className="cursor-pointer group"
      onMouseEnter={() => onHover(leaf.name)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(leaf.id, leaf.name);
      }}
    >
      {/* Sticky/Hover Activity Label */}
      <AnimatePresence>
        {isSelected && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8, x: 30, y: -40 }}
            animate={{ opacity: 1, scale: 1, x: 30, y: -40 }}
            exit={{ opacity: 0, scale: 0.8, x: 30, y: -40 }}
          >
            <rect
              x="0"
              y="0"
              width={leaf.name.length * 8 + 24}
              height="26"
              rx="13"
              fill={leaf.completed ? "#059669" : "#334155"}
              stroke="#ffffff"
              strokeWidth="2"
              className="drop-shadow-xl"
            />
            <text
              x="12"
              y="17"
              className="text-[13px] fill-white font-bold tracking-tight select-none"
            >
              {leaf.name}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Hover-only label (if not selected) */}
      {!isSelected && (
        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" transform="translate(30, -35)">
          <rect
            x="0"
            y="0"
            width={leaf.name.length * 7 + 20}
            height="22"
            rx="11"
            fill="rgba(15, 23, 42, 0.9)"
          />
          <text
            x="10"
            y="15"
            className="text-[11px] fill-white font-bold tracking-tight"
          >
            {leaf.name}
          </text>
        </g>
      )}

      {/* The Leaf Path - starting EXACTLY at 0,0 which is translated to x,y */}
      <motion.path
        d="M 0,0 C 10,-25 50,-25 60,0 C 50,25 10,25 0,0"
        fill={leaf.completed ? "#22c55e" : "#e2e8f0"}
        initial={false}
        animate={{ 
          fill: leaf.completed ? "#22c55e" : "#cbd5e1",
          stroke: isSelected ? "#fff" : "rgba(255,255,255,0.2)"
        }}
        strokeWidth={isSelected ? 3 : 1}
        whileHover={{ scale: 1.1 }}
      />
    </motion.g>
  );
};
