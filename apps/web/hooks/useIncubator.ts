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
  sunFeedback?: string;
  sunQuestions?: string[];
  earth: number; // Feasibility (Factible)
  earthFeedback?: string;
  earthQuestions?: string[];
  water: number; // Viability (Viable)
  waterFeedback?: string;
  waterQuestions?: string[];
}

export interface IdeaCloud {
  id: string;
  text: string;
  x?: number;
  y?: number;
}

export interface SeedDocument {
  executiveSummary: string;
  problemAnatomy: string;
  solutionArchitecture: string;
  technicalViability: string;
  sustainability: string;
  riskMatrix: string;
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
  proposal?: SeedDocument | null;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401) return []; // Not logged in yet, return empty list instead of throwing
    throw new Error('Failed to fetch seeds');
  }
  const data = await res.json();
  return Array.isArray(data.seeds) ? data.seeds : [];
};

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
      proposal: null,
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
        sunFeedback: updates.sunFeedback ?? seed.scores.sunFeedback,
        sunQuestions: updates.sunQuestions ?? seed.scores.sunQuestions,
        earth: Math.min(100, Math.max(0, updates.earth ?? seed.scores.earth)),
        earthFeedback: updates.earthFeedback ?? seed.scores.earthFeedback,
        earthQuestions: updates.earthQuestions ?? seed.scores.earthQuestions,
        water: Math.min(100, Math.max(0, updates.water ?? seed.scores.water)),
        waterFeedback: updates.waterFeedback ?? seed.scores.waterFeedback,
        waterQuestions: updates.waterQuestions ?? seed.scores.waterQuestions,
      };
      
      const isReady = newScores.sun >= 80 && newScores.earth >= 80 && newScores.water >= 80;
      const status = isReady ? 'ready' : 'incubating';

      updateSeedDb(seedId, { scores: newScores, status });

      return currentSeeds.map(s => s.id === seedId ? { ...s, scores: newScores, status } : s);
    }, { revalidate: false });
  }, [mutate]);

  const updateDocument = useCallback((seedId: string, partialDoc: Partial<SeedDocument>) => {
    mutate((currentSeeds = []) => {
      const seed = currentSeeds.find(s => s.id === seedId);
      if (!seed) return currentSeeds;
      
      const newProposal = {
        executiveSummary: partialDoc.executiveSummary ?? seed.proposal?.executiveSummary ?? '',
        problemAnatomy: partialDoc.problemAnatomy ?? seed.proposal?.problemAnatomy ?? '',
        solutionArchitecture: partialDoc.solutionArchitecture ?? seed.proposal?.solutionArchitecture ?? '',
        technicalViability: partialDoc.technicalViability ?? seed.proposal?.technicalViability ?? '',
        sustainability: partialDoc.sustainability ?? seed.proposal?.sustainability ?? '',
        riskMatrix: partialDoc.riskMatrix ?? seed.proposal?.riskMatrix ?? ''
      };
      
      updateSeedDb(seedId, { proposal: newProposal });
      return currentSeeds.map(s => s.id === seedId ? { ...s, proposal: newProposal } : s);
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

  const evaluateSeed = useCallback(async (seedId: string, currentProposal: SeedDocument) => {
    try {
      const res = await fetch('/api/ai/incubator/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal: currentProposal })
      });
      const data = await res.json();
      if (data.success && data.scores) {
        updateScores(seedId, data.scores);
      }
    } catch (error) {
      console.error('Failed to evaluate seed', error);
    }
  }, [updateScores]);

  return {
    seeds,
    loading,
    createSeed,
    getSeed,
    addMessage,
    addCloud,
    removeCloud,
    updateScores,
    updateDocument,
    deleteSeed,
    restartChat,
    evaluateSeed
  };
}
