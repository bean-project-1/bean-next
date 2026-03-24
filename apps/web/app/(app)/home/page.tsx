'use client';

import React, { useState, useEffect } from 'react';
import DnaModal from '../../../features/dashboard/components/DnaModal';
import NodeSidePanel from '../../../features/dashboard/components/NodeSidePanel';
import { LifeTree } from '../../../features/dashboard/components/life-tree/LifeTree';
import { TreeData } from '../../../features/dashboard/components/life-tree/types';

export default function HomePage() {
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const res = await fetch('/api/life-tree');
        if (res.ok) {
          const data = await res.json();
          setTreeData(data);
        }
      } catch (err) {
        console.error('Failed to fetch tree data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeData();
  }, []);

  const handleLeafClick = (id: string) => {
    console.log('Leaf clicked:', id);
    // Logic to open side panel or details
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
          />
        </main>
      </div>

      <DnaModal isOpen={isDnaOpen} onClose={() => setIsDnaOpen(false)} />
      
      {selectedObjective && (
        <NodeSidePanel
          isOpen={!!selectedObjective}
          onClose={() => setSelectedObjective(null)}
          title={selectedObjective.goal}
          data={selectedObjective}
        />
      )}
    </div>
  );
}
