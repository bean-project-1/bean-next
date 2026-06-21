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
        const { user, dimensions } = json.data;
        const userAttrs = user.attributes || [];
        setAttributes(userAttrs);
        setDbDimensions(dimensions || []);
        
        // Derive 'scores' as the count of attributes per dimension for UI completeness
        if (dimensions) {
          const scoreMap: Record<string, number> = {};
          userAttrs.forEach((attr: any) => {
            if (attr.dimension?.name) {
              scoreMap[attr.dimension.name] = (scoreMap[attr.dimension.name] || 0) + 1;
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
    addAttribute,
    refresh: fetchProfile
  };
}
