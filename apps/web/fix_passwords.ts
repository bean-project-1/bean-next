import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function setPasswords() {
  const hash = await bcrypt.hash('password123', 10);
  const result = await prisma.user.updateMany({
    data: { passwordHash: hash }
  });
  console.log(`Updated ${result.count} users with password: password123`);
}

setPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
