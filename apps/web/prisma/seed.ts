// =====================================================================
// BEAN — Prisma Seed Script
// apps/web/prisma/seed.ts
//
// Seeds the 19 BEAN life dimensions into the `dimensions` table.
// Run with: npx prisma db seed
// =====================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DIMENSIONS = [
  // ── Identity (5) ────────────────────────────────────────────────────
  {
    name: 'values',
    label: 'Core Values',
    category: 'identity',
    description: 'The principles and beliefs that guide your decisions and define what matters most to you.',
    sortOrder: 1,
  },
  {
    name: 'personality',
    label: 'Personality',
    category: 'identity',
    description: 'Your character traits, behavioral tendencies, and how you engage with the world around you.',
    sortOrder: 2,
  },
  {
    name: 'interests',
    label: 'Interests',
    category: 'identity',
    description: 'Activities, topics, and domains that naturally energize and captivate your attention.',
    sortOrder: 3,
  },
  {
    name: 'purpose',
    label: 'Purpose',
    category: 'identity',
    description: 'Your sense of meaning, long-term mission, and the impact you want to create in the world.',
    sortOrder: 4,
  },
  {
    name: 'motivations',
    label: 'Motivations',
    category: 'identity',
    description: 'The internal drivers behind your daily actions, decisions, and long-term aspirations.',
    sortOrder: 5,
  },

  // ── Human Capital (7) ────────────────────────────────────────────────
  {
    name: 'knowledge',
    label: 'Knowledge',
    category: 'capital',
    description: 'Your accumulated understanding, expertise, and intellectual capital across domains.',
    sortOrder: 6,
  },
  {
    name: 'skills',
    label: 'Skills',
    category: 'capital',
    description: 'Practical abilities and competencies you can apply to create value.',
    sortOrder: 7,
  },
  {
    name: 'career',
    label: 'Career',
    category: 'capital',
    description: 'Your professional trajectory, reputation, positioning, and growth in your field.',
    sortOrder: 8,
  },
  {
    name: 'income',
    label: 'Income',
    category: 'capital',
    description: 'Your financial earnings relative to your needs, goals, and market potential.',
    sortOrder: 9,
  },
  {
    name: 'social_capital',
    label: 'Social Capital',
    category: 'capital',
    description: 'The value and quality of your professional network, connections, and collaborative relationships.',
    sortOrder: 10,
  },
  {
    name: 'physical_health',
    label: 'Physical Health',
    category: 'capital',
    description: "Your body's fitness level, vitality, energy, and overall physical wellness.",
    sortOrder: 11,
  },
  {
    name: 'emotional_resilience',
    label: 'Emotional Resilience',
    category: 'capital',
    description: 'Your capacity to handle stress, adapt to adversity, and recover from setbacks.',
    sortOrder: 12,
  },

  // ── Life Experience (7) ──────────────────────────────────────────────
  {
    name: 'job_satisfaction',
    label: 'Job Satisfaction',
    category: 'experience',
    description: 'How fulfilling, engaging, and meaningful your daily work feels to you.',
    sortOrder: 13,
  },
  {
    name: 'relationships',
    label: 'Relationships',
    category: 'experience',
    description: 'The quality, depth, and nourishment of your personal bonds with family and friends.',
    sortOrder: 14,
  },
  {
    name: 'mental_wellbeing',
    label: 'Mental Wellbeing',
    category: 'experience',
    description: 'Your overall psychological health, emotional clarity, and subjective happiness.',
    sortOrder: 15,
  },
  {
    name: 'free_time',
    label: 'Free Time',
    category: 'experience',
    description: 'The availability and quality of leisure, rest, and time to pursue personal interests.',
    sortOrder: 16,
  },
  {
    name: 'personal_growth',
    label: 'Personal Growth',
    category: 'experience',
    description: 'Your active progress toward becoming a better, more capable version of yourself.',
    sortOrder: 17,
  },
  {
    name: 'social_impact',
    label: 'Social Impact',
    category: 'experience',
    description: 'The positive difference you make in your community, society, and the world.',
    sortOrder: 18,
  },
  {
    name: 'financial_stability',
    label: 'Financial Stability',
    category: 'experience',
    description: 'The security, savings buffer, and long-term health of your personal finances.',
    sortOrder: 19,
  },
];

async function main() {
  console.log('🌱 Seeding BEAN dimensions...\n');

  let created = 0;
  let updated = 0;

  for (const dim of DIMENSIONS) {
    const result = await prisma.dimension.upsert({
      where: { name: dim.name },
      update: {
        label: dim.label,
        category: dim.category,
        description: dim.description,
        sortOrder: dim.sortOrder,
      },
      create: dim,
    });

    const isNew = result.createdAt.getTime() === result.createdAt.getTime(); // always true, just for tracking
    const existed = await prisma.dimension.count({ where: { name: dim.name } });
    if (existed > 0 && result.createdAt < new Date(Date.now() - 1000)) {
      updated++;
      console.log(`  ↻ Updated  [${dim.category.padEnd(10)}] ${dim.label}`);
    } else {
      created++;
      console.log(`  ✓ Created  [${dim.category.padEnd(10)}] ${dim.label}`);
    }
  }

  console.log(`\n✅ Done — ${DIMENSIONS.length} dimensions seeded.`);
  console.log(`   Identity: 5 | Capital: 7 | Experience: 7`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
