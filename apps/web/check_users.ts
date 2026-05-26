import { prisma } from './lib/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Users in DB (${users.length}):`);
  users.forEach(u => console.log(`- ${u.id} | ${u.email} | ${u.name}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
