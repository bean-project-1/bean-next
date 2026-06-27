'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, subWeeks, addWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { PostItWall } from './PostItWall';

import { TaskDetailModal } from './TaskDetailModal';

export interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  date: string;
  type: string;
  status: string;
  goalId?: string;
  goalTitle?: string;
  estimatedHours: number;
  itemType: 'action' | 'habit' | 'task' | 'commitment' | 'daily' | 'post-it' | 'project';
  dimensions?: string[];
  attributes?: string[];
  notes?: string;
  tasks?: any[];
  originalPostIt?: any;
  assignee?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

// ─── Bottom Sheet Component (mobile agenda drawer) ───────────────────────────
function BottomSheet({
  isOpen,
  onClose,
  selectedDay,
  hoursLeft,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date;
  hoursLeft: number;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    if (!isOpen) setIsExpanded(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Draggable Sheet */}
          <motion.div
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 && !isExpanded) onClose();
              else if (info.offset.y > 150 && isExpanded) setIsExpanded(false);
              else if (info.offset.y < -50 && !isExpanded) setIsExpanded(true);
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0, height: isExpanded ? '100dvh' : '88dvh' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 380, mass: 0.8 }}
            className={`relative w-full bg-[#FAF9F6] flex flex-col shadow-2xl overflow-hidden ${
              isExpanded ? 'rounded-none' : 'rounded-t-[28px]'
            }`}
          >
            {/* Drag Handle */}
            <div
              className="w-full flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-[#D4CFC6] rounded-full pointer-events-none" />
            </div>

            {/* Header */}
            <div className="px-5 pt-3 pb-4 border-b border-[#E6E1D6] flex items-center justify-between shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Date callout */}
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1B7A4E] to-[#0B462C] flex flex-col items-center justify-center text-white shadow-md">
                  <span className="text-[8px] font-black uppercase leading-none opacity-70 tracking-wider">
                    {format(selectedDay, 'MMM', { locale: es })}
                  </span>
                  <span className="text-lg font-black leading-none">
                    {format(selectedDay, 'd')}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-stone-900 tracking-tight leading-tight">
                    {isToday(selectedDay) ? 'Hoy' : format(selectedDay, 'EEEE', { locale: es })}
                  </h2>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5 truncate">
                    {format(selectedDay, "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black px-2.5 py-1.5 rounded-xl bg-[#EAF5EC] text-[#1B7A4E] border border-emerald-100 whitespace-nowrap">
                  {hoursLeft}h libres
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100/80 hover:bg-stone-200 text-stone-500 transition-colors active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto px-5 py-5 bg-[#FAF9F6] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              onPointerDown={(e) => e.stopPropagation()}
              onScroll={(e) => {
                if (!isExpanded && e.currentTarget.scrollTop > 5) setIsExpanded(true);
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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

  const recurrentEvents = events.filter(e => {
    if (e.itemType !== 'commitment' && e.itemType !== 'habit' && e.itemType !== 'project') return false;
    const d = new Date(e.date);
    if (e.startDate) {
      const s = new Date(e.startDate);
      return selectedDay >= s && selectedDay <= d;
    }
    return isSameDay(d, selectedDay);
  });

  const workEvents = recurrentEvents.filter(e => e.type === 'work');
  const studyEvents = recurrentEvents.filter(e => e.type === 'study');
  const routineEvents = recurrentEvents.filter(e => e.type === 'routine');

  const renderRecurrentEvent = (event: ScheduledEvent) => {
    const isHabit = event.itemType === 'habit';
    const isProject = event.itemType === 'project';
    const hasGoal = !!event.goalTitle && event.goalTitle !== 'Base DNA';
    
    const styles: Record<string, { bg: string, border: string, text: string, badge: string, iconBg: string, icon: string }> = {
      work: {
        bg: 'bg-indigo-50/40 hover:bg-indigo-50/80',
        border: 'border-indigo-100/60',
        text: 'text-indigo-900',
        badge: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/40',
        iconBg: 'bg-indigo-100 text-indigo-600',
        icon: '💼'
      },
      study: {
        bg: 'bg-amber-50/40 hover:bg-amber-50/80',
        border: 'border-amber-100/60',
        text: 'text-amber-900',
        badge: 'bg-amber-100/70 text-amber-700 border-amber-200/40',
        iconBg: 'bg-amber-100 text-amber-600',
        icon: '🎓'
      },
      routine: {
        bg: 'bg-emerald-50/40 hover:bg-emerald-50/80',
        border: 'border-emerald-100/60',
        text: 'text-emerald-900',
        badge: 'bg-emerald-100/70 text-emerald-700 border-emerald-200/40',
        iconBg: 'bg-emerald-100 text-emerald-600',
        icon: isHabit ? '✨' : '🔄'
      }
    };

    const style = styles[event.type] || styles.routine;

    const accentColor = event.type === 'work' ? 'border-indigo-400' : event.type === 'study' ? 'border-amber-400' : 'border-[#1B7A4E]';

    return (
      <div
        key={event.id}
        onClick={() => handleClick(event)}
        className="group bg-white rounded-2xl border border-[#E6E1D6] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] overflow-hidden"
      >
        <div className={`flex items-center gap-3 p-4 border-l-[3px] ${accentColor}`}>
          <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center text-sm shrink-0 shadow-sm`}>
            {style.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
                isHabit ? 'bg-amber-50 text-amber-600 border-amber-100' :
                isProject ? 'bg-violet-50 text-violet-600 border-violet-100' :
                'bg-stone-50 text-stone-500 border-stone-200'
              }`}>
                {isHabit ? 'Hábito' : isProject ? 'Proyecto' : 'Fijo'}
              </span>
              {hasGoal && (
                <span className="text-[9px] font-bold text-stone-400 truncate max-w-[120px]">
                  🎯 {event.goalTitle}
                </span>
              )}
            </div>
            <h3 className="text-xs font-black text-stone-800 leading-tight truncate">{event.title}</h3>
            {event.startTime && event.endTime && (
              <p className="text-[9px] text-stone-400 font-semibold mt-0.5">{event.startTime} – {event.endTime}</p>
            )}
          </div>
          {event.estimatedHours > 0 && (
            <span className="shrink-0 text-[9px] font-black text-stone-400 bg-stone-100 px-2 py-1 rounded-lg ml-auto">
              {event.estimatedHours}h
            </span>
          )}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ label, dot }: { label: string; dot: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</h2>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Anchored Notes */}
      {anchoredNotes && anchoredNotes.length > 0 && (
        <div>
          <SectionHeader label="Notas Ancladas" dot="bg-yellow-400" />
          <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x -mx-1 px-1">
            {anchoredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => handleClick(note)}
                className={`snap-start shrink-0 w-28 p-3 rounded-2xl shadow-sm border cursor-pointer hover:-translate-y-1 active:scale-95 transition-all
                  ${note.originalPostIt?.color === 'emerald' ? 'bg-emerald-100/90 text-emerald-900 border-emerald-200/60' :
                  note.originalPostIt?.color === 'rose' ? 'bg-rose-100/90 text-rose-900 border-rose-200/60' :
                  note.originalPostIt?.color === 'blue' ? 'bg-blue-100/90 text-blue-900 border-blue-200/60' :
                  note.originalPostIt?.color === 'violet' ? 'bg-violet-100/90 text-violet-900 border-violet-200/60' :
                  'bg-yellow-100/90 text-yellow-900 border-yellow-200/60'}`}
              >
                <span className="text-sm block mb-1">📌</span>
                <p className="text-[10px] font-semibold leading-tight line-clamp-3">{note.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tasks */}
      <div>
        <SectionHeader label="Tareas del Día" dot="bg-[#1B7A4E]" />
        <div className="space-y-2.5">
          {loading ? (
            <>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-stone-100/80 animate-pulse rounded-2xl" />
              ))}
            </>
          ) : dailyTasks.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2 text-center">
              <span className="text-2xl">☀️</span>
              <p className="text-[11px] text-stone-400 font-bold">Sin tareas para hoy.<br/>Añade una debajo.</p>
            </div>
          ) : (
            dailyTasks.map(event => {
              const isDone = event.status === 'completed';
              const isOverdue = (event as any).isOverdue && !isDone;
              return (
                <div
                  key={event.id}
                  onClick={() => handleClick(event)}
                  className={`group bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] overflow-hidden ${
                    isDone ? 'border-[#E6E1D6] opacity-55' : isOverdue ? 'border-amber-200' : 'border-[#E6E1D6]'
                  }`}
                >
                  <div className={`flex items-center gap-3 p-4 border-l-[3px] ${isDone ? 'border-stone-200' : isOverdue ? 'border-amber-400' : 'border-[#1B7A4E]'}`}>
                    {/* Status circle */}
                    <div className={`w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center transition-colors ${
                      isDone ? 'bg-[#1B7A4E] border-[#1B7A4E]' : 'border-stone-300 group-hover:border-[#1B7A4E]'
                    }`}>
                      {isDone && (
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="2 6 5 9 10 3"/></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xs font-black text-stone-800 leading-tight ${isDone ? 'line-through opacity-40' : ''}`}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {event.goalTitle && (
                          <span className="text-[9px] font-bold text-stone-400 truncate max-w-[140px]">🎯 {event.goalTitle}</span>
                        )}
                        {isOverdue && (
                          <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Atrasada</span>
                        )}
                      </div>
                    </div>
                    {event.estimatedHours > 0 && (
                      <span className="shrink-0 text-[9px] font-black text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
                        {event.estimatedHours < 1 ? `${Math.round(event.estimatedHours * 60)}m` : `${event.estimatedHours}h`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Quick-add form */}
          <form
            onSubmit={handleCreateDailyTask}
            className="mt-2 flex gap-2 items-center bg-white p-2.5 rounded-2xl border border-[#E6E1D6] shadow-sm focus-within:border-[#1B7A4E] focus-within:ring-1 focus-within:ring-[#1B7A4E]/20 transition-all"
          >
            <button
              type="submit"
              disabled={isCreatingTask || !newTaskTitle.trim()}
              className="w-8 h-8 flex items-center justify-center shrink-0 rounded-xl bg-stone-100 text-stone-400 hover:bg-[#1B7A4E] hover:text-white transition-colors disabled:opacity-40 text-lg font-black leading-none"
            >
              +
            </button>
            <input
              type="text"
              placeholder="Añadir tarea rápida..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-stone-700 placeholder-stone-300"
            />
            <input
              type="number"
              placeholder="h"
              step="0.5"
              min="0"
              value={newTaskHours}
              onChange={e => setNewTaskHours(e.target.value)}
              className="w-10 bg-stone-50 border border-[#E6E1D6] rounded-lg p-1 text-center text-[10px] font-bold text-stone-600 outline-none focus:border-[#1B7A4E]"
              title="Horas estimadas"
            />
          </form>
        </div>
      </div>

      {/* Trabajo */}
      {workEvents.length > 0 && (
        <div>
          <SectionHeader label="💼 Trabajo" dot="bg-indigo-400" />
          <div className="space-y-2.5">
            {workEvents.map(renderRecurrentEvent)}
          </div>
        </div>
      )}

      {/* Estudio */}
      {studyEvents.length > 0 && (
        <div>
          <SectionHeader label="🎓 Estudio" dot="bg-amber-400" />
          <div className="space-y-2.5">
            {studyEvents.map(renderRecurrentEvent)}
          </div>
        </div>
      )}

      {/* Rutinas */}
      {routineEvents.length > 0 && (
        <div>
          <SectionHeader label="🔄 Rutinas" dot="bg-[#1B7A4E]" />
          <div className="space-y-2.5">
            {routineEvents.map(renderRecurrentEvent)}
          </div>
        </div>
      )}

      {/* Empty day state */}
      {!loading && dailyTasks.length === 0 && workEvents.length === 0 && studyEvents.length === 0 && routineEvents.length === 0 && anchoredNotes.length === 0 && (
        <div className="flex flex-col items-center py-10 gap-3 text-center">
          <span className="text-4xl">🌿</span>
          <p className="text-xs font-black text-stone-400">Día libre o sin actividades.<br/>Disfruta el descanso.</p>
        </div>
      )}
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
  const [selectedTask, setSelectedTask] = useState<ScheduledEvent | null>(null);

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

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

  // Auto-open bottom sheet on mobile when entering the schedule view
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsBottomSheetOpen(true);
    }
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

  // Initial scroll to current day
  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (!didInitialScroll.current && loadedMonths.length > 0) {
      setTimeout(() => {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const el = document.querySelector(`[data-date="${todayMidnight.getTime()}"]`);
        
        if (el && scrollContainerRef.current) {
          el.scrollIntoView({ block: 'start' });
          // Offset for sticky headers
          scrollContainerRef.current.scrollBy({ top: -60 });
          didInitialScroll.current = true;
        } else {
          const monthEl = document.getElementById(`month-${startOfMonth(new Date()).getTime()}`);
          if (monthEl && scrollContainerRef.current) {
            monthEl.scrollIntoView({ block: 'start' });
            didInitialScroll.current = true;
          }
        }
      }, 50); // slight delay to ensure DOM is ready
    }
  }, [loadedMonths]);

  const jumpToMonth = (date: Date, scrollToDay?: Date) => {
    const target = startOfMonth(date);
    setLoadedMonths([
      startOfMonth(subMonths(target, 1)),
      target,
      startOfMonth(addMonths(target, 1))
    ]);
    setActiveVisibleMonth(target);
    setIsMonthPickerOpen(false);
    
    // We use auto (instant) scroll instead of smooth, 
    // because smooth scrolling while IntersectionObserver is active 
    // can trigger the top-trigger and shift the DOM downwards,
    // causing the scroll destination to land on the wrong month.
    setTimeout(() => {
      if (scrollToDay) {
        const dayId = `day-${format(scrollToDay, 'yyyy-MM-dd')}`;
        const el = document.getElementById(dayId);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
      } else {
        const el = document.getElementById(`month-${target.getTime()}`);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 100);
  };

  const jumpToToday = () => {
    const today = new Date();
    setSelectedDay(today);
    jumpToMonth(today, today);
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
    if (e.itemType === 'project') return true;
    if (e.itemType === 'commitment' || e.itemType === 'habit') return false;
    if (!e.startDate) return false;
    return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000;
  });

  const commitments = selectedDayEvents.filter(e => e.itemType === 'commitment');
  const habits = selectedDayEvents.filter(e => e.itemType === 'habit');

  const totalDailyHours =
    dailyTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) +
    commitments.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) +
    habits.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) +
    continuousProjects.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

  const handleOpenActivity = (event: ScheduledEvent) => {
    if (event.itemType === 'commitment') return;
    setSelectedTask(event);
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      let endpoint = `/api/profile/goals/tasks/${taskId}`;
      if (selectedTask?.id === taskId) {
        if (selectedTask.type === 'daily') endpoint = `/api/schedule/daily-tasks/${taskId}`;
        else if (selectedTask.itemType === 'action' || selectedTask.itemType === 'habit') endpoint = `/api/profile/goals/actions/${taskId}`;
      }

      const res = await fetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        fetchEvents();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        if (selectedTask) {
          if (selectedTask.id === taskId) {
            setSelectedTask({ ...selectedTask, status: isCompleted ? 'completed' : 'pending' });
          } else {
            const updatedTasks = selectedTask.tasks?.map(t =>
              t.id === taskId ? { ...t, isCompleted } : t
            );
            setSelectedTask({ ...selectedTask, tasks: updatedTasks });
          }
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateTask = async (taskId: string, data: { title: string; description?: string; notes?: string }) => {
    try {
      let endpoint = `/api/profile/goals/tasks/${taskId}`;
      if (selectedTask?.id === taskId) {
        if (selectedTask.type === 'daily') endpoint = `/api/schedule/daily-tasks/${taskId}`;
        else if (selectedTask.itemType === 'action' || selectedTask.itemType === 'habit') endpoint = `/api/profile/goals/actions/${taskId}`;
      }

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchEvents();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        if (selectedTask) {
          if (selectedTask.id === taskId) {
            setSelectedTask({ ...selectedTask, title: data.title, description: data.description, notes: data.notes });
          } else {
            const updatedTasks = selectedTask.tasks?.map(t =>
              t.id === taskId ? { ...t, title: data.title, description: data.description, notes: data.notes } : t
            );
            setSelectedTask({ ...selectedTask, tasks: updatedTasks });
          }
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      let endpoint = `/api/profile/goals/tasks/${taskId}`;
      if (selectedTask?.id === taskId) {
        if (selectedTask.type === 'daily') endpoint = `/api/schedule/daily-tasks/${taskId}`;
        else if (selectedTask.itemType === 'action' || selectedTask.itemType === 'habit') endpoint = `/api/profile/goals/actions/${taskId}`;
      }

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(null);
        }
      }
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

  const renderControls = (className: string) => (
    <div className={`flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/80 shadow-lg ${className}`}>
      {/* View Toggle */}
      <div className="flex bg-stone-100/50 rounded-xl p-1 border border-stone-200/50">
        <button onClick={() => setViewMode('month')} className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}>Mes</button>
        <button onClick={() => setViewMode('week')} className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}>Sem</button>
      </div>

      <div className="w-px h-6 bg-stone-200/80"></div>

      <button
        onClick={jumpToToday}
        className="px-3 sm:px-4 py-2 flex items-center justify-center rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all text-stone-600 font-bold text-xs uppercase tracking-widest active:scale-95"
      >
        Hoy
      </button>
      <div className="w-px h-6 bg-stone-200/80"></div>
      <button
        onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
        className="px-3 sm:px-4 py-2 flex items-center gap-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-stone-800 active:scale-95 relative"
      >
        <span className="text-xs sm:text-sm font-black uppercase tracking-widest">
          {format(activeVisibleMonth, 'MMMM yyyy', { locale: es })}
        </span>
        <span className="text-[10px]">▼</span>
      </button>

      {/* Month Picker Popover */}
      {isMonthPickerOpen && (
        <div className="absolute top-full mt-3 right-0 w-64 bg-white/95 backdrop-blur-2xl border border-stone-200/80 rounded-3xl shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-200">
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
  );

  return (
    <div 
      className="flex flex-col h-[100dvh] relative overflow-hidden"
      style={{
        backgroundColor: '#f8f5f0',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
      }}
    >

      {/* ── Floating Nav (Mobile Only) ───────────────────────────────────────────── */}
      {renderControls("absolute top-4 right-4 sm:top-8 sm:right-8 z-[60] lg:hidden")}


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
        <div className="flex-1 flex flex-col overflow-hidden p-4 pb-28 sm:p-8 sm:pb-32 lg:p-12 lg:pb-32 relative z-10">
          <div className="flex-1 flex flex-col relative max-w-5xl mx-auto w-full min-h-0">
            {/* Top Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/70 backdrop-blur-md shadow-sm border border-stone-200/50 rotate-[-1deg] z-20" />
            
            <div className="flex-1 flex flex-col bg-[#fffcf8] rounded shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-stone-200/60 overflow-hidden w-full h-full">
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
            
            {viewMode === 'week' ? (
              <div className="flex flex-col h-full bg-white/40 backdrop-blur-md min-h-[500px]">
                {/* Week Navigation Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/50 bg-white/60 sticky top-0 z-[5]">
                  <button onClick={() => setSelectedDay(subWeeks(selectedDay, 1))} className="p-2 font-black text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Semana Actual</span>
                    <span className="text-sm font-black text-stone-700 uppercase tracking-tighter">
                      {format(startOfWeek(selectedDay, { weekStartsOn: 1 }), 'd MMM', { locale: es })} - {format(endOfWeek(selectedDay, { weekStartsOn: 1 }), 'd MMM', { locale: es })}
                    </span>
                  </div>
                  <button onClick={() => setSelectedDay(addWeeks(selectedDay, 1))} className="p-2 font-black text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 border-l border-r border-stone-200/50 flex-1">
                  {eachDayOfInterval({ start: startOfWeek(selectedDay, { weekStartsOn: 1 }), end: endOfWeek(selectedDay, { weekStartsOn: 1 }) }).map((day, i) => {
                    const dayEvents = getEventsForDay(day);
                    const isSelected = isSameDay(day, selectedDay);
                    const today = isToday(day);
                    const hasPostIt = dayEvents.some(e => e.itemType === 'post-it');

                    return (
                      <div
                        id={`day-${format(day, 'yyyy-MM-dd')}`}
                        data-date={day.getTime()}
                        key={i}
                        onClick={() => {
                          setSelectedDay(day);
                          setIsBottomSheetOpen(true);
                        }}
                        className={`
                          min-h-[300px] p-2 sm:p-4
                          border-r border-stone-200/50 transition-all cursor-pointer group relative
                          bg-transparent
                          ${isSelected ? 'ring-2 ring-inset ring-emerald-500 bg-emerald-50/40' : 'hover:bg-white/90'}
                          active:bg-emerald-50/50
                        `}
                      >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className={`
                            text-xs sm:text-sm font-black
                            w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl
                            transition-colors
                            ${today ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : isSelected ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'}
                          `}>
                            {format(day, 'd')}
                          </span>
                          {hasPostIt && (
                            <span className="text-[14px] sm:text-[16px] drop-shadow-md z-10 animate-in fade-in zoom-in duration-300" title="Contiene nota anclada">
                              📌
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          {(() => {
                            const regularEvents = dayEvents.filter(e => e.itemType !== 'commitment');
                            
                            return (
                              <>
                                {regularEvents.map(e => {
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
                                          window.dispatchEvent(new CustomEvent('open-postit-modal', { detail: e.originalPostIt }));
                                        }}
                                        className={`text-[10px] sm:text-[11px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg truncate font-bold shadow-sm cursor-pointer hover:-translate-y-0.5 transition-transform border ${colorClass} rotate-[-1deg]`}
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
                                      className={`text-[10px] sm:text-[11px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl truncate font-bold border-l-2 shadow-sm cursor-pointer hover:opacity-80 transition-opacity
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
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div id="top-trigger" ref={topTriggerRef} className="h-4 w-full" />
                
                {loadedMonths.map(month => {
                  const monthStart = startOfMonth(month);
                  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                  const endDate = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
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
                      const isCurrentMonth = isSameMonth(day, monthStart);

                      if (!isCurrentMonth) {
                        return (
                          <div
                            key={i}
                            className="min-h-[60px] sm:min-h-[85px] lg:min-h-[95px] border-b border-r border-stone-200/50 bg-stone-50/30"
                          />
                        );
                      }

                      const dayEvents = getEventsForDay(day);
                      const validEventsForHours = dayEvents.filter(e => {
                        if (e.itemType === 'commitment' || e.itemType === 'habit') return true;
                        if (!e.startDate) return true;
                        return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) <= 14 * 24 * 60 * 60 * 1000;
                      });
                      const dayHours = validEventsForHours.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

                      const isSelected = isSameDay(day, selectedDay);
                      const today = isToday(day);
                      const hasPostIt = dayEvents.some(e => e.itemType === 'post-it');

                      return (
                        <div
                          id={`day-${format(day, 'yyyy-MM-dd')}`}
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
                              const displayLimit = 3;
                              
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
              </>
            )}
          </div>
        </div>
        </div>
        </div>

        {/* ── Desktop Sidebar Agenda (hidden on mobile) ─────────────────── */}
        <div className="hidden lg:flex w-[380px] shrink-0 flex-col pt-8 pb-32 pr-12 relative z-10 gap-4">
          {/* Top Options Menu */}
          {renderControls("self-end z-[60]")}

          <div className="flex-1 flex flex-col relative min-h-0 rotate-[1deg]">
            {/* Top Clip */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-stone-300 rounded-sm shadow-md border border-stone-400 rotate-[-2deg] z-20">
              <div className="absolute inset-x-2 top-2 h-1 bg-stone-400/50 rounded-full" />
            </div>

            {/* Paper Notebook Effect Container */}
            <div className="flex-1 bg-[#fffdf8] rounded-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-stone-200/80 overflow-hidden flex flex-col">
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
    </div>

      {/* ── Mobile Bottom Sheet (hidden on lg+) ──────────────────────────── */}
      <div className="lg:hidden">
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          selectedDay={selectedDay}
          hoursLeft={Math.max(0, 24 - Math.round(totalDailyHours))}
        >
          <AgendaContent
            {...agendaProps}
            onItemClick={() => setIsBottomSheetOpen(false)}
          />
        </BottomSheet>
      </div>

      {/* ── Task Detail Modal ─────────────────────────────────────────────── */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
          onUpdate={handleUpdateTask}
          onToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
}

