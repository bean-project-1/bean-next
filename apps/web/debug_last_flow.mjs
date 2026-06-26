import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  // Find "Daniel Diaz" user
  const danielDiaz = await prisma.user.findFirst({
    where: { name: { contains: 'Diaz', mode: 'insensitive' } }
  });
  
  if (danielDiaz) {
    console.log(`Found Daniel Diaz: ${danielDiaz.name} (${danielDiaz.id})`);
  }

  // Find all spaces, show all with message counts
  const spaces = await prisma.space.findMany({
    include: {
      members: { include: { user: true } },
    },
    orderBy: { updatedAt: 'desc' }
  });

  console.log('\n====== ALL SPACES ======');
  for (const s of spaces) {
    const msgCount = await prisma.spaceMessage.count({ where: { spaceId: s.id } });
    console.log(`\nSpace: "${s.name}" (${s.id}) | msgs: ${msgCount} | updated: ${s.updatedAt}`);
    for (const m of s.members) {
      console.log(`  Member: ${m.user.name} (${m.userId})`);
    }
  }

  // Find the space with the most recent messages related to "proposito" or startup
  console.log('\n====== SEARCHING FOR STARTUP/PROPOSITO SPACE ======');
  const relevantMessages = await prisma.spaceMessage.findMany({
    where: {
      content: { contains: 'startup', mode: 'insensitive' }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { space: { include: { members: { include: { user: true } } } } }
  });

  for (const msg of relevantMessages) {
    console.log(`\nSpaceID: ${msg.spaceId} | Space: "${msg.space.name}"`);
    console.log(`Members: ${msg.space.members.map(m => m.user.name).join(', ')}`);
    console.log(`Msg preview: ${msg.content.slice(0, 200)}`);
  }

  // Get the spaceId from the relevant messages
  if (relevantMessages.length > 0) {
    const targetSpaceId = relevantMessages[0].spaceId;
    
    // Last 30 messages
    const msgs = await prisma.spaceMessage.findMany({
      where: { spaceId: targetSpaceId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
    const reversed = [...msgs].reverse();
    
    console.log(`\n====== LAST ${reversed.length} MESSAGES IN STARTUP SPACE ======`);
    for (const m of reversed) {
      const preview = m.content.slice(0, 400).replace(/\n/g, ' ');
      console.log(`[${m.role.toUpperCase()}] ${preview}\n`);
    }

    // Last goal in that space
    const goal = await prisma.goal.findFirst({
      where: { spaceId: targetSpaceId },
      orderBy: { createdAt: 'desc' },
      include: {
        actions: {
          where: { parentId: null },
          include: { subActions: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (goal) {
      console.log('\n====== SAVED GOAL IN STARTUP SPACE ======');
      console.log(`Title: "${goal.title}"`);
      console.log(`Description: "${goal.description || 'EMPTY'}"`);
      console.log(`GoalActions: ${goal.actions.length}`);
      for (const a of goal.actions) {
        console.log(`  [${a.type}] "${a.title}" assigneeId: ${a.assigneeId || 'null'} | subActions: ${a.subActions.length}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
