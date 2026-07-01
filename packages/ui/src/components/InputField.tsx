'use client';

export function InputField({
  label, type = 'text', value, onChange, placeholder, autoFocus = false, disabled = false,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoFocus?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-500">{label}</label>
      <input
        type={type} value={value} placeholder={placeholder} autoFocus={autoFocus} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-neutral-600 outline-none transition-all focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
