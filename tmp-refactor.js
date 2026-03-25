const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/dhdiazga/OneDrive - Telefonica/Documentos/Desarrollos/bean-next/apps/web/features/onboarding/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-neutral-[345]00/g, 'text-slate-500');
  content = content.replace(/text-neutral-[67]00/g, 'text-slate-400');
  
  content = content.replace(/bg-white\/[0-9]+/g, 'bg-white');
  content = content.replace(/bg-white\/\[0\.04\]/g, 'bg-white');
  
  content = content.replace(/border-white\/[0-9]+/g, 'border-slate-200');
  
  content = content.replace(/hover:text-white/g, 'hover:text-slate-900');
  content = content.replace(/hover:bg-white\/[0-9]+/g, 'hover:bg-slate-50');
  
  // Specific fix for primary buttons that use gradient
  content = content.replace(/text-sm font-semibold text-slate-900/g, 'text-sm font-semibold text-white');
  content = content.replace(/text-sm font-bold text-slate-900">B/g, 'text-sm font-bold text-white">B');

  // Specific fix for Quiz progress bar
  content = content.replace(/bg-white\/10/g, 'bg-slate-200');

  // Drop shadows
  content = content.replace(/shadow-black\/20/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Script finish');
