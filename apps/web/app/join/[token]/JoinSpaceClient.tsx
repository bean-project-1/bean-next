'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinSpace } from '../../../features/spaces/actions/spaces';

interface JoinSpaceClientProps {
  token: string;
  spaceName: string;
}

export function JoinSpaceClient({ token, spaceName }: JoinSpaceClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await joinSpace(token);
      if (res.success) {
        // Redirigir al inicio donde ahora verá su nuevo árbol
        router.push('/home');
      } else {
        setError(res.message || 'No se pudo aceptar la invitación.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al aceptar la invitación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}
      
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          <>
            Aceptar Invitación
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
