'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const AchievementNode = ({ data, selected }: NodeProps) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`relative p-3 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 text-white border-4 ${
        selected ? 'border-white shadow-xl' : 'border-amber-200 shadow-lg'
      } cursor-pointer flex items-center justify-center`}
    >
      <Star size={24} fill="white" />
      
      {/* Tooltip-like label */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {data.label}
      </div>

      <Handle type="target" position={Position.Left} className="w-1 h-1 opacity-0" />
    </motion.div>
  );
};

export default memo(AchievementNode);
