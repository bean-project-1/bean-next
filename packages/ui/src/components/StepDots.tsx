'use client';

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="mb-6 flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          i < current ? 'bg-violet-500' : i === current ? 'bg-violet-400' : 'bg-white'
        }`} />
      ))}
    </div>
  );
}
