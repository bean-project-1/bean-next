// =======================================================
// BEAN AI Engine — Agent Coordinator
// services/ai-engine/agents/agentCoordinator.ts
//
// Single entry point that wires BranchConversationAgent and
// BranchPlannerAgent together. Import this from your API route.
//
// Usage:
//   import { processBranchMessage } from './agents/agentCoordinator.js';
//
//   const result = await processBranchMessage({
//     userId: 'user-123',
//     message: 'Quiero empezar a correr',
//     conversationRepo: myConversationRepo,
//     scheduleRepo: myScheduleRepo,
//   });
// =======================================================

import { processMessage } from './branchConversationAgent.js';
import { buildPlan } from './branchPlannerAgent.js';
import type {
  ConversationRepository,
  ConversationTurn,
  ScheduleRepository,
} from './branchConversationAgent.js';

// ─── Public API ───────────────────────────────────────────────────────

export interface ProcessBranchMessageInput {
  /** The authenticated user's ID */
  userId: string;
  /** The user's latest message */
  message: string;
  /** DB adapter for reading/writing BranchConversationState */
  conversationRepo: ConversationRepository;
  /** DB adapter for reading GlobalSchedule (base commitments, tasks, habits) */
  scheduleRepo: ScheduleRepository;
}

/**
 * Main orchestration function for the Branch Agent system.
 *
 * Coordinates:
 * 1. BranchConversationAgent — handles dialogue with the user
 * 2. BranchPlannerAgent — builds the time-validated BranchPlan when ready
 *
 * The two agents are decoupled:
 * - The conversation agent decides WHEN to call the planner (based on stage)
 * - The planner is injected as a function, making it easy to swap or mock
 *
 * @returns ConversationTurn with the agent reply, updated state, and optional confirmedPlan
 */
export async function processBranchMessage(
  input: ProcessBranchMessageInput
): Promise<ConversationTurn> {
  const { userId, message, conversationRepo, scheduleRepo } = input;

  return processMessage(
    userId,
    message,
    conversationRepo,
    scheduleRepo,
    buildPlan // inject the planner
  );
}

// ─── Re-exports for convenience ───────────────────────────────────────

export type { ConversationTurn, ConversationRepository, ScheduleRepository };
export { buildPlan } from './branchPlannerAgent.js';
export { buildAvailabilityMap, buildScheduleSummary, fitHabitsInSchedule } from './scheduleUtils.js';
