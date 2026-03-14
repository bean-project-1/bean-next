// =======================================================
// BEAN Design System — RadarChart Component
// packages/ui/src/components/RadarChart.tsx
// Pure SVG radar / spider chart for dimension scores
// =======================================================
import React from 'react';

export interface RadarDataPoint {
  label: string;
  value: number;   // 0–10
  maxValue?: number;
}

export interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
  className?: string;
  showLabels?: boolean;
  showGrid?: boolean;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleIndex: number,
  total: number
): { x: number; y: number } {
  const angle = (Math.PI * 2 * angleIndex) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 300,
  color = '#7c3aed',
  className = '',
  showLabels = true,
  showGrid = true,
}) => {
  if (!data || data.length < 3) return null;

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const levels = 5;
  const total = data.length;

  // Build grid level polygons
  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const r = (maxRadius / levels) * (i + 1);
    const points = Array.from({ length: total }, (_, j) => {
      const p = polarToCartesian(cx, cy, r, j, total);
      return `${p.x},${p.y}`;
    }).join(' ');
    return points;
  });

  // Build axis lines
  const axisLines = Array.from({ length: total }, (_, i) => {
    const p = polarToCartesian(cx, cy, maxRadius, i, total);
    return { x: p.x, y: p.y };
  });

  // Build data polygon
  const dataPoints = data.map((d, i) => {
    const max = d.maxValue ?? 10;
    const ratio = Math.min(d.value / max, 1);
    const p = polarToCartesian(cx, cy, maxRadius * ratio, i, total);
    return p;
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Label positions (slightly outside maxRadius)
  const labelPositions = data.map((d, i) => {
    const p = polarToCartesian(cx, cy, maxRadius + 24, i, total);
    return { ...p, label: d.label, value: d.value };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="Life dimensions radar chart"
    >
      {/* Grid polygons */}
      {showGrid &&
        gridPolygons.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

      {/* Axis lines */}
      {axisLines.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Data area */}
      <polygon
        points={dataPolygon}
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="white" strokeWidth="1.5" />
      ))}

      {/* Labels */}
      {showLabels &&
        labelPositions.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="500"
            fill="rgba(255,255,255,0.75)"
          >
            {p.label}
          </text>
        ))}
    </svg>
  );
};
