import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Debug check for model availability in development
if (process.env.NODE_ENV === 'development') {
  console.log('--- Prisma Model Check ---');
  const keys = Object.keys(prisma);
  console.log('Available models/keys:', keys.filter(k => !k.startsWith('_')));
  console.log('Goal:', !!(prisma as any).goal);
  console.log('GoalAction:', !!(prisma as any).goalAction);
  console.log('ChatSession:', !!(prisma as any).chatSession);
  console.log('ChatMessage:', !!(prisma as any).chatMessage);
  console.log('--------------------------');
}
