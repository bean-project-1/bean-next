import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DIMENSIONS = [
  // Identity
  { name: 'values', label: 'Core Values', category: 'identity', sortOrder: 1, description: 'Principles and beliefs.' },
  { name: 'personality', label: 'Personality', category: 'identity', sortOrder: 2, description: 'Character traits.' },
  { name: 'interests', label: 'Interests', category: 'identity', sortOrder: 3, description: 'Captivating topics.' },
  { name: 'purpose', label: 'Purpose', category: 'identity', sortOrder: 4, description: 'Sense of meaning.' },
  { name: 'motivations', label: 'Motivations', category: 'identity', sortOrder: 5, description: 'Internal drivers.' },
  // Capital
  { name: 'knowledge', label: 'Knowledge', category: 'capital', sortOrder: 6, description: 'Accumulated understanding.' },
  { name: 'skills', label: 'Skills', category: 'capital', sortOrder: 7, description: 'Practical abilities.' },
  { name: 'career', label: 'Career', category: 'capital', sortOrder: 8, description: 'Professional trajectory.' },
  { name: 'income', label: 'Income', category: 'capital', sortOrder: 9, description: 'Financial earnings.' },
  { name: 'social_capital', label: 'Social Capital', category: 'capital', sortOrder: 10, description: 'Professional network.' },
  { name: 'physical_health', label: 'Physical Health', category: 'capital', sortOrder: 11, description: 'Vitality and fitness.' },
  { name: 'emotional_resilience', label: 'Emotional Resilience', category: 'capital', sortOrder: 12, description: 'Stress handling.' },
  // Experience
  { name: 'job_satisfaction', label: 'Job Satisfaction', category: 'experience', sortOrder: 13, description: 'Work fulfillment.' },
  { name: 'relationships', label: 'Relationships', category: 'experience', sortOrder: 14, description: 'Social nourishing.' },
  { name: 'mental_wellbeing', label: 'Mental Wellbeing', category: 'experience', sortOrder: 15, description: 'Psychological health.' },
  { name: 'free_time', label: 'Free Time', category: 'experience', sortOrder: 16, description: 'Leisure quality.' },
  { name: 'personal_growth', label: 'Personal Growth', category: 'experience', sortOrder: 17, description: 'Self evolution.' },
  { name: 'social_impact', label: 'Social Impact', category: 'experience', sortOrder: 18, description: 'Positive difference.' },
  { name: 'financial_stability', label: 'Financial Stability', category: 'experience', sortOrder: 19, description: 'Financial security.' },
];

async function main() {
  console.log('🌱 Seeding MongoDB BEAN data...\n');

  // 1. Seed Dimensions
  console.log('Creating Dimensions...');
  const dimensionMap: Record<string, string> = {};
  for (const dim of DIMENSIONS) {
    const d = await prisma.dimension.upsert({
      where: { name: dim.name },
      update: dim,
      create: dim,
    });
    dimensionMap[dim.name] = d.id;
  }

  // 2. Create Global Seed User
  console.log('Creating Test User...');
  const user = await prisma.user.upsert({
    where: { email: 'daniel@bean.app' },
    update: {},
    create: {
      email: 'daniel@bean.app',
      name: 'Daniel BEAN',
      avatarUrl: 'https://github.com/daniel.png',
    },
  });

  // 3. Create initial DimensionInputs (Evidence)
  console.log('Creating Evidence (Inputs)...');
  const inputs = [
    { inputType: 'coding_years', valueJson: { years: 10 }, source: 'manual' },
    { inputType: 'running_distance', valueJson: { km: 42.195, event: 'Marathon' }, source: 'manual' },
    { inputType: 'values_list', valueJson: { items: ['Freedom', 'Creativity', 'Impact'] }, source: 'manual' },
  ];

  for (const input of inputs) {
    await prisma.dimensionInput.create({
      data: {
        ...input,
        userId: user.id,
      },
    });
  }

  // 4. Create initial LifeState (Scores)
  console.log('Creating Life Snapshot (LifeState)...');
  await prisma.lifeState.create({
    data: {
      userId: user.id,
      lifeScore: 78.5,
      notes: 'Initial seed state',
      triggeredBy: 'seed',
      scores: Object.keys(dimensionMap).map((name) => ({
        dimensionId: dimensionMap[name],
        score: 5 + Math.random() * 5, // Random initial scores
        trend: 'stable',
        notes: `Seed data for ${name}`,
      })),
    },
  });

  console.log('\n✅ Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
