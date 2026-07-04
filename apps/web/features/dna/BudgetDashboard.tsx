'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';


const BUCKET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316'];

const DonutChart = ({ buckets, totalPercentage }: { buckets: any[], totalPercentage: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} stroke="#f5f5f4" strokeWidth="16" fill="none" />
        {buckets.map((b: any, i: number) => {
          if (!b.percentage || b.percentage <= 0) return null;
          const dash = (b.percentage / 100) * circumference;
          const offset = currentOffset;
          currentOffset += dash;
          
          return (
            <motion.circle
              key={b.id}
              cx="80"
              cy="80"
              r={radius}
              stroke={BUCKET_COLORS[i % BUCKET_COLORS.length]}
              strokeWidth="16"
              fill="none"
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${dash} ${circumference}` }}
              transition={{ duration: 1, type: "spring", bounce: 0 }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-stone-700">{totalPercentage}%</span>
        {totalPercentage === 100 && <span className="text-xs font-bold text-emerald-500">¡Perfecto! ✨</span>}
        {totalPercentage > 100 && <span className="text-xs font-bold text-rose-500">Excedido</span>}
        {totalPercentage < 100 && <span className="text-xs font-bold text-stone-400">Distribuílo</span>}
      </div>
    </div>
  );
};


const SortableBucketCard = ({ 
  b, 
  globalIdx, 
  expandedBucketId, 
  setExpandedBucketId, 
  monthlyIncome, 
  updateBucket, 
  updateBucketAmount, 
  assignRest, 
  unassignedPercentage, 
  removeBucket, 
  addBucketDetail, 
  updateBucketDetail, 
  removeBucketDetail, 
  activeAmountInput, 
  setActiveAmountInput 
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: b.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const amount = monthlyIncome * (b.percentage / 100);
  const isExpanded = expandedBucketId === b.id;
  const color = BUCKET_COLORS[globalIdx % BUCKET_COLORS.length];

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex flex-col rounded-[1.5rem] border transition-all duration-300 group overflow-hidden ${isExpanded ? 'border-indigo-200 bg-white shadow-xl shadow-indigo-500/10' : 'border-stone-100 bg-white/50 hover:bg-white hover:shadow-md'}`}
    >
      <div 
        onClick={() => setExpandedBucketId(isExpanded ? null : b.id)}
        className="flex items-center gap-2 p-4 md:p-5 cursor-pointer"
      >
        <div 
          {...attributes} 
          {...listeners}
          onClick={e => e.stopPropagation()}
          className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical size={16} />
        </div>
        <div className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          {isExpanded ? (
            <input
              type="text"
              value={b.name}
              onClick={e => e.stopPropagation()}
              onChange={e => updateBucket(b.id, 'name', e.target.value)}
              className="bg-transparent text-lg font-black text-stone-700 outline-none w-full focus:text-indigo-600"
            />
          ) : (
            <h4 className="text-lg font-black text-stone-700 truncate">{b.name}</h4>
          )}
          {!isExpanded && <p className="text-xs font-bold text-stone-400">{b.percentage}% asignado</p>}
        </div>
        
        <div className="text-right shrink-0">
          <p className="text-lg font-black text-stone-700">${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
      
      {/* EXPANDED VIEW */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-stone-100 bg-stone-50/50"
          >
            <div className="p-4 md:p-5 flex flex-wrap gap-6 items-start">
              
              <div className="flex flex-col relative w-32">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Monto</span>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-black text-stone-400">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={activeAmountInput?.id === b.id ? activeAmountInput.val : (amount ? amount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '')}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
                      setActiveAmountInput({ id: b.id, val: e.target.value });
                      if (raw !== '' && !isNaN(parseFloat(raw))) {
                        updateBucketAmount(b.id, parseFloat(raw));
                      }
                    }}
                    onBlur={() => setActiveAmountInput(null)}
                    className="w-full bg-white border border-stone-200 rounded-xl pl-6 pr-2 py-2 text-sm font-black text-stone-800 outline-none focus:border-indigo-400 transition-all shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex flex-col relative w-24">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Porcentaje</span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={b.percentage}
                    onChange={e => updateBucket(b.id, 'percentage', e.target.value)}
                    onBlur={e => { if (e.target.value === '') updateBucket(b.id, 'percentage', 0); }}
                    className="w-full bg-white border border-stone-200 rounded-xl px-2 py-2 text-sm font-black text-indigo-600 outline-none focus:border-indigo-400 text-center transition-all shadow-sm"
                  />
                  <span className="absolute right-2 top-2.5 text-[10px] text-stone-400 font-bold">%</span>
                </div>
              </div>

              {unassignedPercentage > 0 && (
                <div className="flex flex-col justify-end h-[60px]">
                  <button
                    onClick={() => assignRest(b.id)}
                    className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-3 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-1 shadow-sm"
                  >
                    ✨ Sumar {unassignedPercentage.toFixed(1)}%
                  </button>
                </div>
              )}

              <div className="flex-1" />

              <div className="flex flex-col justify-end h-[60px]">
                <button 
                  onClick={() => removeBucket(b.id)} 
                  className="p-2 text-stone-400 hover:text-white hover:bg-rose-500 transition-colors bg-white rounded-xl border border-stone-200 shadow-sm"
                  title="Eliminar categoría"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="px-4 md:px-5 pb-5">
              <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Desglose (Opcional)
                </h4>
                <div className="space-y-2">
                  {(b.details || []).map((detail: any) => (
                    <div key={detail.id} className="flex items-center gap-3 group/detail">
                      <input
                        type="text"
                        placeholder="Ej: Netflix"
                        value={detail.name}
                        onChange={e => updateBucketDetail(b.id, detail.id, 'name', e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 hover:border-stone-300 text-sm font-bold text-stone-600 outline-none placeholder:text-stone-300 rounded-xl px-4 py-2 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                      />
                      <div className="relative w-32 md:w-40">
                        <span className="absolute left-3 top-2.5 text-sm font-black text-stone-400">$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={activeAmountInput?.id === `detail-${detail.id}` ? activeAmountInput.val : (detail.amount ? detail.amount.toLocaleString('es-AR') : '')}
                          onChange={e => {
                            const raw = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
                            setActiveAmountInput({ id: `detail-${detail.id}`, val: e.target.value });
                            if (raw !== '' && !isNaN(parseFloat(raw))) {
                              updateBucketDetail(b.id, detail.id, 'amount', parseFloat(raw));
                            } else if (raw === '') {
                              updateBucketDetail(b.id, detail.id, 'amount', 0);
                            }
                          }}
                          onBlur={() => setActiveAmountInput(null)}
                          className="w-full bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-stone-700 outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeBucketDetail(b.id, detail.id)}
                        className="w-9 h-9 rounded-xl bg-white text-stone-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors border border-stone-200 shadow-sm opacity-100 md:opacity-0 group-hover/detail:opacity-100"
                      >
                        <span className="text-xs font-black">✕</span>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addBucketDetail(b.id)}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 mt-2"
                  >
                    + Añadir detalle
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


export function BudgetDashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [buckets, setBuckets] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [payday, setPayday] = useState<number | ''>('');
  const [accumulatedSavings, setAccumulatedSavings] = useState<number>(0);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // UX States
  const [activeAmountInput, setActiveAmountInput] = useState<{ id: number | string, val: string } | null>(null);
  const [expandedBucketId, setExpandedBucketId] = useState<number | null>(null);

  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    const activeBucket = buckets.find(b => b.id === activeId);
    const overBucket = buckets.find(b => b.id === overId);
    
    // If hovering over a dropzone (container id)
    if (overId === 'esencial' || overId === 'estilo' || overId === 'futuro') {
      if (activeBucket && activeBucket.group !== overId) {
        let newBuckets = [...buckets];
        const idx = newBuckets.findIndex(b => b.id === activeId);
        newBuckets[idx] = { ...newBuckets[idx], group: overId, isSavings: overId === 'futuro' };
        setBuckets(newBuckets);
      }
      return;
    }

    // If hovering over another item
    if (activeBucket && overBucket && activeBucket.group !== overBucket.group) {
      let newBuckets = [...buckets];
      const idx = newBuckets.findIndex(b => b.id === activeId);
      newBuckets[idx] = { ...newBuckets[idx], group: overBucket.group, isSavings: overBucket.group === 'futuro' };
      setBuckets(newBuckets);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId !== overId) {
      const oldIndex = buckets.findIndex(b => b.id === activeId);
      const newIndex = buckets.findIndex(b => b.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newBuckets = arrayMove(buckets, oldIndex, newIndex);
        setBuckets(newBuckets);
        saveBudget(monthlyIncome, newBuckets);
      }
    } else {
      // Just save to be safe if group changed during dragOver
      saveBudget(monthlyIncome, buckets);
    }
  };

  const activeBucket = activeId ? buckets.find(b => b.id === activeId) : null;


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/dna/budgets/settings');
      const json = await res.json();
      if (json.success && json.settings) {
        if (json.settings.payday) setPayday(json.settings.payday);
        if (json.settings.accumulatedSavings !== undefined) setAccumulatedSavings(json.settings.accumulatedSavings);
      }
    } catch (e) {
      console.error(e);
    }
    setSettingsLoading(false);
  };

  const saveSettings = async (field: 'payday' | 'accumulatedSavings', value: number | '') => {
    try {
      await fetch('/api/dna/budgets/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value === '' ? null : value }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [month, year]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dna/budgets?month=${month}&year=${year}`);
      const json = await res.json();
      if (json.success && json.budget) {
        const incomes = json.budget.incomes || [];
        const expenses = json.budget.expenses || [];
        
        const main = incomes.find((i: any) => i.type === 'main');
        if (main) setMonthlyIncome(main.amount || 0);
        else setMonthlyIncome(0);

        const savedBuckets = expenses.filter((e: any) => e.type === 'bucket');
        if (savedBuckets.length > 0) setBuckets(savedBuckets);
      } else {
        setMonthlyIncome(0);
        setBuckets([
          { id: 1, name: 'Arriendo / Hipoteca', percentage: 25, isSavings: false, group: 'esencial' },
          { id: 2, name: 'Mercado', percentage: 20, isSavings: false, group: 'esencial' },
          { id: 3, name: 'Servicios', percentage: 10, isSavings: false, group: 'esencial' },
          { id: 4, name: 'Transporte', percentage: 10, isSavings: false, group: 'esencial' },
          { id: 5, name: 'Salud', percentage: 10, isSavings: false, group: 'esencial' },
          { id: 6, name: 'Créditos / Deudas', percentage: 5, isSavings: false, group: 'esencial' },
          { id: 7, name: 'Ocio / Libre', percentage: 10, isSavings: false, group: 'estilo' },
          { id: 8, name: 'Metas / Ahorro', percentage: 10, isSavings: true, group: 'futuro' }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const saveBudget = (newIncome: number, newBuckets: any[]) => {
    setSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const incomes = [{ type: 'main', amount: newIncome }];
        const expenses = newBuckets.map(b => ({ ...b, type: 'bucket' }));

        await fetch('/api/dna/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ month, year, incomes, expenses }),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  const changeMonth = async (direction: 'prev' | 'next') => {
    // If there is a pending save, execute it immediately and await it
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
      
      const incomes = [{ type: 'main', amount: monthlyIncome }];
      const expenses = buckets.map(b => ({ ...b, type: 'bucket' }));

      try {
        await fetch('/api/dna/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ month, year, incomes, expenses }),
        });
      } catch (e) {
        console.error(e);
      }
      setSaving(false);
    }
    
    // Now change the month
    if (direction === 'prev') {
      if (month === 1) { setMonth(12); setYear(year - 1); }
      else setMonth(month - 1);
    } else {
      if (month === 12) { setMonth(1); setYear(year + 1); }
      else setMonth(month + 1);
    }
  };

  // --- Handlers ---
  const handleIncomeChange = (val: number) => {
    setMonthlyIncome(val);
    saveBudget(val, buckets);
  };

  const addBucket = (group: 'esencial' | 'estilo' | 'futuro') => {
    let newBuckets = [...buckets, { 
      id: Date.now(), 
      name: 'Nueva Categoría', 
      percentage: 0, 
      isSavings: group === 'futuro',
      group 
    }];
    setBuckets(newBuckets);
    saveBudget(monthlyIncome, newBuckets);
    setExpandedBucketId(newBuckets[newBuckets.length - 1].id);
  };

  const updateBucket = (id: number, field: string, value: any) => {
    let newBuckets = [...buckets];
    const targetIdx = newBuckets.findIndex(b => b.id === id);
    if (targetIdx === -1) return;

    if (field === 'percentage') {
      const newValClamped = Math.max(0, Math.min(100, Number(value) || 0));
      newBuckets[targetIdx] = { ...newBuckets[targetIdx], percentage: newValClamped };
    } else {
      newBuckets[targetIdx] = { ...newBuckets[targetIdx], [field]: value };
    }

    setBuckets(newBuckets);
    saveBudget(monthlyIncome, newBuckets);
  };
  
  const updateBucketAmount = (id: number, newAmount: number) => {
    if (monthlyIncome > 0) {
      const newPercentage = (newAmount / monthlyIncome) * 100;
      updateBucket(id, 'percentage', parseFloat(newPercentage.toFixed(2)));
    }
  };

  const removeBucket = (id: number) => {
    let newBuckets = buckets.filter(b => b.id !== id);
    setBuckets(newBuckets);
    saveBudget(monthlyIncome, newBuckets);
  };

  const assignRest = (bucketId: number) => {
    const currentTotal = buckets.reduce((sum, b) => sum + (b.percentage || 0), 0);
    const targetBucket = buckets.find(b => b.id === bucketId);
    const diff = 100 - currentTotal;
    if (diff > 0 && targetBucket) {
      updateBucket(bucketId, 'percentage', parseFloat((targetBucket.percentage + diff).toFixed(1)));
    }
  };

  // --- Details Handlers ---
  const addBucketDetail = (bucketId: number) => {
    const newBuckets = [...buckets];
    const idx = newBuckets.findIndex(b => b.id === bucketId);
    if (idx === -1) return;
    
    if (!newBuckets[idx].details) newBuckets[idx].details = [];
    newBuckets[idx].details.push({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      amount: 0
    });
    setBuckets(newBuckets);
    saveBudget(monthlyIncome, newBuckets);
  };

  const updateBucketDetail = (bucketId: number, detailId: string, field: string, value: any) => {
    const newBuckets = JSON.parse(JSON.stringify(buckets));
    const idx = newBuckets.findIndex((b: any) => b.id === bucketId);
    if (idx === -1 || !newBuckets[idx].details) return;

    const detIdx = newBuckets[idx].details.findIndex((d: any) => d.id === detailId);
    if (detIdx === -1) return;

    newBuckets[idx].details[detIdx] = { ...newBuckets[idx].details[detIdx], [field]: value };
    setBuckets(newBuckets);
    saveBudget(monthlyIncome, newBuckets);
  };

  const removeBucketDetail = (bucketId: number, detailId: string) => {
    const newBuckets = [...buckets];
    const idx = newBuckets.findIndex(b => b.id === bucketId);
    if (idx === -1 || !newBuckets[idx].details) return;

    newBuckets[idx].details = newBuckets[idx].details.filter((d: any) => d.id !== detailId);
    setBuckets(newBuckets);
    saveBudget(monthlyIncome, newBuckets);
  };

  // --- Calculations ---
  const totalPercentage = Math.round(buckets.reduce((sum, b) => sum + Number(b.percentage || 0), 0) * 10) / 10;
  const unassignedPercentage = Math.max(0, 100 - totalPercentage);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const essentialBuckets = buckets.filter(b => b.group === 'esencial' || (!b.group && !b.isSavings));
  const lifestyleBuckets = buckets.filter(b => b.group === 'estilo');
  const futureBuckets = buckets.filter(b => b.group === 'futuro' || (!b.group && b.isSavings));
  
  const isZeroState = monthlyIncome === 0;

  

  return (
    <div className="space-y-6 pb-12">
      {/* GLOBAL HEADER: MES, DÍA DE PAGO Y AHORRO ACUMULADO */}
      <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-20">
        
        {/* IZQUIERDA: Selector de Mes */}
        <div className="flex items-center gap-2 md:gap-4 justify-center xl:justify-start">
          <button
            onClick={() => changeMonth('prev')}
            className="p-2 md:p-3 bg-stone-50 rounded-full text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
          >
            ←
          </button>
          <div className="text-center w-36 md:w-48">
            <h2 className="text-xl md:text-2xl font-black text-indigo-700 leading-none">{monthNames[month - 1]}</h2>
            <p className="text-xs md:text-sm font-bold text-stone-400">{year}</p>
          </div>
          <button
            onClick={() => changeMonth('next')}
            className="p-2 md:p-3 bg-stone-50 rounded-full text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
          >
            →
          </button>
        </div>
        
        {/* DERECHA: Configuración Global (Día de Pago y Ahorro) */}
        {!settingsLoading && (
          <div className="flex flex-wrap items-center justify-center xl:justify-end gap-6 md:gap-8 bg-stone-50/50 p-4 rounded-[1.5rem] border border-stone-100/50">
            {/* Día de Pago */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100/50 flex items-center justify-center text-lg shadow-inner">
                🗓️
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest">Día de Pago</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={payday}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Math.max(1, Math.min(31, Number(e.target.value)));
                    setPayday(val);
                  }}
                  onBlur={() => saveSettings('payday', payday)}
                  className="w-16 bg-transparent border-b-2 border-stone-200 focus:border-indigo-400 text-base md:text-lg font-black text-indigo-600 outline-none transition-all placeholder:text-stone-300"
                  placeholder="Ej: 15"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-stone-200" />

            {/* Ahorro Acumulado */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center text-lg shadow-inner">
                💎
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">Ahorro Total</span>
                <div className="flex items-center border-b-2 border-stone-200 focus-within:border-emerald-400 transition-all">
                  <span className="text-base md:text-lg font-black text-emerald-400">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={activeAmountInput?.id === 'savings' ? activeAmountInput.val : (accumulatedSavings ? accumulatedSavings.toLocaleString('es-AR') : '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
                      setActiveAmountInput({ id: 'savings', val: e.target.value });
                      if (raw !== '' && !isNaN(parseFloat(raw))) {
                        setAccumulatedSavings(parseFloat(raw));
                      } else if (raw === '') {
                        setAccumulatedSavings(0);
                      }
                    }}
                    onBlur={() => {
                      setActiveAmountInput(null);
                      saveSettings('accumulatedSavings', accumulatedSavings);
                    }}
                    className="w-24 md:w-32 bg-transparent text-base md:text-lg font-black text-emerald-600 outline-none ml-1 placeholder:text-stone-300"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Saving Indicator */}
            {saving && (
              <div className="absolute top-4 right-4 md:static">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400 font-bold animate-pulse">Cargando tu presupuesto...</div>
      ) : (
        <div className="space-y-8">
          
          {/* INGRESO MENSUAL HERO (ZERO-STATE o NORMAL) */}
          <motion.div 
            layout 
            className={`bg-white rounded-[2rem] border border-stone-100 overflow-hidden relative transition-all duration-500 ${isZeroState ? 'p-12 md:p-20 shadow-2xl shadow-indigo-500/10 text-center' : 'p-6 md:p-8 shadow-lg shadow-stone-200/40 flex flex-col md:flex-row md:items-center justify-between gap-6'}`}
          >
            <div className={`relative z-10 ${isZeroState ? 'mb-8' : ''}`}>
              <h3 className={`font-black uppercase tracking-widest flex items-center gap-2 ${isZeroState ? 'text-sm text-indigo-400 justify-center mb-4' : 'text-[10px] text-stone-400 mb-1.5'}`}>
                <span>🏦</span> Tu Ingreso Mensual
              </h3>
              <p className={`${isZeroState ? 'text-lg md:text-xl' : 'text-sm'} font-bold text-stone-500`}>
                {isZeroState ? '¿Cuánto dinero querés presupuestar este mes?' : 'El dinero total a distribuir este mes.'}
              </p>
            </div>
            
            <div className={`relative z-10 ${isZeroState ? 'max-w-md mx-auto' : ''}`}>
              <span className={`absolute left-5 font-black text-stone-300 ${isZeroState ? 'top-4 text-4xl' : 'top-3.5 text-2xl'}`}>$</span>
              <input 
                type="text"
                inputMode="decimal"
                value={activeAmountInput?.id === 'income' ? activeAmountInput.val : (monthlyIncome ? monthlyIncome.toLocaleString('es-AR') : '')}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
                  setActiveAmountInput({ id: 'income', val: e.target.value });
                  if (raw !== '' && !isNaN(parseFloat(raw))) {
                    handleIncomeChange(parseFloat(raw));
                  } else if (raw === '') {
                    handleIncomeChange(0);
                  }
                }}
                onBlur={() => setActiveAmountInput(null)}
                placeholder="0"
                className={`bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-indigo-300 focus:bg-white transition-all placeholder:text-stone-200 font-black text-indigo-700 w-full ${isZeroState ? 'pl-14 pr-6 py-4 text-5xl md:text-6xl text-center' : 'pl-12 pr-6 py-3 text-3xl md:text-4xl md:w-72'}`}
              />
            </div>
          </motion.div>

          {/* CATEGORÍAS Y GRÁFICO (OCULTO EN ZERO STATE) */}
          <AnimatePresence>
            {!isZeroState && (
              
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCorners} 
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                
                {/* COLUMNA IZQUIERDA: GRÁFICO Y RESUMEN */}
                <div className="lg:col-span-4">
                  <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm sticky top-8">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6 text-center">
                      Distribución
                    </h3>
                    
                    <DonutChart buckets={buckets} totalPercentage={totalPercentage} />
                    
                    <div className="mt-8 pt-6 border-t border-stone-50 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-stone-500">Total Ingresos</span>
                        <span className="font-black text-stone-800">${monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-stone-500">Asignado</span>
                        <span className="font-black text-indigo-600">${(monthlyIncome * (totalPercentage/100)).toLocaleString()}</span>
                      </div>
                      {unassignedPercentage > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-stone-500">Disponible</span>
                          <span className="font-black text-emerald-500">${(monthlyIncome * (unassignedPercentage/100)).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: LISTAS DE CATEGORÍAS */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* SECCIÓN 1: LO ESENCIAL */}
                  <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-sm font-black text-stone-700 uppercase tracking-widest flex items-center gap-2">
                        <span>🏠</span> Lo Esencial
                      </h3>
                      <button onClick={() => addBucket('esencial')} className="text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                        + Añadir
                      </button>
                    </div>
                    <div className="space-y-3">
                      
                      <SortableContext items={essentialBuckets.map(b => b.id)} strategy={verticalListSortingStrategy} id="esencial">
                        {essentialBuckets.map((b, idx) => (
                          <SortableBucketCard
                            key={b.id}
                            b={b}
                            globalIdx={buckets.findIndex((x: any) => x.id === b.id)}
                            expandedBucketId={expandedBucketId}
                            setExpandedBucketId={setExpandedBucketId}
                            monthlyIncome={monthlyIncome}
                            updateBucket={updateBucket}
                            updateBucketAmount={updateBucketAmount}
                            assignRest={assignRest}
                            unassignedPercentage={unassignedPercentage}
                            removeBucket={removeBucket}
                            addBucketDetail={addBucketDetail}
                            updateBucketDetail={updateBucketDetail}
                            removeBucketDetail={removeBucketDetail}
                            activeAmountInput={activeAmountInput}
                            setActiveAmountInput={setActiveAmountInput}
                          />
                        ))}
                      </SortableContext>

                      {essentialBuckets.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-[1.5rem] text-stone-400 font-bold text-sm">
                          No tenés categorías esenciales.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECCIÓN 2: MI ESTILO DE VIDA */}
                  <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                        <span>🍹</span> Mi Estilo de Vida
                      </h3>
                      <button onClick={() => addBucket('estilo')} className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
                        + Añadir
                      </button>
                    </div>
                    <div className="space-y-3">
                      
                      <SortableContext items={lifestyleBuckets.map(b => b.id)} strategy={verticalListSortingStrategy} id="estilo">
                        {lifestyleBuckets.map((b, idx) => (
                          <SortableBucketCard
                            key={b.id}
                            b={b}
                            globalIdx={buckets.findIndex((x: any) => x.id === b.id)}
                            expandedBucketId={expandedBucketId}
                            setExpandedBucketId={setExpandedBucketId}
                            monthlyIncome={monthlyIncome}
                            updateBucket={updateBucket}
                            updateBucketAmount={updateBucketAmount}
                            assignRest={assignRest}
                            unassignedPercentage={unassignedPercentage}
                            removeBucket={removeBucket}
                            addBucketDetail={addBucketDetail}
                            updateBucketDetail={updateBucketDetail}
                            removeBucketDetail={removeBucketDetail}
                            activeAmountInput={activeAmountInput}
                            setActiveAmountInput={setActiveAmountInput}
                          />
                        ))}
                      </SortableContext>

                      {lifestyleBuckets.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-[1.5rem] text-stone-400 font-bold text-sm">
                          No tenés gastos de estilo de vida.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECCIÓN 3: MI FUTURO */}
                  <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <span>🚀</span> Mi Futuro
                      </h3>
                      <button onClick={() => addBucket('futuro')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                        + Meta
                      </button>
                    </div>
                    <div className="space-y-3">
                      
                      <SortableContext items={futureBuckets.map(b => b.id)} strategy={verticalListSortingStrategy} id="futuro">
                        {futureBuckets.map((b, idx) => (
                          <SortableBucketCard
                            key={b.id}
                            b={b}
                            globalIdx={buckets.findIndex((x: any) => x.id === b.id)}
                            expandedBucketId={expandedBucketId}
                            setExpandedBucketId={setExpandedBucketId}
                            monthlyIncome={monthlyIncome}
                            updateBucket={updateBucket}
                            updateBucketAmount={updateBucketAmount}
                            assignRest={assignRest}
                            unassignedPercentage={unassignedPercentage}
                            removeBucket={removeBucket}
                            addBucketDetail={addBucketDetail}
                            updateBucketDetail={updateBucketDetail}
                            removeBucketDetail={removeBucketDetail}
                            activeAmountInput={activeAmountInput}
                            setActiveAmountInput={setActiveAmountInput}
                          />
                        ))}
                      </SortableContext>

                      {futureBuckets.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-[1.5rem] text-stone-400 font-bold text-sm">
                          No tenés metas de ahorro configuradas.
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
              <DragOverlay>
                {activeBucket ? (
                  <SortableBucketCard
                    b={activeBucket}
                    globalIdx={buckets.findIndex((x: any) => x.id === activeBucket.id)}
                    expandedBucketId={null}
                    setExpandedBucketId={() => {}}
                    monthlyIncome={monthlyIncome}
                    updateBucket={() => {}}
                    updateBucketAmount={() => {}}
                    assignRest={() => {}}
                    unassignedPercentage={0}
                    removeBucket={() => {}}
                    addBucketDetail={() => {}}
                    updateBucketDetail={() => {}}
                    removeBucketDetail={() => {}}
                    activeAmountInput={null}
                    setActiveAmountInput={() => {}}
                  />
                ) : null}
              </DragOverlay>
              </DndContext>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
