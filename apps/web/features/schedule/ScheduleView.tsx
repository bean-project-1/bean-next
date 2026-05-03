'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface ScheduledEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  status: string;
  goalTitle: string;
  estimatedHours: number;
  itemType: 'action' | 'habit' | 'task';
}

export function ScheduleView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.success) setEvents(data.events);
      })
      .finally(() => setLoading(false));
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
    return events.filter(e => e.date && isSameDay(new Date(e.date), day));
  };

  const selectedDayEvents = getEventsForDay(selectedDay);
  const totalDailyHours = selectedDayEvents.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

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
              const dayHours = dayEvents.reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = isSameDay(day, selectedDay);
              const today = isToday(day);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDay(day)}
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
                    {dayEvents.slice(0, 3).map(e => (
                      <div 
                        key={e.id} 
                        className={`text-[9px] px-2 py-1 rounded-lg truncate font-bold border-l-2 shadow-sm
                          ${e.status === 'completed' 
                            ? 'bg-slate-100 text-slate-400 border-slate-300' 
                            : 'bg-white text-slate-700 border-green-500'}`}
                      >
                        {e.title}
                      </div>
                    ))}
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

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-3xl mb-3">🍃</div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No hay actividades</p>
                <p className="text-[10px] text-slate-300 mt-2 px-6">Disfruta de tu tiempo libre o planifica algo nuevo.</p>
              </div>
            ) : (
              selectedDayEvents.map(event => (
                <div key={event.id} className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
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
                  {event.description && (
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              ))
            )}

            {/* Habits Section (Always visible as reminders) */}
            <div className="mt-8">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Hábitos Sugeridos</h2>
               <div className="space-y-2">
                 {events.filter(e => e.itemType === 'habit').map(habit => (
                   <div key={habit.id} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-slate-100/50">
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
    </div>
  );
}
