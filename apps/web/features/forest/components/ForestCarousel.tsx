'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeTree } from '../../life-tree/LifeTree';
import { useLifeTree } from '../../../hooks/useLifeTree';
import { InviteBottomSheet } from './InviteBottomSheet';
import { generateInviteLink } from '../../spaces/actions/spaces';

interface Space {
  id: string;
  name: string;
  theme?: string | null;
}

interface ForestCarouselProps {
  spaces: Space[];
  onActionHooks: any; // Pointers to the handlers (handleLeafClick, etc) from HomePage
}

export function ForestCarousel({ spaces, onActionHooks }: ForestCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inviteModalSpace, setInviteModalSpace] = useState<Space | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(spaces.length - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spaces.length]);

  if (spaces.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden perspective-[1000px]">
      
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
                  isActive ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
                }`}
              >
                <div 
                  className="w-full h-full"
                  onClick={() => !isActive && setActiveIndex(idx)}
                >
                  <TreeContainer 
                    space={space} 
                    isActive={isActive} 
                    onTrunkClick={() => setInviteModalSpace(space)}
                    onActionHooks={onActionHooks}
                  />
                </div>

                {/* Tree Name Label (Visible only when slightly zoomed out or switching) */}
                <motion.div 
                  animate={{ opacity: isActive ? 0.3 : 1, y: isActive ? 100 : 0 }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                >
                  <h2 className="text-2xl font-black text-white uppercase tracking-widest" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                    {space.name}
                  </h2>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        {spaces.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex 
                ? 'w-8 h-2 bg-emerald-400 shadow-[0_0_10px_#34d399]' 
                : 'w-2 h-2 bg-slate-500/50 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

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
