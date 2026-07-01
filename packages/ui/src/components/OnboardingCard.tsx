'use client';

export function OnboardingCard({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning={true} className="glass rounded-[2rem] p-8 border border-stone-200/50 bg-white/70 shadow-2xl backdrop-blur-xl shadow-stone-200/30">
      {children}
    </div>
  );
}
