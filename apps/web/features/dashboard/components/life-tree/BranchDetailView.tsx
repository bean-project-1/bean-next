'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Branch } from './types';

interface Props {
  branch: Branch;
  onClose: () => void;
}

const SVG_W = 600;
const SVG_H = 1200;
const CX = SVG_W / 2;
const START_Y = SVG_H - 80; // trunk bottom
const END_Y = 100;          // branch tip

function getBezierPoint(t: number) {
  const cp1y = START_Y - (START_Y - END_Y) * 0.3;
  const cp2y = START_Y - (START_Y - END_Y) * 0.7;
  const mt = 1 - t;
  return {
    x: CX + Math.sin(t * Math.PI * 0.4) * 60,
    y: mt * mt * mt * START_Y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * END_Y,
  };
}

const BRANCH_PATH = `M ${CX},${START_Y} C ${CX + 20},${START_Y - 250} ${CX - 30},${END_Y + 350} ${CX + 10},${END_Y}`;

/** Build a tapered polygon path around the bezier — wide at base, thin at tip */
function buildTaperedPath(color: string, steps = 40): { left: string; right: string } {
  const BASE_W = 38;  // half-width at bottom (perspective base)
  const TIP_W = 3;    // half-width at top (vanishing point)

  type Pt = { x: number; y: number };
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    pts.push(getBezierPoint(i / steps));
  }

  const left: string[] = [];
  const right: string[] = [];

  pts.forEach((p, i) => {
    const t = i / steps;
    const hw = BASE_W + (TIP_W - BASE_W) * t; // lerp from thick → thin

    // Tangent from neighbouring point
    const prev = pts[Math.max(0, i - 1)]!;
    const next = pts[Math.min(steps, i + 1)]!;
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    // Perpendicular normal (rotated 90°)
    const nx = -ty / len;
    const ny =  tx / len;

    const lx = p.x + nx * hw;
    const ly = p.y + ny * hw;
    const rx = p.x - nx * hw;
    const ry = p.y - ny * hw;

    left.push(`${i === 0 ? 'M' : 'L'} ${lx.toFixed(1)},${ly.toFixed(1)}`);
    right.unshift(`${rx.toFixed(1)},${ry.toFixed(1)}`);
  });

  // Closed shape: left edge forward + right edge reversed
  return {
    left: left.join(' '),
    right: right.join(' '),
  };
}


