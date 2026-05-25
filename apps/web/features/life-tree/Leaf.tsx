'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
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
  const containerRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    // Initial appear animation (Growth)
    gsap.fromTo(containerRef.current, 
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.8, 
        delay, 
        ease: "back.out(1.7)" 
      }
    );
  }, [delay]); // Only re-run appear if delay changes

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <g
        ref={containerRef}
        style={{ transformOrigin: "0 0", cursor: 'pointer' }}
        className={`group transition-transform duration-300 ease-out ${isSelected ? 'scale-[1.15]' : 'scale-100'}`}
        onMouseEnter={() => onHover(leaf.name)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClick(leaf.id, leaf.name);
        }}
      >
        <defs>
          <linearGradient id={`leafGrad-${leaf.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* The Realistic Leaf Body */}
        <path
          ref={pathRef}
          d="M 0,0 C 1.25,-3.75 6.25,-5.5 11.25,-3.75 C 16.25,-2 18.75,0 20,0 C 18.75,1.25 16.25,3.75 11.25,5.5 C 6.25,5.5 1.25,3.75 0,0 Z"
          fill={leaf.completed ? "#22c55e" : "#e2e8f0"}
          stroke={isSelected ? "#fff" : "rgba(255,255,255,0.15)"}
          strokeWidth={isSelected ? 1 : 0.3}
          className="transition-all duration-300 group-hover:scale-125 group-hover:stroke-white group-hover:stroke-[0.5px]"
          style={!isSelected ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' } : undefined}
        />
        
        {/* Depth Overlay */}
        <path
          d="M 0,0 C 1.25,-3.75 6.25,-5.5 11.25,-3.75 C 16.25,-2 18.75,0 20,0 C 18.75,1.25 16.25,3.75 11.25,5.5 C 6.25,5.5 1.25,3.75 0,0 Z"
          fill={`url(#leafGrad-${leaf.id})`}
          pointerEvents="none"
          className="transition-opacity duration-300 group-hover:opacity-40"
        />

        {/* Central Vein */}
        <path
          d="M 0,0 C 5,0 12,0 19,0"
          stroke={leaf.completed ? "#15803d" : "#cbd5e1"}
          strokeWidth="0.3"
          fill="none"
          opacity="0.6"
          pointerEvents="none"
          className="transition-colors duration-300 group-hover:stroke-emerald-700"
        />

        {/* Lateral Veins */}
        <g opacity="0.4" pointerEvents="none">
          <path d="M 3.75,0 C 4.5,-1.5 6.25,-2 7.5,-2.5" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
          <path d="M 3.75,0 C 4.5,1.5 6.25,2 7.5,2.5" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
          <path d="M 8.75,0 C 9.5,-1.25 11.25,-1.5 12.5,-2" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
          <path d="M 8.75,0 C 9.5,1.25 11.25,1.5 12.5,2" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
        </g>
      </g>
    </g>
  );
};
