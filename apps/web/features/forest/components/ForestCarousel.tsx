'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeTree } from '../../life-tree/LifeTree';
import { useLifeTree } from '../../../hooks/useLifeTree';
import { useUIStore } from '../../../hooks/useUIStore';
import { InviteBottomSheet } from './InviteBottomSheet';
import { SpaceChat } from '../../spaces/components/SpaceChat';
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
  const [zoomedSpaceId, setZoomedSpaceId] = useState<string | null>(null);
  const setSpaceState = useUIStore(state => state.setSpaceState);

  // Sync state with UI Store
  useEffect(() => {
    const space = spaces[activeIndex];
    if (space) {
      setSpaceState(space.id, !!zoomedSpaceId);
    }
  }, [zoomedSpaceId, activeIndex, spaces, setSpaceState]);

  // Clean up on unmount
  useEffect(() => {
    return () => setSpaceState(null, false);
  }, [setSpaceState]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCreatingSpace || zoomedSpaceId) return;
      if (e.key === 'ArrowLeft') {
        onIndexChange(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        onIndexChange(activeIndex + 1);
      } else if (e.key === 'Escape' && zoomedSpaceId) {
        setZoomedSpaceId(null);
      } else if (e.key === 'Enter' && !zoomedSpaceId) {
        // Find safe active index
        const safeIndex = ((activeIndex % spaces.length) + spaces.length) % spaces.length;
        setZoomedSpaceId(spaces[safeIndex]?.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spaces, activeIndex, isCreatingSpace, zoomedSpaceId, onIndexChange]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!zoomedSpaceId) setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || zoomedSpaceId) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onIndexChange(activeIndex + 1);
      } else {
        onIndexChange(activeIndex - 1);
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

      {/* Zoom Controls (Must stay on top) */}
      <AnimatePresence>
        {zoomedSpaceId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 left-6 z-[100]"
          >
            <button
              onClick={() => setZoomedSpaceId(null)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md rounded-full shadow-lg border border-white/10 font-medium transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver al Bosque
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trees Carousel */}
      <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
        <AnimatePresence>
          {[-2, -1, 0, 1, 2].map((offset) => {
            const virtualIndex = activeIndex + offset;
            const safeIndex = ((virtualIndex % spaces.length) + spaces.length) % spaces.length;
            const space = spaces[safeIndex];
            
            if (!space) return null;

            const isActive = offset === 0;
            const isZoomed = zoomedSpaceId === space.id;
            const isOtherZoomed = zoomedSpaceId !== null && !isZoomed;

            // Positioning logic
            const xOffset = isZoomed ? 0 : offset * 250;
            const yOffset = isZoomed ? 80 : 0; // Shift down slightly when zoomed to center the tree better
            const zOffset = isZoomed ? 250 : Math.abs(offset) * -200;
            const scale = isZoomed ? 1.4 : (isActive ? 1 : 0.8);
            const opacity = isZoomed ? 1 : (isOtherZoomed ? 0 : (isActive ? 1 : 0.6));
            const blur = isZoomed ? 0 : (isOtherZoomed ? 0 : Math.min(Math.abs(offset) * 3, 6));

            return (
              <motion.div
                key={`${space.id}-${virtualIndex}`}
                layout
                initial={{ opacity: 0, x: offset > 0 ? 500 : -500 }}
                animate={{
                  x: xOffset,
                  y: yOffset,
                  z: zOffset,
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                exit={{ opacity: 0, x: offset > 0 ? 500 : -500 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 25,
                  mass: 0.8
                }}
                className={`absolute w-full max-w-[800px] h-full flex items-center justify-center origin-bottom ${
                  isActive ? 'z-10' : 'z-0'
                } ${isOtherZoomed ? 'pointer-events-none' : ''}`}
              >
                <div 
                  className={`w-full h-full relative transition-transform duration-300 ${isActive && !isZoomed ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (isActive && !isZoomed) {
                      setZoomedSpaceId(space.id);
                    } else if (!isZoomed && !isActive) {
                      onIndexChange(virtualIndex);
                    }
                  }}
                >
                  <TreeContainer 
                    space={space} 
                    isActive={isActive} 
                    isZoomed={isZoomed}
                    onTrunkClick={() => setInviteModalSpace(space)}
                    onActionHooks={onActionHooks}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Explicit Navigation Arrows */}
      <AnimatePresence>
        {!zoomedSpaceId && spaces.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => onIndexChange(activeIndex - 1)}
              className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-md rounded-full text-slate-800 shadow-sm border border-slate-900/10 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => onIndexChange(activeIndex + 1)}
              className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-md rounded-full text-slate-800 shadow-sm border border-slate-900/10 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Indicators */}
      <AnimatePresence>
        {!zoomedSpaceId && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Create Tree Button */}
      <AnimatePresence>
        {!zoomedSpaceId && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsCreatingSpace(true)}
            className="absolute right-6 top-6 w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-lg z-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

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
function TreeContainer({ space, isActive, isZoomed, onTrunkClick, onActionHooks }: { space: Space, isActive: boolean, isZoomed: boolean, onTrunkClick: () => void, onActionHooks: any }) {
  const { treeData, loading } = useLifeTree(space.id);

  if (loading || !treeData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-100 border-t-emerald-500 animate-spin opacity-50" />
      </div>
    );
  }

  // Si no está zoomed, pasamos un objeto de hooks vacío para deshabilitar clicks internos.
  // Si está zoomed, pasamos los hooks reales para que se puedan abrir modales.
  const activeHooks = isZoomed ? onActionHooks : {};

  return (
    <>
      <LifeTree 
        data={treeData} 
        onTrunkClick={isZoomed ? onTrunkClick : undefined}
        isInteractive={isZoomed}
        spaceName={space.name}
        {...activeHooks}
      />
      {isZoomed && (
        <SpaceChat 
          spaceId={space.id} 
          spaceName={space.name} 
          onRefreshTree={() => onActionHooks?.onRefresh?.()}
        />
      )}
    </>
  );
}
