import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DIMENSIONS = [
  // 🌱 IDENTIDAD
  { name: 'values', label: 'Core Values', category: 'identity' },
  { name: 'personality', label: 'Personality', category: 'identity' },
  { name: 'interests', label: 'Interests', category: 'identity' },
  { name: 'purpose', label: 'Purpose', category: 'identity' },
  { name: 'motivations', label: 'Motivations', category: 'identity' },

  // 🌿 CAPITAL
  { name: 'knowledge', label: 'Knowledge', category: 'capital' },
  { name: 'skills', label: 'Skills', category: 'capital' },
  { name: 'career', label: 'Career', category: 'capital' },
  { name: 'income', label: 'Income', category: 'capital' },
  { name: 'social_capital', label: 'Social Capital', category: 'capital' },
  { name: 'physical_health', label: 'Physical Health', category: 'capital' },
  { name: 'resilience', label: 'Resilience', category: 'capital' },

  // 🌳 EXPERIENCIA
  { name: 'work_satisfaction', label: 'Work Satisfaction', category: 'experience' },
  { name: 'relationships', label: 'Relationships', category: 'experience' },
  { name: 'mental_wellbeing', label: 'Mental Wellbeing', category: 'experience' },
  { name: 'free_time', label: 'Free Time', category: 'experience' },
  { name: 'personal_growth', label: 'Personal Growth', category: 'experience' },
  { name: 'impact', label: 'Impact', category: 'experience' },
  { name: 'financial_security', label: 'Financial Security', category: 'experience' },
];

async function clearData() {
  console.log('🧹 Cleaning up existing data...');
  await prisma.task.deleteMany({});
  await prisma.goalAction.deleteMany({ where: { parentId: { not: null } } });
  await prisma.goalAction.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.userAttribute.deleteMany({});
  await prisma.dimensionInput.deleteMany({});

  await prisma.chatMessage.deleteMany({});
  await prisma.chatSession.deleteMany({});
  await prisma.suggestedPath.deleteMany({});
  await prisma.baseCommitment.deleteMany({});
  await prisma.lifeEvent.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createDimensions() {
  console.log('📐 Creating Dimensions...');
  const dimensionMap: Record<string, string> = {};
  for (let i = 0; i < DIMENSIONS.length; i++) {
    const dim = DIMENSIONS[i];
    const d = await prisma.dimension.upsert({
      where: { name: dim.name },
      update: { ...dim, sortOrder: i + 1 },
      create: { ...dim, sortOrder: i + 1, description: dim.label },
    });
    dimensionMap[dim.name] = d.id;
  }
  return dimensionMap;
}

async function seedUser(email: string, name: string, attributes: any[], goals: any[], dimensionMap: Record<string, string>, baseCommitments: any[] = [], lifeEvents: any[] = []) {
  console.log(`👤 Seeding user: ${name} (${email})`);
  const user = await prisma.user.create({
    data: { email, name }
  });

  // DNA Attributes
  for (const attr of attributes) {
    await prisma.userAttribute.create({
      data: {
        userId: user.id,
        dimensionId: dimensionMap[attr.dimension],
        name: attr.name,
        category: attr.category,
        metadata: attr.metadata || {}
      }
    });
  }

  // Base Commitments (Current)
  for (const bc of baseCommitments) {
    await prisma.baseCommitment.create({
      data: {
        userId: user.id,
        title: bc.title,
        type: bc.type,
        daysOfWeek: bc.daysOfWeek,
        hoursPerDay: bc.hoursPerDay,
        startTime: bc.startTime,
        endTime: bc.endTime,
        dimensionIds: bc.dimension ? (dimensionMap[bc.dimension] ? [dimensionMap[bc.dimension]] : []) : [],
      }
    });
  }

  // Life Events (Historical)
  for (const le of lifeEvents) {
    await prisma.lifeEvent.create({
      data: {
        userId: user.id,
        type: le.type,
        title: le.title,
        description: le.description,
        date: new Date(le.date),
        dimensionId: le.dimension ? dimensionMap[le.dimension] : null,
        impact: le.impact || {}
      }
    });
  }

  // Goals
  for (const goalData of goals) {
    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: goalData.title,
        dimensionId: dimensionMap[goalData.dimension],
        description: goalData.description,
        progress: goalData.progress || 0,
      }
    });

    if (goalData.phases) {
      for (const phaseData of goalData.phases) {
        const phase = await prisma.goalAction.create({
          data: {
            goalId: goal.id,
            type: 'phase',
            title: phaseData.title,
            isCompleted: phaseData.isCompleted || false,
          }
        });

        if (phaseData.tasks) {
          await prisma.goalAction.createMany({
            data: phaseData.tasks.map((t: any) => ({
              goalId: goal.id,
              type: 'task',
              title: t.title,
              parentId: phase.id,
              isCompleted: t.isCompleted || false,
              effort: t.effort || 1,
            }))
          });
        }
      }
    }

    if (goalData.habits) {
      await prisma.goalAction.createMany({
        data: goalData.habits.map((h: any) => ({
          goalId: goal.id,
          type: 'habit',
          title: h.title,
          frequency: h.frequency,
          consistency: h.consistency || 0,
          streak: h.streak || 0,
        }))
      });
    }
  }



  return user;
}

