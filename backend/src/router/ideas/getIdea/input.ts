import { zStringRequired } from '@make-ideas/shared/src/zod'
import { z } from 'zod'

export const zGetIdeaTrpcInput = z.object({
  makeIdea: zStringRequired,
})
