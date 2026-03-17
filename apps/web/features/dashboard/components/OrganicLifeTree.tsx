'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ── Types ──────────────────────────────────────────────
interface Activity {
  id: string;
  label: string;
  completed: boolean;
}

interface LifeObjective {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'planned';
  activities: Activity[];
}

interface OrganicLifeTreeProps {
  score: number;
  onElementClick?: (element: any) => void;
}

// ── Mock Data ──────────────────────────────────────────
const MOCK_OBJECTIVES: LifeObjective[] = [
  {
    id: 'obj-ds',
    label: 'Ser Data Scientist',
    status: 'in-progress',
    activities: [
      { id: 'act-1', label: 'Completar curso Python', completed: true },
      { id: 'act-2', label: 'Estadística avanzada', completed: true },
      { id: 'act-3', label: 'Proyecto de ML', completed: false },
    ],
  },
  {
    id: 'obj-maraton',
    label: 'Correr Maratón NYC',
    status: 'planned',
    activities: [
      { id: 'act-4', label: 'Entrenar 5k', completed: true },
      { id: 'act-5', label: 'Zapatillas nuevas', completed: true },
    ],
  },
  {
    id: 'obj-travel',
    label: 'Viajar por Japón',
    status: 'planned',
    activities: [
      { id: 'act-6', label: 'Ahorrar presupuesto', completed: true },
    ],
  },
];

// ── Components ─────────────────────────────────────────

const Leaf = ({ x, y, angle, completed, delay }: { 
  x: number; y: number; angle: number; completed: boolean; delay: number 
}) => (
  <motion.path
    d="M 0,0 C 2,-5 8,-5 10,0 C 8,5 2,5 0,0"
    fill={completed ? "#22c55e" : "#e5e7eb"}
    initial={{ scale: 0, opacity: 0, rotate: angle }}
    animate={{ scale: 1, opacity: 1, rotate: angle }}
    whileHover={{ scale: 1.4, fill: "#16a34a" }}
    style={{ originX: "0px", originY: "0px" }}
    className="cursor-pointer"
    transform={`translate(${x},${y})`}
    transition={{ delay, type: "spring", stiffness: 100 }}
  />
);

const Root = ({ d, label, color }: { d: string; label: string; color: string }) => {
  const segments = d.split(' ');
  const lastSegment = segments[segments.length - 1] || '0,0';
  const coords = lastSegment.includes(',') ? lastSegment.split(',') : ['0', '0'];
  const lastX = parseFloat(coords[0] || '0');
  const lastY = parseFloat(coords[1] || '0');

  return (
    <g>
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.2 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.text
        x={lastX}
        y={lastY + 20}
        textAnchor="middle"
        className="text-[10px] font-bold fill-gray-300 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {label}
      </motion.text>
    </g>
  );
};

const Branch = ({ id, label, path, activities, onClick }: { 
  id: string; 
  label: string; 
  path: string; 
  activities: Activity[];
  onClick?: () => void;
}) => {
  const parts = path.split(' ');
  const lastPart = parts[parts.length - 1] || '400,400';
  const coords = lastPart.includes(',') ? lastPart.split(',') : ['400', '400'];
  const ex = parseFloat(coords[0] || '400');
  const ey = parseFloat(coords[1] || '400');

  return (
    <motion.g 
      onClick={onClick} 
      className="cursor-pointer group"
      animate={{ rotate: [0, 1, 0, -1, 0] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "400px", originY: "400px" }}
    >
      {/* Branch Line (Organic Curve) */}
      <motion.path
        d={path}
        stroke="#4B5563"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        whileHover={{ opacity: 0.7, strokeWidth: 4 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      
      {/* Leaves (Activities) */}
      {activities.map((act, i) => {
        const t = 0.5 + (i / (activities.length || 1)) * 0.4;
        const lx = 400 + (ex - 400) * t + Math.sin(i * 2) * 15;
        const ly = 400 + (ey - 400) * t + Math.cos(i * 2) * 10;
        
        return (
          <Leaf 
            key={act.id} 
            x={lx} 
            y={ly} 
            angle={(i * 30)} 
            completed={act.completed} 
            delay={0.8 + i * 0.1}
          />
        );
      })}

      {/* Label - Positioned near the end of branch */}
      <motion.text
        x={ex + (ex > 400 ? 15 : -15)}
        y={ey - 10}
        textAnchor={ex > 400 ? "start" : "end"}
        className="text-[10px] font-bold fill-gray-500 uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity"
      >
        {label}
      </motion.text>
    </motion.g>
  );
};

const OrganicLifeTree = ({ score, onElementClick }: OrganicLifeTreeProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative">
      {/* Top Score Indicator */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 cursor-pointer group"
        onClick={() => onElementClick?.({ type: 'score' })}
      >
        <div className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Score</span>
            <span className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">Bean Vitality</span>
          </div>
        </div>
        <motion.div 
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-300"
        >
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>

      <svg
        viewBox="0 0 800 800"
        className="w-full h-full max-w-[800px] max-h-[800px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Organic Roots */}
        <Root 
          d="M 400,450 C 380,550 320,600 280,680" 
          label="Identidad" 
          color="#8b5cf6" 
        />
        <Root 
          d="M 400,450 C 400,580 410,620 400,720" 
          label="Capital Humano" 
          color="#3b82f6" 
        />
        <Root 
          d="M 400,450 C 420,550 480,600 520,680" 
          label="Experiencia de Vida" 
          color="#10b981" 
        />

        {/* The Simple Trunk */}
        <motion.path
          d="M 400,450 L 400,350"
          stroke="#4B5563"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.15 }}
          transition={{ duration: 1.2 }}
        />

        {/* Organic Branches */}
        {MOCK_OBJECTIVES.map((obj, i) => {
          // Dynamic paths based on index for variety
          const paths = [
            "M 400,400 C 350,350 250,330 200,200",
            "M 400,400 C 400,320 400,280 400,150",
            "M 400,400 C 450,350 550,330 600,200"
          ];
          return (
            <Branch
              key={obj.id}
              id={obj.id}
              label={obj.label}
              path={paths[i] || "M 400,400 L 400,200"}
              activities={obj.activities}
              onClick={() => onElementClick?.({ type: 'objective', ...obj })}
            />
          );
        })}
      </svg>
      
      {/* Legend / Hints */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1.5 rounded-full bg-green-500 opacity-80" />
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Actividad Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1.5 rounded-full bg-gray-200 opacity-80" />
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Actividad Pendiente</span>
        </div>
      </div>
    </div>
  );
};

export default OrganicLifeTree;
