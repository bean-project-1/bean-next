'use client';

import React, { useState, useEffect } from 'react';
import DnaModal from '../../../features/life-tree/DnaModal';
import NodeSidePanel from '../../../features/life-tree/NodeSidePanel';
import { LifeTree } from '../../../features/life-tree/LifeTree';
import { LeafDetailView } from '../../../features/life-tree/LeafDetailView';
import { BranchDetailView } from '../../../features/life-tree/BranchDetailView';
import { TreeData } from '../../../features/life-tree/types';
import { useLifeTree } from '../../../hooks/useLifeTree';
import { SeedbedDashboard } from '../../../features/idea-incubator/SeedbedDashboard';
import { ForestCarousel } from '../../../features/forest/components/ForestCarousel';
import { getSpaces } from '../../../features/spaces/actions/spaces';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'tree' | 'incubator'>('tree');
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  
  const [spaces, setSpaces] = useState<{ id: string; name: string }[]>([{ id: 'personal', name: 'Bosque Personal' }]);
  
  useEffect(() => {
    getSpaces().then(data => {
      const formattedSpaces = data.map(s => ({ id: s.id, name: s.name }));
      setSpaces([{ id: 'personal', name: 'Bosque Personal' }, ...formattedSpaces]);
    }).catch(console.error);
  }, []);

  const { treeData, loading, deleteGoal, deleteAction, updateAction, addAction, updateGoal, updateTask, refresh, error } = useLifeTree('personal');

  const handleLeafClick = (id: string | null) => {
    if (!id) {
      setSelectedAction(null);
      return;
    }
    if (!treeData) return;
    for (const b of treeData.branches) {
      const act = b.leaves.find((a: any) => a.id === id);
      if (act) {
        setSelectedBranchId(b.id);
        if (act.parentId) {
          setSelectedPhaseId(act.parentId);
        }
        setSelectedAction(act);
        break;
      }
    }
  };

  const handlePhaseClick = (phaseId: string | null) => {
    setSelectedPhaseId(phaseId);
    if (!phaseId || !treeData) return;
    for (const b of treeData.branches) {
      const phase = b.leaves.find((a: any) => a.id === phaseId);
      if (phase) {
        setSelectedBranchId(b.id);
        break;
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const res = await deleteGoal(id);
    if (res.success) {
      setSelectedBranchId(null);
      setSelectedPhaseId(null);
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleToggleAction = async (id: string, data: { completed?: boolean; targetDate?: string; dimensions?: string[]; attributes?: string[] }) => {
    const res = await updateAction(id, { 
      isCompleted: data.completed,
      targetDate: data.targetDate,
      dimensions: data.dimensions,
      attributes: data.attributes
    });
    if (res.success) {
      if (selectedAction?.id === id) {
        setSelectedAction({ ...selectedAction, ...data });
      }
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleDeleteAction = async (id: string) => {
    const res = await deleteAction(id);
    if (res.success) {
      setSelectedAction(null);
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    if (!updateTask) return;
    const res = await updateTask(taskId, isCompleted);
    if (res.success) {
      // Update selected action tasks optimistic UI
      if (selectedAction) {
        const newTasks = selectedAction.tasks.map((t: any) => t.id === taskId ? { ...t, isCompleted } : t);
        setSelectedAction({ ...selectedAction, tasks: newTasks });
      }
    } else {
      alert('Error al actualizar la tarea: ' + res.error);
    }
  };

  if (loading && !treeData) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando tu BEAN...</span>
        </div>
      </div>
    );
  }

  if (!treeData) return null;

  return (
    <div className="flex h-screen bg-transparent flex-col relative">
      {/* View Toggle */}
      <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-[100]">
        <div className="flex bg-white/90 backdrop-blur-md p-1 rounded-full shadow-lg border border-slate-200">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              viewMode === 'tree' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            El Bosque
          </button>
          <button
            onClick={() => setViewMode('incubator')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 ${
              viewMode === 'incubator' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Semillero</span>
            <span className={`text-[9px] leading-none px-1.5 py-0.5 rounded-full uppercase tracking-widest ${viewMode === 'incubator' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Beta</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 relative">
          {viewMode === 'tree' ? (
            <ForestCarousel 
              spaces={spaces}
              onActionHooks={{
                onLeafClick: handleLeafClick,
                onScoreClick: () => setIsDnaOpen(true),
                onRefresh: refresh,
                activePhaseId: selectedPhaseId,
                activeLeafId: selectedAction?.id,
                onEditBranch: (b: any) => setSelectedBranchId(b ? b.id : null),
                onPhaseClick: handlePhaseClick,
                onDeleteBranch: (b: any) => handleDeleteGoal(b.id)
              }}
            />
          ) : (
            <SeedbedDashboard />
          )}
        </main>
      </div>

      <DnaModal isOpen={isDnaOpen} onClose={() => setIsDnaOpen(false)} />

      {(() => {
        const branch = treeData.branches.find(b => b.id === selectedBranchId);
        if (!branch) return null;
        return (
          <BranchDetailView
            branch={branch}
            zoomedPhaseId={selectedPhaseId}
            activeLeafId={selectedAction?.id}
            onPhaseSelect={setSelectedPhaseId}
            onClose={() => setSelectedBranchId(null)}
            onDelete={handleDeleteGoal}
            onUpdateGoal={async (id, data) => {
              const res = await updateGoal(id, data);
              if (!res.success) alert('Error: ' + res.error);
            }}
            onToggleAction={handleToggleAction}
            onDeleteAction={handleDeleteAction}
            onLeafClick={handleLeafClick}
            onAddAction={addAction}
          />
        );
      })()}
    </div>
  );
}
