import { useState, useEffect, useCallback } from 'react';
import { TreeData } from '../features/life-tree/types';

export function useLifeTree(spaceId?: string) {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    console.log(`[useLifeTree] fetchTree starting for spaceId: ${spaceId}`);
    try {
      const timestamp = Date.now();
      const url = spaceId 
        ? `/api/life-tree?spaceId=${spaceId}&t=${timestamp}` 
        : `/api/life-tree?t=${timestamp}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        console.log(`[useLifeTree] fetchTree success for spaceId: ${spaceId}. Branches count:`, data?.branches?.length);
        setTreeData(data);
        setError(null);
      } else {
        console.error(`[useLifeTree] fetchTree failed for spaceId: ${spaceId}`);
        setError('Error al cargar los datos del árbol');
      }
    } catch (err) {
      console.error('[useLifeTree] fetchTree error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [spaceId]);

  const deleteGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/goals/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        console.log(`[useLifeTree] deleteGoal success, triggering local fetch and event`);
        await fetchTree();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to delete goal:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const deleteAction = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/goals/actions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchTree();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to delete action:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const updateAction = async (id: string, data: { isCompleted?: boolean; title?: string; targetDate?: string; dimensions?: string[]; attributes?: string[] }) => {
    try {
      const res = await fetch(`/api/profile/goals/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchTree();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to update action:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const addAction = async (goalId: string, name: string, data?: { targetDate?: string; dimensions?: string[] }) => {
    try {
      const res = await fetch(`/api/profile/goals/${goalId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ...data }),
      });
      if (res.ok) {
        await fetchTree();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to add action:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const updateGoal = async (id: string, data: { goal?: string; description?: string }) => {
    try {
      const res = await fetch(`/api/profile/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchTree();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to update goal:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const updateTask = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/profile/goals/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        await fetchTree();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  const addGoal = async (data: { title: string; description?: string; purpose?: string; dimensions?: string[], spaceId?: string }) => {
    try {
      const res = await fetch(`/api/profile/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, spaceId: data.spaceId || spaceId }),
      });
      if (res.ok) {
        console.log(`[useLifeTree] addGoal success, calling local fetchTree and dispatching refresh event`);
        await fetchTree();
        if (typeof window !== 'undefined') {
          console.log(`[useLifeTree] dispatching refresh-life-tree event`);
          window.dispatchEvent(new CustomEvent('refresh-life-tree'));
        }
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (err) {
      console.error('Failed to add goal:', err);
      return { success: false, error: 'Error de red' };
    }
  };

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  useEffect(() => {
    const handleRefresh = () => {
      console.log(`[useLifeTree] event listener handleRefresh triggered for spaceId: ${spaceId}`);
      fetchTree();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('refresh-life-tree', handleRefresh);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('refresh-life-tree', handleRefresh);
      }
    };
  }, [fetchTree]);

  return {
    treeData,
    loading,
    error,
    deleteGoal,
    deleteAction,
    updateAction,
    addAction,
    updateGoal,
    addGoal,
    updateTask,
    refresh: fetchTree
  };
}
