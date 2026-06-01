'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { isSameDay, addDays } from 'date-fns';
import { TaskDetailModal } from '@/features/schedule/TaskDetailModal';
import { LeafDetailView } from '@/features/life-tree/LeafDetailView';

interface WarmupEvent {
  id: string;
  title: string;
  description?: string;
  date?: string;
  type: string;
  status: string;
  itemType: string;
  estimatedHours?: number;
  goalTitle?: string;
  parentActionType?: string;
  dimensions?: any[];
}

export function DailyWarmup() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // All events fetched from API
  const [allEvents, setAllEvents] = useState<WarmupEvent[]>([]);
  // The deck of cards currently being shown
  const [deck, setDeck] = useState<WarmupEvent[]>([]);
  
  // Selected task to show in Bottom Sheet
  const [selectedTask, setSelectedTask] = useState<WarmupEvent | null>(null);

  // Track seen cards to detect a full loop
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    // Check if we already did warmup today in this session
    const hasDone = sessionStorage.getItem('warmup_done_today');
    if (!hasDone) {
      setIsVisible(true);
    }

    // Listen for manual triggers (e.g. from the mobile floating button)
    const handleOpenManual = () => {
      console.log('Event open-daily-warmup received in DailyWarmup!');
      setCurrentDate(new Date());
      setIsVisible(true);
    };
    window.addEventListener('open-daily-warmup', handleOpenManual);
    return () => window.removeEventListener('open-daily-warmup', handleOpenManual);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    setLoading(true);
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAllEvents(data.events);
          buildDeckForDate(currentDate, data.events);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isVisible]);

  const buildDeckForDate = (date: Date, events: WarmupEvent[]) => {
    // Filter events for the specific date
    const dayOfWeek = date.getDay();
    
    const filtered = events.filter(e => {
      // Exclude base commitments and post-its for the Tinder view
      if (e.itemType === 'commitment' || e.itemType === 'post-it') return false;
      
      // Exclude already completed
      if (e.status === 'completed') return false;

      // Check dates
      if (e.date) {
        const d = new Date(e.date);
        
        // Handle multi-day events
        if ((e as any).startDate) {
          const s = new Date((e as any).startDate);
          if (date >= s && date <= d) return true;
        } else {
          if (isSameDay(d, date)) return true;
        }

        // If it's overdue daily task, include it in today
        if (e.itemType === 'daily' && (e as any).isOverdue && isSameDay(date, new Date())) return true;
      }
      
      // Include all habits for now (as ScheduleView does)
      if (e.itemType === 'habit') {
        return true;
      }

      return false;
    });

    // Reverse to display first item on top of the stack
    setDeck(filtered.reverse());
    setCurrentDate(date);
    setSeenIds([]); // Reset seen cards when building a new deck
  };

  const closeWarmup = () => {
    sessionStorage.setItem('warmup_done_today', 'true');
    setIsVisible(false);
  };

  const handleNextDay = () => {
    const nextDate = addDays(currentDate, 1);
    buildDeckForDate(nextDate, allEvents);
  };

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-stone-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-white font-black text-2xl tracking-tighter">Focus</h1>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mt-1">
            {isSameDay(currentDate, new Date()) ? 'Tus Tareas de Hoy' : currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button 
          onClick={closeWarmup}
          className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Main Tinder Area */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-stone-500 font-bold text-sm uppercase tracking-widest">Preparando tu día...</p>
          </div>
        ) : deck.length > 0 && seenIds.includes(deck[deck.length - 1]?.id) ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center max-w-xs"
          >
            <div className="text-7xl mb-6">🔄</div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">¡Revisión completa!</h2>
            <p className="text-stone-400 font-medium text-sm mb-10">
              Has revisado todas las tareas de {isSameDay(currentDate, new Date()) ? 'hoy' : 'este día'}. Tienes {deck.length} tarea(s) pendiente(s) que dejaste para después.
            </p>
            
            <button
              onClick={() => setSeenIds([])}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-wider shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-95 mb-3"
            >
              Ver Tareas Nuevamente
            </button>
            <button
              onClick={closeWarmup}
              className="w-full py-4 rounded-2xl bg-stone-800 text-white font-black uppercase tracking-wider hover:bg-stone-700 transition-all active:scale-95"
            >
              Salir a la App
            </button>
          </motion.div>
        ) : deck.length > 0 ? (
          <div className="relative w-full max-w-sm aspect-[3/4]">
            <AnimatePresence>
              {deck.map((event, index) => {
                const isTop = index === deck.length - 1;
                return (
                  <SwipeableCard
                    key={`${event.id}-${currentDate.toISOString()}`}
                    event={event}
                    isTop={isTop}
                    index={index}
                    total={deck.length}
                    onSwipeLeft={() => {
                      setSeenIds(prev => [...prev, event.id]);
                      // Push to back of deck (Option A: Loop)
                      setDeck(prev => {
                        const newDeck = [...prev];
                        const card = newDeck.pop();
                        if (card) newDeck.unshift(card);
                        return newDeck;
                      });
                    }}
                    onSwipeRight={() => {
                      setSeenIds(prev => [...prev, event.id]);
                      // Mark as done / Dismiss
                      setDeck(prev => prev.slice(0, -1));
                      
                      // Tell backend it's done (unless it's a habit, which we just dismiss locally for now)
                      if (event.itemType !== 'habit') {
                        let endpoint = '';
                        if (event.itemType === 'daily') endpoint = `/api/schedule/daily-tasks/${event.id}`;
                        else if (event.itemType === 'task') endpoint = `/api/profile/goals/tasks/${event.id}`;
                        else if (event.itemType === 'action') endpoint = `/api/profile/goals/actions/${event.id}`;
                        
                        if (endpoint) {
                          fetch(endpoint, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isCompleted: true })
                          }).then(() => {
                            window.dispatchEvent(new Event('refresh-schedule'));
                          });
                        }
                      }
                    }}
                    onClickCenter={() => setSelectedTask(event)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center max-w-xs"
          >
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">¡Todo limpio!</h2>
            <p className="text-stone-400 font-medium text-sm mb-10">
              No tienes más tareas pendientes para {isSameDay(currentDate, new Date()) ? 'hoy' : 'este día'}. ¡Has dominado la inercia!
            </p>
            
            <button
              onClick={handleNextDay}
              className="w-full py-4 rounded-2xl bg-stone-800 text-white font-black uppercase tracking-wider hover:bg-stone-700 transition-all active:scale-95 mb-3"
            >
              Ver Tareas de Mañana
            </button>
            <button
              onClick={closeWarmup}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-wider shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-95"
            >
              Entrar a la App
            </button>
          </motion.div>
        )}
      </div>

      {/* Progress Footer */}
      {!loading && deck.length > 0 && !seenIds.includes(deck[deck.length - 1]?.id) && (
        <div className="p-8 flex flex-col items-center z-10">
          <p className="text-stone-500 font-bold text-xs uppercase tracking-widest mb-4">
            Desliza para organizar
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 font-black text-xl">👈</div>
            <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 font-black text-xl">👉</div>
          </div>
          <div className="flex justify-between w-full max-w-xs mt-4 px-4 text-[10px] font-bold text-stone-600 uppercase tracking-widest">
            <span>Luego</span>
            <span>Hecho</span>
          </div>
        </div>
      )}

      {/* Modals for "Hacer Ahora" */}
      {selectedTask && (
        selectedTask.itemType === 'daily' || selectedTask.itemType === 'task' ? (
          <TaskDetailModal
            isOpen={true}
            onClose={() => setSelectedTask(null)}
            task={selectedTask as any}
            onUpdated={() => {}}
          />
        ) : (
          <LeafDetailView
            isOpen={true}
            onClose={() => setSelectedTask(null)}
            nodeId={selectedTask.id}
          />
        )
      )}
    </div>,
    document.body
  );
}

