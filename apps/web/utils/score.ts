// =======================================================
// BEAN — Score Utilities
// apps/web/utils/score.ts
// =======================================================
import type { DimensionScore } from '@bean/types';

/**
 * Calculate overall life score (0–100) from dimension scores (0–10 each).
 * Applies equal weighting across all dimensions.
 */
export function calculateLifeScore(scores: DimensionScore[]): number {
  if (scores.length === 0) return 0;
  const avg = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  return Math.round((avg / 10) * 100);
}

/**
 * Calculate pillar score (0–10) by averaging a subset of dimension scores.
 */
export function calculatePillarScore(
  scores: DimensionScore[],
  dimensionNames: string[]
): number {
  const pillarScores = scores.filter((s) => s.dimension?.name && dimensionNames.includes(s.dimension.name));
  if (pillarScores.length === 0) return 0;
  const avg = pillarScores.reduce((sum, s) => sum + s.score, 0) / pillarScores.length;
  return Math.round(avg * 10) / 10;
}

/**
 * Format a score nicely: "7.5/10" or "75/100"
 */
export function formatScore(value: number, max = 10): string {
  return `${value.toFixed(1)}/${max}`;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
