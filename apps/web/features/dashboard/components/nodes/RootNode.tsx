'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';

const RootNode = ({ data, selected }: NodeProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-1.5 rounded-full bg-white text-gray-600 border border-gray-100 text-xs font-medium uppercase tracking-wider ${
        selected ? 'border-amber-400 text-amber-900 shadow-sm' : ''
      } cursor-pointer min-w-[100px] text-center transition-all hover:bg-gray-50`}
    >
      <Handle type="target" position={Position.Top} className="w-1.5 h-1.5 bg-gray-200" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="w-1.5 h-1.5 bg-gray-200" />
    </motion.div>
  );
};

export default memo(RootNode);
