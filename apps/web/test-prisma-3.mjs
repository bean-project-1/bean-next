import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const seed = await prisma.incubatorSeed.findFirst({
    orderBy: { updatedAt: 'desc' }
  });
  console.log("Before:", typeof seed.proposal);
  
  const updated = await prisma.incubatorSeed.update({
    where: { id: seed.id },
    data: {
      proposal: {
        executiveSummary: "test update",
        problemAnatomy: "test"
      }
    }
  });
  console.log("After:", typeof updated.proposal);
  console.log("After:", updated.proposal);
}
run();
