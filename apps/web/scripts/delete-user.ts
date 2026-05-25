import { prisma } from "../lib/prisma";
import { deleteUserAccount } from "../lib/user-service";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Por favor proporciona el correo del usuario.");
    console.log("Uso: npx tsx scripts/delete-user.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ No se encontró ningún usuario con el correo: ${email}`);
    process.exit(1);
  }

  console.log(`🗑️  Borrando usuario: ${user.name || user.email} (${user.id})...`);
  
  try {
    await deleteUserAccount(user.id);
    console.log("✅ Usuario y todos sus datos borrados exitosamente.");
  } catch (error) {
    console.error("❌ Error al borrar el usuario:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
