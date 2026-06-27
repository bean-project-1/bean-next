'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ─── palette ─── */
const C = {
  cream:   '#F7F4EE',
  creamDk: '#F0EBE0',
  ink:     '#1A1A1A',
  green:   '#10b981',
  muted:   '#6B6B6B',
  border:  '#E8E3D8',
  ghost:   '#BFBAB0',
  branch:  '#7c4a1e',
};

/* ─── static data ─── */
const TICKER_WORDS = [
  'Identidad','Capital','Bienestar','Hábitos','Metas',
  'Propósito','Relaciones','Coach IA','Consistencia',
];



const DIMS = [
  { icon: '🧭', name: 'Identidad', count: '5 dimensiones', desc: 'Valores, Propósito, Intereses, Personalidad, Motivaciones', status: 'Enraizado', pct: 85 },
  { icon: '💼', name: 'Capital',   count: '7 dimensiones', desc: 'Conocimiento, Habilidades, Carrera, Ingresos, Capital Social, Salud Física, Resiliencia', status: 'Creciendo', pct: 60 },
  { icon: '💚', name: 'Experiencia', count: '7 dimensiones', desc: 'Satisfacción Laboral, Relaciones, Bienestar Mental, Tiempo Libre, Crecimiento, Impacto, Seguridad', status: 'Floreciendo', pct: 75 },
  { icon: '🔥', name: 'Hábitos',   count: 'Compromisos', desc: 'Rutinas, Tareas Diarias, Metas y Eventos de Vida en Curso', status: 'Consistente', pct: 90 },
];

const QUOTES = [
  { text: 'Ver mi árbol crecer me da más motivación que cualquier app de productividad.', name: 'Valeria R.', dim: 'Pilar: Identidad · Propósito' },
  { text: 'El coach IA realmente me conoce. Sabe cuándo empujarme y cuándo dejarme respirar.', name: 'Diego M.', dim: 'Pilar: Experiencia · Bienestar' },
  { text: 'En 3 meses cambié mis finanzas y mis hábitos. BEAN me mantuvo en foco.', name: 'Ana L.', dim: 'Pilar: Capital · Carrera & Habilidades' },
];

const revealVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number], delay: i * 0.1 },
  }),
};

/* ─── SeedIcon ─── */
function SeedIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="15" rx="8" ry="10" fill={C.green} opacity="0.15" />
      <path d="M14 24 C14 24 6 18 6 11 C6 7 9.5 4 14 4 C18.5 4 22 7 22 11 C22 18 14 24 14 24Z" fill={C.green} opacity="0.9" />
      <path d="M14 24 L14 12" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 17 C14 17 10 14 10 11" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M14 15 C14 15 18 12 18 9" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   HERO TREE — fiel al estilo de Branch/Leaf.tsx
   Cubic-bezier branches, leaf path idéntico al Leaf.tsx,
   milestones con degradado dorado/gris.
   Sin Framer — 100% GSAP vía refs y data-* attrs.
   ═══════════════════════════════════════ */

/* Leaf path — identical to Leaf.tsx */
const LEAF = 'M 0,0 C 1.25,-3.75 6.25,-5.5 11.25,-3.75 C 16.25,-2 18.75,0 20,0 C 18.75,1.25 16.25,3.75 11.25,5.5 C 6.25,5.5 1.25,3.75 0,0 Z';

/*
  Hero tree — centrado en (220, 290), tronco trapezoidal con degradado de madera real.
  Ramas cúbicas a 4 ángulos como en Branch.tsx (startX=220, startY=290, length=150).
  ViewBox 440 x 430 para dar espacio a raíces y frutos.
*/
const TRUNK_D      = 'M 208,390 C 206,360 209,320 212,290 L 228,290 C 231,320 234,360 232,390 Z';
const TRUNK_GRAIN1 = 'M 214,380 C 213,350 212,320 214,295';
const TRUNK_GRAIN2 = 'M 220,385 C 219,355 220,325 220,293';
const TRUNK_GRAIN3 = 'M 226,380 C 227,350 228,320 226,295';
const TRUNK_KNOT_RX = 5; const TRUNK_KNOT_RY = 3.5;

const ROOTS = [
  'M 220,387 C 196,394 168,396 142,391',
  'M 220,387 C 244,394 272,396 298,391',
  'M 220,383 C 208,393 194,399 176,401',
  'M 220,383 C 232,392 248,398 264,400',
];

