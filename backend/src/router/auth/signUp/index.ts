import { createHash } from 'crypto'
import { env } from '../../../lib/env'
import { trpc } from '../../../lib/trpc'
import { signJWT } from '../../../utils/signJWT'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpc.procedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUser = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (exUser) {
    throw new Error('User with this nick already exists')
  }
  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      password: createHash('sha256').update(`${env.PASSWORD_SALT}${input.password}`).digest('hex'),
    },
  })
  const token = signJWT(user.id)
  return { token }
})
