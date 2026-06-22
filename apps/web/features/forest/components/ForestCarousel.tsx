'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeTree } from '../../life-tree/LifeTree';
import { useLifeTree } from '../../../hooks/useLifeTree';
import { InviteBottomSheet } from './InviteBottomSheet';
import { generateInviteLink, createSpace } from '../../spaces/actions/spaces';

interface Space {
  id: string;
  name: string;
  theme?: string | null;
}

interface ForestCarouselProps {
  spaces: Space[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onSpaceCreated: (space: Space) => void;
  onActionHooks: any; // Pointers to the handlers (handleLeafClick, etc) from HomePage
}

export function ForestCarousel({ spaces, activeIndex, onIndexChange, onSpaceCreated, onActionHooks }: ForestCarouselProps) {
  const [inviteModalSpace, setInviteModalSpace] = useState<Space | null>(null);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCreatingSpace) return;
      if (e.key === 'ArrowLeft') {
        onIndexChange(Math.max(0, activeIndex - 1));
      } else if (e.key === 'ArrowRight') {
        onIndexChange(Math.min(spaces.length - 1, activeIndex + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spaces.length, activeIndex, isCreatingSpace, onIndexChange]);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    setIsCreating(true);
    try {
      const newSpace = await createSpace(newSpaceName.trim());
      onSpaceCreated(newSpace);
      setIsCreatingSpace(false);
      setNewSpaceName('');
    } catch (err) {
      console.error(err);
      alert('Error al crear el árbol.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onIndexChange(Math.min(spaces.length - 1, activeIndex + 1));
      } else {
        onIndexChange(Math.max(0, activeIndex - 1));
      }
    }
    setTouchStart(null);
  };

  if (spaces.length === 0) return null;

  return (
    <div 
      className="relative w-full h-full overflow-hidden perspective-[1000px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Background ambient glow based on active tree */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-900/10 to-transparent pointer-events-none" />

      {/* Trees Carousel */}
      <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
        <AnimatePresence>
          {spaces.map((space, idx) => {
            const offset = idx - activeIndex;
            const isActive = offset === 0;

            // Positioning logic
            const xOffset = offset * 250; // Distance between trees
            const zOffset = Math.abs(offset) * -200; // Push back non-active trees
            const scale = isActive ? 1 : 0.8;
            const opacity = isActive ? 1 : 0.6;
            const blur = isActive ? 0 : Math.min(Math.abs(offset) * 3, 6);

            return (
              <motion.div
                key={space.id}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 25,
                  mass: 0.8
                }}
                className={`absolute w-full max-w-[800px] h-full flex items-center justify-center origin-bottom ${
                  isActive ? 'z-10' : 'z-0'
                }`}
              >
                <div 
                  className="w-full h-full relative"
                >
                  <TreeContainer 
                    space={space} 
                    isActive={isActive} 
                    onTrunkClick={() => setInviteModalSpace(space)}
                    onActionHooks={onActionHooks}
                  />
                  {!isActive && (
                    <div 
                      className="absolute inset-0 z-50 cursor-pointer"
                      onClick={() => onIndexChange(idx)}
                    />
                  )}
                </div>

                {/* Tree Name Label (Visible only when slightly zoomed out or switching) */}
                <motion.div 
                  animate={{ opacity: isActive ? 0.1 : 1, y: isActive ? 40 : 0 }}
                  className="absolute bottom-44 sm:bottom-28 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                >
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                    {space.name}
                  </h2>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-32 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        {spaces.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onIndexChange(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex 
                ? 'w-8 h-2 bg-emerald-400 shadow-[0_0_10px_#34d399]' 
                : 'w-2 h-2 bg-slate-500/50 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      {/* Floating Create Tree Button */}
      <button 
        onClick={() => setIsCreatingSpace(true)}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-200/50 hover:bg-slate-300/80 backdrop-blur-sm border border-slate-300 text-slate-700 flex items-center justify-center transition-all shadow-sm z-50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <AnimatePresence>
        {isCreatingSpace && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-[2rem] w-full max-w-sm shadow-2xl text-white"
            >
              <h3 className="text-xl font-bold mb-2">Plantar un Nuevo Árbol</h3>
              <p className="text-sm text-slate-400 mb-6">Crea un nuevo grupo de metas compartidas (ej. "Pareja", "Startup").</p>
              
              <form onSubmit={handleCreateSpace}>
                <input 
                  autoFocus
                  type="text"
                  placeholder="Nombre del árbol..."
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 mb-6 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingSpace(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreating || !newSpaceName.trim()}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    {isCreating ? 'Creando...' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InviteBottomSheet 
        isOpen={!!inviteModalSpace} 
        onClose={() => setInviteModalSpace(null)} 
        spaceName={inviteModalSpace?.name || ''}
        onGenerateLink={async () => {
           if (!inviteModalSpace) throw new Error();
           return generateInviteLink(inviteModalSpace.id);
        }}
      />
    </div>
  );
}

// Separate component to handle individual tree data fetching
function TreeContainer({ space, isActive, onTrunkClick, onActionHooks }: { space: Space, isActive: boolean, onTrunkClick: () => void, onActionHooks: any }) {
  const { treeData, loading } = useLifeTree(space.id);

  if (loading || !treeData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-100 border-t-emerald-500 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <LifeTree 
      data={treeData} 
      onTrunkClick={isActive ? onTrunkClick : undefined}
      {...onActionHooks}
    />
  );
}
