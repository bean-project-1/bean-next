import { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_DIMENSIONS } from '../features/onboarding/constants';

// Minimal types matching the API and shared package
interface UserAttribute {
  id: string;
  name: string;
  category: string;
  dimensionId: string;
  dimension?: { name: string; label: string };
  metadata?: Record<string, any>;
}

interface Dimension {
  id: string;
  name: string;
  label: string;
  emoji?: string;
  cat: string;
}

export function useProfile() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [attributes, setAttributes] = useState<UserAttribute[]>([]);
  const [dbDimensions, setDbDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      const json = await res.json();
      
      if (json.success && json.data) {
        const { user, latestState, dimensions } = json.data;
        setAttributes(user.attributes || []);
        setDbDimensions(dimensions || []);
        
        if (latestState?.scores && dimensions) {
          const scoreMap: Record<string, number> = {};
          latestState.scores.forEach((ds: any) => {
            const dimMetadata = dimensions.find((d: any) => d.id === ds.dimensionId);
            if (dimMetadata) {
              scoreMap[dimMetadata.name] = ds.score;
            }
          });
          setScores(scoreMap);
        }
        setError(null);
      } else {
        setError(json.error || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScores = async (newScores: Record<string, number>) => {
    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch('/api/profile/dimensions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimensionScores: Object.entries(newScores).map(([key, score]) => ({ key, score })),
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSaved(true);
        setScores(newScores);
        return { success: true };
      } else {
        const msg = result.error || 'Erro al guardar';
        setError(msg);
        return { success: false, error: msg };
      }
    } catch (err) {
      console.error('Save error:', err);
      return { success: false, error: 'Error de red' };
    } finally {
      setSaving(false);
    }
  };

  const addAttribute = async (dimensionId: string, name: string, category = 'other') => {
    try {
      const response = await fetch('/api/profile/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimensionId, name, category }),
      });
      const result = await response.json();
      if (result.success) {
        setAttributes(prev => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Add attribute error:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const pct = useMemo(() => {
    const filled = ALL_DIMENSIONS.filter(d => (scores[d.key] ?? 0) > 0).length;
    return Math.round((filled / ALL_DIMENSIONS.length) * 100);
  }, [scores]);

  const filledCount = useMemo(() => {
    return ALL_DIMENSIONS.filter(d => (scores[d.key] ?? 0) > 0).length;
  }, [scores]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    scores,
    setScores, // Allow local updates before save
    attributes,
    dbDimensions,
    loading,
    saving,
    saved,
    error,
    pct,
    filledCount,
    updateScores,
    addAttribute,
    refresh: fetchProfile
  };
}
