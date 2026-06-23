import { useState, useEffect } from 'react';
import { ALL_DIMENSIONS } from '../onboarding/constants';

interface CommitmentModalProps {
  commitment: any; // If it has id, it's edit mode. If only type, it's create mode.
  onClose: () => void;
  onSave: () => void;
}

const DAYS = [
  { label: 'D', value: 0 },
  { label: 'L', value: 1 },
  { label: 'M', value: 2 },
  { label: 'M', value: 3 },
  { label: 'J', value: 4 },
  { label: 'V', value: 5 },
  { label: 'S', value: 6 },
];

export function CommitmentModal({ commitment, onClose, onSave }: CommitmentModalProps) {
  const isEditing = !!commitment.id;

  const [title, setTitle] = useState(commitment.title || '');
  const [type, setType] = useState(commitment.type || 'work');
  const [hours, setHours] = useState(commitment.hoursPerDay || 8);
  const [startTime, setStartTime] = useState(commitment.startTime || '09:00');
  const [endTime, setEndTime] = useState(commitment.endTime || '17:00');
  const [commuteHours, setCommuteHours] = useState(commitment.commuteHours || 0);
  const [selectedDays, setSelectedDays] = useState<number[]>(commitment.daysOfWeek || [1, 2, 3, 4, 5]);
  const [selectedDims, setSelectedDims] = useState<string[]>(
    commitment.dimensions?.map((d: any) => d.name) || 
    (commitment.dimension?.name ? [commitment.dimension.name] : [])
  );
  
  const [startDate, setStartDate] = useState(
    commitment.startDate ? new Date(commitment.startDate).toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState(
    commitment.endDate ? new Date(commitment.endDate).toISOString().split('T')[0] : ''
  );
  const [goalId, setGoalId] = useState(commitment.goalId || '');
  const [energyLevel, setEnergyLevel] = useState(commitment.energyLevel || 'medium');
  const [description, setDescription] = useState(commitment.description || '');
  const [goals, setGoals] = useState<{ id: string; goal: string }[]>([]);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/life-tree')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data.branches)) {
          setGoals(data.branches.map((b: any) => ({ id: b.id, goal: b.goal })));
        }
      })
      .catch(e => console.error('Error fetching goals in CommitmentModal:', e));
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diff = endH - startH + (endM - startM) / 60;
      if (diff < 0) diff += 24; 
      setHours(Math.round(diff * 10) / 10);
    }
  }, [startTime, endTime]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!title) return;
    setSaving(true);
    
    const payload = {
      title,
      type,
      hoursPerDay: hours,
      startTime: startTime || null,
      endTime: endTime || null,
      commuteHours,
      daysOfWeek: selectedDays,
      dimensionIds: selectedDims.length > 0 ? selectedDims : null,
      startDate: startDate || null,
      endDate: endDate || null,
      goalId: goalId || null,
      energyLevel,
      description
    };

    try {
      const url = isEditing ? `/api/profile/commitments/${commitment.id}` : '/api/profile/commitments';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onSave();
        onClose();
      } else {
        const errData = await res.json();
        alert('Error: ' + errData.error);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !confirm('¿Estás seguro de eliminar este compromiso?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/profile/commitments/${commitment.id}`, { method: 'DELETE' });
      if (res.ok) {
        onSave();
        onClose();
      } else {
        const errData = await res.json();
        alert('Error: ' + errData.error);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90dvh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEditing ? 'Editar Compromiso' : 'Nuevo Compromiso Fijo'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">¿Qué es?</label>
                <input 
                  type="text" 
                  placeholder="Ej: Trabajo 9-5, Universidad..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Descripción</label>
                <textarea 
                  placeholder="Detalles u observaciones..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700 resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tipo</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                >
                  <option value="work">💼 Trabajo / Profesional</option>
                  <option value="study">🎓 Estudio / Académico</option>
                  <option value="routine">🔄 Rutina / Estilo de Vida</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nivel de Energía</label>
                <select 
                  value={energyLevel}
                  onChange={e => setEnergyLevel(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                >
                  <option value="high">🔥 Alta Energía</option>
                  <option value="medium">⚡ Energía Media</option>
                  <option value="low">💤 Baja Energía</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Meta Relacionada</label>
                <select 
                  value={goalId}
                  onChange={e => setGoalId(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                >
                  <option value="">Ninguna</option>
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>{g.goal}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Dimensiones Vinculadas</label>
                <select 
                  value=""
                  onChange={e => {
                    const val = e.target.value;
                    if (val && !selectedDims.includes(val)) {
                      setSelectedDims([...selectedDims, val]);
                    }
                  }}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all mb-2"
                >
                  <option value="">Añadir dimensión...</option>
                  {ALL_DIMENSIONS.filter(d => !selectedDims.includes(d.key)).map(d => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  {selectedDims.map(dimKey => {
                    const dimInfo = ALL_DIMENSIONS.find(d => d.key === dimKey);
                    return (
                      <span key={dimKey} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                        {dimInfo?.label || dimKey}
                        <button onClick={() => setSelectedDims(selectedDims.filter(d => d !== dimKey))} className="hover:text-red-500 ml-1">✕</button>
                      </span>
                    );
                  })}
                </div>
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
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Hora Fin</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Fecha Inicio</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Fecha Fin</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-200 transition-all text-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Horas por día (calc)</label>
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
                <div className="flex gap-1 sm:gap-2">
                  {DAYS.map(d => (
                    <button
                      key={d.value}
                      onClick={() => toggleDay(d.value)}
                      className={`flex-1 sm:w-10 h-10 rounded-xl text-xs font-black transition-all ${
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
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-gray-50">
          {isEditing ? (
            <button 
              onClick={handleDelete} disabled={saving}
              className="text-red-500 hover:text-red-700 font-bold text-sm uppercase tracking-tighter"
            >
              Eliminar
            </button>
          ) : <div/>}
          <button 
            onClick={handleSave} disabled={saving || !title}
            className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