// Ramas principales
const BRANCHES_DATA = [
  { startX: 220, startY: 290, cp1x: 181, cp1y: 298, cp2x: 138, cp2y: 256, endX: 84, endY: 238, w: 7 },
  { startX: 220, startY: 290, cp1x: 220, cp1y: 282, cp2x: 194, cp2y: 178, endX: 157, endY: 152, w: 6 },
  { startX: 220, startY: 290, cp1x: 262, cp1y: 270, cp2x: 274, cp2y: 168, endX: 280, endY: 150, w: 6 },
  { startX: 220, startY: 290, cp1x: 274, cp1y: 268, cp2x: 316, cp2y: 234, endX: 362, endY: 230, w: 7 },
];

// Sub-ramas cuadráticas
const SUB_BRANCHES_DEF = [
  { branchIdx: 0, t: 0.43, endX: 128, endY: 244, cpX: 142, cpY: 260 },
  { branchIdx: 0, t: 0.73, endX: 96,  endY: 230, cpX: 108, cpY: 242 },
  { branchIdx: 1, t: 0.45, endX: 172, endY: 194, cpX: 183, cpY: 213 },
  { branchIdx: 1, t: 0.70, endX: 163, endY: 165, cpX: 171, cpY: 183 },
  { branchIdx: 2, t: 0.45, endX: 288, endY: 192, cpX: 277, cpY: 212 },
  { branchIdx: 2, t: 0.70, endX: 298, endY: 164, cpX: 290, cpY: 182 },
  { branchIdx: 3, t: 0.43, endX: 344, endY: 228, cpX: 330, cpY: 242 },
  { branchIdx: 3, t: 0.73, endX: 366, endY: 210, cpX: 356, cpY: 222 },
  { branchIdx: 0, t: 0.92, endX: 72,  endY: 224, cpX: 82,  cpY: 232 },
  { branchIdx: 3, t: 0.92, endX: 392, endY: 210, cpX: 380, cpY: 220 },
];

const LEAVES_DEF = [
  // Hojas de ramas principales (MB)
  { type: 'mb', idx: 0, t: 1.0,  a: 140, done: true },
  { type: 'mb', idx: 0, t: 0.8,  a: -70, done: true },
  { type: 'mb', idx: 1, t: 1.0,  a: 130, done: true },
  { type: 'mb', idx: 1, t: 0.85, a: -10, done: true },
  { type: 'mb', idx: 2, t: 1.0,  a: 50,  done: false },
  { type: 'mb', idx: 2, t: 0.85, a: 190, done: true },
  { type: 'mb', idx: 3, t: 1.0,  a: -30, done: false },
  { type: 'mb', idx: 3, t: 0.8,  a: 155, done: false },

  // Hojas de sub-ramas (SB)
  { type: 'sb', idx: 0, t: 1.0,  a: 125, done: true },
  { type: 'sb', idx: 0, t: 0.75, a: 105, done: true },
  { type: 'sb', idx: 1, t: 1.0,  a: -55, done: true },
  { type: 'sb', idx: 1, t: 0.75, a: 115, done: true },
  
  { type: 'sb', idx: 2, t: 1.0,  a: 152, done: true },
  { type: 'sb', idx: 3, t: 1.0,  a: 142, done: false },
  
  { type: 'sb', idx: 4, t: 1.0,  a: 35,  done: true },
  { type: 'sb', idx: 5, t: 1.0,  a: 28,  done: false },
  
  { type: 'sb', idx: 6, t: 1.0,  a: -10, done: false },
  { type: 'sb', idx: 6, t: 0.75, a: 168, done: false },
  { type: 'sb', idx: 7, t: 1.0,  a: -20, done: false },
  
  { type: 'sb', idx: 8, t: 1.0,  a: -50, done: true },
  { type: 'sb', idx: 9, t: 1.0,  a: -30, done: false },
];

const FRUITS_DEF = [
  { branchIdx: 0, t: 1.0, done: true },
  { branchIdx: 2, t: 1.0, done: false },
];

const getCubicBezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
};

const getQuadraticBezierPoint = (t: number, p0: number, p1: number, p2: number) => {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
};

const getPointOnBranch = (b: typeof BRANCHES_DATA[0], t: number) => {
  return {
    x: getCubicBezierPoint(t, b.startX, b.cp1x, b.cp2x, b.endX),
    y: getCubicBezierPoint(t, b.startY, b.cp1y, b.cp2y, b.endY),
  };
};

