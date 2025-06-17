import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetIdeaTrpcInput } from './input'
import { omit } from '@make-ideas/shared/src/omit'

export const getIdeaTrpcRoute = trpcLoggedProcedure.input(zGetIdeaTrpcInput).query(async ({ ctx, input }) => {
  const rawIdea = await ctx.prisma.idea.findUnique({
    where: {
      nick: input.makeIdea,
    },
    include: {
      author: {
        select: {
          id: true,
          nick: true,
          name: true,
          avatar: true,
        },
      },
      ideasLikes: {
        select: {
          id: true,
        },
        where: {
          userId: ctx.me?.id,
        },
      },
      _count: {
        select: {
          ideasLikes: true,
        },
      },
    },
  })
  if (rawIdea?.blockedAt) {
    throw new ExpectedError('Idea blocked by admin')
  }

  const isLikedByMe = !!rawIdea?.ideasLikes.length
  const likesCount = rawIdea?._count?.ideasLikes || 0
  const idea = rawIdea && { ...omit(rawIdea, ['ideasLikes', '_count']), isLikedByMe, likesCount }

  return { idea }
})
