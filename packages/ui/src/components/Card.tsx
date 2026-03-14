// =======================================================
// BEAN Design System — Card Component
// packages/ui/src/components/Card.tsx
// =======================================================
import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Glassmorphism style (default: true) */
  glass?: boolean;
  /** Adds a hover lift animation */
  hoverable?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = true,
  hoverable = false,
  onClick,
  padding = 'md',
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-2xl border border-white/10',
        glass
          ? 'bg-white/5 backdrop-blur-md'
          : 'bg-neutral-900',
        hoverable
          ? 'cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10'
          : '',
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

// ---- Card sub-components ----

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`mb-4 flex items-center justify-between ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={className}>{children}</div>;
