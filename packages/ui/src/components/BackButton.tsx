'use client';

export function BackButton({ label = '← Cambiar método', onClick }: { label?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
      {label}
    </button>
  );
}
