// =======================================================
// BEAN Platform — Core TypeScript Interfaces
// packages/types/src/index.ts
// =======================================================

// ---- User ----

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Dimension Scoring ----

/** Score for any single life sub-dimension (0–10) */
export interface DimensionScore {
  key: string;       // e.g. "health", "career"
  label: string;     // Human-readable label
  value: number;     // 0–10
  trend?: 'up' | 'down' | 'stable';
  notes?: string;
}

// ---- Identity Pillar ----

export interface IdentityProfile {
  values: string[];
  interests: string[];
  motivations: string[];
  personalityTraits?: string[];
}

// ---- Capital Pillar ----

export interface CapitalProfile {
  knowledge: string[];      // Areas of expertise
  skills: string[];         // Specific skills
  careerStage: string;      // e.g. "mid-level engineer"
  jobTitle?: string;
  industry?: string;
  incomeRange?: string;     // e.g. "$80k–$100k"
  educationLevel?: string;
}

// ---- Wellbeing Pillar ----

export interface WellbeingProfile {
  healthScore: number;         // 0–10
  relationshipsScore: number;  // 0–10
  happinessScore: number;      // 0–10
  stressLevel?: number;        // 0–10
  exerciseFrequency?: string;  // e.g. "3x/week"
  sleepQuality?: number;       // 0–10
}

// ---- BEAN Profile (aggregated) ----

export interface BeanProfile {
  id: string;
  userId: string;

  /** Identity pillar */
  identity: IdentityProfile;

  /** Capital pillar */
  capital: CapitalProfile;

  /** Wellbeing pillar */
  wellbeing: WellbeingProfile;

  /** Computed scores per dimension */
  dimensionScores?: DimensionScore[];

  /** Overall life score (0–100) */
  lifeScore?: number;

  createdAt: Date;
  updatedAt: Date;
}

// ---- Life Events ----

export type LifeEventType =
  | 'career_change'
  | 'relationship'
  | 'health'
  | 'financial'
  | 'education'
  | 'milestone'
  | 'crisis'
  | 'other';

export interface LifeEvent {
  id: string;
  userId: string;
  type: LifeEventType;
  title: string;
  description: string;
  date: Date;
  impact?: 'positive' | 'negative' | 'neutral';
  affectedDimensions?: string[];
  metadata?: Record<string, unknown>;
}

// ---- Life State (snapshot) ----

export interface LifeState {
  id: string;
  userId: string;
  dimensionScores: DimensionScore[];
  lifeScore: number;
  timestamp: Date;
  triggeredBy?: string; // event id or 'manual'
}

// ---- Life Trajectory ----

export interface TrajectoryPoint {
  timestamp: Date;
  lifeScore: number;
  dimensionScores: DimensionScore[];
}

export interface LifeTrajectory {
  userId: string;
  points: TrajectoryPoint[];
  projectedPoints?: TrajectoryPoint[];  // AI-simulated future
  generatedAt: Date;
}

// ---- Insights ----

export type InsightCategory = 'strength' | 'gap' | 'opportunity' | 'risk' | 'action';

export interface Insight {
  id: string;
  userId: string;
  category: InsightCategory;
  title: string;
  body: string;
  affectedDimensions: string[];
  priority: 'low' | 'medium' | 'high';
  actionable?: boolean;
  suggestedAction?: string;
  generatedAt: Date;
}

// ---- AI Analysis ----

export interface AnalysisRequest {
  userId: string;
  profile: BeanProfile;
  recentEvents?: LifeEvent[];
}

export interface AnalysisResponse {
  lifeScore: number;
  dimensionScores: DimensionScore[];
  insights: Insight[];
  trajectory?: LifeTrajectory;
  generatedAt: Date;
}

// ---- Onboarding ----

export interface OnboardingData {
  profession: string;
  skills: string[];
  interests: string[];
  exerciseFrequency: string;
  lifeSatisfaction: number;  // 0–10
  values?: string[];
  motivations?: string[];
}

// ---- API Response helpers ----

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
