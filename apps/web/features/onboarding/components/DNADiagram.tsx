// =======================================================
// BEAN — DNA Helix Diagram
// apps/web/app/onboarding/_components/DNADiagram.tsx
// =======================================================
'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS, CAT_COLORS } from '../constants';

interface Props {
  scores: Record<string, number>;
}

const W = 200;
const H = 520;
const CX = W / 2;
const AMP = 60;
const ROW_H = (H - 40) / (ALL_DIMENSIONS.length - 1);

export function DNADiagram({ scores }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase(p => p + 0.05), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
      aria-label="BEAN DNA life profile diagram"
    >
      <defs>
        {Object.keys(CAT_COLORS).map(cat => (
          <filter key={cat} id={`glow-${cat}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {/* Left backbone */}
      <polyline
        points={ALL_DIMENSIONS.map((_, i) => {
          const y = 20 + i * ROW_H;
          const x = CX + AMP * Math.sin(i * 0.7 + phase);
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke="rgba(139,92,246,0.2)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Right backbone */}
      <polyline
        points={ALL_DIMENSIONS.map((_, i) => {
          const y = 20 + i * ROW_H;
          const x = CX - AMP * Math.sin(i * 0.7 + phase);
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke="rgba(59,130,246,0.2)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Rungs + nodes per dimension */}
      {ALL_DIMENSIONS.map((dim, i) => {
        const y = 20 + i * ROW_H;
        const sinVal = Math.sin(i * 0.7 + phase);
        const lx = CX + AMP * sinVal;
        const rx = CX - AMP * sinVal;
        const score = scores[dim.key] ?? 0;
        const hasData = score > 0;
        const c = CAT_COLORS[dim.cat as keyof typeof CAT_COLORS];
        const opacity = hasData ? 0.9 : 0.15;
        const nodeR = hasData ? 5 + score * 0.35 : 3;

        return (
          <g key={dim.key}>
            {/* Connecting rung */}
            <line
              x1={lx} y1={y} x2={rx} y2={y}
              stroke={hasData ? c.glow : 'rgba(255,255,255,0.05)'}
              strokeWidth={hasData ? 1.5 : 1}
              opacity={opacity}
            />
            {/* Left node */}
            <circle
              cx={lx} cy={y} r={nodeR}
              fill={c.glow}
              opacity={opacity}
              filter={hasData ? `url(#glow-${dim.cat})` : undefined}
            />
            {/* Right node */}
            <circle
              cx={rx} cy={y} r={nodeR}
              fill={c.glow}
              opacity={opacity}
              filter={hasData ? `url(#glow-${dim.cat})` : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}
