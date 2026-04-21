'use client';

export function PrimaryButton({
  onClick, disabled = false, children, className = '',
}: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-px hover:shadow-violet-500/40 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>
  );
}
