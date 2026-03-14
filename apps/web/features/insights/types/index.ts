// =======================================================
// BEAN — Insights Feature Types
// apps/web/features/insights/types/index.ts
// =======================================================
import type { InsightCategory } from '@bean/types';

export type InsightFilter = {
  category?: InsightCategory;
  priority?: 'low' | 'medium' | 'high';
  actionableOnly?: boolean;
};

export type InsightSortKey = 'priority' | 'generatedAt' | 'category';
