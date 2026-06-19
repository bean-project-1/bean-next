'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';

export type SeedStatus = 'new' | 'incubating' | 'ready' | 'planted';

export interface SeedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SeedScores {
  sun: number;   // Desirability (Deseable)
  earth: number; // Feasibility (Factible)
  water: number; // Viability (Viable)
}

export interface IdeaCloud {
  id: string;
  text: string;
  x?: number;
  y?: number;
}

export interface Seed {
  id: string;
  title: string;
  description: string;
  status: SeedStatus;
  scores: SeedScores;
  createdAt: number | string | Date;
  messages: SeedMessage[];
  clouds: IdeaCloud[];
  proposal?: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json()).then(data => data.seeds);

export function useIncubator() {
  const { data: seeds = [], error, mutate } = useSWR<Seed[]>('/api/incubator/seeds', fetcher);
  const loading = !seeds && !error;

  // Sync legacy local storage on mount
  useEffect(() => {
    const syncLocal = async () => {
      const stored = localStorage.getItem('bean_seeds_v3');
      if (stored) {
        try {
          const localSeeds: Seed[] = JSON.parse(stored);
          if (localSeeds.length > 0) {
            // Upload them to the DB
            for (const s of localSeeds) {
              await fetch('/api/incubator/seeds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: s.title, description: s.description })
              });
            }
            mutate();
          }
        } catch (e) {
          console.error('Failed to sync local seeds', e);
        }
        localStorage.removeItem('bean_seeds_v3');
      }
    };
    syncLocal();
  }, [mutate]);

  const updateSeedDb = async (id: string, data: Partial<Seed>) => {
    await fetch(`/api/incubator/seeds/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  const createSeed = useCallback(async (initialIdea: string) => {
    const title = initialIdea.substring(0, 40) + (initialIdea.length > 40 ? '...' : '');
    
    // Optimistic update
    const newId = Math.random().toString(36).substring(2, 9);
    const tempSeed: Seed = {
      id: newId,
      title,
      description: initialIdea,
      status: 'new',
      scores: { sun: 10, earth: 10, water: 10 },
      createdAt: Date.now(),
      clouds: [],
      proposal: '',
      messages: [{
        id: 'msg_0',
        role: 'system',
        content: `¡Hola! Qué gran idea. Para empezar a madurarla, cuéntame: ¿Qué problema principal intentas resolver con esto?`,
        timestamp: Date.now()
      }]
    };
    mutate([tempSeed, ...seeds], { revalidate: false });

    const res = await fetch('/api/incubator/seeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: initialIdea })
    });
    const data = await res.json();
    mutate(); // Re-fetch exact DB data
    return data.seed?.id || newId;
  }, [seeds, mutate]);

  const getSeed = (id: string) => seeds.find(s => s.id === id);

  const addMessage = useCallback((seedId: string, role: 'user' | 'assistant' | 'system', content: string) => {
    const newMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role,
      content,
      timestamp: Date.now()
    };

    mutate((currentSeeds = []) => {
      const seed = currentSeeds.find(s => s.id === seedId);
      if (!seed) return currentSeeds;

      const newMessages = [...seed.messages, newMessage];
      updateSeedDb(seedId, { messages: newMessages });

      return currentSeeds.map(s => s.id === seedId ? { ...s, messages: newMessages } : s);
    }, { revalidate: false });
  }, [mutate]);

  const addCloud = useCallback((seedId: string, text: string) => {
    const newCloud = { 
      id: Math.random().toString(36).substring(2, 9), 
      text,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50
    };

    mutate((currentSeeds = []) => {
      const seed = currentSeeds.find(s => s.id === seedId);
      if (!seed) return currentSeeds;

      const newClouds = [...(seed.clouds || []), newCloud];
      updateSeedDb(seedId, { clouds: newClouds });

      return currentSeeds.map(s => s.id === seedId ? { ...s, clouds: newClouds } : s);
    }, { revalidate: false });
  }, [mutate]);

  const removeCloud = useCallback((seedId: string, cloudId: string) => {
    mutate((currentSeeds = []) => {
      const seed = currentSeeds.find(s => s.id === seedId);
      if (!seed) return currentSeeds;

      const newClouds = (seed.clouds || []).filter(c => c.id !== cloudId);
      updateSeedDb(seedId, { clouds: newClouds });

      return currentSeeds.map(s => s.id === seedId ? { ...s, clouds: newClouds } : s);
    }, { revalidate: false });
  }, [mutate]);

  const updateScores = useCallback((seedId: string, updates: Partial<SeedScores>) => {
    mutate((currentSeeds = []) => {
      const seed = currentSeeds.find(s => s.id === seedId);
      if (!seed) return currentSeeds;

      const newScores = {
        sun: Math.min(100, Math.max(0, updates.sun ?? seed.scores.sun)),
        earth: Math.min(100, Math.max(0, updates.earth ?? seed.scores.earth)),
        water: Math.min(100, Math.max(0, updates.water ?? seed.scores.water)),
      };
      
      const isReady = newScores.sun >= 80 && newScores.earth >= 80 && newScores.water >= 80;
      const status = isReady ? 'ready' : 'incubating';

      updateSeedDb(seedId, { scores: newScores, status });

      return currentSeeds.map(s => s.id === seedId ? { ...s, scores: newScores, status } : s);
    }, { revalidate: false });
  }, [mutate]);

  const updateProposal = useCallback((seedId: string, proposal: string) => {
    mutate((currentSeeds = []) => {
      updateSeedDb(seedId, { proposal });
      return currentSeeds.map(s => s.id === seedId ? { ...s, proposal } : s);
    }, { revalidate: false });
  }, [mutate]);

  const restartChat = useCallback((seedId: string) => {
    mutate((currentSeeds = []) => {
      const seed = currentSeeds.find(s => s.id === seedId);
      if (!seed) return currentSeeds;

      const hasProposal = Boolean(seed.proposal);
      const greeting = hasProposal 
        ? `¡Chat reiniciado! He revisado la propuesta actual de tu idea. ¿En qué aspecto específico quieres que trabajemos ahora para seguir mejorándola?`
        : `¡Chat reiniciado! Empecemos de nuevo. Cuéntame, ¿Qué problema principal intentas resolver con esta idea?`;

      const newMessages = [{
        id: Math.random().toString(36).substring(2, 9),
        role: 'system' as const,
        content: greeting,
        timestamp: Date.now()
      }];

      updateSeedDb(seedId, { messages: newMessages });
      return currentSeeds.map(s => s.id === seedId ? { ...s, messages: newMessages } : s);
    }, { revalidate: false });
  }, [mutate]);

  const deleteSeed = useCallback(async (seedId: string) => {
    mutate(seeds.filter(s => s.id !== seedId), { revalidate: false });
    await fetch(`/api/incubator/seeds/${seedId}`, { method: 'DELETE' });
    mutate();
  }, [seeds, mutate]);

  return {
    seeds,
    loading,
    createSeed,
    getSeed,
    addMessage,
    addCloud,
    removeCloud,
    updateScores,
    updateProposal,
    deleteSeed,
    restartChat
  };
}
