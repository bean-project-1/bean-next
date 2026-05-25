'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

import { LeafDetailView } from '@/features/life-tree/LeafDetailView';
import { Leaf } from '@/features/life-tree/types';

interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  date: string;
  type: string;
  status: string;
  goalTitle: string;
  estimatedHours: number;
  itemType: 'action' | 'habit' | 'task' | 'commitment';
  dimensions?: string[];
  attributes?: string[];
  tasks?: any[];
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
  totalDailyHours,
  selectedDay,
  onOpenActivity,
  onItemClick,
}: {
  loading: boolean;
  dailyTasks: ScheduledEvent[];
  continuousProjects: ScheduledEvent[];
  commitments: ScheduledEvent[];
  events: ScheduledEvent[];
  totalDailyHours: number;
  selectedDay: Date;
  onOpenActivity: (event: ScheduledEvent) => void;
  onItemClick?: () => void;
}) {
  const handleClick = (event: ScheduledEvent) => {
    onOpenActivity(event);
    onItemClick?.();
  };

  return (
    <div className="space-y-6">
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
                className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border flex items-center gap-1
                    ${event.status === 'completed' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {event.type}
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
                  <span className="text-[9px] font-bold text-slate-300 group-hover:text-slate-400 transition-colors uppercase">
                    {event.goalTitle}
                  </span>
                </div>
                <h3 className={`text-xs font-black text-slate-800 leading-tight ${event.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                  {event.title}
                </h3>
              </div>
            ))
          )}
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
                  {bc.estimatedHours}h
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Leaf | null>(null);

  const fetchEvents = () => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.success) setEvents(data.events);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

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
    if (!e.startDate) return true;
    return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) <= 14 * 24 * 60 * 60 * 1000;
  });

  const continuousProjects = selectedDayEvents.filter(e => {
    if (e.itemType === 'commitment') return false;
    if (!e.startDate) return false;
    return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000;
  });

  const commitments = selectedDayEvents.filter(e => e.itemType === 'commitment');

  const totalDailyHours =
    dailyTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) +
    commitments.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

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
    events,
    totalDailyHours,
    selectedDay,
    onOpenActivity: handleOpenActivity,
  };

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="px-4 sm:px-6 py-4 sm:py-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            📅 Mi Calendario
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">Gestiona tu tiempo y carga de trabajo</p>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 p-1 sm:p-1.5 rounded-2xl border border-slate-100 self-start sm:self-auto">
          <button
            onClick={prevMonth}
            id="calendar-prev-month"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500 active:scale-90"
          >
            ←
          </button>
          <span className="text-xs sm:text-sm font-bold text-slate-700 min-w-[100px] sm:min-w-[120px] text-center uppercase tracking-widest px-1 sm:px-2">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </span>
          <button
            onClick={nextMonth}
            id="calendar-next-month"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500 active:scale-90"
          >
            →
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Calendar grid */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6">
          <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">

            {/* Day headers */}
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dayShort, i) => (
              <div
                key={i}
                className="py-2 sm:py-4 bg-slate-50 border-b border-r border-slate-100 text-center"
              >
                {/* Show short letter on mobile, full abbrev on desktop */}
                <span className="sm:hidden text-[9px] font-black text-slate-400 uppercase">{dayShort}</span>
                <span className="hidden sm:inline text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}
                </span>
              </div>
            ))}

            {/* Day cells */}
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const activeDailyTasks = dayEvents.filter(e => {
                if (!e.startDate) return true;
                return (new Date(e.date).getTime() - new Date(e.startDate).getTime()) <= 14 * 24 * 60 * 60 * 1000;
              });
              const dayHours = activeDailyTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = isSameDay(day, selectedDay);
              const today = isToday(day);

              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedDay(day);
                    setIsBottomSheetOpen(true);
                  }}
                  className={`
                    min-h-[60px] sm:min-h-[120px] p-1.5 sm:p-3
                    border-b border-r border-slate-100 transition-all cursor-pointer group
                    ${!isCurrentMonth ? 'bg-slate-50/30' : 'bg-white'}
                    ${isSelected ? 'ring-2 ring-inset ring-green-500 bg-green-50/20' : 'hover:bg-slate-50/50'}
                    active:bg-green-50/30
                  `}
                >
                  {/* Date number + hours badge */}
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className={`
                      text-[10px] sm:text-xs font-black
                      w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md sm:rounded-lg
                      transition-colors
                      ${today ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                        : isSelected ? 'text-green-700'
                        : 'text-slate-400'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {dayHours > 0 && (
                      <span className={`
                        hidden sm:inline
                        text-[9px] font-black px-1.5 py-0.5 rounded-md
                        ${dayHours > 6 ? 'bg-red-100 text-red-600' : dayHours > 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {dayHours}h
                      </span>
                    )}
                  </div>

                  {/* Event pills — on mobile just show dots, desktop shows pills */}
                  <div className="hidden sm:block space-y-1">
                    {dayEvents.slice(0, 3).map(e => {
                      const isLongRange = e.startDate &&
                        (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000;
                      const isCommitment = e.itemType === 'commitment';
                      return (
                        <div
                          key={e.id}
                          className={`text-[9px] px-2 py-1 rounded-lg truncate font-bold border-l-2 shadow-sm
                            ${isCommitment
                              ? 'bg-slate-50 text-slate-400 border-slate-300 italic'
                              : e.status === 'completed'
                                ? 'bg-slate-100 text-slate-400 border-slate-300'
                                : isLongRange
                                  ? 'bg-violet-50 text-violet-700 border-violet-400 opacity-60'
                                  : 'bg-white text-slate-700 border-green-500'}`}
                        >
                          {isCommitment ? `🔒 ${e.title}` : e.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[8px] text-slate-400 font-bold pl-2">+{dayEvents.length - 3} más</div>
                    )}
                  </div>

                  {/* Mobile: coloured dot indicators */}
                  {dayEvents.length > 0 && (
                    <div className="sm:hidden flex gap-0.5 flex-wrap mt-1">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full shrink-0
                            ${e.itemType === 'commitment' ? 'bg-slate-300'
                              : e.status === 'completed' ? 'bg-slate-200'
                              : e.startDate && (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000
                                ? 'bg-violet-400'
                                : 'bg-green-500'}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop Sidebar Agenda (hidden on mobile) ─────────────────── */}
        <aside className="hidden lg:flex w-80 border-l border-slate-100 bg-slate-50/30 flex-col">
          <div className="p-6 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Agenda del Día</h2>
              <div className="flex items-center gap-1.5">
                {totalDailyHours > 0 && (
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${totalDailyHours > 16 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    {Math.round(totalDailyHours)}h ocupadas
                  </span>
                )}
                <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {Math.max(0, 24 - Math.round(totalDailyHours))}h libres
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
              {format(selectedDay, "eeee d 'de' MMMM", { locale: es })}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <AgendaContent {...agendaProps} />
          </div>
        </aside>
      </div>

      {/* ── Mobile Bottom Sheet (hidden on lg+) ──────────────────────────── */}
      <div className="lg:hidden">
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          title="Agenda del Día"
          subtitle={format(selectedDay, "eeee d 'de' MMMM", { locale: es })}
        >
          {/* Hour summary pill */}
          <div className="flex items-center gap-2 mb-2">
            {totalDailyHours > 0 && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black
                ${totalDailyHours > 16 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                ⏱ {Math.round(totalDailyHours)}h ocupadas
              </span>
            )}
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

