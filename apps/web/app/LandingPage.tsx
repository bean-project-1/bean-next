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

// Ramas principales — fórmula idéntica a Branch.tsx (startX=220,startY=290,len=150,angles -155,-100,-65,-15)
const MB = [
  { d: 'M 220,290 C 181,298 138,256  84,238', w: 7 },
  { d: 'M 220,290 C 220,282 194,178 157,152', w: 6 },
  { d: 'M 220,290 C 262,270 274,168 280,150', w: 6 },
  { d: 'M 220,290 C 274,268 316,234 362,230', w: 7 },
];

// Sub-ramas cuadráticas
const SB = [
  'M 165,278 Q 142,260 128,244',
  'M 128,254 Q 108,242  96,230',
  'M 204,234 Q 183,213 172,194',
  'M 188,202 Q 171,183 163,165',
  'M 258,234 Q 277,212 288,192',
  'M 274,202 Q 290,182 298,164',
  'M 308,258 Q 330,242 344,228',
  'M 340,235 Q 356,222 366,210',
  'M 100,242 Q  82,232  72,224',
  'M 362,232 Q 380,220 392,210',
];

type LeafDef = { x: number; y: number; a: number; done: boolean; size?: number };
const LEAVES: LeafDef[] = [
  /* izquierda grupo 1 */
  { x: 138, y: 272, a: 125,  done: true  },
  { x: 118, y: 256, a: -55,  done: true  },
  { x: 104, y: 242, a: 115,  done: true  },
  { x: 122, y: 248, a: 105,  done: true  },
  { x:  90, y: 232, a: -70,  done: true  },
  /* izquierda punta */
  { x:  78, y: 225, a: 140,  done: true  },
  { x:  68, y: 216, a: -50,  done: true  },
  /* centro-izq */
  { x: 196, y: 228, a: 152,  done: true  },
  { x: 180, y: 206, a:   5,  done: true  },
  { x: 166, y: 182, a: 142,  done: false },
  { x: 178, y: 188, a: -10,  done: true  },
  /* centro-der */
  { x: 260, y: 228, a:  35,  done: true  },
  { x: 274, y: 206, a: 178,  done: true  },
  { x: 286, y: 182, a:  28,  done: false },
  { x: 272, y: 188, a: 190,  done: true  },
  /* derecha grupo 1 */
  { x: 316, y: 256, a: -10,  done: false },
  { x: 336, y: 242, a: 168,  done: false },
  { x: 352, y: 228, a: -20,  done: false },
  { x: 372, y: 218, a: 155,  done: false },
  /* derecha punta */
  { x: 388, y: 210, a: -30,  done: false },
  /* punta izq alta */
  { x: 158, y: 156, a: 130,  done: true  },
  /* punta der alta */
  { x: 278, y: 152, a:  50,  done: false },
];

