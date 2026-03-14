// =======================================================
// BEAN — Trajectory Feature Types
// apps/web/features/trajectory/types/index.ts
// =======================================================
export type TrajectoryViewMode = 'historical' | 'projected' | 'combined';

export interface TrajectoryFilter {
  startDate?: Date;
  endDate?: Date;
  dimensions?: string[];
  viewMode: TrajectoryViewMode;
}
