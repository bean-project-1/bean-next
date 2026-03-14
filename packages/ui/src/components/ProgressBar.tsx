// =======================================================
// BEAN Design System — ProgressBar Component
// packages/ui/src/components/ProgressBar.tsx
// =======================================================
import React from 'react';

export interface ProgressBarProps {
  /** Value between 0 and max */
  value: number;
  max?: number;
  /** Show numeric label */
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Color variant based on score */
  colorScheme?: 'auto' | 'violet' | 'green' | 'amber' | 'red';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

function getAutoColor(pct: number): string {
  if (pct >= 70) return 'from-emerald-500 to-green-400';
  if (pct >= 40) return 'from-amber-500 to-yellow-400';
  return 'from-red-600 to-rose-500';
}

const colorMap: Record<string, string> = {
  violet: 'from-violet-600 to-indigo-500',
  green: 'from-emerald-500 to-green-400',
  amber: 'from-amber-500 to-yellow-400',
  red: 'from-red-600 to-rose-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 10,
  showLabel = true,
  label,
  size = 'md',
  colorScheme = 'auto',
  animated = true,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const pct = (clampedValue / max) * 100;
  const gradientClass =
    colorScheme === 'auto' ? getAutoColor(pct) : colorMap[colorScheme] ?? colorMap['violet'];

  return (
    <div className={`w-full ${className}`}>
      {(label || showLabel) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-neutral-300">{label}</span>}
          {showLabel && (
            <span className="text-sm font-semibold text-white">
              {clampedValue.toFixed(1)}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-white/10 ${sizeMap[size]}`}>
        <div
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          className={[
            'h-full rounded-full bg-gradient-to-r',
            gradientClass,
            animated ? 'transition-all duration-700 ease-out' : '',
          ].join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
