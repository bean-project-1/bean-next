import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../../auth';
import { prisma } from '../../../lib/prisma';
import { JoinSpaceClient } from './JoinSpaceClient';

interface JoinPageProps {
  params: {
    token: string;
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { token } = params;

  // 1. Validar Token en BD
  const invitation = await prisma.spaceInvitation.findUnique({
    where: { token },
    include: {
      space: {
        select: {
          name: true,
          theme: true,
        }
      }
    }
  });

  const isInvalid = !invitation || invitation.status !== 'pending' || invitation.expiresAt < new Date();

  if (isInvalid) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-lg border border-stone-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Enlace inválido o expirado</h2>
          <p className="text-stone-500 mb-8">La invitación a este árbol ya no es válida. Por favor, solicita a tu compañero que te envíe un nuevo enlace.</p>
          <Link href="/home" className="inline-block bg-stone-900 text-white font-semibold py-3 px-8 rounded-full hover:bg-stone-800 transition-colors">
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  // 2. Verificar Sesión
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
        
        {/* Decorative Tree Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm rotate-3 transform">
          🌳
        </div>

        <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">¡Estás invitado!</h1>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Te han invitado a colaborar en el árbol compartido: <br/>
          <strong className="text-stone-800 text-lg">{invitation.space.name}</strong>
        </p>

        {session?.user ? (
          <JoinSpaceClient token={token} spaceName={invitation.space.name} />
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl mb-6">
              Inicia sesión o crea una cuenta para unirte.
            </p>
            <Link 
              href={`/login?callbackUrl=/join/${token}`}
              className="block w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-lg rounded-2xl transition-colors shadow-md"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register"
              className="block w-full py-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg rounded-2xl transition-colors"
            >
              Crear una cuenta nueva
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
