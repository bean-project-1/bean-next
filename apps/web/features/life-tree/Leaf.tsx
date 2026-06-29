'use client';

import React, { useRef, useMemo } from 'react';
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
  isActive?: boolean;
  isCurrent?: boolean;
  isInteractive?: boolean;
  animate?: boolean;
  onHover: (name: string | null) => void;
  onClick: (id: string, name: string) => void;
  className?: string;
  isMobile?: boolean;
}

const LeafComponent = ({ leaf, x, y, angle, delay, isSelected, isActive, isCurrent, isInteractive = true, animate = false, onHover, onClick, className = "", isMobile = false }: LeafProps) => {
  const containerRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!animate) return;
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
  }, [delay, animate]);

  const swayStyle = useMemo(() => {
    // Disable swaying entirely on mobile screens (performance) or if the tree is not interactive
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isInteractive || isMobileDevice) {
      return { transformOrigin: '0 0' } as React.CSSProperties;
    }

    // Generate stable pseudo-random values based on leaf ID
    const hash = leaf.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const duration = 4.0 + (hash % 6) * 0.4; // 4.0s to 6.4s
    const delay = -(hash % 8) * 0.5; // Starts immediately at different phases
    const swayDeg = 3.5 + (hash % 5) * 1.0; // 3.5deg to 7.5deg

    return {
      animationName: 'leafSway',
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
      '--sway-deg': `${swayDeg}deg`,
      transformOrigin: '0 0'
    } as React.CSSProperties;
  }, [leaf.id, isInteractive]);

  const fruitGradUrl = leaf.completed ? "url(#fruitGrad-completed)" : "url(#fruitGrad-incomplete)";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Wind Sway Wrapper */}
      <g style={swayStyle} className="sway-leaf">
        <g
          ref={containerRef}
          style={{ transformOrigin: "0 0", cursor: 'pointer' }}
          className={`group transition-transform duration-300 ease-out ${isSelected ? 'scale-[1.15]' : 'scale-100'} ${className}`}
          onMouseEnter={() => onHover(leaf.name)}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => {
            if (!isInteractive) return;
            e.stopPropagation();
            onClick(leaf.originalId || leaf.id, leaf.name);
          }}
        >
          {leaf.type === 'milestone' ? (
            <>
              {isActive && (
                <circle
                  cx="12" cy="0" r={leaf.completed ? "9" : "6"}
                  fill="none"
                  stroke={leaf.completed ? "#f59e0b" : "#94a3b8"}
                  strokeWidth="4"
                  className="animate-pulse"
                  style={isMobile ? undefined : { filter: 'blur(3px)' }}
                />
              )}

              <g className="transition-all duration-500">
                {/* Stem */}
                <path d="M 0,0 Q 6,0 12,0" stroke="#7c4a1e" strokeWidth="1.5" fill="none" className="transition-all duration-300 group-hover:stroke-[#925c27]" />
                
                {leaf.completed ? (
                  // Blooming Fruit
                  <g transform="translate(12, 0)">
                    <circle 
                      cx="0" cy="0" r="8" 
                      fill={fruitGradUrl} 
                      stroke={isSelected ? "#fff" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={isSelected ? 1.5 : 0} 
                      className="transition-all duration-300 group-hover:scale-125"
                      style={(!isSelected && !isMobile) ? { filter: 'drop-shadow(0 0px 8px rgba(245,158,11,0.5))' } : undefined}
                    />
                    {/* Inner shine */}
                    <path d="M -3,-4 A 4 4 0 0 1 3,-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </g>
                ) : (
                  // Unripe Bud
                  <g transform="translate(12, 0) scale(0.7)">
                    <path 
                      d="M 0,8 C 6,6 6,-6 0,-8 C -6,-6 -6,6 0,8 Z" 
                      fill={fruitGradUrl} 
                      stroke={isSelected ? "#fff" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={isSelected ? 1 : 0.5} 
                      className="transition-all duration-300 group-hover:scale-110"
                    />
                  </g>
                )}
              </g>
            </>
          ) : (
            <>
              {/* Active Glow/Pulse Overlay */}
              {(isActive || isCurrent) && (
                <path
                  d="M 0,0 C 1.25,-3.75 6.25,-5.5 11.25,-3.75 C 16.25,-2 18.75,0 20,0 C 18.75,1.25 16.25,3.75 11.25,5.5 C 6.25,5.5 1.25,3.75 0,0 Z"
                  fill="none"
                  stroke={leaf.completed ? "#10b981" : "#f59e0b"} // Emerald or Amber depending on completion
                  strokeWidth={isCurrent && !isActive ? "2.5" : "4"}
                  className="animate-pulse"
                  style={isMobile ? undefined : { filter: 'blur(2.5px)' }}
                />
              )}
      
              {/* The Realistic Leaf Body */}
              <path
                ref={pathRef}
                d="M 0,0 C 1.25,-3.75 6.25,-5.5 11.25,-3.75 C 16.25,-2 18.75,0 20,0 C 18.75,1.25 16.25,3.75 11.25,5.5 C 6.25,5.5 1.25,3.75 0,0 Z"
                fill={leaf.completed ? "#22c55e" : (isCurrent ? "#94a3b8" : "#e2e8f0")}
                fillOpacity={leaf.completed || isCurrent ? 1.0 : 0.45}
                stroke={isSelected ? "#fff" : (isCurrent ? "#f59e0b" : "rgba(255,255,255,0.15)")}
                strokeWidth={isSelected ? 1.2 : (isCurrent ? 0.8 : 0.3)}
                className="transition-all duration-300 group-hover:scale-125 group-hover:stroke-white group-hover:stroke-[0.5px]"
                style={(!isSelected && !isMobile) ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' } : undefined}
              />
              
              {/* Depth Overlay */}
              <path
                d="M 0,0 C 1.25,-3.75 6.25,-5.5 11.25,-3.75 C 16.25,-2 18.75,0 20,0 C 18.75,1.25 16.25,3.75 11.25,5.5 C 6.25,5.5 1.25,3.75 0,0 Z"
                fill="url(#leafGrad)"
                pointerEvents="none"
                className="transition-opacity duration-300 group-hover:opacity-40"
              />
      
              {/* Central Vein */}
              <path
                d="M 0,0 C 5,0 12,0 19,0"
                stroke={leaf.completed ? "#15803d" : (isCurrent ? "#94a3b8" : "#cbd5e1")}
                strokeWidth="0.3"
                fill="none"
                opacity="0.6"
                pointerEvents="none"
                className="transition-colors duration-300 group-hover:stroke-emerald-700"
              />
      
              <g opacity={leaf.completed || isCurrent ? 0.4 : 0.15} pointerEvents="none">
                <path d="M 3.75,0 C 4.5,-1.5 6.25,-2 7.5,-2.5" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
                <path d="M 3.75,0 C 4.5,1.5 6.25,2 7.5,2.5" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
                <path d="M 8.75,0 C 9.5,-1.25 11.25,-1.5 12.5,-2" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
                <path d="M 8.75,0 C 9.5,1.25 11.25,1.5 12.5,2" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
              </g>
            </>
          )}
        </g>
      </g>
    </g>
  );
};

export const Leaf = React.memo(LeafComponent, (prev, next) => {
  return (
    prev.leaf.id === next.leaf.id &&
    prev.leaf.completed === next.leaf.completed &&
    prev.leaf.name === next.leaf.name &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.angle === next.angle &&
    prev.isSelected === next.isSelected &&
    prev.isActive === next.isActive &&
    prev.isCurrent === next.isCurrent &&
    prev.isInteractive === next.isInteractive &&
    prev.animate === next.animate &&
    prev.isMobile === next.isMobile
  );
});
