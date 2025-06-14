import { zStringRequired } from '@make-ideas/shared/src/zod'
import { z } from 'zod'

export const zBlockIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
})
