// =======================================================
// BEAN AI Engine — Schedule Utilities
// services/ai-engine/agents/scheduleUtils.ts
//
// Pure functions for computing time availability from a
// user's GlobalSchedule (BaseCommitments + DayTasks + CommittedHabits)
// and distributing PlannedHabits across available days.
// =======================================================

import type {
  GlobalSchedule,
  DayOfWeek,
  SuggestedHabit,
  PlannedHabit,
  DayAvailability,
  ScheduleSummary,
} from '@bean/types';

// ─── Constants ────────────────────────────────────────────────────────

export const ALL_DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/** Default total minutes in a day (24h) */
const DEFAULT_WAKING_MINUTES = 1440;

// ─── buildAvailabilityMap ─────────────────────────────────────────────

/**
 * Calculates raw available minutes per day of the week, considering:
 * 1. Base Commitments (work, study, etc.)
 * 2. Recurring DayTasks
 * 3. Active CommittedHabits from existing goals/branches
 *
 * @param schedule - The user's GlobalSchedule
 * @param excludeCommitmentId - Optional BaseCommitment ID to exclude (when goal replaces it)
 * @returns Map of DayOfWeek → available minutes before adding new habits
 */
export function buildAvailabilityMap(
  schedule: GlobalSchedule,
  excludeCommitmentId?: string
): Record<DayOfWeek, number> {
  const waking = schedule.wakingMinutesPerDay ?? DEFAULT_WAKING_MINUTES;

  // Start with full waking minutes for every day
  const committed: Record<DayOfWeek, number> = ALL_DAYS.reduce(
    (acc, day) => ({ ...acc, [day]: 0 }),
    {} as Record<DayOfWeek, number>
  );

  // 1. Subtract BaseCommitments
  for (const bc of schedule.baseCommitments) {
    if (excludeCommitmentId && bc.id === excludeCommitmentId) continue;
    const totalMins = bc.minutesPerDay + (bc.commuteMinutes || 0);
    for (const day of bc.scheduledDays) {
      committed[day] += totalMins;
    }
  }

  // 2. Subtract recurring DayTasks
  for (const task of schedule.dayTasks) {
    if (!task.recurringDays) continue;
    for (const day of task.recurringDays) {
      committed[day] += task.estimatedMinutes;
    }
  }

  // 3. Subtract active CommittedHabits
  for (const habit of schedule.committedHabits) {
    if (!habit.isActive) continue;
    for (const day of habit.scheduledDays) {
      committed[day] += habit.dailyMinutes;
    }
  }

  // Compute available = waking - committed, floored at 0
  return ALL_DAYS.reduce(
    (acc, day) => ({
      ...acc,
      [day]: Math.max(0, waking - committed[day]),
    }),
    {} as Record<DayOfWeek, number>
  );
}

// ─── fitHabitsInSchedule ──────────────────────────────────────────────

/**
 * Distributes suggested habits into concrete days based on availability.
 * Strategy:
 * 1. Sort days by descending availability
 * 2. For each habit, assign it to the N days with most free time
 * 3. If a habit can't fit any day without overloading, reduce its frequency
 * 4. Track warnings when reductions are made
 */
export function fitHabitsInSchedule(
  habits: SuggestedHabit[],
  availability: Record<DayOfWeek, number>
): { fitted: PlannedHabit[]; warnings: string[] } {
  const warnings: string[] = [];
  const remaining = { ...availability }; // mutable copy

  const fitted: PlannedHabit[] = habits.map((habit) => {
    const targetDays = targetDayCount(habit);
    const assignedDays = assignDays(habit, targetDays, remaining, warnings);

    // Deduct the habit time from remaining availability on assigned days
    for (const day of assignedDays) {
      remaining[day] -= habit.dailyMinutes;
    }

    return {
      ...habit,
      scheduledDays: assignedDays,
      timeSlotSuggestion: suggestTimeSlot(assignedDays, availability),
    };
  });

  return { fitted, warnings };
}

// ─── buildScheduleSummary ─────────────────────────────────────────────

/**
 * Builds a ScheduleSummary comparing committed time vs new habit time per day.
 */
