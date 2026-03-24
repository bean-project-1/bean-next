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
  const labelRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    // Initial appear animation
    gsap.fromTo(containerRef.current, 
      { scale: 0, opacity: 0 },
      { 
        scale: isSelected ? 1.6 : 1, 
        opacity: 1, 
        duration: 0.8, 
        delay, 
        ease: "back.out(1.7)" 
      }
    );

    // Organic Sway
    const swayAmount = 4 + Math.random() * 4;
    gsap.to(containerRef.current, {
      rotate: `+=${swayAmount}`,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, [delay]); // Only re-run appear if delay changes (unlikely)

  useGSAP(() => {
    // Selection scale toggle
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: isSelected ? 1.6 : 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    // Modal label visibility
    if (labelRef.current) {
      if (isSelected) {
        gsap.fromTo(labelRef.current, 
          { opacity: 0, scale: 0.8, y: -20 },
          { opacity: 1, scale: 1, y: -40, duration: 0.3, ease: "back.out(1.2)" }
        );
      }
    }
  }, [isSelected]);

  return (
    <g
      ref={containerRef}
      style={{ transformOrigin: "0 0", cursor: 'pointer' }}
      transform={`translate(${x}, ${y}) rotate(${angle})`}
      className="group"
      onMouseEnter={() => {
        onHover(leaf.name);
        gsap.to(pathRef.current, { scale: 1.1, duration: 0.2 });
      }}
      onMouseLeave={() => {
        onHover(null);
        gsap.to(pathRef.current, { scale: 1, duration: 0.2 });
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(leaf.id, leaf.name);
      }}
    >
      {/* Sticky/Hover Activity Label */}
      {isSelected && (
        <g ref={labelRef} transform="translate(30, -40)">
          <rect
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
        </g>
      )}

      {/* Hover-only label (if not selected) */}
      {!isSelected && (
        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" transform="translate(30, -35)">
          <rect
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

      {/* The Leaf Path */}
      <path
        ref={pathRef}
        d="M 0,0 C 10,-25 50,-25 60,0 C 50,25 10,25 0,0"
        fill={leaf.completed ? "#22c55e" : "#e2e8f0"}
        stroke={isSelected ? "#fff" : "rgba(255,255,255,0.2)"}
        strokeWidth={isSelected ? 3 : 1}
        style={{ transformOrigin: "center" }}
      />
    </g>
  );
};
