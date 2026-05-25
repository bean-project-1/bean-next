'use client';

import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS } from '../onboarding/constants';

interface Commitment {
  id: string;
  title: string;
  type: string;
  hoursPerDay: number;
  daysOfWeek: number[];
  dimensionId?: string;
  dimension?: { label: string };
}

export function CommitmentSettings() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('work');
  const [hours, setHours] = useState(8);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [commuteHours, setCommuteHours] = useState(0);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedDim, setSelectedDim] = useState('');

  // Auto-calculate hours when start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diff = endH - startH + (endM - startM) / 60;
      if (diff < 0) diff += 24; // Cross-midnight
      setHours(Math.round(diff * 10) / 10);
    }
  }, [startTime, endTime]);

  const days = [
    { label: 'D', value: 0 },
    { label: 'L', value: 1 },
    { label: 'M', value: 2 },
    { label: 'M', value: 3 },
    { label: 'J', value: 4 },
    { label: 'V', value: 5 },
    { label: 'S', value: 6 },
  ];

  const fetchCommitments = async () => {
    try {
      const res = await fetch('/api/profile/commitments');
      const data = await res.json();
      if (data.success) setCommitments(data.commitments);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchCommitments();
  }, []);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAdd = async () => {
    if (!title) return;
    try {
      const res = await fetch('/api/profile/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          hoursPerDay: hours,
          startTime,
          endTime,
          commuteHours: commuteHours,
          daysOfWeek: selectedDays,
          dimensionId: selectedDim || null
        })
      });
      if (res.ok) {
        setIsAdding(false);
        setTitle('');
        fetchCommitments();
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    // We need a DELETE endpoint. I'll create it later.
    try {
      const res = await fetch(`/api/profile/commitments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCommitments();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando compromisos...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">⚙️ Configuración de Vida</h1>
          <p className="text-sm text-slate-400 font-medium">Gestiona tus horarios fijos y rutinas base</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
        >
          {isAdding ? 'Cancelar' : '+ Añadir Bloque'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 bg-white border border-slate-100 rounded-[32px] p-8 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-black text-slate-800 mb-6">Nuevo Compromiso Fijo</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">¿Qué es?</label>
                <input 
                  type="text" 
                  placeholder="Ej: Trabajo 9-5, Universidad..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tipo</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                >
                  <option value="work">💼 Trabajo / Profesional</option>
                  <option value="study">🎓 Estudio / Académico</option>
                  <option value="routine">🔄 Rutina / Estilo de Vida</option>
                  <option value="other">📅 Otro</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Dimensión Vinculada</label>
                <select 
                  value={selectedDim}
                  onChange={e => setSelectedDim(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                >
                  <option value="">Seleccionar dimensión...</option>
                  {ALL_DIMENSIONS.map(d => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Hora Inicio</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Hora Fin</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Horas por día (calculado o manual)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="24" step="0.5"
                    value={hours}
                    onChange={e => setHours(parseFloat(e.target.value))}
                    className="flex-1 accent-slate-900"
                  />
                  <span className="text-sm font-black text-slate-900 w-12">{hours}h</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tiempo de traslado (hrs / día)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0" max="4" step="0.5"
                    value={commuteHours}
                    onChange={e => setCommuteHours(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="text-sm font-black text-emerald-600 w-12">{commuteHours > 0 ? `+${commuteHours}h` : '0h'}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Días de la semana</label>
                <div className="flex gap-2">
                  {days.map(d => (
                    <button
                      key={d.value}
                      onClick={() => toggleDay(d.value)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                        selectedDays.includes(d.value) 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleAdd}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                >
                  Guardar Compromiso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {commitments.length === 0 ? (
          <div className="col-span-2 py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100">
            <p className="text-slate-300 font-black uppercase tracking-widest">No tienes bloques fijos configurados</p>
          </div>
        ) : (
          commitments.map(bc => (
            <div key={bc.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-colors text-xl">
                  {bc.type === 'work' ? '💼' : bc.type === 'study' ? '🎓' : '📅'}
                </div>
                <button 
                  onClick={() => handleDelete(bc.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors font-black text-xs uppercase tracking-tighter"
                >
                  Eliminar
                </button>
              </div>
              <h3 className="text-lg font-black text-slate-800">{bc.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {(bc as any).startTime && (bc as any).endTime ? `${(bc as any).startTime} - ${(bc as any).endTime} (${bc.hoursPerDay}h)` : `${bc.hoursPerDay}h por día`} {(bc as any).commuteHours > 0 && `(+ ${(bc as any).commuteHours}h traslado)`} • {bc.dimension?.label || 'General'}
              </p>
              
              <div className="mt-6 flex gap-1">
                {days.map(d => (
                  <div
                    key={d.value}
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${
                      bc.daysOfWeek.includes(d.value) 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-50 text-slate-300'
                    }`}
                  >
                    {d.label}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
