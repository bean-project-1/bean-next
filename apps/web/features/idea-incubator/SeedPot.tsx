import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Seed, IdeaCloud } from '../../hooks/useIncubator';
import { Plus } from 'lucide-react';

interface SeedPotProps {
  seed: Seed;
  onDropCloudToChat: (cloud: IdeaCloud) => void;
  onAddCloud: (text: string) => void;
  onPlant: () => void;
}

export function SeedPot({ seed, onDropCloudToChat, onAddCloud, onPlant }: SeedPotProps) {
  const [newCloudText, setNewCloudText] = useState('');
  const [isAddingCloud, setIsAddingCloud] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Growth calculation based on scores
  const totalScore = (seed.scores.sun + seed.scores.earth + seed.scores.water) / 3; // 0 to 100
  
  // Visual factors
  const leafColor = totalScore > 80 ? '#10B981' : totalScore > 40 ? '#34D399' : '#A7F3D0';

  const handleDragEnd = (cloud: IdeaCloud, event: any, info: PanInfo) => {
    // If dragged to the right side significantly, assume dropped to chat
    if (info.offset.x > 150) {
      onDropCloudToChat(cloud);
    }
  };

  const handleAddCloudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCloudText.trim()) {
      onAddCloud(newCloudText.trim());
      setNewCloudText('');
      setIsAddingCloud(false);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#FAFAFA] overflow-hidden lg:rounded-l-[2rem]">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#10B981_0%,_transparent_60%)]" />

      {/* Floating Idea Clouds */}
      {seed.clouds?.map((cloud, index) => (
        <motion.div
          key={cloud.id}
          drag
          dragConstraints={{ left: -200, right: 300, top: -200, bottom: 200 }}
          onDragEnd={(e, info) => handleDragEnd(cloud, e, info)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, x: cloud.x || 0, y: cloud.y || 0 }}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
          className="absolute z-10 cursor-grab bg-white border border-stone-200 shadow-md rounded-2xl px-4 py-3 max-w-[180px] text-center group"
          style={{
            left: `calc(50% + ${Math.sin(index) * 120}px)`,
            top: `calc(20% + ${Math.cos(index) * 100}px)`,
          }}
        >
          <p className="text-sm text-stone-700 font-medium">{cloud.text}</p>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-stone-400 font-bold tracking-wider whitespace-nowrap pointer-events-none">
            Arrastra al chat →
          </div>
        </motion.div>
      ))}

      {/* Add Cloud Button / Input */}
      <div className="absolute bottom-6 left-6 z-20">
        {isAddingCloud ? (
          <form onSubmit={handleAddCloudSubmit} className="bg-white p-3 rounded-2xl shadow-lg border border-stone-200 flex flex-col gap-2 w-48">
            <textarea
              autoFocus
              value={newCloudText}
              onChange={(e) => setNewCloudText(e.target.value)}
              placeholder="Nueva idea..."
              className="w-full bg-stone-50 border border-stone-100 rounded-xl p-2 text-sm outline-none resize-none"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddingCloud(false)} className="text-xs text-stone-500 font-bold px-2">Cancelar</button>
              <button type="submit" disabled={!newCloudText.trim()} className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg">Añadir</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCloud(true)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-stone-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-sm font-bold text-stone-600"
          >
            <Plus className="w-4 h-4" />
            Añadir Nube
          </button>
        )}
      </div>

      {/* The Pot and Plant Visualization */}
      <div 
        className="relative z-0 mt-20 flex flex-col items-center cursor-pointer group"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap z-50 pointer-events-none">
          Clic para ver detalles
        </div>

        {/* Plant System */}
        <div className="relative flex flex-col items-center justify-end h-48 pb-1 z-20">
          
          {/* The Flower / Plant Action (Button) */}
          <motion.div 
            initial={false}
            animate={{ scale: seed.status === 'ready' ? 1 : 0, y: seed.status === 'ready' ? 0 : 20 }}
            className="z-30 mb-[-12px] pointer-events-auto"
          >
            <button
              onClick={(e) => { e.stopPropagation(); onPlant(); }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-[13px] font-bold shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all flex items-center gap-2 border-2 border-white/20 whitespace-nowrap"
            >
              ✨ Plantar al Árbol
            </button>
          </motion.div>

          {/* Stem and Leaves Container */}
          <div className="relative flex flex-col items-center justify-end pointer-events-none">
            {/* Dynamic Stem */}
            <motion.div 
              initial={{ height: 10 }}
              animate={{ height: Math.max(10, totalScore * 1.5) }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="w-3.5 bg-emerald-600 rounded-t-full shadow-inner"
            />
            
            {/* Sun Leaf */}
            <motion.div 
              initial={false}
              animate={{ scale: seed.scores.sun >= 30 ? 1 : 0 }}
              className="absolute bottom-6 -right-8 origin-bottom-left"
            >
              <div className="w-10 h-6 rounded-tr-full rounded-bl-full rotate-12" style={{ backgroundColor: leafColor }} />
            </motion.div>
            
            {/* Earth Leaf */}
            <motion.div 
              initial={false}
              animate={{ scale: seed.scores.earth >= 30 ? 1 : 0 }}
              className="absolute bottom-16 -left-8 origin-bottom-right"
            >
              <div className="w-10 h-6 rounded-tl-full rounded-br-full -rotate-12" style={{ backgroundColor: leafColor }} />
            </motion.div>

            {/* Water Leaf */}
            <motion.div 
              initial={false}
              animate={{ scale: seed.scores.water >= 30 ? 1 : 0 }}
              className="absolute bottom-24 -right-6 origin-bottom-left"
            >
              <div className="w-8 h-5 rounded-tr-full rounded-bl-full rotate-[30deg]" style={{ backgroundColor: leafColor }} />
            </motion.div>
          </div>
        </div>

        {/* The Pot */}
        <div className="relative w-40 h-32 mt-[-10px] z-10 transition-transform group-hover:scale-105 pointer-events-none">
          <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            {/* Back rim */}
            <ellipse cx="80" cy="15" rx="70" ry="10" fill="#B45309" />
            {/* Soil inside */}
            <ellipse cx="80" cy="15" rx="60" ry="8" fill="#451A03" />
            {/* Body */}
            <path d="M10,15 L30,110 Q80,130 130,110 L150,15 Z" fill="#D97706" />
            {/* Front rim lip */}
            <path d="M5,15 Q80,35 155,15 L150,25 Q80,45 10,25 Z" fill="#F59E0B" />
          </svg>

          {/* Indicators on the pot */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 pt-6 pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-200 font-black mb-0.5">{seed.scores.sun}%</span>
              <div className="w-6 h-6 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-300 text-xs shadow-inner">☀️</div>
            </div>
            <div className="flex flex-col items-center translate-y-3">
              <span className="text-[10px] text-emerald-200 font-black mb-0.5">{seed.scores.earth}%</span>
              <div className="w-6 h-6 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-300 text-xs shadow-inner">🌍</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-blue-200 font-black mb-0.5">{seed.scores.water}%</span>
              <div className="w-6 h-6 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-300 text-xs shadow-inner">💧</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal/Overlay */}
      {showInfo && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-sm w-full p-6 relative"
          >
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🌱</span> Estado de tu Idea
            </h3>
            
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">☀️</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-stone-800 text-sm">Deseable (Sol)</h4>
                      <span className="text-amber-600 font-bold">{seed.scores.sun}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${seed.scores.sun}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-stone-500 pl-11 leading-relaxed">
                  ¿La gente realmente quiere o necesita esto? Representa la claridad del problema y el público objetivo.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">🌍</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-stone-800 text-sm">Factible (Tierra)</h4>
                      <span className="text-emerald-600 font-bold">{seed.scores.earth}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${seed.scores.earth}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-stone-500 pl-11 leading-relaxed">
                  ¿Tenemos la tecnología o capacidad para hacerlo? Representa la claridad técnica y de ejecución.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">💧</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-stone-800 text-sm">Viable (Agua)</h4>
                      <span className="text-blue-600 font-bold">{seed.scores.water}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${seed.scores.water}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-stone-500 pl-11 leading-relaxed">
                  ¿Es sostenible a largo plazo? Representa el modelo de negocio, recursos, tiempo y rentabilidad.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
