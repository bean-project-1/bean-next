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
  attributes?: UserAttribute[];
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
  dimensionId: string;
  score: number;           // 0.0 – 10.0
  trend: ScoreTrend;
  notes?: string;
  confidence?: number;
  dimension?: Dimension;   // Optional metadata for UI
}

// ─── Raw Inputs ───────────────────────────────────────────────────────

export interface DimensionInput {
  id: string;
  userId: string;
  dimensionId: string;
  inputType: string;       // "habit", "mood", "learning", "event"
  subType?: string;        // "frequency", "level", etc
  valueJson: unknown;      // flexible JSON payload
  source: InputSource;
  createdAt: Date;
}

// ─── User Attributes (Source of Truth) ──────────────────────────────

export interface UserAttribute {
  id: string;
  userId: string;
  dimensionId: string;
  name: string;            // "ciclismo", "familia", "backend"
  category: string;        // "value", "interest", "skill", etc
  metadata?: Record<string, unknown>;
  createdAt: Date;
  dimension?: Dimension;
}

// ─── Life State (Snapshots for Trajectory) ───────────────────────────

export interface LifeState {
  id: string;
  userId: string;
  lifeScore: number;       // 0–100 composite
  balanceScore: number;
  alignmentScore: number;
  energyIndex: number;
  timestamp: Date;
  triggeredBy?: string;
  insights?: unknown;
  scores: DimensionScore[];
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

// ─── Branch / Goal System ─────────────────────────────────────────────

export type GoalStatus = 'planning' | 'active' | 'paused' | 'completed' | 'abandoned';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * BaseCommitment: bloque de tiempo fijo y no negociable (trabajo, estudio, etc.)
 * Se descuenta SIEMPRE del tiempo disponible, salvo que el goal lo reemplace
 * explícitamente (isReplaceable = true y el BranchIntent lo menciona).
 */
export interface BaseCommitment {
  id: string;
  userId: string;
  name: string;              // "Trabajo", "Universidad"
  minutesPerDay: number;     // minutos que consume por día que aplica
  commuteMinutes?: number;   // tiempo de traslado opcional
  scheduledDays: DayOfWeek[];
  isReplaceable: boolean;    // true si un goal podría estar diseñado para reemplazarlo
}

/**
 * DayTask: tarea concreta asignada a un día específico con tiempo estimado.
 * Puede ser one-off (scheduledDate) o recurrente (recurringDays).
 */
export interface DayTask {
  id: string;
  userId: string;
  title: string;
  estimatedMinutes: number;
  scheduledDate?: Date;      // fecha específica (one-off)
  recurringDays?: DayOfWeek[];
  goalId?: string;           // rama a la que pertenece (si aplica)
}

/** Un hábito activo comprometido por el usuario, perteneciente a una rama */
export interface CommittedHabit {
  id: string;
  goalId?: string;           // rama a la que pertenece
  name: string;
  dailyMinutes: number;      // cuánto tarda hacerlo cada día que aplica
  scheduledDays: DayOfWeek[];
  isActive: boolean;
}

/**
 * GlobalSchedule: agenda global consolidada.
 * Fuente de verdad para calcular disponibilidad real del usuario antes
 * de proponer nuevos hábitos en una rama.
 */
export interface GlobalSchedule {
  userId: string;
  baseCommitments: BaseCommitment[];
  dayTasks: DayTask[];       // tareas de la semana actual / próxima
  committedHabits: CommittedHabit[];
  /** Minutos totales disponibles en el día (default: 960 = 16h despierto) */
  wakingMinutesPerDay?: number;
}

// ─── Branch Intent (output del agente conversacional) ─────────────────

/** Hábito sugerido por el agente, antes de validar disponibilidad */
export interface SuggestedHabit {
  name: string;
  dailyMinutes: number;      // estimación de cuánto tarda por sesión
  frequency: HabitFrequency;
  customDays?: DayOfWeek[];
  rationale: string;         // por qué se sugiere este hábito
}

/** Intención extraída por el BranchConversationAgent */
export interface BranchIntent {
  rawGoal: string;           // "quiero correr una maratón"
  category: DimensionCategory | 'mixed';
  targetDimensions: string[];
  urgency: 'low' | 'medium' | 'high';
  timeHorizonWeeks: number;  // cuántas semanas quiere lograr esto
  constraints?: string;      // restricciones que mencionó el usuario
  replacesCommitment?: string; // id del BaseCommitment que reemplaza (si aplica)
  suggestedHabits?: SuggestedHabit[];
}

// ─── Branch Plan (output del BranchPlannerAgent) ──────────────────────

export interface Milestone {
  weekOffset: number;        // semana relativa al inicio en que debe lograrse
  title: string;
  description: string;
}

/** Hábito con días ya asignados respetando la disponibilidad del usuario */
export interface PlannedHabit extends SuggestedHabit {
  scheduledDays: DayOfWeek[];
  timeSlotSuggestion?: string; // "mañana antes del trabajo"
}

/** Resumen de ocupación de tiempo por día de la semana */
export interface DayAvailability {
  availableMinutes: number;   // minutos totales despierto
  committedMinutes: number;   // base commitments + dayTasks + hábitos existentes
  newHabitMinutes: number;    // minutos de hábitos de la nueva rama
  remainingMinutes: number;   // lo que queda tras la nueva rama
  isOverloaded: boolean;
}

export interface ScheduleSummary {
  byDay: Partial<Record<DayOfWeek, DayAvailability>>;
  totalNewMinutesPerWeek: number;
  averageDailyAddition: number; // promedio de nuevos minutos solo en días activos
}

export interface BranchPlan {
  title: string;
  description: string;
  targetDimensions: string[];
  timeHorizonWeeks: number;
  milestones: Milestone[];
  habits: PlannedHabit[];
  scheduleSummary: ScheduleSummary;
  isSustainable: boolean;    // false si supera el tiempo disponible en algún día
  warnings: string[];        // avisos de saturación o ajustes realizados
}

// ─── Conversation State (persiste en DB) ─────────────────────────────

export type ConversationStage =
  | 'greeting'           // Inicio, presentación
  | 'exploring_goal'     // Entendiendo qué quiere lograr
  | 'clarifying_schedule' // Preguntando sobre disponibilidad (si no hay datos en DB)
  | 'clarifying_constraints' // Restricciones adicionales
  | 'confirming_intent'  // Confirmando que entendió bien el objetivo
  | 'reviewing_plan'     // Mostrando el BranchPlan generado
  | 'adjusting_plan'     // Usuario pide cambios al plan
  | 'confirmed';         // Usuario aprobó el plan → rama lista para crear

export interface ConversationMessage {
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

export interface BranchConversationState {
  id: string;
  userId: string;
  stage: ConversationStage;
  messages: ConversationMessage[];
  extractedIntent?: BranchIntent;
  currentPlan?: BranchPlan;
  scheduleWasInferred: boolean; // true si los datos de agenda se extrajeron de DB
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
