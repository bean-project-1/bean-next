import { prisma } from './lib/prisma';

async function main() {
  const dimensions = await prisma.dimension.findMany();
  console.log('Dimensions in DB:');
  dimensions.forEach(d => console.log(`- ${d.name}`));

  const user = await prisma.user.findFirst({
    include: {
      attributes: { include: { dimension: true } },
      dimensionInputs: { include: { dimension: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (user) {
    console.log(`\nUser: ${user.email}`);
    console.log(`Attributes (${user.attributes.length}):`);
    user.attributes.forEach(a => console.log(`- [${a.dimension?.name}] ${a.name} (category: ${a.category})`));
    
    console.log(`Inputs (${user.dimensionInputs.length}):`);
    user.dimensionInputs.forEach(i => console.log(`- [${i.dimension?.name}] ${JSON.stringify(i.valueJson)} (type: ${i.inputType})`));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
