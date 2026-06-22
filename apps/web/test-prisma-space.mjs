import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const goalsWithNull = await prisma.goal.findMany({ where: { spaceId: null } })
  const allGoals = await prisma.goal.findMany()
  console.log("Goals with spaceId=null:", goalsWithNull.length)
  console.log("Total goals:", allGoals.length)
}
main()
