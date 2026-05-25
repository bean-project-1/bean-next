import { prisma } from "../lib/prisma";
import { deleteUserAccount } from "../lib/user-service";

async function main() {
  console.log("🔍 Buscando todos los usuarios...");
  const users = await prisma.user.findMany({
    select: { id: true, email: true }
  });

  if (users.length === 0) {
    console.log("ℹ️ No hay usuarios en la base de datos.");
    return;
  }

  console.log(`🗑️ Se encontraron ${users.length} usuarios. Procediendo a borrar...`);
  
  for (const user of users) {
    try {
      await deleteUserAccount(user.id);
      console.log(`✅ Usuario borrado exitosamente: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error al borrar a ${user.email}:`, error);
    }
  }
  
  console.log("🎉 Limpieza completada. Todos los usuarios han sido borrados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
