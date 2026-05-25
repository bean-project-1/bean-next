import { prisma } from "./prisma";

/**
 * Borra una cuenta de usuario y todos sus datos de forma segura.
 * Desvincula las auto-relaciones de GoalAction primero para evitar errores 
 * de restricciones en MongoDB (violate the required relation 'SubActions').
 */
export async function deleteUserAccount(userId: string) {
  // 1. Obtener todas las metas del usuario
  const goals = await prisma.goal.findMany({
    where: { userId },
    select: { id: true }
  });
  
  const goalIds = goals.map(g => g.id);

  if (goalIds.length > 0) {
    // 2. Desvincular todas las acciones hijas (sub-acciones)
    // Esto rompe la jerarquía temporalmente permitiendo un borrado en cascada exitoso
    await prisma.goalAction.updateMany({
      where: { goalId: { in: goalIds } },
      data: { parentId: null }
    });
  }

  // 3. Borrar el usuario (Prisma borrará las Metas y Acciones desvinculadas en cascada)
  await prisma.user.delete({
    where: { id: userId }
  });
}
