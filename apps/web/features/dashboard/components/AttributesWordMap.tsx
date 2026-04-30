'use client';

import React from 'react';

interface Attribute {
  id: string;
  name: string;
  category: string;
  dimensionId?: string;
  dimension?: { name: string; label: string; cat?: string };
}

interface Props {
  attributes: Attribute[];
}

export function AttributesWordMap({ attributes }: Props) {
  if (!attributes || attributes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl h-full border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm font-medium mb-3">Tu mapa de ADN está vacío</p>
        <a href="/dna" className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-xl transition-colors">
          Definir mis características →
        </a>
      </div>
    );
  }

  // Helper to pseudo-randomize sizes based on string length to make it look like a cloud
  const getSizeClass = (name: string) => {
    const v = name.length % 3;
    if (v === 0) return 'text-xs px-3 py-1.5 font-medium';
    if (v === 1) return 'text-sm px-4 py-2 font-semibold';
    return 'text-base px-5 py-2 font-bold';
  };

  // Helper to color based on attribute category
  const getColorClass = (cat: string) => {
    switch (cat) {
      case 'skill':
        return 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm shadow-blue-100/50 hover:bg-blue-100';
      case 'interest':
        return 'bg-orange-50 text-orange-700 border border-orange-100 shadow-sm shadow-orange-100/50 hover:bg-orange-100';
      case 'value':
        return 'bg-violet-50 text-violet-700 border border-violet-100 shadow-sm shadow-violet-100/50 hover:bg-violet-100';
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-100/50 hover:bg-emerald-100';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-4 h-full content-center bg-white rounded-2xl min-h-[200px]">
      {attributes.map((attr, idx) => {
        // Add a slight rotation to some tags for a more dynamic "cloud" feel
        const rotate = idx % 2 === 0 ? (idx % 3 === 0 ? '-rotate-1' : 'rotate-1') : '';
        
        return (
          <div
            key={attr.id || idx}
            className={`
              inline-flex items-center justify-center rounded-2xl transition-all duration-300 cursor-default hover:scale-105 hover:z-10
              ${getSizeClass(attr.name)}
              ${getColorClass(attr.category)}
              ${rotate}
            `}
            title={attr.dimension?.label ? `Dimensión: ${attr.dimension.label}` : ''}
          >
            {attr.name}
          </div>
        );
      })}
    </div>
  );
}
