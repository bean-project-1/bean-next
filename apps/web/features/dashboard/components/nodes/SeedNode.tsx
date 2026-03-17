'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';

const SeedNode = ({ data, selected }: NodeProps) => {
  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`w-20 h-20 rounded-full bg-white flex items-center justify-center border-2 ${
          selected ? 'border-green-500 shadow-lg shadow-green-100' : 'border-gray-100 shadow-sm'
        } cursor-pointer transition-all hover:border-green-300 hover:shadow-md z-10`}
      >
        <span className="text-gray-900 font-bold text-xs text-center px-1 uppercase tracking-tight">
          {data.label || 'BEAN'}
        </span>
      </motion.div>

      {/* Handles */}
      <Handle type="target" position={Position.Bottom} className="w-3 h-3 bg-amber-600 border-2 border-white" />
      <Handle type="source" position={Position.Top} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="roots" className="w-3 h-3 bg-amber-800 border-2 border-white" />
    </div>
  );
};

export default memo(SeedNode);
