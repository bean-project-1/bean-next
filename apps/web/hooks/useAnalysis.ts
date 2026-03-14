// =======================================================
// BEAN — useAnalysis Hook
// apps/web/hooks/useAnalysis.ts
// =======================================================
import { useState, useCallback } from 'react';
import type { AnalysisResponse } from '@bean/types';

interface UseAnalysisReturn {
  data: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (userId?: string) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (userId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error ?? 'Analysis failed');
      }

      setData(result.data as AnalysisResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, isLoading, error, analyze, reset };
}
