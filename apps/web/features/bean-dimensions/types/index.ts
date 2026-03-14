// =======================================================
// BEAN — Bean Dimensions Feature Types
// apps/web/features/bean-dimensions/types/index.ts
// =======================================================
import type { DimensionScore } from '@bean/types';

export interface PillarGroup {
  key: 'identity' | 'capital' | 'wellbeing';
  label: string;
  icon: string;
  dimensionKeys: string[];
}

export interface DimensionDetail extends DimensionScore {
  pillar: 'identity' | 'capital' | 'wellbeing';
  description: string;
  improvementTips: string[];
}

export const PILLAR_GROUPS: PillarGroup[] = [
  {
    key: 'identity',
    label: 'Identity',
    icon: '🧭',
    dimensionKeys: ['values', 'interests', 'motivations'],
  },
  {
    key: 'capital',
    label: 'Capital',
    icon: '💼',
    dimensionKeys: ['knowledge', 'skills', 'career', 'income'],
  },
  {
    key: 'wellbeing',
    label: 'Wellbeing',
    icon: '❤️',
    dimensionKeys: ['health', 'relationships', 'happiness'],
  },
];
