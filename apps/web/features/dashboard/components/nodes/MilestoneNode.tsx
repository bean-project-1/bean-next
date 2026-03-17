'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const MilestoneNode = ({ data, selected }: NodeProps) => {
  const isCompleted = data.status === 'completed';
  const isFuture = data.status === 'future';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative px-4 py-2 rounded-full flex items-center gap-3 min-w-[160px] border transition-all ${
        isCompleted 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : isFuture 
            ? 'bg-transparent border-gray-100 text-gray-300' 
            : 'bg-white border-blue-200 text-blue-800 shadow-sm'
      } ${selected ? 'ring-1 ring-blue-400' : ''} cursor-pointer`}
    >
      <div className={isCompleted ? 'text-green-500' : isFuture ? 'text-gray-200' : 'text-blue-400'}>
        {isCompleted ? <div className="w-2 h-2 rounded-full bg-current" /> : <div className="w-2 h-2 rounded-full border border-current" />}
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-semibold tracking-tight">{data.label}</span>
      </div>

      <Handle type="target" position={Position.Bottom} className="w-2 h-2" />
      <Handle type="source" position={Position.Top} className="w-2 h-2" />
    </motion.div>
  );
};

export default memo(MilestoneNode);
