import os
import glob

# Mapping of light mode tailwind classes to dark/glass mode classes
replacements = {
    'bg-white': 'bg-white/5 backdrop-blur-md border border-white/10',
    'text-slate-900': 'text-white',
    'text-gray-900': 'text-white',
    'text-slate-800': 'text-neutral-100',
    'text-gray-800': 'text-neutral-100',
    'text-slate-700': 'text-neutral-200',
    'text-gray-700': 'text-neutral-200',
    'text-slate-600': 'text-neutral-300',
    'text-gray-600': 'text-neutral-300',
    'text-slate-500': 'text-neutral-400',
    'text-gray-500': 'text-neutral-400',
    'text-slate-400': 'text-neutral-500',
    'text-gray-400': 'text-neutral-500',
    'bg-slate-50': 'bg-white/5',
    'bg-gray-50': 'bg-white/5',
    'bg-slate-100': 'bg-white/10',
    'bg-gray-100': 'bg-white/10',
    'bg-slate-200': 'bg-white/20',
    'bg-gray-200': 'bg-white/20',
    'border-slate-50': 'border-white/5',
    'border-gray-50': 'border-white/5',
    'border-slate-100': 'border-white/10',
    'border-gray-100': 'border-white/10',
    'border-slate-200': 'border-white/10',
    'border-gray-200': 'border-white/10',
    'border-slate-300': 'border-white/20',
    'border-gray-300': 'border-white/20',
    'shadow-sm': 'shadow-black/50',
    'shadow-md': 'shadow-lg shadow-black/50',
    'bg-amber-50': 'bg-amber-500/10',
    'bg-emerald-50': 'bg-emerald-500/10',
    'bg-violet-50': 'bg-violet-500/10',
    'bg-indigo-50': 'bg-indigo-500/10',
    'bg-rose-50': 'bg-rose-500/10',
    'border-amber-100': 'border-amber-500/20',
    'border-amber-200': 'border-amber-500/20',
    'border-emerald-100': 'border-emerald-500/20',
    'border-emerald-200': 'border-emerald-500/20',
    'border-violet-100': 'border-violet-500/20',
    'border-violet-200': 'border-violet-500/20',
    'border-indigo-100': 'border-indigo-500/20',
    'border-indigo-200': 'border-indigo-500/20',
    'border-rose-100': 'border-rose-500/20',
    'border-rose-200': 'border-rose-500/20',
    'text-amber-800': 'text-amber-400',
    'text-amber-900': 'text-amber-300',
    'text-emerald-800': 'text-emerald-400',
    'text-emerald-900': 'text-emerald-300',
    'text-violet-800': 'text-violet-400',
    'text-violet-900': 'text-violet-300',
    'text-indigo-800': 'text-indigo-400',
    'text-indigo-900': 'text-indigo-300',
    'text-rose-800': 'text-rose-400',
    'text-rose-900': 'text-rose-300',
}

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Replace longer matches first to avoid partial replacements
    for old, new in sorted(replacements.items(), key=lambda x: len(x[0]), reverse=True):
        # Only replace if it's a whole word match (to prevent bg-white-50 being replaced by bg-white replacement)
        # Using simple replacement for now, as tailwind classes are space/quote delimited
        content = content.replace(f'"{old}"', f'"{new}"')
        content = content.replace(f"'{old}'", f"'{new}'")
        content = content.replace(f' {old} ', f' {new} ')
        content = content.replace(f' {old}"', f' {new}"')
        content = content.replace(f' {old}\'', f' {new}\'')
        content = content.replace(f'"{old} ', f'"{new} ')
        content = content.replace(f'\'{old} ', f'\'{new} ')
        content = content.replace(f'`{old} ', f'`{new} ')
        content = content.replace(f' {old}`', f' {new}`')

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

# Features directory
features_dir = '/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/**/*.tsx'
app_dir = '/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/app/**/*.tsx'

for filepath in glob.glob(features_dir, recursive=True):
    replace_in_file(filepath)

for filepath in glob.glob(app_dir, recursive=True):
    replace_in_file(filepath)

print("Done replacing.")
