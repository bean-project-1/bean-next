// =======================================================
// BEAN — Onboarding Shared UI Components
// apps/web/app/onboarding/_components/shared.tsx
// =======================================================
'use client';

import { useState } from 'react';

// ── BEAN Logo ──────────────────────────────────────────
export function BeanLogo() {
  return (
    <div className="flex items-center gap-2.5 mb-10">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
        <span className="text-sm font-bold text-white">B</span>
      </div>
      <span className="text-base font-bold text-white tracking-tight">BEAN</span>
    </div>
  );
}

// ── Back button ────────────────────────────────────────
export function BackButton({ label = '← Cambiar método', onClick }: { label?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors">
      {label}
    </button>
  );
}

// ── Text input ─────────────────────────────────────────
export function InputField({
  label, type = 'text', value, onChange, placeholder, autoFocus = false,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-300">{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} autoFocus={autoFocus}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
      />
    </div>
  );
}

// ── Tag input ──────────────────────────────────────────
export function TagInput({
  tags, suggestions, onAdd, onRemove, placeholder,
}: {
  tags: string[]; suggestions: string[];
  onAdd: (t: string) => void; onRemove: (t: string) => void; placeholder: string;
}) {
  const [input, setInput] = useState('');
  const add = (v: string) => { const t = v.trim(); if (t && !tags.includes(t)) { onAdd(t); setInput(''); } };

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1.5 rounded-full bg-violet-600/25 border border-violet-500/30 px-3 py-1 text-sm text-violet-300">
              {tag}
              <button onClick={() => onRemove(tag)} className="text-violet-400/70 hover:text-white transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text" value={input} placeholder={placeholder}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); } }}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-600 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.filter(s => !tags.includes(s)).slice(0, 6).map(s => (
          <button key={s} onClick={() => add(s)}
            className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs text-neutral-400 transition-all hover:border-violet-500/40 hover:text-violet-300">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Primary CTA button ─────────────────────────────────
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

// ── Step progress bar ──────────────────────────────────
export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="mb-6 flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          i < current ? 'bg-violet-500' : i === current ? 'bg-violet-400' : 'bg-white/10'
        }`} />
      ))}
    </div>
  );
}

// ── Card wrapper ───────────────────────────────────────
export function OnboardingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md shadow-xl shadow-black/20">
      {children}
    </div>
  );
}
