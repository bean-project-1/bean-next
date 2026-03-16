// =====================================================================
// BEAN — Shared TypeScript Types (v2)
// packages/types/src/index.ts
//
// Aligned with the v2 relational database schema.
// =====================================================================

// ─── Enums / Constants ────────────────────────────────────────────────

export type DimensionCategory = 'identity' | 'capital' | 'experience';
export type ScoreTrend = 'up' | 'down' | 'stable';
export type LifeEventImpact = 'positive' | 'negative' | 'neutral';
export type InputSource = 'manual' | 'questionnaire' | 'integration';

// ─── Core Entities ────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BeanProfile {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  dimensionScores?: DimensionScore[];
}

// ─── Dimensions ───────────────────────────────────────────────────────

export interface Dimension {
  id: string;
  name: string;            // slug: "values", "skills", "income" …
  label: string;           // display: "Core Values", "Skills" …
  category: DimensionCategory;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DimensionScore {
  id: string;
  profileId: string;
  dimensionId: string;
  score: number;           // 0.0 – 10.0
  trend: ScoreTrend;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  dimension?: Dimension;
}

// ─── Raw Inputs ───────────────────────────────────────────────────────

export interface DimensionInput {
  id: string;
  userId: string;
  inputType: string;       // "exercise_hours_per_week", "skills", …
  valueJson: unknown;      // flexible JSON payload
  source: InputSource;
  createdAt: Date;
}

// ─── Life State (Snapshots for Trajectory) ───────────────────────────

export interface LifeState {
  id: string;
  userId: string;
  lifeScore: number;       // 0–100 composite
  timestamp: Date;
  triggeredBy?: string;
  notes?: string;
  scores?: LifeStateScore[];
}

export interface LifeStateScore {
  id: string;
  lifeStateId: string;
  dimensionId: string;
  score: number;
  dimension?: Dimension;
}

// ─── Life Events ──────────────────────────────────────────────────────

export interface LifeEvent {
  id: string;
  userId: string;
  type: string;            // "new_job", "marathon", "graduation" …
  title: string;
  description?: string;
  date: Date;
  impact?: LifeEventImpact;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ─── Onboarding ───────────────────────────────────────────────────────

export interface OnboardingData {
  name: string;
  email: string;
  profession: string;
  skills: string[];
  interests: string[];
  exerciseFrequency: string;
  lifeSatisfaction: number;    // 0–10
  values?: string[];
  motivations?: string[];
}

// ─── Score Utilities ──────────────────────────────────────────────────

/** A compact view of a dimension with its current score — for display. */
export interface DimensionView {
  name: string;
  label: string;
  category: DimensionCategory;
  score: number;
  trend: ScoreTrend;
  description?: string;
}

/** Grouped view by category — used in dashboard radar/pillar cards. */
export interface PillarView {
  category: DimensionCategory;
  label: string;
  score: number;          // avg of dimensions in this category
  dimensions: DimensionView[];
}

// ─── AI / Analysis ───────────────────────────────────────────────────

export interface AnalysisRequest {
  userId: string;
  inputs?: DimensionInput[];
}

export interface AnalysisResponse {
  lifeScore: number;
  dimensionScores: DimensionView[];
  pillars: PillarView[];
  insights: Insight[];
  trajectory?: LifeTrajectory;
  generatedAt?: Date;
}

export interface Insight {
  id?: string;
  type: 'strength' | 'risk' | 'opportunity' | 'action' | 'gap';
  title: string;
  body: string;
  dimensionName?: string;
  priority?: number;
  suggestedAction?: string;
}

export interface LifeTrajectory {
  userId: string;
  points: TrajectoryPoint[];
  projectedPoints: TrajectoryPoint[];
  generatedAt: Date;
}

export interface TrajectoryPoint {
  timestamp: Date;
  lifeScore: number;
  dimensionScores: Partial<DimensionView>[];
}

// ─── API Helpers ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
