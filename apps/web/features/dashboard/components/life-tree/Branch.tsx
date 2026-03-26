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
  onBranchClick: (branch: BranchType) => void;
}

export const Branch = ({ branch, index, totalBranches, clickedLeafId, onClick, onHover, onBranchClick }: BranchProps) => {
  const groupRef = useRef<SVGGElement>(null);
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

  // Natural control points: bulge slightly upward for organic feel
  const cp1x = startX + Math.cos(rad) * (length * 0.35) + Math.sin(rad) * -20;
  const cp1y = startY + Math.sin(rad) * (length * 0.1) + Math.cos(rad) * -15;
  const cp2x = startX + Math.cos(rad) * (length * 0.65) + Math.sin(rad) * -15;
  const cp2y = startY + Math.sin(rad) * (length * 0.85) + Math.cos(rad) * -10;

  const pathContent = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

  // Sub-branch at ~60% along the main branch
  const subT = 0.55;
  const mt = 1 - subT;
  const sbX = mt*mt*mt*startX + 3*mt*mt*subT*cp1x + 3*mt*subT*subT*cp2x + subT*subT*subT*endX;
  const sbY = mt*mt*mt*startY + 3*mt*mt*subT*cp1y + 3*mt*subT*subT*cp2y + subT*subT*subT*endY;

  // Sub-branch veers ~30° from the main direction
  const subRad = rad + (index % 2 === 0 ? 0.55 : -0.55);
  const subLen = length * 0.35;
  const sbEndX = sbX + Math.cos(subRad) * subLen;
  const sbEndY = sbY + Math.sin(subRad) * subLen;
  const sbCpX = sbX + Math.cos(subRad) * subLen * 0.5 + Math.sin(subRad) * -10;
  const sbCpY = sbY + Math.sin(subRad) * subLen * 0.5 + Math.cos(subRad) * -8;
  const subPath = `M ${sbX},${sbY} Q ${sbCpX},${sbCpY} ${sbEndX},${sbEndY}`;

  // Smaller twig at ~80% along
  const tT = 0.8;
  const mtT = 1 - tT;
  const tX = mtT*mtT*mtT*startX + 3*mtT*mtT*tT*cp1x + 3*mtT*tT*tT*cp2x + tT*tT*tT*endX;
  const tY = mtT*mtT*mtT*startY + 3*mtT*mtT*tT*cp1y + 3*mtT*tT*tT*cp2y + tT*tT*tT*endY;
  const twigRad = rad + (index % 2 === 0 ? -0.65 : 0.65);
  const twigLen = length * 0.2;
  const twigEndX = tX + Math.cos(twigRad) * twigLen;
  const twigEndY = tY + Math.sin(twigRad) * twigLen;
  const twigPath = `M ${tX},${tY} Q ${tX + Math.cos(twigRad)*twigLen*0.5},${tY + Math.sin(twigRad)*twigLen*0.5} ${twigEndX},${twigEndY}`;

  const getBezierPoint = (t: number) => {
    const mt = 1 - t;
    return {
      x: mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*endX,
      y: mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*endY,
    };
  };

  const branchColor = '#7c4a1e';
  const branchColorDark = '#4a2810';

  useGSAP(() => {
    const group = groupRef.current;
    if (!group) return;

    // Grow branches from root outward
    const paths = group.querySelectorAll('path.branch-stroke');
    paths.forEach((path, i) => {
      const svgPath = path as SVGPathElement;
      const pLen = svgPath.getTotalLength();
      gsap.fromTo(svgPath,
        { strokeDasharray: pLen, strokeDashoffset: pLen, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: i === 0 ? 0.88 : i === 1 ? 0.55 : 0.4,
          duration: i === 0 ? 2.5 : 1.8,
          delay: 1.2 + index * 0.2 + i * 0.25,
          ease: 'power2.inOut',
        }
      );
    });

    // Subtle sway
    gsap.to(group, {
      rotate: index % 2 === 0 ? '0.3deg' : '-0.3deg',
      duration: 8 + (index * 1.5),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: `${startX}px ${startY}px`,
    });

    // Fade in text
    gsap.fromTo(textRef.current,
      { opacity: 0, x: endX > startX ? -10 : 10 },
      { opacity: 0.65, x: 0, duration: 1.5, delay: 3 + index * 0.15, ease: 'power2.out' }
    );
  }, [index]);

  return (
    <g ref={groupRef}>
      {/* Shadow / depth layer for the main branch */}
      <path
        className="branch-stroke"
        d={pathContent}
        stroke={branchColorDark}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        opacity="0"
      />

      {/* Main branch — mid-tone wood color */}
      <path
        className="branch-stroke"
        d={pathContent}
        stroke={branchColor}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0"
      />

      {/* Highlight streak — lighter center grain */}
      <path
        className="branch-stroke"
        d={pathContent}
        stroke="#c48a4e"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0"
        strokeDasharray="6 12"
      />

      {/* Sub-branch */}
      <path
        className="branch-stroke"
        d={subPath}
        stroke={branchColor}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0"
      />

      {/* Twig */}
      <path
        className="branch-stroke"
        d={twigPath}
        stroke={branchColor}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0"
      />

      {/* Invisible thick hitbox for easy clicking */}
      <path
        d={pathContent}
        stroke="transparent"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
        className="cursor-pointer"
        onClick={() => onBranchClick(branch)}
      />

      {/* Branch Label */}
      <text
        ref={textRef}
        x={endX + (endX > startX ? 22 : -22)}
        y={endY - 12}
        textAnchor={endX > startX ? 'start' : 'end'}
        className="text-[11px] font-bold fill-slate-500 uppercase tracking-tighter"
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
