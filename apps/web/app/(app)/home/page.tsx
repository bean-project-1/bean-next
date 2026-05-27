'use client';

import React, { useState } from 'react';
import DnaModal from '../../../features/life-tree/DnaModal';
import NodeSidePanel from '../../../features/life-tree/NodeSidePanel';
import { LifeTree } from '../../../features/life-tree/LifeTree';
import { LeafDetailView } from '../../../features/life-tree/LeafDetailView';
import { BranchDetailView } from '../../../features/life-tree/BranchDetailView';
import { TreeData } from '../../../features/life-tree/types';
import { useLifeTree } from '../../../hooks/useLifeTree';

export default function HomePage() {
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  
  const { treeData, loading, deleteGoal, deleteAction, updateAction, addAction, updateGoal, updateTask, refresh, error } = useLifeTree();

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
    <div className="flex h-screen bg-transparent">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 relative">
          <LifeTree 
            data={treeData}
            onLeafClick={handleLeafClick}
            onScoreClick={() => setIsDnaOpen(true)}
            onRefresh={refresh}
            activePhaseId={selectedPhaseId}
            activeLeafId={selectedAction?.id}
            onEditBranch={(b) => setSelectedBranchId(b ? b.id : null)}
            onPhaseClick={handlePhaseClick}
            onDeleteBranch={(b) => handleDeleteGoal(b.id)}
          />
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
