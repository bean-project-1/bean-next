'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  ConnectionLineType,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import SeedNode from './nodes/SeedNode';
import RootNode from './nodes/RootNode';
import BranchNode from './nodes/BranchNode';
import MilestoneNode from './nodes/MilestoneNode';
import AchievementNode from './nodes/AchievementNode';

const nodeTypes = {
  seed: SeedNode,
  root: RootNode,
  branch: BranchNode,
  milestone: MilestoneNode,
  achievement: AchievementNode,
};

const initialNodes: Node[] = [
  // Seed
  { 
    id: 'seed', 
    type: 'seed', 
    position: { x: 400, y: 300 }, 
    data: { label: 'Your BEAN' } 
  },
  
  // Roots
  { 
    id: 'root-identity', 
    type: 'root', 
    position: { x: 250, y: 500 }, 
    data: { label: 'Identity' } 
  },
  { 
    id: 'root-capital', 
    type: 'root', 
    position: { x: 400, y: 550 }, 
    data: { label: 'Human Capital' } 
  },
  { 
    id: 'root-experience', 
    type: 'root', 
    position: { x: 550, y: 500 }, 
    data: { label: 'Life Experience' } 
  },

  // Branches
  { 
    id: 'branch-career', 
    type: 'branch', 
    position: { x: 200, y: 150 }, 
    data: { label: 'Career' } 
  },
  { 
    id: 'branch-health', 
    type: 'branch', 
    position: { x: 400, y: 100 }, 
    data: { label: 'Health' } 
  },
  { 
    id: 'branch-impact', 
    type: 'branch', 
    position: { x: 600, y: 150 }, 
    data: { label: 'Impact' } 
  },

  // Milestones
  { 
    id: 'm1', 
    type: 'milestone', 
    position: { x: 150, y: 0 }, 
    data: { label: 'Learn Python', status: 'completed', description: 'Master the basics of programming' } 
  },
  { 
    id: 'm2', 
    type: 'milestone', 
    position: { x: 150, y: -100 }, 
    data: { label: 'Study ML', status: 'completed', description: 'Understand algorithms and data' } 
  },
  { 
    id: 'm3', 
    type: 'milestone', 
    position: { x: 150, y: -200 }, 
    data: { label: 'Build Portfolio', status: 'current', description: 'Showcase your best projects' } 
  },
  { 
    id: 'm4', 
    type: 'milestone', 
    position: { x: 150, y: -300 }, 
    data: { label: 'Get Data Job', status: 'future', description: 'Land your first professional role' } 
  },

  // Achievement (Leaf)
  { 
    id: 'a1', 
    type: 'achievement', 
    position: { x: 50, y: 20 }, 
    data: { label: 'Python Certified' } 
  }
];

const initialEdges: Edge[] = [
  // Roots to Seed
  { id: 'e-identity-seed', source: 'seed', target: 'root-identity', sourceHandle: 'roots', style: { stroke: '#d1d5db', strokeWidth: 1 } },
  { id: 'e-capital-seed', source: 'seed', target: 'root-capital', sourceHandle: 'roots', style: { stroke: '#d1d5db', strokeWidth: 1 } },
  { id: 'e-experience-seed', source: 'seed', target: 'root-experience', sourceHandle: 'roots', style: { stroke: '#d1d5db', strokeWidth: 1 } },

  // Seed to Branches
  { id: 'e-seed-career', source: 'seed', target: 'branch-career', style: { stroke: '#d1d5db', strokeWidth: 1 } },
  { id: 'e-seed-health', source: 'seed', target: 'branch-health', style: { stroke: '#d1d5db', strokeWidth: 1 } },
  { id: 'e-seed-impact', source: 'seed', target: 'branch-impact', style: { stroke: '#d1d5db', strokeWidth: 1 } },

  // Branch Career to Milestones
  { id: 'e-career-m1', source: 'branch-career', target: 'm1', style: { stroke: '#e5e7eb', strokeWidth: 1 } },
  { id: 'e-m1-m2', source: 'm1', target: 'm2', style: { stroke: '#e5e7eb', strokeWidth: 1 } },
  { id: 'e-m2-m3', source: 'm2', target: 'm3', style: { stroke: '#e5e7eb', strokeWidth: 1 } },
  { id: 'e-m3-m4', source: 'm3', target: 'm4', style: { stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' } },

  // Achievement connection
  { id: 'e-m1-a1', source: 'm1', target: 'a1', type: 'smoothstep', style: { stroke: '#f3f4f6', strokeWidth: 1 } },
];

interface LifeTreeProps {
  onNodeClick: (node: Node) => void;
}

const LifeTree = ({ onNodeClick }: LifeTreeProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    onNodeClick(node);
  };

  return (
    <div className="w-full h-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background color="#f9fafb" gap={40} />
        <Controls showInteractive={false} className="bg-white border-gray-100 shadow-sm" />
        <Panel position="top-left" className="bg-white/50 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-light text-gray-900 tracking-tight">
            Life <span className="font-semibold text-green-600">Growth</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Growth Intelligence</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default LifeTree;
