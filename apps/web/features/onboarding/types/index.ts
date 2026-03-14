// =======================================================
// BEAN — Onboarding Feature
// apps/web/features/onboarding/types/index.ts
// =======================================================
export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  isValid: (data: Partial<OnboardingFormData>) => boolean;
}

export interface OnboardingFormData {
  profession: string;
  skills: string[];
  interests: string[];
  exerciseFrequency: string;
  lifeSatisfaction: number;
  values?: string[];
  motivations?: string[];
}
