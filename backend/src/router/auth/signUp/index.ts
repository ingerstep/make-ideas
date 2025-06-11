import { createHash } from 'crypto'
import { sendWelcomeEmail } from '../../../lib/emails'
import { env } from '../../../lib/env'
import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { signJWT } from '../../../utils/signJWT'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpcLoggedProcedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUserWithNick = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (exUserWithNick) {
    throw new ExpectedError('User with this nick already exists')
  }

  const exUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })

  if (exUserWithEmail) {
    throw new ExpectedError('User with this email already exists')
  }

  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: createHash('sha256').update(`${env.PASSWORD_SALT}${input.password}`).digest('hex'),
    },
  })

  void sendWelcomeEmail({ user })

  const token = signJWT(user.id)
  return { token }
})
