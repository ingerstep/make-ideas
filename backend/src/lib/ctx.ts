import { createPrismaClient } from './prisma'

export const creatAppContext = () => {
  const prisma = createPrismaClient()
  return {
    prisma,
    stop: async () => {
      await prisma.$disconnect()
    },
  }
}

export type AppContext = ReturnType<typeof creatAppContext>
