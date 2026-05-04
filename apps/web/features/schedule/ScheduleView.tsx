'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

import { LeafDetailView } from '@/features/dashboard/components/life-tree/LeafDetailView';
import { Leaf } from '@/features/dashboard/components/life-tree/types';

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
  itemType: 'action' | 'habit' | 'task';
  dimensions?: string[];
  attributes?: string[];
  tasks?: any[];
}

export function ScheduleView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Leaf | null>(null);

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
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    return events.filter(e => {
      const d = new Date(e.date);
      if (e.startDate) {
        const s = new Date(e.startDate);
        return day >= s && day <= d;
      }
      return isSameDay(d, day);
    });
  };

  const selectedDayEvents = getEventsForDay(selectedDay);
  
  const dailyTasks = selectedDayEvents.filter(e => {
    if (!e.startDate) return true;
    const diff = new Date(e.date).getTime() - new Date(e.startDate).getTime();
    return diff <= 14 * 24 * 60 * 60 * 1000;
  });

  const continuousProjects = selectedDayEvents.filter(e => {
    if (e.itemType === 'commitment') return false;
    if (!e.startDate) return false;
    const diff = new Date(e.date).getTime() - new Date(e.startDate).getTime();
    return diff > 14 * 24 * 60 * 60 * 1000;
  });

  const commitments = selectedDayEvents.filter(e => e.itemType === 'commitment');

  const totalDailyHours = dailyTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0) + 
                        commitments.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

  const handleOpenActivity = (event: ScheduledEvent) => {
    if (event.itemType === 'commitment') return; // Commitments are static blocks for now
    // Map ScheduledEvent to Leaf type
    const leaf: Leaf = {
      id: event.id,
      name: event.title,
      description: event.description,
      type: event.type as any,
      completed: event.status === 'completed',
      targetDate: event.date,
      dimensions: event.dimensions || [],
      attributes: event.attributes || [],
      tasks: event.tasks || []
    };
    setSelectedActivity(leaf);
  };

  // Handlers for LeafDetailView
  const handleToggleAction = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/profile/goals/actions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: data.completed })
      });
      if (res.ok) {
        fetchEvents();
        if (selectedActivity && selectedActivity.id === id) {
          setSelectedActivity({ ...selectedActivity, completed: data.completed });
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/profile/goals/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted })
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
      if (res.ok) {
        fetchEvents();
        setSelectedActivity(null);
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-6 py-8 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            📅 Mi Calendario
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Gestiona tu tiempo y carga de trabajo</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
           <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500">←</button>
           <span className="text-sm font-bold text-slate-700 min-w-[120px] text-center uppercase tracking-widest px-2">
             {format(currentMonth, 'MMMM yyyy', { locale: es })}
           </span>
           <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500">→</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="py-4 bg-slate-50 border-b border-r border-slate-100 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{day}</span>
              </div>
            ))}
            
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
                    setIsDayModalOpen(true);
                  }}
                  className={`min-h-[120px] p-3 border-b border-r border-slate-100 transition-all cursor-pointer group
                    ${!isCurrentMonth ? 'bg-slate-50/30' : 'bg-white'}
                    ${isSelected ? 'ring-2 ring-inset ring-green-500 bg-green-50/20' : 'hover:bg-slate-50/50'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-lg transition-colors
                      ${today ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : isSelected ? 'text-green-700' : 'text-slate-400'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {dayHours > 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md
                        ${dayHours > 6 ? 'bg-red-100 text-red-600' : dayHours > 3 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                        {dayHours}h
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(e => {
                      const isLongRange = e.startDate && (new Date(e.date).getTime() - new Date(e.startDate).getTime()) > 14 * 24 * 60 * 60 * 1000;
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Agenda */}
        <aside className="w-80 border-l border-slate-100 bg-slate-50/30 flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Agenda del Día</h2>
              {totalDailyHours > 0 && (
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${totalDailyHours > 6 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {totalDailyHours}h total
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
              {format(selectedDay, "eeee d 'de' MMMM", { locale: es })}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Daily Tasks Section */}
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
                      onClick={() => handleOpenActivity(event)}
                      className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border
                          ${event.status === 'completed' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-green-50 text-green-700 border-green-100'}`}>
                          {event.type} • {event.estimatedHours}h
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

            {/* Continuous Projects Section */}
            {continuousProjects.length > 0 && (
              <div>
                <h2 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Proyectos Continuos</h2>
                <div className="space-y-3">
                  {continuousProjects.map(proj => (
                    <div 
                      key={proj.id} 
                      onClick={() => handleOpenActivity(proj)}
                      className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100/50 cursor-pointer hover:bg-violet-50 transition-colors"
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

            {/* Base Commitments Section */}
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
                        {bc.estimatedHours}h • {bc.dimensionName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Habits Section */}
            <div className="mt-8">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Hábitos Sugeridos</h2>
               <div className="space-y-2">
                 {events.filter(e => e.itemType === 'habit').map(habit => (
                   <div 
                    key={habit.id} 
                    onClick={() => handleOpenActivity(habit)}
                    className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-slate-100/50 cursor-pointer hover:bg-white transition-colors"
                   >
                     <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-sm">✨</div>
                     <div className="overflow-hidden">
                       <p className="text-[11px] font-bold text-slate-700 truncate">{habit.title}</p>
                       <p className="text-[9px] text-slate-400 uppercase tracking-tighter">{habit.goalTitle}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Day Activities Modal */}
      {isDayModalOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 sm:p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsDayModalOpen(false)}>
          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Actividades del Día</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {format(selectedDay, "eeee d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <button onClick={() => setIsDayModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-400 font-bold">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3 max-h-[60vh]">
              {selectedDayEvents.length === 0 ? (
                <div className="py-12 text-center text-slate-300">No hay actividades para este día.</div>
              ) : (
                selectedDayEvents.map(event => (
                  <div 
                    key={event.id}
                    onClick={() => {
                      handleOpenActivity(event);
                      setIsDayModalOpen(false);
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100/50 transition-all cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm
                      ${event.type === 'habit' ? 'bg-violet-100 text-violet-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {event.type === 'habit' ? '✨' : '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{event.title}</h3>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{event.goalTitle} • {event.estimatedHours}h</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">→</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Detail Modal (LeafDetailView) */}
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
