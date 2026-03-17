'use client';

import React, { useState } from 'react';
import DnaModal from '../../../features/dashboard/components/DnaModal';
import NodeSidePanel from '../../../features/dashboard/components/NodeSidePanel';
import { LifeTree } from '../../../features/dashboard/components/life-tree/LifeTree';
import { TreeData } from '../../../features/dashboard/components/life-tree/types';

// Specialized Mock Data
const MOCK_TREE_DATA: TreeData = {
  growthScore: 63,
  branches: [
    {
      id: 'b1',
      goal: 'Ser Data Scientist',
      progress: 65,
      leaves: [
        { id: 'l1', name: 'Python Basics', completed: true },
        { id: 'l2', name: 'Advanced Stats', completed: true },
        { id: 'l3', name: 'ML Project', completed: false },
      ],
    },
    {
      id: 'b2',
      goal: 'Correr Maratón NYC',
      progress: 40,
      leaves: [
        { id: 'l4', name: '5k Run', completed: true },
        { id: 'l5', name: 'Training Plan', completed: true },
        { id: 'l6', name: 'Half Marathon', completed: false },
        { id: 'l7', name: 'Marathon', completed: false },
      ],
    },
    {
      id: 'b3',
      goal: 'Viajar por Japón',
      progress: 20,
      leaves: [
        { id: 'l8', name: 'Save Money', completed: true },
        { id: 'l9', name: 'Book Flights', completed: false },
      ],
    },
  ],
};

export default function HomePage() {
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);

  const handleLeafClick = (id: string) => {
    console.log('Leaf clicked:', id);
    // In a real app, this would open the leaf detail or mark as completed
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 relative">
          <LifeTree 
            data={MOCK_TREE_DATA}
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
