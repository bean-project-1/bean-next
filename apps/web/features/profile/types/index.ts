// =======================================================
// BEAN — Profile Feature Types
// apps/web/features/profile/types/index.ts
// =======================================================
export type ProfileTab = 'identity' | 'capital' | 'wellbeing';

export interface ProfileEditPayload {
  pillar: 'identity' | 'capital' | 'wellbeing';
  field: string;
  value: unknown;
}