export function BranchDetailView({ branch, onClose }: Props) {
  // ── Pan / Zoom state ────────────────────────────────────
  const [vb, setVb] = useState({ x: 0, y: 0, w: SVG_W, h: SVG_H });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    setVb(v => {
      const nw = Math.max(100, Math.min(SVG_W * 2, v.w * factor));
      const nh = Math.max(200, Math.min(SVG_H * 2, v.h * factor));
      // Zoom toward center
      const dx = (v.w - nw) / 2;
      const dy = (v.h - nh) / 2;
      return { x: v.x + dx, y: v.y + dy, w: nw, h: nh };
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const svgEl = e.currentTarget as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = vb.w / rect.width;
    const scaleY = vb.h / rect.height;
    const dx = (e.clientX - lastPos.current.x) * scaleX;
    const dy = (e.clientY - lastPos.current.y) * scaleY;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setVb(v => ({ ...v, x: v.x - dx, y: v.y - dy }));
  };

  const handlePointerUp = () => { dragging.current = false; };

  // ── Colors ──────────────────────────────────────────────
  const colors = [
    '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6',
    '#f59e0b', '#22c55e', '#0ea5e9',
  ];
  const branchColor = colors[Math.abs(branch.id.charCodeAt(0) % colors.length)];

  // Pre-compute tapered path once per render
  const STEPS = 50;
  const taper = buildTaperedPath(branchColor, STEPS);
  const taperedD = `${taper.left} L ${taper.right.split(' ').join(' L ')} Z`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fade-in overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full" style={{ background: branchColor }} />
          <h2 className="text-xl font-bold text-slate-900">{branch.goal}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 font-medium">
            {branch.leaves.length} actividades
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setVb({ x: 0, y: 0, w: SVG_W, h: SVG_H })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setVb(v => ({ x: v.x + v.w * 0.1, y: v.y + v.h * 0.1, w: v.w * 0.8, h: v.h * 0.8 }))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >＋</button>
            <button
              onClick={() => setVb(v => ({ x: v.x - v.w * 0.1, y: v.y - v.h * 0.1, w: v.w * 1.2, h: v.h * 1.2 }))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >－</button>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            ✕ Cerrar
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mx-6 mt-3 mb-1 flex items-center gap-3 shrink-0">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-20">Progreso</span>
        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${branch.progress}%`, background: branchColor }}
          />
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: branchColor }}>{branch.progress}%</span>
      </div>

      {/* ── SVG Canvas with Pan+Zoom ── */}
      <div className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing select-none">
        <svg
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          {/* Background hint */}
          <text
            x={CX}
            y={SVG_H + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#cbd5e1"
            fontWeight="700"
            fontFamily="sans-serif"
            letterSpacing="4"
          >
            RAÍZ
          </text>
          <text
            x={CX}
            y={END_Y - 30}
            textAnchor="middle"
            fontSize="11"
            fill="#cbd5e1"
            fontWeight="700"
            fontFamily="sans-serif"
            letterSpacing="4"
          >
            META
          </text>

          {/* Tapered branch — wide at root, narrow at tip, faking perspective */}
          <defs>
            <linearGradient id="branchGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"  stopColor={branchColor} stopOpacity="0.18" />
              <stop offset="60%" stopColor={branchColor} stopOpacity="0.09" />
              <stop offset="100%" stopColor={branchColor} stopOpacity="0.04" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Shadow fill for depth */}
          <path
            d={taperedD}
            fill="url(#branchGrad)"
            stroke="none"
          />

          {/* Outline edge — left side only, for the lit edge look */}
          <path
            d={taper.left}
            fill="none"
            stroke={branchColor}
            strokeWidth="1"
            opacity="0.4"
            strokeLinecap="round"
          />

          {/* Centre spine = original bezier, ultra-thin */}
          <path
            d={BRANCH_PATH}
            stroke={branchColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#glow)"
          />

          {/* Floor-line gradient at the base for grounding */}
          <ellipse
            cx={CX}
            cy={START_Y}
            rx={38}
            ry={8}
            fill={branchColor}
            opacity="0.12"
          />

          {/* Leaves along path */}
          {branch.leaves.map((leaf, i) => {
            const t = 0.1 + (i / Math.max(branch.leaves.length - 1, 1)) * 0.8;
            const pos = getBezierPoint(t);
            const side = i % 2 === 0 ? 1 : -1;
            const leafX = pos.x + side * 140;
            const leafY = pos.y;
            const done = leaf.completed;

            return (
              <g key={leaf.id}>
                {/* Connector */}
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={leafX}
                  y2={leafY}
                  stroke={done ? branchColor : '#94a3b8'}
                  strokeWidth="2"
                  strokeDasharray="5,3"
                  opacity="0.8"
                />
                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="9"
                  fill={done ? branchColor : '#e2e8f0'}
                  stroke="white"
                  strokeWidth="2.5"
                />
                {/* Leaf card */}
                <rect
                  x={leafX - 125}
                  y={leafY - 36}
                  width="260"
                  height="72"
                  rx="14"
                  fill="white"
                  stroke={done ? branchColor : '#cbd5e1'}
                  strokeWidth="2"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.07))' }}
                />
                {/* Status dot */}
                <circle
                  cx={leafX - 105}
                  cy={leafY}
                  r="10"
                  fill={done ? branchColor : '#f1f5f9'}
                  stroke={done ? branchColor : '#cbd5e1'}
                  strokeWidth="2"
                />
                {done && (
                  <text
                    x={leafX - 105}
                    y={leafY + 5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="900"
                  >✓</text>
                )}
                {/* Leaf title */}
                <text
                  x={leafX - 86}
                  y={leafY - 8}
                  fontSize="15"
                  fill="#1e293b"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {leaf.name.length > 22 ? leaf.name.slice(0, 22) + '\u2026' : leaf.name}
                </text>
                <text
                  x={leafX - 86}
                  y={leafY + 14}
                  fontSize="13"
                  fill={done ? branchColor : '#94a3b8'}
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {done ? '✓ Completado' : '○ Pendiente'}
                </text>
              </g>
            );
          })}

          {/* Empty state */}
          {branch.leaves.length === 0 && (
            <text
              x={CX}
              y={SVG_H / 2}
              textAnchor="middle"
              fontSize="13"
              fill="#cbd5e1"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              Sin actividades aún
            </text>
          )}
        </svg>
      </div>

      {/* ── Hint ── */}
      <div className="shrink-0 text-center pb-3">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Scroll para zoom · Arrastra para moverte
        </span>
      </div>
    </div>
  );
}