async function main() {
  await clearData();
  const dimensionMap = await createDimensions();

  // 1. DANIEL - The Tech Architect
  await seedUser(
    'daniel@bean.app', 
    'Daniel BEAN',
    [
      // Identity
      { dimension: 'values', name: 'Libertad', category: 'value', metadata: { importance: 95 } },
      { dimension: 'values', name: 'Innovación', category: 'value', metadata: { importance: 90 } },
      { dimension: 'personality', name: 'Analítico/Explorador', category: 'trait' },
      { dimension: 'interests', name: 'IA & Futuro', category: 'interest' },
      { dimension: 'interests', name: 'Astrofísica', category: 'interest' },
      { dimension: 'purpose', name: 'Democratizar la tecnología', category: 'mission' },
      { dimension: 'motivations', name: 'Autonomía', category: 'driver' },
      
      // Capital
      { dimension: 'knowledge', name: 'Arquitectura de Software', category: 'expertise', metadata: { level: 'Master' } },
      { dimension: 'skills', name: 'Fullstack Dev', category: 'skill', metadata: { level: 90 } },
      { dimension: 'skills', name: 'Problem Solving', category: 'skill' },
      { dimension: 'career', name: 'Product Lead', category: 'role' },
      { dimension: 'income', name: 'Ingresos Altos', category: 'financial' },
      { dimension: 'social_capital', name: 'Red de Mentores Tech', category: 'asset' },
      { dimension: 'physical_health', name: 'Entrenamiento Funcional', category: 'routine', metadata: { frequency: '3x/week' } },
      { dimension: 'resilience', name: 'Gestión de Crisis en Startups', category: 'experience' },

      // Experience
      { dimension: 'work_satisfaction', name: 'Alta Autonomía', category: 'factor' },
      { dimension: 'relationships', name: 'Círculo de Crecimiento', category: 'asset' },
      { dimension: 'mental_wellbeing', name: 'Meditación Zen', category: 'practice' },
      { dimension: 'free_time', name: 'Hacking Ético / Side Projects', category: 'activity' },
      { dimension: 'personal_growth', name: 'Aprendizaje Continuo', category: 'value' },
      { dimension: 'impact', name: 'Contribución a Open Source', category: 'achievement' },
      { dimension: 'financial_security', name: 'Inversiones Diversificadas', category: 'asset' },
    ],
    [
      {
        title: 'Ser Data Scientist',
        dimension: 'career',
        description: 'Expertise en análisis de datos.',
        progress: 30,
        phases: [
          { title: 'Fundamentos Python', isCompleted: true, tasks: [{ title: 'Curso Pandas', isCompleted: true }] }
        ]
      }
    ],
    dimensionMap,
    [
      { title: 'Trabajo (Fullstack Dev)', type: 'work', daysOfWeek: [1, 2, 3, 4, 5], hoursPerDay: 8, startTime: '09:00', endTime: '18:00', dimension: 'career' }
    ],
    [
      { type: 'job', title: 'Senior Developer en TechCorp', date: '2022-01-01', dimension: 'career', description: 'Lideré el equipo de backend.' },
      { type: 'education', title: 'MSc Computer Science', date: '2020-12-15', dimension: 'knowledge', description: 'Especialización en Sistemas Distribuidos.' }
    ]
  );

  // 2. ELENA - The Wellness Specialist
  await seedUser(
    'elena@bean.app',
    'Elena Nature',
    [
      { dimension: 'values', name: 'Sostenibilidad', category: 'value', metadata: { importance: 98 } },
      { dimension: 'values', name: 'Paz Interior', category: 'value', metadata: { importance: 92 } },
      { dimension: 'interests', name: 'Yoga & Meditación', category: 'interest', metadata: { frequency: 'Daily' } },
      { dimension: 'interests', name: 'Botánica', category: 'interest' },
      { dimension: 'physical_health', name: 'Flexibilidad', category: 'skill', metadata: { level: 85 } },
      { dimension: 'mental_wellbeing', name: 'Mindfulness', category: 'practice' },
    ],
    [
      {
        title: 'Vivir en un Hogar Residuo Cero',
        dimension: 'personal_growth',
        description: 'Eliminar el plástico y crear un santuario sostenible.',
        progress: 15,
        phases: [
          { 
            title: 'Auditoría de Residuos', 
            isCompleted: true, 
            tasks: [{ title: 'Identificar plásticos de un solo uso', isCompleted: true }] 
          },
          { 
            title: 'Sistema de Compostaje', 
            tasks: [{ title: 'Comprar vermicompostador', effort: 2 }] 
          }
        ],
        habits: [
          { title: 'Comprar a granel', frequency: { type: 'weekly', value: 1 }, consistency: 0.9 }
        ]
      }
    ],
    dimensionMap,
    [
      { title: 'Universidad (Clases)', type: 'study', daysOfWeek: [1, 2, 3, 4, 5], hoursPerDay: 4, startTime: '08:00', endTime: '12:00', dimension: 'knowledge' }
    ],
    [
      { type: 'education', title: 'Grado en Biología', date: '2020-06-15', dimension: 'knowledge', description: 'Especialización en ecosistemas.' }
    ]
  );

  // 3. MARCUS - The Hustler
  await seedUser(
    'marcus@bean.app',
    'Marcus Growth',
    [
      { dimension: 'values', name: 'Ambición', category: 'value', metadata: { importance: 95 } },
      { dimension: 'values', name: 'Eficiencia', category: 'value', metadata: { importance: 90 } },
      { dimension: 'interests', name: 'FinTech', category: 'interest' },
      { dimension: 'interests', name: 'Biohacking', category: 'interest' },
      { dimension: 'income', name: 'Trading', category: 'skill', metadata: { level: 70 } },
      { dimension: 'social_capital', name: 'Venture Capitalist Network', category: 'network' },
    ],
    [
      {
        title: 'Lanzar SaaS de Productividad con IA',
        dimension: 'career',
        description: 'Llegar a $5,000 de MRR en 6 meses.',
        progress: 40,
        phases: [
          { 
            title: 'MVP Development', 
            isCompleted: true, 
            tasks: [{ title: 'Setup landing page', isCompleted: true }] 
          },
          { 
            title: 'Beta Testing', 
            tasks: [{ title: 'Conseguir 100 usuarios beta', effort: 5 }] 
          }
        ],
        habits: [
          { title: 'Cold Outreach (10 emails/día)', frequency: { type: 'daily', value: 10 }, consistency: 0.6 }
        ]
      }
    ],
    dimensionMap
  );

  // 4. SOFIA - The Creative
  await seedUser(
    'sofia@bean.app',
    'Sofia Harmony',
    [
      { dimension: 'values', name: 'Expresión Creativa', category: 'value', metadata: { importance: 99 } },
      { dimension: 'values', name: 'Libertad de Movimiento', category: 'value', metadata: { importance: 88 } },
      { dimension: 'interests', name: 'Producción Musical', category: 'interest' },
      { dimension: 'interests', name: 'Ilustración Digital', category: 'interest' },
      { dimension: 'skills', name: 'Piano Jazz', category: 'skill', metadata: { level: 80 } },
      { dimension: 'skills', name: 'Ableton Live', category: 'skill', metadata: { level: 75 } },
    ],
    [
      {
        title: 'Publicar Álbum Lo-Fi en Spotify',
        dimension: 'personal_growth',
        description: 'Componer, mezclar y lanzar 8 tracks originales.',
        progress: 60,
        phases: [
          { 
            title: 'Composición de Melodías', 
            isCompleted: true, 
            tasks: [{ title: 'Grabar 10 demos de piano', isCompleted: true }] 
          },
          { 
            title: 'Mezcla y Masterización', 
            tasks: [{ title: 'Masterizar track principal', effort: 4 }] 
          }
        ],
        habits: [
          { title: 'Sesión de creación nocturna', frequency: { type: 'daily', value: 1 }, consistency: 0.75 }
        ]
      }
    ],
    dimensionMap
  );

  console.log('\n🚀 Multi-User Seed Completo 🌳');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());