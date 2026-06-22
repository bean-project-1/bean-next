import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const goalsWithIsSetFalse = await prisma.goal.findMany({ where: { spaceId: { isSet: false } } })
  console.log("Goals with isSet: false :", goalsWithIsSetFalse.length)
}
main()
