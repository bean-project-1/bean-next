import { PrismaClient } from './generated-prisma';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = (process.env.NODE_ENV === 'development') 
  ? prismaClientSingleton() 
  : (globalThis.prisma ?? prismaClientSingleton());

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
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