const FRUITS = [
  { x:  84, y: 238, done: true  },   /* hito alcanzado — dorado */
  { x: 280, y: 150, done: false },   /* pendiente — gris */
];

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
        {FRUITS.map((f, i) => (
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
          d={d} stroke={C.branch} strokeWidth="3.5" strokeLinecap="round" fill="none"
          style={{ opacity: 0 }} />
      ))}

      {/* Tronco trapezoidal — fill con degradado de madera */}
      <path data-draw="" data-trunk=""
        d={TRUNK_D} fill="url(#htTrunkGrad)"
        style={{ opacity: 0 }} />
      <path d={TRUNK_D} fill="url(#htTrunkSheen)" style={{ opacity: 0 }} data-trunk-sheen="" />
      {/* Vetas del tronco */}
      <path d={TRUNK_GRAIN1} stroke="#2e1505" strokeWidth="1"   fill="none" opacity="0" style={{ opacity: 0 }} data-trunk-grain="" />
      <path d={TRUNK_GRAIN2} stroke="#5a320f" strokeWidth="1.5" fill="none" opacity="0" style={{ opacity: 0 }} data-trunk-grain="" />
      <path d={TRUNK_GRAIN3} stroke="#2e1505" strokeWidth="1"   fill="none" opacity="0" style={{ opacity: 0 }} data-trunk-grain="" />
      {/* Nudo */}
      <ellipse cx="222" cy="340" rx={TRUNK_KNOT_RX} ry={TRUNK_KNOT_RY} fill="#2e1505" opacity="0" style={{ opacity: 0 }} data-trunk-grain="" />

      {/* Ramas principales */}
      {MB.map((b, i) => (
        <path key={`hmb${i}`} data-draw="" data-main-branch=""
          d={b.d} stroke={C.branch} strokeWidth={b.w} strokeLinecap="round" fill="none"
          style={{ opacity: 0 }} />
      ))}

      {/* Sub-ramas */}
      {SB.map((d, i) => (
        <path key={`hsb${i}`} data-draw="" data-sub-branch=""
          d={d} stroke={C.branch} strokeWidth="3" strokeLinecap="round" fill="none"
          style={{ opacity: 0 }} />
      ))}

      {/* Hojas */}
      {LEAVES.map((l, i) => (
        <g key={`hl${i}`} transform={`translate(${l.x},${l.y}) rotate(${l.a})`}>
          <g data-leaf="" data-leaf-done={l.done ? 'true' : 'false'} style={{ opacity: 0 }}>
            <path d={LEAF} fill={l.done ? '#22c55e' : '#D1D5DB'} transform={`scale(${l.size ?? 1.1})`} />
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
      ))}

      {/* Frutos/milestones */}
      {FRUITS.map((f, i) => (
        <g key={`hfruit${i}`} transform={`translate(${f.x - 12},${f.y})`}>
          <g data-fruit="" style={{ opacity: 0 }}>
            <path d="M 0,0 Q 6,0 12,0" stroke={C.branch} strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="0" r="9" fill={`url(#hfg${i})`}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            {f.done && (
              <path d="M 9,-5 A 4 4 0 0 1 15,-5"
                stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            )}
          </g>
        </g>
      ))}
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

  /* ── GSAP: hero entrance — árbol florece al cargar, texto entra ── */
  useGSAP(() => {
    const svg = treeSvgRef.current;
    if (!svg) return;

    const sel = gsap.utils.selector(svg);
    const ease = 'power2.out';

    /* Inicializar paths de stroke (raíces y ramas) con dashoffset — evita dots */
    (sel('[data-root],[data-main-branch],[data-sub-branch]') as unknown as SVGGeometryElement[]).forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });
    /* Tronco trapezoidal (fill) — parte invisible */
    gsap.set(sel('[data-trunk],[data-trunk-sheen],[data-trunk-grain]'), { opacity: 0 });
    gsap.set(sel('[data-leaf]'),  { scale: 0, opacity: 0, transformOrigin: '0px 0px' });
    gsap.set(sel('[data-fruit]'), { scale: 0, opacity: 0, transformOrigin: '0px 0px' });

    /* Timeline de ENTRADA — dibuja el árbol completo inmediatamente */
    const tl = gsap.timeline({ delay: 0.3 });

    /* Tronco — fade in con clip desde abajo usando scaleY */
    const trunkEl = sel('[data-trunk]')[0] as Element;
    if (trunkEl) {
      tl.fromTo(trunkEl,
        { opacity: 0, scaleY: 0, transformOrigin: '220px 390px' },
        { opacity: 1, scaleY: 1, ease, duration: 0.55 }, 0);
    }
    /* Sheen y vetas entran con el tronco */
    tl.to(sel('[data-trunk-sheen],[data-trunk-grain]'), { opacity: 1, ease, duration: 0.4 }, 0.3);

    /* Raíces */
    (sel('[data-root]') as unknown as SVGGeometryElement[]).forEach((r, i) => {
      const len = r.getTotalLength();
      tl.fromTo(r,
        { strokeDashoffset: len, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, ease, duration: 0.4 },
        0.1 + i * 0.05);
    });
    /* Ramas principales */
    (sel('[data-main-branch]') as unknown as SVGGeometryElement[]).forEach((b, i) => {
      const len = b.getTotalLength();
      tl.fromTo(b,
        { strokeDashoffset: len, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, ease, duration: 0.45 },
        0.3 + i * 0.08);
    });
    /* Sub-ramas */
    (sel('[data-sub-branch]') as unknown as SVGGeometryElement[]).forEach((b, i) => {
      const len = b.getTotalLength();
      tl.fromTo(b,
        { strokeDashoffset: len, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, ease, duration: 0.35 },
        0.55 + i * 0.04);
    });
    /* Hojas verdes primero */
    (sel('[data-leaf-done="true"]') as Element[]).forEach((l, i) => {
      tl.to(l, { scale: 1, opacity: 1, ease: 'back.out(1.7)', duration: 0.25,
        transformOrigin: '0px 0px' }, 0.7 + i * 0.025);
    });
    (sel('[data-leaf-done="false"]') as Element[]).forEach((l, i) => {
      tl.to(l, { scale: 1, opacity: 1, ease: 'back.out(1.5)', duration: 0.25,
        transformOrigin: '0px 0px' }, 0.85 + i * 0.025);
    });
    /* Frutos/milestones */
    (sel('[data-fruit]') as Element[]).forEach((f, i) => {
      tl.to(f, { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.25,
        transformOrigin: '0px 0px' }, 0.95 + i * 0.04);
    });

    /* Texto hero entra en paralelo */
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

    /* inicializar stroke-dashoffset en troncos y ramas */
    (sel('[data-pano-trunk],[data-pano-branch]') as unknown as SVGGeometryElement[]).forEach((el) => {
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.set(sel('[data-pano-leaf]'), { scale: 0, opacity: 0 });

    /* Un solo timeline por árbol, dispara al entrar — sin scrub — terminan florecidos */
    ([0, 1, 2, 3] as const).forEach((tIdx) => {
      const delay = tIdx * 0.18;  /* escalonado entre árboles */
      const trunkEls = sel(`[data-pano-tree="${tIdx}"][data-pano-trunk]`) as unknown as SVGGeometryElement[];
      const branchEls = sel(`[data-pano-tree="${tIdx}"][data-pano-branch]`) as unknown as SVGGeometryElement[];
      const leafEls   = sel(`[data-pano-tree="${tIdx}"][data-pano-leaf]`) as Element[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay,
      });

      /* tronco */
      if (trunkEls.length > 0) {
        tl.fromTo(trunkEls,
          { opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, ease: 'power2.out', duration: 0.4 }, 0);
      }
      /* ramas — stagger rápido */
      branchEls.forEach((b, i) => {
        tl.fromTo(b,
          { opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, ease: 'power2.out', duration: 0.3 },
          0.15 + i * 0.04);
      });
      /* hojas — todas aparecen antes de que el usuario vea la sección completa */
      leafEls.forEach((l, i) => {
        tl.to(l, { scale: 1, opacity: 1, ease: 'back.out(1.4)', duration: 0.25,
          transformOrigin: '0px 0px' }, 0.3 + i * 0.03);
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

      {/* ═════ DIMENSIONES ═════ */}
      <section className="py-20 px-6" style={{ background: C.creamDk }}>
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-12"
            variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: C.muted }}>Tu desarrollo integral</p>
            <h2 className="font-serif leading-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.ink }}>
              19 dimensiones de{' '}<em style={{ color: C.green, fontStyle: 'italic' }}>lo que eres.</em>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* dim cards — GSAP stagger */}
            <div ref={dimCardsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DIMS.map((d) => (
                <div key={d.name} data-dim-card
                  className="flex flex-col gap-1.5 rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{d.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: C.green }}>
                      {d.status}
                    </span>
                  </div>
                  <span className="text-sm font-bold mt-2" style={{ color: C.ink }}>{d.name}</span>
                  <span className="font-serif text-2xl font-bold leading-none" style={{ color: C.green }}>{d.count}</span>
                  <p className="text-[11px] leading-normal mt-1" style={{ color: C.muted }}>{d.desc}</p>
                </div>
              ))}
            </div>

            {/* value proposition card */}
            <motion.div className="rounded-2xl px-6 py-6 text-left h-full flex flex-col justify-center" style={{ background: C.ink }}
              variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} custom={0.2}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.green }}>Lo que BEAN activa en ti</p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '🌱', label: 'Coach IA personalizado', detail: 'Que recuerda quién eres y te guía con precisión en cada etapa' },
                  { icon: '🌿', label: 'Metas con propósito real', detail: 'Conectadas a tus dimensiones y compromisos base' },
                  { icon: '🌳', label: 'Tu bosque personal', detail: 'Una metáfora visual de todo tu crecimiento en la vida' },
                  { icon: '✦', label: 'Identidad, Capital y Experiencia', detail: 'Los tres pilares que cubren todo lo que eres' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: '#fff' }}>{item.label}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: C.ghost }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════ PANORAMIC TREES ═════ */}
      <section ref={panoRef} className="py-24 px-6" style={{ background: C.cream }}>
        <motion.div className="text-center mb-16"
          variants={revealVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: C.ink }}>
            Tu vida,{' '}<em style={{ color: C.green, fontStyle: 'italic' }}>visualizada.</em>
          </h2>
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
