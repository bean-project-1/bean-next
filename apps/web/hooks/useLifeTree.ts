import { useState, useEffect, useCallback } from 'react';
import { TreeData } from '../features/dashboard/components/life-tree/types';

export function useLifeTree() {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/life-tree');
      if (res.ok) {
        const data = await res.json();
        setTreeData(data);
        setError(null);
      } else {
        setError('Error al cargar los datos del árbol');
      }
    } catch (err) {
      console.error('Failed to fetch tree data:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGoal = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/goals/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchTree();
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

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  return {
    treeData,
    loading,
    error,
    deleteGoal,
    deleteAction,
    updateAction,
    addAction,
    refresh: fetchTree
  };
}