function SwipeableCard({ event, isTop, index, total, onSwipeLeft, onSwipeRight, onClickCenter }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Stamps opacity
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);

  // Card scaling for the stack effect
  const isFront = isTop;
  const scale = isFront ? 1 : 0.95 - (total - index) * 0.02;
  const yOffset = isFront ? 0 : (total - index) * -15;

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
        scale,
        y: yOffset,
        zIndex: index,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          onSwipeRight();
        } else if (info.offset.x < -100) {
          onSwipeLeft();
        }
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale, opacity: 1, y: yOffset }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute inset-0 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-stone-200 flex flex-col overflow-hidden touch-none`}
    >
      {/* Card Header Pattern */}
      <div className={`h-24 shrink-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:20px_20px]
        ${event.itemType === 'habit' ? 'bg-violet-500' : event.itemType === 'daily' ? 'bg-amber-500' : 'bg-emerald-500'}
      `} />

      {/* STAMPS */}
      {isFront && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-10 left-6 z-20 pointer-events-none"
          >
            <div className="px-4 py-2 border-4 border-emerald-500 rounded-xl text-emerald-500 font-black text-3xl tracking-widest uppercase rotate-[-15deg] shadow-lg bg-white/90 backdrop-blur-sm">
              ¡HECHO!
            </div>
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-10 right-6 z-20 pointer-events-none"
          >
            <div className="px-4 py-2 border-4 border-stone-400 rounded-xl text-stone-400 font-black text-3xl tracking-widest uppercase rotate-[15deg] shadow-lg bg-white/90 backdrop-blur-sm">
              LUEGO
            </div>
          </motion.div>
        </>
      )}

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between items-center text-center">
        <div className="w-full">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4
            ${event.itemType === 'habit' ? 'bg-violet-100 text-violet-700' : event.itemType === 'daily' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}
          `}>
            {event.itemType === 'habit' ? 'Hábito' : event.itemType === 'daily' ? 'Tarea Rápida' : event.type || 'Tarea'}
          </span>
          <h2 className="text-2xl font-black text-stone-800 leading-tight mb-2 tracking-tighter">
            {event.title}
          </h2>
          <p className="text-sm font-medium text-stone-500 mt-2">
            {event.goalTitle || event.description || 'Sin descripción'}
          </p>
        </div>

        {event.estimatedHours > 0 && (
          <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-xl">⏱️</span>
            <span className="text-sm font-bold text-stone-600">
              {event.estimatedHours < 1 ? `${Math.round(event.estimatedHours * 60)} min` : `${event.estimatedHours} horas`}
            </span>
          </div>
        )}

        <button
          onClick={onClickCenter}
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-6 w-full py-4 rounded-2xl bg-stone-900 text-white font-black uppercase tracking-widest shadow-xl hover:bg-stone-800 transition-all active:scale-95"
        >
          Hacer Ahora
        </button>
      </div>
    </motion.div>
  );
}
