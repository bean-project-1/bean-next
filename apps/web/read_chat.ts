import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const latestSession = await prisma.chatSession.findFirst({
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!latestSession) {
    console.log("No sessions found.");
    return;
  }

  console.log("=== LATEST SESSION MESSAGES ===");
  latestSession.messages.forEach((m: any) => {
    console.log(`[${m.role.toUpperCase()}]: ${m.content}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
