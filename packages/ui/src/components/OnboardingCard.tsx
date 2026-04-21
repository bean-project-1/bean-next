'use client';

export function OnboardingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 backdrop-blur-md shadow-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {children}
    </div>
  );
}
