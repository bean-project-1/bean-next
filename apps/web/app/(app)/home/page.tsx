'use client';

import React, { useState } from 'react';
import DnaModal from '../../../features/dashboard/components/DnaModal';
import NodeSidePanel from '../../../features/dashboard/components/NodeSidePanel';
import { LifeTree } from '../../../features/dashboard/components/life-tree/LifeTree';
import { BranchDetailView } from '../../../features/dashboard/components/life-tree/BranchDetailView';
import { LeafDetailView } from '../../../features/dashboard/components/life-tree/LeafDetailView';
import { TreeData, Branch } from '../../../features/dashboard/components/life-tree/types';
import { useLifeTree } from '../../../hooks/useLifeTree';

export default function HomePage() {
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  
  const { treeData, loading, deleteGoal, deleteAction, updateAction, addAction, error } = useLifeTree();

  const handleLeafClick = (id: string) => {
    console.log('handleLeafClick triggered for ID:', id);
    if (!treeData) return;
    for (const b of treeData.branches) {
      const act = b.leaves.find((a: any) => a.id === id);
      if (act) {
        console.log('Action found:', act.name);
        setSelectedAction(act);
        break;
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const res = await deleteGoal(id);
    if (res.success) {
      setSelectedBranchId(null);
      setSelectedObjective(null);
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

  if (loading) {
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
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 relative">
          <LifeTree 
            data={treeData}
            onLeafClick={handleLeafClick}
            onScoreClick={() => setIsDnaOpen(true)}
            onBranchClick={(b) => setSelectedBranchId(b.id)}
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
            onClose={() => setSelectedBranchId(null)}
            onDelete={handleDeleteGoal}
            onToggleAction={handleToggleAction}
            onDeleteAction={handleDeleteAction}
            onLeafClick={handleLeafClick}
            onAddAction={addAction}
          />
        );
      })()}
      
      {selectedObjective && (
        <NodeSidePanel
          node={selectedObjective}
          onClose={() => setSelectedObjective(null)}
          onDelete={handleDeleteGoal}
        />
      )}

      {selectedAction && (
        <LeafDetailView
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          onDelete={handleDeleteAction}
          onToggle={handleToggleAction}
        />
      )}
    </div>
  );
}
