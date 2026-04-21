'use client';

import { useState } from 'react';

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
              <button onClick={() => onRemove(tag)} className="text-violet-400/70 hover:text-slate-900 transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text" value={input} placeholder={placeholder}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); } }}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-neutral-600 outline-none transition-all focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.filter(s => !tags.includes(s)).slice(0, 6).map(s => (
          <button key={s} onClick={() => add(s)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 transition-all hover:border-violet-500/40 hover:text-violet-300">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}
