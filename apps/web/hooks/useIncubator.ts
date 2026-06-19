'use client';

import { useState, useEffect } from 'react';

export type SeedStatus = 'new' | 'incubating' | 'ready' | 'planted';

export interface SeedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SeedScores {
  sun: number;   // Desirability (Deseable)
  earth: number; // Feasibility (Factible)
  water: number; // Viability (Viable)
}

export interface Seed {
  id: string;
  title: string;
  description: string;
  status: SeedStatus;
  scores: SeedScores;
  createdAt: number;
  messages: SeedMessage[];
}

export function useIncubator() {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('bean_seeds_v2'); // changed key to reset state
    if (stored) {
      try {
        setSeeds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse seeds', e);
      }
    }
    setLoading(false);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('bean_seeds_v2', JSON.stringify(seeds));
    }
  }, [seeds, loading]);

  const createSeed = (initialIdea: string) => {
    const newSeed: Seed = {
      id: Math.random().toString(36).substring(2, 9),
      title: initialIdea.substring(0, 40) + (initialIdea.length > 40 ? '...' : ''),
      description: initialIdea,
      status: 'new',
      scores: {
        sun: 10,
        earth: 0,
        water: 0
      },
      createdAt: Date.now(),
      messages: [
        {
          id: 'msg_0',
          role: 'assistant',
          content: '¡Hola! Qué gran idea. Para empezar a madurarla, cuéntame: ¿Qué problema principal intentas resolver con esto?',
          timestamp: Date.now()
        }
      ]
    };
    setSeeds(prev => [newSeed, ...prev]);
    return newSeed.id;
  };

  const getSeed = (id: string) => seeds.find(s => s.id === id);

  const addMessage = (seedId: string, role: 'user' | 'assistant', content: string) => {
    setSeeds(prev => prev.map(seed => {
      if (seed.id === seedId) {
        return {
          ...seed,
          messages: [...seed.messages, {
            id: Math.random().toString(36).substring(2, 9),
            role,
            content,
            timestamp: Date.now()
          }]
        };
      }
      return seed;
    }));
  };

  const updateScores = (seedId: string, updates: Partial<SeedScores>) => {
    setSeeds(prev => prev.map(seed => {
      if (seed.id === seedId) {
        const newScores = {
          sun: Math.min(100, Math.max(0, updates.sun ?? seed.scores.sun)),
          earth: Math.min(100, Math.max(0, updates.earth ?? seed.scores.earth)),
          water: Math.min(100, Math.max(0, updates.water ?? seed.scores.water)),
        };
        
        const isReady = newScores.sun >= 80 && newScores.earth >= 80 && newScores.water >= 80;

        return {
          ...seed,
          scores: newScores,
          status: isReady ? 'ready' : 'incubating'
        };
      }
      return seed;
    }));
  };

  const deleteSeed = (seedId: string) => {
    setSeeds(prev => prev.filter(s => s.id !== seedId));
  };

  return {
    seeds,
    loading,
    createSeed,
    getSeed,
    addMessage,
    updateScores,
    deleteSeed
  };
}
