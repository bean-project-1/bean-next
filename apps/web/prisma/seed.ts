import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//
// ───────────────── DIMENSIONS (19 CORRECTAS) ─────────────────
//
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

async function main() {
  console.log('🌱 BEAN Seed v2 (19 dimensiones correctas)\n');

  //
  // ───────────────── 1. DIMENSIONS ─────────────────
  //
  const dimensionMap: Record<string, string> = {};

  for (let i = 0; i < DIMENSIONS.length; i++) {
    const dim = DIMENSIONS[i];
    const index = i;
    const d = await prisma.dimension.upsert({
      where: { name: dim.name },
      update: { ...dim, sortOrder: index + 1 },
      create: {
        ...dim,
        sortOrder: index + 1,
        description: dim.label,
      },
    });

    dimensionMap[dim.name] = d.id;
  }

  //
  // ───────────────── 2. USER ─────────────────
  //
  const user = await prisma.user.upsert({
    where: { email: 'daniel@bean.app' },
    update: {},
    create: {
      email: 'daniel@bean.app',
      name: 'Daniel BEAN',
    },
  });

  //
  // ───────────────── 3. USER ATTRIBUTES (ADN) ─────────────────
  //
  console.log('Creating User Attributes...');

  const attributes = [
    // Identidad
    { dimension: 'values', name: 'Libertad', category: 'value', metadata: { importance: 95 } },
    { dimension: 'values', name: 'Impacto Social', category: 'value', metadata: { importance: 90 } },
    { dimension: 'values', name: 'Autenticidad', category: 'value', metadata: { importance: 85 } },
    
    { dimension: 'personality', name: 'Introvertido', category: 'trait', metadata: { level: 70 } },
    { dimension: 'personality', name: 'Analítico', category: 'trait', metadata: { level: 90 } },
    
    { dimension: 'interests', name: 'Ciclismo', category: 'interest', metadata: { frequency: '4x/week' } },
    { dimension: 'interests', name: 'IA & Futuro', category: 'interest' },
    { dimension: 'interests', name: 'Filosofía', category: 'interest' },

    { dimension: 'purpose', name: 'Democratizar Tecnología', category: 'goal' },
    { dimension: 'purpose', name: 'Sostenibilidad', category: 'goal' },

    { dimension: 'motivations', name: 'Curiosidad', category: 'driver' },
    { dimension: 'motivations', name: 'Reconocimiento', category: 'driver' },

    // Capital
    { dimension: 'knowledge', name: 'Arquitectura de Software', category: 'expertise', metadata: { level: 'Senior' } },
    { dimension: 'knowledge', name: 'Historia Moderna', category: 'expertise' },

    { dimension: 'skills', name: 'Backend (Node.js/Go)', category: 'skill', metadata: { level: 90 } },
    { dimension: 'skills', name: 'React/Next.js', category: 'skill', metadata: { level: 85 } },
    { dimension: 'skills', name: 'Public Speaking', category: 'skill', metadata: { level: 60 } },

    { dimension: 'career', name: 'Senior Developer', category: 'role' },
    { dimension: 'career', name: 'Team Lead', category: 'aspiration' },

    { dimension: 'income', name: 'Sueldo Base', category: 'source' },
    { dimension: 'income', name: 'Inversiones', category: 'source' },

    { dimension: 'social_capital', name: 'Mentores Tech', category: 'network' },
    { dimension: 'social_capital', name: 'Comunidad Open Source', category: 'network' },

    { dimension: 'physical_health', name: 'Resistencia (Endurance)', category: 'skill', metadata: { level: 75 } },
    { dimension: 'physical_health', name: 'Buena Nutrición', category: 'habit' },

    { dimension: 'resilience', name: 'Adaptabilidad', category: 'trait' },
    { dimension: 'resilience', name: 'Gestión de Estrés', category: 'skill', metadata: { level: 80 } },

    // Experiencia
    { dimension: 'work_satisfaction', name: 'Autonomía', category: 'factor', metadata: { satisfaction: 9 } },
    { dimension: 'work_satisfaction', name: 'Reto Técnico', category: 'factor', metadata: { satisfaction: 10 } },

    { dimension: 'relationships', name: 'Familia', category: 'vital', metadata: { quality: 10 } },
    { dimension: 'relationships', name: 'Amigos Cercanos', category: 'vital' },

    { dimension: 'mental_wellbeing', name: 'Meditación', category: 'habit', metadata: { frequency: 'Daily' } },
    { dimension: 'mental_wellbeing', name: 'Lectura', category: 'habit' },

    { dimension: 'free_time', name: 'Gaming', category: 'hobby' },
    { dimension: 'free_time', name: 'Series/Cine', category: 'hobby' },

    { dimension: 'personal_growth', name: 'Escribir un Blog', category: 'project' },
    { dimension: 'personal_growth', name: 'Aprender Piano', category: 'aspiration' },

    { dimension: 'impact', name: 'Voluntariado Tech', category: 'action' },
    { dimension: 'impact', name: 'Donaciones Locales', category: 'action' },

    { dimension: 'financial_security', name: 'Fondo de Emergencia', category: 'status', metadata: { completed: true } },
    { dimension: 'financial_security', name: 'Plan de Retiro', category: 'status' },
  ];

  for (const attr of attributes) {
    await prisma.userAttribute.create({
      data: {
        userId: user.id,
        dimensionId: dimensionMap[attr.dimension],
        name: attr.name,
        category: attr.category,
        metadata: attr.metadata,
      },
    });
  }

  //
  // ───────────────── 4. DIMENSION INPUTS (EVENTOS) ─────────────────
  //
  console.log('Creating Inputs...');

  const inputs = [
    {
      dimension: 'physical_health',
      inputType: 'activity',
      valueJson: { activity: 'cycling', duration: 120 },
    },
    {
      dimension: 'career',
      inputType: 'learning',
      valueJson: { topic: 'machine learning', hours: 3 },
    },
    {
      dimension: 'mental_wellbeing',
      inputType: 'mood',
      valueJson: { mood: 'stressed', level: 60 },
    },
  ];

  for (const input of inputs) {
    await prisma.dimensionInput.create({
      data: {
        userId: user.id,
        dimensionId: dimensionMap[input.dimension],
        inputType: input.inputType,
        valueJson: input.valueJson,
      },
    });
  }

  //
  // ───────────────── 5. GOALS (RAMAS) ─────────────────
  //
  console.log('Creating Goals...');

  const goals = [
    {
      title: 'Ser Data Scientist',
      dimension: 'career',
      progress: 65,
      actions: [
        { title: 'Python Basics', isCompleted: true, impact: { career: 3 } },
        { title: 'ML Project', isCompleted: false, impact: { career: 5 } },
      ],
    },
    {
      title: 'Correr Maratón',
      dimension: 'physical_health',
      progress: 40,
      actions: [
        { title: 'Run 10km', isCompleted: true, impact: { health: 3 } },
        { title: 'Half Marathon', isCompleted: false, impact: { health: 5 } },
      ],
    },
  ];

  for (const g of goals) {
    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: g.title,
        dimensionId: dimensionMap[g.dimension],
        progress: g.progress,
      },
    });

    for (const action of g.actions) {
      await prisma.goalAction.create({
        data: {
          goalId: goal.id,
          ...action,
        },
      });
    }
  }

  //
  // ───────────────── 6. LIFE STATE (ADN MOCK) ─────────────────
  //
  console.log('Creating LifeState...');

  await prisma.lifeState.create({
    data: {
      userId: user.id,
      lifeScore: 72,
      balanceScore: 60,
      alignmentScore: 80,
      energyIndex: 65,

      insights: {
        message: 'Buen progreso en carrera, pero necesitas equilibrar bienestar',
        focus: 'balance',
      },

      scores: [
        {
          dimensionId: dimensionMap['career'],
          score: 80,
          trend: 'up',
        },
        {
          dimensionId: dimensionMap['physical_health'],
          score: 65,
          trend: 'up',
        },
        {
          dimensionId: dimensionMap['mental_wellbeing'],
          score: 55,
          trend: 'down',
        },
        {
          dimensionId: dimensionMap['work_satisfaction'],
          score: 75,
          trend: 'stable',
        },
      ],
    },
  });

  console.log('\n✅ Seed completo y consistente 🌳');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());