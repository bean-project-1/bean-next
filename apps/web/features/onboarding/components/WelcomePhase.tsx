// =======================================================
// BEAN — WelcomePhase
// apps/web/app/onboarding/_components/WelcomePhase.tsx
// =======================================================
'use client';

import { BeanLogo, InputField, OnboardingCard } from './shared';

interface Props {
  name: string;
  email: string;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onNext: () => void;
}

export function WelcomePhase({ name, email, onName, onEmail, onNext }: Props) {
  const valid = name.trim().length > 1 && email.includes('@');

  return (
    <div className="w-full max-w-lg">
      <BeanLogo />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white leading-tight">Hola, quiero conocerte.</h1>
        <p className="mt-2 text-neutral-400">
          BEAN es tu plataforma de inteligencia de vida. Empecemos por lo básico.
        </p>
      </div>

      <OnboardingCard>
        <div className="space-y-4">
          <InputField
            label="Tu nombre completo"
            value={name}
            onChange={onName}
            placeholder="Ej. Alex Rivera"
            autoFocus
          />
          <InputField
            label="Tu email"
            type="email"
            value={email}
            onChange={onEmail}
            placeholder="alex@ejemplo.com"
          />
          <button
            onClick={onNext}
            disabled={!valid}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        </div>
      </OnboardingCard>

      <p className="mt-4 text-center text-xs text-neutral-700">
        Tu información es privada y nunca se comparte.
      </p>
    </div>
  );
}
