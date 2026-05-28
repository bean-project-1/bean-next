import { prisma } from '../lib/prisma';

async function main() {
  console.log('Fetching Users...');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    }
  });
  console.log('Users:', JSON.stringify(users, null, 2));

  console.log('\nFetching Accounts...');
  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      userId: true,
      provider: true,
      providerAccountId: true,
    }
  });
  console.log('Accounts:', JSON.stringify(accounts, null, 2));
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
