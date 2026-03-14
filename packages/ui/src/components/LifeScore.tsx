// =======================================================
// BEAN Design System — LifeScore Component
// packages/ui/src/components/LifeScore.tsx
// Displays the overall BEAN Life Score (0–100)
// =======================================================
import React from 'react';

export interface LifeScoreProps {
  score: number;        // 0–100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

function getScoreColor(score: number): { ring: string; text: string; glow: string } {
  if (score >= 70) return { ring: '#10b981', text: '#34d399', glow: 'rgba(16,185,129,0.3)' };
  if (score >= 45) return { ring: '#f59e0b', text: '#fbbf24', glow: 'rgba(245,158,11,0.3)' };
  return { ring: '#ef4444', text: '#f87171', glow: 'rgba(239,68,68,0.3)' };
}

function getLabel(score: number): string {
  if (score >= 85) return 'Thriving';
  if (score >= 70) return 'Growing';
  if (score >= 55) return 'Developing';
  if (score >= 40) return 'Stabilizing';
  return 'Emerging';
}

const sizeConfig = {
  sm: { outer: 80, stroke: 6, fontSize: '18px', labelSize: '10px' },
  md: { outer: 140, stroke: 10, fontSize: '32px', labelSize: '13px' },
  lg: { outer: 200, stroke: 14, fontSize: '48px', labelSize: '16px' },
};

export const LifeScore: React.FC<LifeScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const { outer, stroke, fontSize, labelSize } = sizeConfig[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;
  const colors = getScoreColor(clampedScore);
  const center = outer / 2;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40"
          style={{ background: colors.glow }}
        />
        <svg width={outer} height={outer} className="relative -rotate-90">
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        {/* Score label in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold leading-none" style={{ fontSize, color: colors.text }}>
            {Math.round(clampedScore)}
          </span>
          {showLabel && (
            <span
              className="font-medium text-neutral-400 leading-tight mt-1"
              style={{ fontSize: labelSize }}
            >
              {getLabel(clampedScore)}
            </span>
          )}
        </div>
      </div>
      <span className="text-sm text-neutral-400 font-medium">Life Score</span>
    </div>
  );
};
