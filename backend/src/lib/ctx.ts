import { PrismaClient } from '@prisma/client'

export const creatAppContext = () => {
  const prisma = new PrismaClient()
  return {
    prisma,
    stop: async () => {
      await prisma.$disconnect()
    },
  }
}

export type AppContext = ReturnType<typeof creatAppContext>
