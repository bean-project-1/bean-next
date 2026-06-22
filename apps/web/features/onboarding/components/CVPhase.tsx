// =======================================================
// BEAN — CVPhase (File upload)
// apps/web/app/onboarding/_components/CVPhase.tsx
// =======================================================
'use client';

import { useState, useRef } from 'react';
import { BeanLogo, BackButton, OnboardingCard } from './shared';

interface Props {
  onDone: (resumeText: string, extractedData?: any) => void;
  onBack: () => void;
}

export function CVPhase({ onDone, onBack }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleContinue = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/cv/extract', {
        method: 'POST',
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract CV');

      onDone(data.rawText, data.extractedData);
    } catch (err: any) {
      console.error(err);
      setError('Hubo un problema leyendo tu archivo. Intenta subir un PDF de texto claro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />
      <BackButton onClick={onBack} />

      <span className="text-3xl block mb-3">📄</span>
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Importa tu CV</h1>
      <p className="text-sm text-stone-500 mb-6">
        Sube tu currículum en PDF. Nuestra IA extraerá tus habilidades y conocimientos para rellenar tu ADN.
      </p>

      <OnboardingCard>
        {/* Drop zone */}
        <div
          onClick={() => !loading && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={!loading ? handleDrop : undefined}
          className={`cursor-pointer rounded-xl border-2 border-dashed py-14 flex flex-col items-center gap-3 transition-all ${
            loading ? 'opacity-50 cursor-not-allowed border-stone-200' :
            dragging
              ? 'border-violet-500 bg-violet-600/10'
              : file
                ? 'border-violet-500/40 bg-violet-600/5'
                : 'border-stone-200 hover:border-stone-200'
          }`}
        >
          <input
            ref={inputRef} type="file" accept=".pdf" className="hidden"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            disabled={loading}
          />
          {file ? (
            <>
              <span className="text-4xl">✅</span>
              <p className="font-medium text-stone-900">{file.name}</p>
              <p className="text-xs text-stone-500">{(file.size / 1024).toFixed(0)} KB · Listo para procesar</p>
            </>
          ) : (
            <>
              <span className="text-4xl">📎</span>
              <p className="font-medium text-stone-900">Arrastra tu CV aquí</p>
              <p className="text-xs text-stone-500">Solamente archivos PDF · Haz clic para seleccionar</p>
            </>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

        <button
          onClick={handleContinue}
          disabled={!file || loading}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-transtone-y-px disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analizando con IA...</span>
            </>
          ) : (
            <span>Continuar → Revisar mi ADN extraído</span>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-stone-400">
          Tu archivo se analizará para autocompletar tu perfil. Podrás editarlo en los siguientes pasos.
        </p>
      </OnboardingCard>
    </div>
  );
}
