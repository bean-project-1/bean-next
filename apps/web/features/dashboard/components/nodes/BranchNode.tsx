'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';

const BranchNode = ({ data, selected }: NodeProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`px-5 py-2 rounded-full bg-white text-gray-800 border-2 ${
        selected ? 'border-green-500 shadow-sm' : 'border-gray-50'
      } cursor-pointer min-w-[130px] text-center transition-all hover:border-green-200`}
    >
      <Handle type="target" position={Position.Bottom} className="w-1.5 h-1.5 bg-gray-300" />
      <span className="font-bold tracking-tight text-[11px] uppercase">{data.label}</span>
      <Handle type="source" position={Position.Top} className="w-1.5 h-1.5 bg-gray-300" />
    </motion.div>
  );
};

export default memo(BranchNode);