export function buildScheduleSummary(
  schedule: GlobalSchedule,
  fittedHabits: PlannedHabit[],
  excludeCommitmentId?: string
): ScheduleSummary {
  const waking = schedule.wakingMinutesPerDay ?? DEFAULT_WAKING_MINUTES;

  // Compute total committed minutes per day (without new habits)
  const committedMap: Record<DayOfWeek, number> = ALL_DAYS.reduce(
    (acc, day) => ({ ...acc, [day]: 0 }),
    {} as Record<DayOfWeek, number>
  );

  for (const bc of schedule.baseCommitments) {
    if (excludeCommitmentId && bc.id === excludeCommitmentId) continue;
    const totalMins = bc.minutesPerDay + (bc.commuteMinutes || 0);
    for (const day of bc.scheduledDays) committedMap[day] += totalMins;
  }
  for (const task of schedule.dayTasks) {
    if (!task.recurringDays) continue;
    for (const day of task.recurringDays) committedMap[day] += task.estimatedMinutes;
  }
  for (const habit of schedule.committedHabits) {
    if (!habit.isActive) continue;
    for (const day of habit.scheduledDays) committedMap[day] += habit.dailyMinutes;
  }

  // Compute new habit minutes per day
  const newMap: Record<DayOfWeek, number> = ALL_DAYS.reduce(
    (acc, day) => ({ ...acc, [day]: 0 }),
    {} as Record<DayOfWeek, number>
  );
  for (const habit of fittedHabits) {
    for (const day of habit.scheduledDays) {
      newMap[day] += habit.dailyMinutes;
    }
  }

  // Build byDay record (only include days with activity)
  const byDay: ScheduleSummary['byDay'] = {};
  let totalNewMinutesPerWeek = 0;
  let activeDays = 0;

  for (const day of ALL_DAYS) {
    const committed = committedMap[day];
    const newMins = newMap[day];
    const available = waking - committed;
    const remaining = available - newMins;

    // Only include days that have either existing commitments or new habits
    if (committed > 0 || newMins > 0) {
      byDay[day] = {
        availableMinutes: Math.max(0, available),
        committedMinutes: committed,
        newHabitMinutes: newMins,
        remainingMinutes: remaining,
        isOverloaded: remaining < 0,
      };
    }

    if (newMins > 0) {
      totalNewMinutesPerWeek += newMins;
      activeDays++;
    }
  }

  return {
    byDay,
    totalNewMinutesPerWeek,
    averageDailyAddition: activeDays > 0 ? Math.round(totalNewMinutesPerWeek / activeDays) : 0,
  };
}

// ─── Private Helpers ──────────────────────────────────────────────────

/**
 * Returns how many days per week the habit should run based on frequency.
 */
function targetDayCount(habit: SuggestedHabit): number {
  switch (habit.frequency) {
    case 'daily':
      return 7;
    case 'weekdays':
      return 5;
    case 'weekends':
      return 2;
    case 'custom':
      return habit.customDays?.length ?? 3; // fallback to 3 days
  }
}

/**
 * Assigns a habit to the N best available days (sorted by most free time).
 * If the habit can't fit in N days, reduces N and records a warning.
 */
function assignDays(
  habit: SuggestedHabit,
  targetCount: number,
  remaining: Record<DayOfWeek, number>,
  warnings: string[]
): DayOfWeek[] {
  // For custom frequency, try to use the specified days first
  let candidateDays: DayOfWeek[];

  if (habit.frequency === 'custom' && habit.customDays && habit.customDays.length > 0) {
    candidateDays = habit.customDays;
  } else if (habit.frequency === 'weekdays') {
    candidateDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  } else if (habit.frequency === 'weekends') {
    candidateDays = ['saturday', 'sunday'];
  } else {
    candidateDays = ALL_DAYS;
  }

  // Sort by most available time first
  const sortedByAvailability = [...candidateDays].sort(
    (a, b) => remaining[b] - remaining[a]
  );

  // Pick the top N days that can actually fit the habit
  const fittingDays = sortedByAvailability.filter(
    (day) => remaining[day] >= habit.dailyMinutes
  );

  if (fittingDays.length === 0) {
    // Nothing fits at all — take the best day anyway and mark as overloaded
    warnings.push(
      `⚠️ "${habit.name}" (${habit.dailyMinutes} min) no encaja en ningún día disponible. ` +
      `Se asignó al día con más holgura. Considera reducir la duración o la frecuencia.`
    );
    const bestDay = sortedByAvailability[0];
    return bestDay ? [bestDay] : [];
  }

  if (fittingDays.length < targetCount) {
    warnings.push(
      `ℹ️ "${habit.name}" se planificó para ${fittingDays.length} días en lugar de ${targetCount} ` +
      `por disponibilidad limitada de tiempo.`
    );
    return fittingDays;
  }

  return fittingDays.slice(0, targetCount);
}

/**
 * Suggests a human-friendly time slot based on which days were assigned.
 */
function suggestTimeSlot(
  assignedDays: DayOfWeek[],
  availability: Record<DayOfWeek, number>
): string | undefined {
  if (assignedDays.length === 0) return undefined;

  const isWeekendOnly = assignedDays.every(
    (d) => d === 'saturday' || d === 'sunday'
  );
  const isWeekdayOnly = assignedDays.every(
    (d) => d !== 'saturday' && d !== 'sunday'
  );

  if (isWeekendOnly) return 'fin de semana, en cualquier momento del día';
  if (isWeekdayOnly) return 'entre semana, antes o después del trabajo';
  return 'según tu disponibilidad del día';
}

// ─── buildEmptySchedule ───────────────────────────────────────────────

/**
 * Creates an empty GlobalSchedule for a user when no DB data is available.
 * The conversation agent will fill it in through questioning.
 */
export function buildEmptySchedule(userId: string): GlobalSchedule {
  return {
    userId,
    baseCommitments: [
      {
        id: 'inferred-sleep',
        userId,
        name: 'Dormir',
        minutesPerDay: 480, // 8 hours
        scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        isReplaceable: false,
      }
    ],
    dayTasks: [],
    committedHabits: [],
    wakingMinutesPerDay: DEFAULT_WAKING_MINUTES,
  };
}