const getSubBranchPoint = (sb: typeof SUB_BRANCHES_DEF[0], t: number) => {
  const start = getPointOnBranch(BRANCHES_DATA[sb.branchIdx], sb.t);
  return {
    x: getQuadraticBezierPoint(t, start.x, sb.cpX, sb.endX),
    y: getQuadraticBezierPoint(t, start.y, sb.cpY, sb.endY),
  };
};

function HeroTree({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg ref={svgRef} viewBox="0 0 440 430" fill="none"
      className="w-full max-w-[520px] select-none" aria-hidden>

      <defs>
        {/* Degradado madera — idéntico a LifeTree.tsx */}
        <linearGradient id="htTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3b1f0a" />
          <stop offset="25%"  stopColor="#7c4a1e" />
          <stop offset="50%"  stopColor="#a0632e" />
          <stop offset="75%"  stopColor="#7c4a1e" />
          <stop offset="100%" stopColor="#3b1f0a" />
        </linearGradient>
        <linearGradient id="htTrunkSheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="40%"  stopColor="rgba(255,210,160,0.14)" />
          <stop offset="60%"  stopColor="rgba(255,210,160,0.14)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        {FRUITS_DEF.map((f, i) => (
          <linearGradient key={`hfg${i}`} id={`hfg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={f.done ? '#fcd34d' : '#cbd5e1'} />
            <stop offset="100%" stopColor={f.done ? '#d97706' : '#64748b'} />
          </linearGradient>
        ))}
      </defs>

      {/* Sombra suelo — igual que LifeTree */}
      <ellipse cx="220" cy="396" rx="78" ry="13" fill="#2d1a0e" opacity="0.18" />
      <ellipse cx="220" cy="394" rx="54" ry="9"  fill="#1a0f08" opacity="0.12" />

      {/* Raíces */}
      {ROOTS.map((d, i) => (
        <path key={`hr${i}`} data-draw="" data-root=""
          d={d} stroke={C.branch} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      ))}

      {/* Tronco trapezoidal — fill con degradado de madera */}
      <path data-draw="" data-trunk=""
        d={TRUNK_D} fill="url(#htTrunkGrad)" />
      <path d={TRUNK_D} fill="url(#htTrunkSheen)" data-trunk-sheen="" />
      {/* Vetas del tronco */}
      <path d={TRUNK_GRAIN1} stroke="#2e1505" strokeWidth="1"   fill="none" opacity="0.3" data-trunk-grain="" />
      <path d={TRUNK_GRAIN2} stroke="#5a320f" strokeWidth="1.5" fill="none" opacity="0.25" data-trunk-grain="" />
      <path d={TRUNK_GRAIN3} stroke="#2e1505" strokeWidth="1"   fill="none" opacity="0.3" data-trunk-grain="" />
      {/* Nudo */}
      <ellipse cx="222" cy="340" rx={TRUNK_KNOT_RX} ry={TRUNK_KNOT_RY} fill="#2e1505" opacity="0.4" data-trunk-grain="" />

      {/* Ramas principales */}
      {BRANCHES_DATA.map((b, i) => {
        const pathD = `M ${b.startX},${b.startY} C ${b.cp1x},${b.cp1y} ${b.cp2x},${b.cp2y} ${b.endX},${b.endY}`;
        return (
          <path key={`hmb${i}`} data-draw="" data-main-branch=""
            d={pathD} stroke={C.branch} strokeWidth={b.w} strokeLinecap="round" fill="none" />
        );
      })}

      {/* Sub-ramas */}
      {SUB_BRANCHES_DEF.map((sb, i) => {
        const start = getPointOnBranch(BRANCHES_DATA[sb.branchIdx], sb.t);
        const pathD = `M ${start.x},${start.y} Q ${sb.cpX},${sb.cpY} ${sb.endX},${sb.endY}`;
        return (
          <path key={`hsb${i}`} data-draw="" data-sub-branch=""
            d={pathD} stroke={C.branch} strokeWidth="3" strokeLinecap="round" fill="none" />
        );
      })}

      {/* Hojas */}
      {LEAVES_DEF.map((l, i) => {
        const pt = l.type === 'mb' 
          ? getPointOnBranch(BRANCHES_DATA[l.idx], l.t)
          : getSubBranchPoint(SUB_BRANCHES_DEF[l.idx], l.t);
        
        return (
          <g key={`hl${i}`} transform={`translate(${pt.x},${pt.y}) rotate(${l.a})`}>
            <g data-leaf="" data-leaf-done={l.done ? 'true' : 'false'}>
              <path d={LEAF} fill={l.done ? '#22c55e' : '#D1D5DB'} transform="scale(1.1)" />
              <path d="M 0,0 C 5,0 12,0 19,0"
                stroke={l.done ? '#15803d' : '#cbd5e1'}
                strokeWidth="0.4" fill="none" opacity="0.6" pointerEvents="none" />
              <g opacity="0.4" pointerEvents="none">
                <path d="M 3.75,0 C 4.5,-1.5 6.25,-2 7.5,-2.5" stroke={l.done ? '#15803d' : '#cbd5e1'} strokeWidth="0.2" fill="none" />
                <path d="M 3.75,0 C 4.5,1.5 6.25,2 7.5,2.5"   stroke={l.done ? '#15803d' : '#cbd5e1'} strokeWidth="0.2" fill="none" />
                <path d="M 8.75,0 C 9.5,-1.25 11.25,-1.5 12.5,-2" stroke={l.done ? '#15803d' : '#cbd5e1'} strokeWidth="0.2" fill="none" />
                <path d="M 8.75,0 C 9.5,1.25 11.25,1.5 12.5,2"    stroke={l.done ? '#15803d' : '#cbd5e1'} strokeWidth="0.2" fill="none" />
              </g>
            </g>
          </g>
        );
      })}

      {/* Frutos/milestones */}
      {FRUITS_DEF.map((f, i) => {
        const pt = getPointOnBranch(BRANCHES_DATA[f.branchIdx], f.t);
        return (
          <g key={`hfruit${i}`} transform={`translate(${pt.x - 12},${pt.y})`}>
            <g data-fruit="">
              <path d="M 0,0 Q 6,0 12,0" stroke={C.branch} strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="0" r="9" fill={`url(#hfg${i})`}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
              {f.done && (
                <path d="M 9,-5 A 4 4 0 0 1 15,-5"
                  stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}



/* ═══════════════════════════════════════
   PANORAMIC TREE GROUP (puro SVG + data-attrs para GSAP)
   ═══════════════════════════════════════ */
const getCubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
};

function PanoTreeGroup({ treeIdx, cx, scale, greenRatio }: {
  treeIdx: number; cx: number; scale: number; greenRatio: number;
}) {
  const h = 110 * scale;
  const sw = (v: number) => Math.max(1.5, v * scale);
  const branchLength = 65 * scale;
  const offsetDist = 10 * scale;

  const angles = [-160, -113, -67, -20];
  const doneCount = Math.round(12 * greenRatio);

  const branches = angles.map((angle, bIdx) => {
    const rad = (angle * Math.PI) / 180;
    const endX = Math.cos(rad) * branchLength;
    const endY = -h + Math.sin(rad) * branchLength;

    const cp1x = Math.cos(rad) * (branchLength * 0.35) + Math.sin(rad) * -8 * scale;
    const cp1y = -h + Math.sin(rad) * (branchLength * 0.1) + Math.cos(rad) * -6 * scale;
    const cp2x = Math.cos(rad) * (branchLength * 0.65) + Math.sin(rad) * -6 * scale;
    const cp2y = -h + Math.sin(rad) * (branchLength * 0.85) + Math.cos(rad) * -4 * scale;

    const branchD = `M 0,${-h} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

    const leaves = [
      { t: 0.45, side: -1 },
      { t: 0.75, side: 1 },
      { t: 1.0, side: 0 },
    ].map((spec, lIdx) => {
      const leafIdx = bIdx * 3 + lIdx;
      const done = leafIdx < doneCount;

      if (spec.t === 1.0) {
        return {
          lx: endX,
          ly: endY,
          leafAngle: angle,
          done,
          hasStem: false,
          stemD: '',
        };
      } else {
        const px = getCubicBezier(spec.t, 0, cp1x, cp2x, endX);
        const py = getCubicBezier(spec.t, -h, cp1y, cp2y, endY);
        const lx = px + Math.cos(rad + Math.PI / 2) * offsetDist * spec.side;
        const ly = py + Math.sin(rad + Math.PI / 2) * offsetDist * spec.side;
        const leafAngle = angle + (60 * spec.side);
        const stemD = `M ${px},${py} Q ${(px + lx)/2 + Math.cos(rad) * 2 * scale},${(py + ly)/2 + Math.sin(rad) * 2 * scale} ${lx},${ly}`;

        return {
          lx,
          ly,
          leafAngle,
          done,
          hasStem: true,
          stemD,
        };
      }
    });

    return {
      branchD,
      leaves,
    };
  });

  return (
    <g transform={`translate(${cx},200)`}>
      {/* trunk */}
      <path
        data-pano-trunk="" data-pano-tree={treeIdx}
        d={`M 0,0 C -1,${-h*0.3} 1,${-h*0.7} 0,${-h}`}
        stroke={C.branch} strokeWidth={sw(5)} strokeLinecap="round" fill="none"
        style={{ opacity: 0 }}
      />
      {/* roots */}
      <path d={`M 0,0 C ${-14*scale},${4*scale} ${-28*scale},${7*scale} ${-42*scale},${5*scale}`}
        stroke={C.branch} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d={`M 0,0 C ${14*scale},${4*scale} ${28*scale},${7*scale} ${42*scale},${5*scale}`}
        stroke={C.branch} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      
      {/* branches & stems */}
      {branches.map((b, bIdx) => (
        <g key={`branch-group-${bIdx}`}>
          <path
            data-pano-branch="" data-pano-tree={treeIdx}
            d={b.branchD} stroke={C.branch} strokeWidth={sw(3)} strokeLinecap="round" fill="none"
            style={{ opacity: 0 }}
          />
          {b.leaves.map((leaf, leafIdx) => leaf.hasStem && (
            <path
              key={`stem-${leafIdx}`}
              data-pano-branch="" data-pano-tree={treeIdx}
              d={leaf.stemD} stroke={C.branch} strokeWidth={sw(0.8)} strokeLinecap="round" fill="none"
              style={{ opacity: 0 }}
            />
          ))}
        </g>
      ))}

      {/* leaves */}
      {branches.map((b, bIdx) => (
        <g key={`leaves-group-${bIdx}`}>
          {b.leaves.map((leaf, leafIdx) => (
            <g key={`leaf-${leafIdx}`} transform={`translate(${leaf.lx},${leaf.ly}) rotate(${leaf.leafAngle})`}>
              <g
                data-pano-leaf="" data-pano-tree={treeIdx}
                style={{ opacity: 0 }}
              >
                <path d={LEAF} fill={leaf.done ? '#22c55e' : '#D1D5DB'}
                  transform={`scale(${scale * 0.8})`} />
              </g>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const ctaHref = isLoggedIn ? '/home' : '/onboarding';
  useSmoothScroll();

  /* refs */
  const heroRef      = useRef<HTMLElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const treeSvgRef   = useRef<SVGSVGElement>(null);
  const panoRef      = useRef<HTMLElement>(null);
  const dimCardsRef  = useRef<HTMLDivElement>(null);

  /* ── GSAP: hero entrance — árbol ya florecido al entrar ── */
  useGSAP(() => {
    const svg = treeSvgRef.current;
    if (!svg) return;

    const ease = 'power2.out';

    // Soft fade-in of the entire fully bloomed tree SVG
    gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.8, ease });

    /* Texto hero entra en paralelo */
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from('[data-hero-eyebrow]', { opacity: 0, y: 16, duration: 0.6, ease }, 0.1);
    if (headlineRef.current)
      tl.from(headlineRef.current, { opacity: 0, y: 20, duration: 0.7, ease }, 0.2);
    tl.from('[data-hero-sub]',  { opacity: 0, y: 20, duration: 0.7, ease }, 0.3)
      .from('[data-hero-ctas]', { opacity: 0, y: 16, duration: 0.6, ease }, 0.4);
  }, { dependencies: [] });

  /* ── GSAP: hero scroll — árbol crece/se aleja mientras texto se desvanece ── */
  useGSAP(() => {
    const hero = heroRef.current;
    const svg  = treeSvgRef.current;
    if (!hero || !svg) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    /* Árbol escala hacia afuera dramáticamente (efecto de avanzar hacia él) y se desvanece */
    tl.fromTo(svg,
      { scale: 1, opacity: 1, transformOrigin: 'center 85%' },
      { scale: 1.7, opacity: 0, ease: 'power1.inOut', duration: 0.85, immediateRender: false },
      0);

    /* Texto: escala y desvanecimiento */
    if (headlineRef.current) {
      tl.fromTo(headlineRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.5, opacity: 0, transformOrigin: 'center', ease: 'power1.inOut', duration: 0.5, immediateRender: false },
        0.05);
    }
    tl.fromTo('[data-hero-eyebrow],[data-hero-sub],[data-hero-ctas]',
      { opacity: 1 },
      { opacity: 0, ease: 'power1.inOut', duration: 0.4, immediateRender: false },
      0.05);

    ScrollTrigger.refresh();
  }, { dependencies: [] });

  /* ── GSAP: árboles panorámicos — florecen al entrar al viewport ── */
  useGSAP(() => {
    const section = panoRef.current;
    if (!section) return;

    const sel = gsap.utils.selector(section);

    /* inicializar troncos y ramas: invisible + dashoffset */
    (sel('[data-pano-trunk],[data-pano-branch]') as unknown as SVGGeometryElement[]).forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });
    gsap.set(sel('[data-pano-leaf]'), { scale: 0, opacity: 0 });

    /* Un único timeline para toda la sección */
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 95%',
        toggleActions: 'play none none none',
      }
    });

    ([0, 1, 2, 3] as const).forEach((tIdx) => {
      const delayOffset = tIdx * 0.2; // escalonado entre árboles
      const trunkEls  = sel(`[data-pano-tree="${tIdx}"][data-pano-trunk]`) as unknown as SVGGeometryElement[];
      const branchEls = sel(`[data-pano-tree="${tIdx}"][data-pano-branch]`) as unknown as SVGGeometryElement[];
      const leafEls   = sel(`[data-pano-tree="${tIdx}"][data-pano-leaf]`) as Element[];

      if (trunkEls.length > 0) {
        const trunkLen = trunkEls[0].getTotalLength();
        mainTl.fromTo(trunkEls,
          { strokeDashoffset: trunkLen, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
          delayOffset);
      }
      
      branchEls.forEach((b, i) => {
        const branchLen = (b as SVGGeometryElement).getTotalLength();
        mainTl.fromTo(b,
          { strokeDashoffset: branchLen, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, ease: 'power2.out', duration: 0.35 },
          delayOffset + 0.15 + i * 0.04);
      });

      leafEls.forEach((l, i) => {
        mainTl.to(l, {
          scale: 1,
          opacity: 1,
          ease: 'back.out(1.4)',
          duration: 0.28,
          transformOrigin: '0px 0px'
        }, delayOffset + 0.32 + i * 0.03);
      });
    });
  }, { dependencies: [] });

  /* ── GSAP: dimension cards stagger ── */
  useGSAP(() => {
    const container = dimCardsRef.current;
    if (!container) return;
    gsap.from(container.querySelectorAll('[data-dim-card]'), {
      y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: container, start: 'top 82%', toggleActions: 'play none none none' },
    });
  }, { dependencies: [] });

  /* ═══════════ JSX ═══════════ */
  return (
    <div style={{ backgroundColor: C.cream, color: C.ink }} className="min-h-screen overflow-x-hidden">

      {/* ═════ NAV ═════ */}
      <nav className="fixed top-0 z-50 w-full" style={{ background: 'transparent' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <SeedIcon size={26} />
            <span className="font-serif text-xl font-bold tracking-tight" style={{ color: C.ink }}>BEAN</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/home"  className="hidden sm:inline text-sm font-medium transition-opacity hover:opacity-60" style={{ color: C.muted }}>Árbol</Link>
            <Link href="/login" className="hidden sm:inline text-sm font-medium transition-opacity hover:opacity-60" style={{ color: C.muted }}>Iniciar sesión</Link>
            <Link href={ctaHref}
              className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: C.border, color: C.ink }}>
              {isLoggedIn ? 'Mi BEAN' : 'Comenzar gratis'}
            </Link>
          </div>
        </div>
      </nav>

      {/* ═════ HERO ═════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center px-6 pt-20 pb-12 sm:pt-28 lg:pt-32 min-h-screen overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {/* texto fantasma */}
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-serif italic select-none leading-none z-0"
          style={{ fontSize: 96, opacity: 0.04, color: C.ink, whiteSpace: 'nowrap' }} aria-hidden>
          CRECER
        </span>



        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-4 sm:gap-8 lg:gap-12 xl:gap-20">
          {/* copy — GSAP anima la entrada, no Framer */}
          <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left max-w-xl w-full">
            <p data-hero-eyebrow
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: C.green }}>
              Tu árbol de vida
            </p>
            <h1
              ref={headlineRef}
              className="font-serif mb-5 leading-tight tracking-tight"
              style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', color: C.ink }}
            >
              La vida que quieres vivir,{' '}
              <em style={{ color: C.green, fontStyle: 'italic' }}>cultivada.</em>
            </h1>
            <p data-hero-sub
              className="mb-8 text-base leading-relaxed font-light"
              style={{ color: C.muted, maxWidth: 460 }}>
              Mide tus pilares de vida, define metas con propósito y recibe acompañamiento IA que realmente te conoce.
            </p>
            <div data-hero-ctas className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href={ctaHref}
                className="w-full sm:w-auto text-center rounded-full px-7 py-3 text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95"
                style={{ background: C.ink, color: '#fff' }}>
                Plantar mi semilla →
              </Link>
            </div>
          </div>

          {/* árbol SVG — GSAP controla todo */}
          <div className="relative z-10 flex justify-center w-full max-w-[380px] sm:max-w-[520px] lg:max-w-[640px] xl:max-w-[700px] aspect-[440/430] flex-shrink-0">
            <HeroTree svgRef={treeSvgRef} />
          </div>
        </div>
      </section>

      {/* ═════ TICKER ═════ */}
      <div className="overflow-hidden py-4"
        style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="ticker-track flex gap-0 whitespace-nowrap">
          {[...TICKER_WORDS, ...TICKER_WORDS].map((w, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-4">
              <span className="font-serif italic text-base" style={{ color: C.ghost }}>{w}</span>
              <span style={{ color: C.green, fontSize: 8 }}>●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═════ SECCIÓN 2: SPLIT (COACH IA & DIMENSIONES) ═════ */}
      <section className="py-20 px-6" style={{ background: C.creamDk }}>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Izquierda: Coach IA Mockup */}
          <motion.div className="flex flex-col justify-center text-left"
            variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: C.green }}>Tu coach de vida</p>
            <h2 className="font-serif mb-4 leading-tight text-left" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: C.ink }}>
              La IA que te conoce{' '}<em style={{ color: C.green, fontStyle: 'italic' }}>de verdad.</em>
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-left" style={{ color: C.muted, maxWidth: 500 }}>
              No respuestas genéricas. El coach recuerda tus metas, hábitos y estado anímico para guiarte con precisión — como si llevara días caminando contigo.
            </p>
            
            {/* Tarjeta de Chat Mockup */}
            <div className="rounded-3xl p-6 flex flex-col gap-4 text-left shadow-lg max-w-md w-full"
              style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
              {/* header */}
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #2A2A2A' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: C.green }}>
                  <SeedIcon size={15} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: '#fff' }}>BEAN Coach</p>
                  <p className="text-[10px]" style={{ color: C.green }}>Activo • en línea</p>
                </div>
              </div>
              {/* messages */}
              <div className="flex flex-col gap-3">
                {[
                  { from: 'bean', text: 'Hola 👋 Vi que cerraste el curso de diseño. ¿Cómo te sientes con eso?' },
                  { from: 'user', text: 'Muy bien! Aunque siento que me falta practicar más.' },
                  { from: 'bean', text: 'Perfecto — ¿lo agregamos como meta de práctica a tu árbol? Puedo ayudarte a definir los pasos concretos.' },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
                    {msg.from === 'bean' && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: C.green }}>
                        <SeedIcon size={13} />
                      </div>
                    )}
                    <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed" style={{
                      maxWidth: 280,
                      background: msg.from === 'bean' ? '#2A2A2A' : C.green,
                      color: msg.from === 'bean' ? '#E5E5E5' : '#fff',
                      borderRadius: msg.from === 'bean' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* input simulado */}
              <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 mt-1"
                style={{ background: '#2A2A2A' }}>
                <span className="text-sm flex-1" style={{ color: '#555' }}>Escribe tu respuesta…</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: C.green, opacity: 0.7 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Dimensiones de Vida */}
          <motion.div className="flex flex-col justify-center text-left"
            variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={0.15}>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-left" style={{ color: C.muted }}>Tu desarrollo integral</p>
            <h2 className="font-serif mb-8 leading-tight text-left" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', color: C.ink }}>
              19 dimensiones de{' '}<em style={{ color: C.green, fontStyle: 'italic' }}>lo que eres.</em>
            </h2>

            {/* dim cards */}
            <div ref={dimCardsRef} className="grid grid-cols-2 gap-4 mb-6">
              {DIMS.map((d) => (
                <div key={d.name} data-dim-card
                  className="flex flex-col gap-1.5 rounded-2xl p-4 text-left shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{d.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: C.green }}>
                      {d.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold mt-1" style={{ color: C.ink }}>{d.name}</span>
                  <span className="font-serif text-lg font-bold leading-none" style={{ color: C.green }}>{d.count}</span>
                  <p className="text-[10px] leading-normal mt-0.5" style={{ color: C.muted }}>{d.desc}</p>
                </div>
              ))}
            </div>

            {/* value proposition card */}
            <div className="rounded-2xl px-5 py-4 text-left shadow-sm" style={{ background: C.ink }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.green }}>Lo que BEAN activa en ti</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: '🌱', label: 'Coach IA personalizado', detail: 'Que recuerda quién eres y te guía con precisión' },
                  { icon: '🌿', label: 'Metas con propósito real', detail: 'Conectadas a tus dimensiones y compromisos base' },
                  { icon: '🌳', label: 'Tu bosque personal', detail: 'Una metáfora visual de todo tu crecimiento en la vida' },
                  { icon: '✦', label: 'Identidad, Capital y Experiencia', detail: 'Los tres pilares que cubren todo lo que eres' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold leading-none" style={{ color: '#fff' }}>{item.label}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: C.ghost }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═════ PANORAMIC TREES ═════ */}
      <section ref={panoRef} className="py-24 px-6" style={{ background: C.cream }}>
        <motion.div className="text-center mb-16"
          variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: C.ink }}>
            Metas{' '}<em style={{ color: C.green, fontStyle: 'italic' }}>compartidas.</em>
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto leading-relaxed" style={{ color: C.muted }}>
            El crecimiento no ocurre en aislamiento. Conecta con otros, comparte tus propósitos y ve cómo vuestro bosque crece en comunidad.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
            {[{ color: '#22c55e', label: 'Meta completada' }, { color: '#D1D5DB', label: 'Meta pendiente' }, { color: '#fcd34d', label: 'Hito alcanzado' }]
              .map((leg) => (
                <span key={leg.label} className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: leg.color }} />
                  {leg.label}
                </span>
              ))}
          </div>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <svg viewBox="0 -60 900 280" fill="none" className="w-full" overflow="visible">
            <line x1="0" y1="200" x2="900" y2="200" stroke={C.border} strokeWidth="1" />
            <PanoTreeGroup treeIdx={0} cx={110} scale={0.72} greenRatio={1} />
            <PanoTreeGroup treeIdx={1} cx={295} scale={0.92} greenRatio={1} />
            <PanoTreeGroup treeIdx={2} cx={510} scale={1.22} greenRatio={1} />
            <PanoTreeGroup treeIdx={3} cx={745} scale={0.82} greenRatio={1} />
          </svg>
        </div>
      </section>

      {/* ═════ SOCIAL PROOF ═════ */}
      <section className="py-24 px-6" style={{ background: C.ink }}>
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <motion.div key={i}
              className="flex flex-col justify-between rounded-3xl p-7"
              style={{ background: '#222', border: '1px solid #2E2E2E' }}
              variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
              <p className="font-serif italic text-lg leading-relaxed mb-6" style={{ color: '#E5E5E5' }}>"{q.text}"</p>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#fff' }}>{q.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.green }}>{q.dim}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════ FINAL CTA ═════ */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
        style={{ background: C.creamDk }}>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif italic select-none leading-none"
          style={{ fontSize: 'clamp(80px, 18vw, 180px)', color: C.border, opacity: 0.8, zIndex: 0 }} aria-hidden>
          CRECER
        </span>
        <div className="relative z-10 flex flex-col items-center">
          <motion.h2 className="font-serif mb-4 leading-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: C.ink }}
            variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            Tu árbol espera para{' '}<em style={{ color: C.green, fontStyle: 'italic' }}>florecer.</em>
          </motion.h2>
          <motion.p className="mb-8 text-base leading-relaxed"
            style={{ color: C.muted, maxWidth: 440 }}
            variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={0.1}>
            Gratis. Sin tarjeta. Solo tú, tus metas, y el árbol que los refleja.
          </motion.p>
          <motion.div
            variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={0.2}>
            <Link href={ctaHref}
              className="rounded-full px-8 py-4 text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ background: C.ink, color: '#fff' }}>
              Plantar mi semilla →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═════ FOOTER ═════ */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6"
        style={{ borderTop: `1px solid ${C.border}` }}>
        <p className="text-xs" style={{ color: C.ghost }}>© {new Date().getFullYear()} BEAN — Inteligencia de Vida.</p>
        <div className="flex gap-8">
          {['Privacidad', 'Términos', 'Contacto'].map((l) => (
            <span key={l} className="text-xs cursor-pointer transition-opacity hover:opacity-60" style={{ color: C.ghost }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
