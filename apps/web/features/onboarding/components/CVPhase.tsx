// =======================================================
// BEAN — CVPhase (File upload)
// apps/web/app/onboarding/_components/CVPhase.tsx
// =======================================================
'use client';

import { useState, useRef } from 'react';
import { BeanLogo, BackButton, OnboardingCard } from './shared';

interface Props {
  onDone: () => void;
  onBack: () => void;
}

export function CVPhase({ onDone, onBack }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />
      <BackButton onClick={onBack} />

      <span className="text-3xl block mb-3">📄</span>
      <h1 className="text-2xl font-bold text-white mb-1">Importa tu CV</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Sube tu currículum en PDF o Word. Extraemos habilidades y experiencia automáticamente.
      </p>

      <OnboardingCard>
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-xl border-2 border-dashed py-14 flex flex-col items-center gap-3 transition-all ${
            dragging
              ? 'border-violet-500 bg-violet-600/10'
              : file
                ? 'border-violet-500/40 bg-violet-600/5'
                : 'border-white/10 hover:border-white/20'
          }`}
        >
          <input
            ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <>
              <span className="text-4xl">✅</span>
              <p className="font-medium text-white">{file.name}</p>
              <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(0)} KB · Listo para subir</p>
            </>
          ) : (
            <>
              <span className="text-4xl">📎</span>
              <p className="font-medium text-white">Arrastra tu CV aquí</p>
              <p className="text-xs text-neutral-500">PDF o DOCX · haz clic para seleccionar</p>
            </>
          )}
        </div>

        <button
          onClick={onDone}
          disabled={!file}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar → Ver mi ADN de vida →
        </button>

        <p className="mt-3 text-center text-xs text-neutral-600">
          Tu archivo no se almacena. Solo se usa para extraer datos del perfil.
        </p>
      </OnboardingCard>
    </div>
  );
}
