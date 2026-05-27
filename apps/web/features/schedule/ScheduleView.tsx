'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { PostItWall } from './PostItWall';

import { LeafDetailView } from '@/features/life-tree/LeafDetailView';
import { Leaf } from '@/features/life-tree/types';

interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  date: string;
  type: string;
  status: string;
  goalTitle?: string;
  estimatedHours: number;
  itemType: 'action' | 'habit' | 'task' | 'commitment' | 'daily' | 'post-it';
  dimensions?: string[];
  attributes?: string[];
  tasks?: any[];
  originalPostIt?: any;
}

// ─── Bottom Sheet Component (mobile agenda drawer) ───────────────────────────
function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Touch drag-to-dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !sheetRef.current) return;
    const delta = e.touches[0].clientY - startYRef.current;
    currentYRef.current = delta;
    if (delta > 0) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = 'none';
    }
  };
  const handleTouchEnd = () => {
    if (!sheetRef.current) return;
    isDraggingRef.current = false;
    sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';
    if (currentYRef.current > 120) {
      onClose();
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
    }
    currentYRef.current = 0;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{
          maxHeight: '85dvh',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Sheet header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-lg"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Agenda content shared between sidebar & bottom sheet ────────────────────
function AgendaContent({
  loading,
  dailyTasks,
  continuousProjects,
  commitments,
  events,
  anchoredNotes,
  totalDailyHours,
  selectedDay,
  onOpenActivity,
  onItemClick,
  onRefresh,
}: {
  loading: boolean;
  dailyTasks: ScheduledEvent[];
  continuousProjects: ScheduledEvent[];
  commitments: ScheduledEvent[];
  events: ScheduledEvent[];
  anchoredNotes: ScheduledEvent[];
  totalDailyHours: number;
  selectedDay: Date;
  onOpenActivity: (event: ScheduledEvent) => void;
  onItemClick?: () => void;
  onRefresh?: () => void;
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskHours, setNewTaskHours] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleClick = (event: ScheduledEvent) => {
    if (event.itemType === 'post-it') {
      window.dispatchEvent(new CustomEvent('open-postit-modal', { detail: event.originalPostIt }));
      onItemClick?.();
      return;
    }
    // If it's a daily task, just toggle it directly instead of opening full modal (optional, but requested simple checkboxes)
    if (event.itemType === 'daily') {
      handleToggleDaily(event);
      return;
    }
    onOpenActivity(event);
    onItemClick?.();
  };

  const handleToggleDaily = async (event: ScheduledEvent) => {
    try {
      await fetch(`/api/schedule/daily-tasks/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: event.status !== 'completed' })
      });
      onRefresh?.();
    } catch (e) { console.error(e); }
  };

  const handleCreateDailyTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsCreatingTask(true);
    try {
      await fetch('/api/schedule/daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          estimatedHours: parseFloat(newTaskHours) || 0,
          date: selectedDay.toISOString()
        })
      });
      setNewTaskTitle('');
      setNewTaskHours('');
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Anchored Notes */}
      {anchoredNotes && anchoredNotes.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-4">Notas Ancladas</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
            {anchoredNotes.map(note => (
              <div 
                key={note.id}
                onClick={() => handleClick(note)}
                className={`snap-start shrink-0 w-32 p-3 rounded shadow-sm border rotate-[-1deg] cursor-pointer hover:-translate-y-1 transition-transform 
                  ${note.originalPostIt?.color === 'emerald' ? 'bg-emerald-100/90 text-emerald-900 border-emerald-200/50' :
                  note.originalPostIt?.color === 'rose' ? 'bg-rose-100/90 text-rose-900 border-rose-200/50' :
                  note.originalPostIt?.color === 'blue' ? 'bg-blue-100/90 text-blue-900 border-blue-200/50' :
                  note.originalPostIt?.color === 'violet' ? 'bg-violet-100/90 text-violet-900 border-violet-200/50' :
                  'bg-yellow-100/90 text-yellow-900 border-yellow-200/50'}`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[12px]">📌</span>
                </div>
                <p className="text-[10px] font-medium leading-tight overflow-hidden text-ellipsis line-clamp-3">
                  {note.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tasks */}
      <div>
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tareas de Hoy</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : dailyTasks.length === 0 ? (
            <p className="text-[10px] text-slate-300 font-bold text-center py-4">Sin tareas cortas hoy.</p>
          ) : (
            dailyTasks.map(event => (
              <div
                key={event.id}
                onClick={() => handleClick(event)}
                className={`group bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${event.status === 'completed' ? 'border-slate-100 opacity-60' : (event as any).isOverdue ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border flex items-center gap-1
                    ${event.status === 'completed' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {event.status === 'completed' ? '✓' : '○'} {event.type}
                    {event.estimatedHours > 0 && (
                      <>
                        <span className="opacity-40">•</span>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {event.estimatedHours < 1
                          ? `${Math.round(event.estimatedHours * 60)} min`
                          : `${event.estimatedHours}h`}
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {(event as any).isOverdue && !event.status.includes('completed') && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold" title="Atrasada">
                        ⚠️ Ayer
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-slate-300 group-hover:text-slate-400 transition-colors uppercase">
                      {event.goalTitle || 'Rápida'}
                    </span>
                  </div>
                </div>
                <h3 className={`text-xs font-black text-slate-800 leading-tight ${event.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                  {event.title}
                </h3>
              </div>
            ))
          )}

          {/* Create Daily Task Form */}
          <form onSubmit={handleCreateDailyTask} className="mt-4 flex gap-2 items-center bg-white p-2 rounded-2xl border border-stone-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <button type="submit" disabled={isCreatingTask || !newTaskTitle.trim()} className="w-8 h-8 flex items-center justify-center shrink-0 rounded-xl bg-stone-100 text-stone-400 hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-50">
              +
            </button>
            <input 
              type="text" 
              placeholder="Añadir tarea..." 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-stone-700 placeholder-stone-400"
            />
            <input 
              type="number" 
              placeholder="Horas" 
              step="0.1"
              min="0"
              value={newTaskHours}
              onChange={e => setNewTaskHours(e.target.value)}
              className="w-14 bg-stone-50 border border-stone-100 rounded-lg p-1.5 text-center text-[10px] font-bold text-stone-600 outline-none focus:border-emerald-500"
              title="Horas estimadas (opcional)"
            />
          </form>
        </div>
      </div>

      {/* Continuous Projects */}
      {continuousProjects.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Proyectos Continuos</h2>
          <div className="space-y-3">
            {continuousProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => handleClick(proj)}
                className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100/50 cursor-pointer hover:bg-violet-50 transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-black text-violet-600 uppercase tracking-widest">En curso</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{proj.goalTitle}</span>
                </div>
                <h3 className="text-xs font-black text-slate-800">{proj.title}</h3>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">
                  Hasta {format(new Date(proj.date), 'MMM yyyy', { locale: es })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Base Commitments */}
      {commitments.length > 0 && (
        <div>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Compromisos Base</h2>
          <div className="space-y-3">
            {commitments.map(bc => (
              <div key={bc.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 border-dashed">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fijo</span>
                  <span className="text-[9px] font-bold text-slate-300 uppercase">{bc.type}</span>
                </div>
                <h3 className="text-xs font-black text-slate-600">{bc.title}</h3>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">
                  {bc.startTime && bc.endTime ? `${bc.startTime} - ${bc.endTime} (${bc.estimatedHours}h)` : `${bc.estimatedHours}h`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Habits */}
      <div>
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Hábitos Sugeridos</h2>
        <div className="space-y-2">
          {events.filter(e => e.itemType === 'habit').map(habit => (
            <div
              key={habit.id}
              onClick={() => handleClick(habit)}
              className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-slate-100/50 cursor-pointer hover:bg-white transition-colors active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-sm shrink-0">✨</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-slate-700 truncate">{habit.title}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-tighter">{habit.goalTitle}</p>
              </div>
              {habit.estimatedHours > 0 && (
                <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100 flex items-center gap-0.5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {habit.estimatedHours < 1
                    ? `${Math.round(habit.estimatedHours * 60)} min`
                    : `${habit.estimatedHours}h`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ScheduleView ────────────────────────────────────────────────────────
export function ScheduleView() {
  const [loadedMonths, setLoadedMonths] = useState<Date[]>([
    startOfMonth(subMonths(new Date(), 1)),
    startOfMonth(new Date()),
    startOfMonth(addMonths(new Date(), 1))
  ]);
  const [activeVisibleMonth, setActiveVisibleMonth] = useState<Date>(startOfMonth(new Date()));
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Leaf | null>(null);

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topTriggerRef = useRef<HTMLDivElement>(null);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);

  const fetchEvents = () => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.success) setEvents(data.events);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchEvents();
    const handleRefresh = () => fetchEvents();
    window.addEventListener('refresh-schedule', handleRefresh);
    return () => window.removeEventListener('refresh-schedule', handleRefresh);
  }, []);

  // Observers for infinite scroll
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'top-trigger') {
            setLoadedMonths(prev => {
              const first = prev[0];
              if (prev.length > 24) return prev; 
              return [startOfMonth(subMonths(first, 1)), ...prev];
            });
          } else if (entry.target.id === 'bottom-trigger') {
            setLoadedMonths(prev => {
              const last = prev[prev.length - 1];
              if (prev.length > 24) return prev;
              return [...prev, startOfMonth(addMonths(last, 1))];
            });
          }
        }
      });
    }, { root: scrollContainerRef.current, rootMargin: '400px' });

    if (topTriggerRef.current) observer.observe(topTriggerRef.current);
    if (bottomTriggerRef.current) observer.observe(bottomTriggerRef.current);

    return () => observer.disconnect();
  }, [loadedMonths]);

  // Observer for active month (to update header)
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const monthTime = parseInt(entry.target.getAttribute('data-month') || '0');
          if (monthTime) {
            setActiveVisibleMonth(new Date(monthTime));
          }
        }
      });
    }, { root: scrollContainerRef.current, threshold: 0.3 });

    document.querySelectorAll('.month-block').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loadedMonths]);

  // Initial scroll to current month
  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (!didInitialScroll.current && loadedMonths.length > 0) {
      const el = document.getElementById(`month-${startOfMonth(new Date()).getTime()}`);
      if (el && scrollContainerRef.current) {
        el.scrollIntoView({ block: 'start' });
        didInitialScroll.current = true;
      }
    }
  }, [loadedMonths]);

  const jumpToMonth = (date: Date) => {
    const target = startOfMonth(date);
    setLoadedMonths([
      startOfMonth(subMonths(target, 1)),
      target,
      startOfMonth(addMonths(target, 1))
    ]);
    setActiveVisibleMonth(target);
    setIsMonthPickerOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`month-${target.getTime()}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const jumpToToday = () => {
    setSelectedDay(new Date());
    jumpToMonth(new Date());
  };

  const getEventsForDay = (day: Date) =>
    events.filter(e => {
      const d = new Date(e.date);
      if (e.startDate) {
        const s = new Date(e.startDate);
        return day >= s && day <= d;
      }
      return isSameDay(d, day);
    });

  const selectedDayEvents = getEventsForDay(selectedDay);

  const dailyTasks = selectedDayEvents.filter(e => {
    if (e.itemType === 'commitment' || e.itemType === 'habit' || e.itemType === 'post-it') return false;
    if (!e.startDate) return true;
    return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) <= 14 * 24 * 60 * 60 * 1000;
  });

  const anchoredNotes = selectedDayEvents.filter(e => e.itemType === 'post-it');

  const continuousProjects = selectedDayEvents.filter(e => {
    if (e.itemType === 'commitment' || e.itemType === 'habit') return false;
    if (!e.startDate) return false;
    return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000;
  });

  const commitments = selectedDayEvents.filter(e => e.itemType === 'commitment');
  const habits = selectedDayEvents.filter(e => e.itemType === 'habit');

  const totalDailyHours =
    dailyTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) +
    commitments.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) +
    habits.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

  const handleOpenActivity = (event: ScheduledEvent) => {
    if (event.itemType === 'commitment') return;
    const leaf: Leaf = {
      id: event.id,
      name: event.title,
      description: event.description,
      type: event.type as any,
      completed: event.status === 'completed',
      targetDate: event.date,
      dimensions: event.dimensions || [],
      attributes: event.attributes || [],
      tasks: event.tasks || [],
    };
    setSelectedActivity(leaf);
  };

  const handleToggleAction = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/profile/goals/actions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: data.completed }),
      });
      if (res.ok) {
        fetchEvents();
        if (selectedActivity && selectedActivity.id === id)
          setSelectedActivity({ ...selectedActivity, completed: data.completed });
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/profile/goals/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        fetchEvents();
        if (selectedActivity) {
          const updatedTasks = selectedActivity.tasks?.map(t =>
            t.id === taskId ? { ...t, isCompleted } : t
          );
          setSelectedActivity({ ...selectedActivity, tasks: updatedTasks });
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/goals/actions/${id}`, { method: 'DELETE' });
      if (res.ok) { fetchEvents(); setSelectedActivity(null); }
    } catch (e) { console.error(e); }
  };

  const agendaProps = {
    loading,
    dailyTasks,
    continuousProjects,
    commitments,
    anchoredNotes,
    events,
    totalDailyHours,
    selectedDay,
    onOpenActivity: handleOpenActivity,
    onRefresh: fetchEvents,
  };

  return (
    <div 
      className="flex flex-col h-[100dvh] relative overflow-hidden"
      style={{
        backgroundColor: '#f8f5f0',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
      }}
    >

      {/* ── Header & Quick Nav ───────────────────────────────────────────── */}
      <header className="px-4 sm:px-6 py-4 sm:py-6 border-b border-stone-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 bg-white/40 backdrop-blur-md z-20">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            📅 Mi Calendario
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">Gestiona tu tiempo y carga de trabajo</p>
        </div>

        {/* Month Dropdown Trigger & Today Button */}
        <div className="flex items-center gap-2 sm:gap-3 bg-stone-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-200/50 shadow-sm relative">
          <button
            onClick={jumpToToday}
            className="px-3 sm:px-4 py-2 flex items-center justify-center rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all text-stone-600 font-bold text-xs uppercase tracking-widest active:scale-95"
          >
            Hoy
          </button>
          <div className="w-px h-6 bg-stone-200"></div>
          <button
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            className="px-3 sm:px-4 py-2 flex items-center gap-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-stone-700 active:scale-95"
          >
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest">
              {format(activeVisibleMonth, 'MMMM yyyy', { locale: es })}
            </span>
            <span className="text-[10px]">▼</span>
          </button>

          {/* Month Picker Popover */}
          {isMonthPickerOpen && (
            <div className="absolute top-full mt-2 right-0 w-64 bg-white/90 backdrop-blur-2xl border border-stone-200/50 rounded-3xl shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-200">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = new Date(activeVisibleMonth.getFullYear(), i, 1);
                  return (
                    <button
                      key={i}
                      onClick={() => jumpToMonth(m)}
                      className={`p-2 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all
                        ${i === activeVisibleMonth.getMonth() ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-stone-100 text-stone-600'}`}
                    >
                      {format(m, 'MMM', { locale: es })}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                <button onClick={() => jumpToMonth(subMonths(activeVisibleMonth, 12))} className="p-2 text-stone-400 hover:text-stone-700 font-bold">← {activeVisibleMonth.getFullYear() - 1}</button>
                <span className="text-sm font-black text-stone-800">{activeVisibleMonth.getFullYear()}</span>
                <button onClick={() => jumpToMonth(addMonths(activeVisibleMonth, 12))} className="p-2 text-stone-400 hover:text-stone-700 font-bold">{activeVisibleMonth.getFullYear() + 1} →</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Ideas Zone Background */}
        <div className="hidden xl:flex w-[280px] shrink-0 border-r-2 border-dashed border-stone-300/40 relative z-0 flex-col bg-white/10 backdrop-blur-[2px]">
          <div className="p-8 opacity-40">
            <h2 className="text-xl font-black text-stone-500 uppercase tracking-widest text-center">Ideas</h2>
            <p className="text-[10px] font-bold text-stone-400 text-center mt-2 leading-tight">Espacio libre para tus notas. Arrástralas al calendario para anclarlas a un día.</p>
          </div>
        </div>

        <PostItWall />

        {/* Infinite Scroll Calendar Area (Paper Sheet) */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-8 lg:p-12 relative z-10">
          <div className="flex-1 flex flex-col bg-[#fffcf8] rounded shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-stone-200/60 overflow-hidden relative max-w-5xl mx-auto w-full">
            {/* Top Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/70 backdrop-blur-md shadow-sm border border-stone-200/50 rotate-[-1deg] z-20" />
            
            {/* Sticky Day Headers */}
            <div className="grid grid-cols-7 border-b border-stone-200/60 bg-[#fffcf8]/90 backdrop-blur-md overflow-hidden z-10 shrink-0">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dayShort, i) => (
              <div key={i} className="py-2 sm:py-4 border-b border-r border-stone-200/50 text-center">
                <span className="sm:hidden text-[9px] font-black text-stone-400 uppercase">{dayShort}</span>
                <span className="hidden sm:inline text-[10px] font-black text-stone-500 uppercase tracking-tighter">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}
                </span>
              </div>
            ))}
          </div>

          {/* Scrollable Container */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative rounded-b-2xl sm:rounded-b-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]" style={{ overflowAnchor: 'auto' }}>
            
            <div id="top-trigger" ref={topTriggerRef} className="h-4 w-full" />
            
            {loadedMonths.map(month => {
              const monthStart = startOfMonth(month);
              const startDate = startOfWeek(monthStart);
              const endDate = endOfWeek(endOfMonth(monthStart));
              const days = eachDayOfInterval({ start: startDate, end: endDate });

              return (
                <div key={month.getTime()} id={`month-${month.getTime()}`} data-month={month.getTime()} className="month-block relative">
                  
                  {/* Sticky Month Divider */}
                  <div className="sticky top-0 z-[5] py-2 sm:py-3 text-center bg-white/60 backdrop-blur-md border-b border-l border-r border-stone-200/50 shadow-sm">
                    <span className="text-[10px] sm:text-xs font-black text-stone-700 uppercase tracking-widest">
                      {format(month, 'MMMM yyyy', { locale: es })}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 border-l border-r border-stone-200/50 bg-white/40 backdrop-blur-md">
                    {days.map((day, i) => {
                      const dayEvents = getEventsForDay(day);
                      const validEventsForHours = dayEvents.filter(e => {
                        if (e.itemType === 'commitment' || e.itemType === 'habit') return true;
                        if (!e.startDate) return true;
                        return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) <= 14 * 24 * 60 * 60 * 1000;
                      });
                      const dayHours = validEventsForHours.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

                      const isCurrentMonth = isSameMonth(day, monthStart);
                      const isSelected = isSameDay(day, selectedDay);
                      const today = isToday(day);
                      const hasPostIt = dayEvents.some(e => e.itemType === 'post-it');

                      return (
                        <div
                          data-date={day.getTime()}
                          key={i}
                          onClick={() => {
                            setSelectedDay(day);
                            setIsBottomSheetOpen(true);
                          }}
                          className={`
                            min-h-[60px] sm:min-h-[85px] lg:min-h-[95px] p-1.5 sm:p-3
                            border-b border-r border-stone-200/50 transition-all cursor-pointer group relative
                            ${!isCurrentMonth ? 'bg-stone-50/30' : 'bg-transparent'}
                            ${isSelected ? 'ring-2 ring-inset ring-emerald-500 bg-emerald-50/40' : 'hover:bg-white/90'}
                            active:bg-emerald-50/50
                          `}
                        >
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className={`
                              text-[10px] sm:text-xs font-black
                              w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md sm:rounded-lg
                              transition-colors
                              ${today ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                : isSelected ? 'text-emerald-700'
                                : 'text-stone-400'}
                            `}>
                              {format(day, 'd')}
                            </span>
                            {hasPostIt && (
                              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[12px] sm:text-[14px] drop-shadow-md z-10 animate-in fade-in zoom-in duration-300" title="Contiene nota anclada">
                                📌
                              </span>
                            )}
                          </div>

                          <div className="hidden sm:block space-y-1">
                            {(() => {
                              const regularEvents = dayEvents.filter(e => e.itemType !== 'commitment');
                              const cellCommitments = dayEvents.filter(e => e.itemType === 'commitment');
                              const displayLimit = cellCommitments.length > 0 ? 2 : 3;
                              
                              const visibleEvents = regularEvents.slice(0, displayLimit);
                              const hasMoreEvents = regularEvents.length > displayLimit;

                              return (
                                <>
                                  {visibleEvents.map(e => {
                                    const isPostIt = e.itemType === 'post-it';
                                    const isLongRange = e.startDate &&
                                      (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000;
                                    
                                    if (isPostIt) {
                                      const colorClass = e.originalPostIt?.color === 'emerald' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                                        e.originalPostIt?.color === 'rose' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                                        e.originalPostIt?.color === 'blue' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                                        e.originalPostIt?.color === 'violet' ? 'bg-violet-100 text-violet-900 border-violet-300' :
                                        'bg-yellow-100 text-yellow-900 border-yellow-300';
                                        
                                      return (
                                        <div
                                          key={e.id}
                                          onClick={(ev) => {
                                            ev.stopPropagation();
                                            // Dispatch event to open modal in PostItWall
                                            window.dispatchEvent(new CustomEvent('open-postit-modal', { detail: e.originalPostIt }));
                                          }}
                                          className={`text-[9px] px-2 py-1 rounded truncate font-bold shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform border ${colorClass} rotate-[-1deg]`}
                                        >
                                          📌 {e.title}
                                        </div>
                                      );
                                    }
                                    
                                    return (
                                      <div
                                        key={e.id}
                                        onClick={(ev) => {
                                          ev.stopPropagation();
                                          handleOpenActivity(e);
                                        }}
                                        className={`text-[9px] px-2 py-1 rounded-lg truncate font-bold border-l-2 shadow-sm cursor-pointer hover:opacity-80
                                          ${e.status === 'completed'
                                            ? 'bg-stone-100 text-stone-400 border-stone-300'
                                            : isLongRange
                                              ? 'bg-violet-50 text-violet-700 border-violet-400 opacity-60'
                                              : 'bg-white text-stone-700 border-emerald-500'}`}
                                      >
                                        {e.title}
                                      </div>
                                    );
                                  })}
                                  
                                  {cellCommitments.length > 0 && (
                                    <div className="text-[9px] px-2 py-1 rounded-lg truncate font-bold border-l-2 shadow-sm bg-stone-50 text-stone-400 border-stone-300 italic">
                                      🔒 {cellCommitments.length} Compromiso{cellCommitments.length > 1 ? 's' : ''} Base
                                    </div>
                                  )}

                                  {hasMoreEvents && (
                                    <div className="text-[8px] text-stone-400 font-bold pl-2">+{regularEvents.length - displayLimit} más</div>
                                  )}
                                </>
                              );
                            })()}
                          </div>

                          {dayEvents.length > 0 && (
                            <div className="sm:hidden flex gap-0.5 flex-wrap mt-1">
                              {(() => {
                                const regularEvents = dayEvents.filter(e => e.itemType !== 'commitment');
                                const cellCommitments = dayEvents.filter(e => e.itemType === 'commitment');
                                
                                return (
                                  <>
                                    {regularEvents.slice(0, 3).map((e, idx) => (
                                      <span
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full shrink-0
                                          ${e.status === 'completed' ? 'bg-stone-200'
                                            : e.startDate && (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000
                                              ? 'bg-violet-400'
                                              : 'bg-emerald-500'}`}
                                      />
                                    ))}
                                    {cellCommitments.length > 0 && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                                    )}
                                    {regularEvents.length > 3 && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-stone-200 shrink-0" />
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div id="bottom-trigger" ref={bottomTriggerRef} className="h-4 w-full" />
          </div>
        </div>
        </div>

        {/* ── Desktop Sidebar Agenda (hidden on mobile) ─────────────────── */}
        <div className="hidden lg:flex w-[380px] shrink-0 flex-col py-12 pr-12 relative z-10">
          {/* Paper Notebook Effect Container */}
          <div className="flex-1 bg-[#fffdf8] rounded-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-stone-200/80 overflow-hidden flex flex-col relative rotate-[1deg]">
            
            {/* Top Clip */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-stone-300 rounded-sm shadow-md border border-stone-400 rotate-[-2deg] z-20">
              <div className="absolute inset-x-2 top-2 h-1 bg-stone-400/50 rounded-full" />
            </div>

            <div className="p-6 border-b border-stone-200/50 bg-[#fffdf8] shrink-0 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-stone-900 uppercase tracking-tighter">Agenda del Día</h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    {Math.max(0, 24 - Math.round(totalDailyHours))}h libres
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 font-bold mt-1 uppercase tracking-widest">
                {format(selectedDay, "eeee d 'de' MMMM", { locale: es })}
              </p>
            </div>
            
            {/* Ruled lines background for the agenda content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#fffdf8] bg-[linear-gradient(transparent_27px,#f1f5f9_28px)] bg-[length:100%_28px]">
              <div className="relative z-10">
                <AgendaContent {...agendaProps} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Sheet (hidden on lg+) ──────────────────────────── */}
      <div className="lg:hidden">
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          title="Agenda del Día"
          subtitle={format(selectedDay, "eeee d 'de' MMMM", { locale: es })}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
              ✨ {Math.max(0, 24 - Math.round(totalDailyHours))}h libres
            </span>
          </div>
          <AgendaContent
            {...agendaProps}
            onItemClick={() => setIsBottomSheetOpen(false)}
          />
        </BottomSheet>
      </div>

      {/* ── Activity Detail Modal ─────────────────────────────────────────── */}
      {selectedActivity && (
        <LeafDetailView
          action={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onDelete={handleDeleteAction}
          onToggle={handleToggleAction}
          onToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
}

