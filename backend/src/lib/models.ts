import type { User } from '@prisma/client'
import { pick } from '@make-ideas/shared/src/pick'

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['id', 'nick', 'name', 'permissions', 'email', 'avatar'])
}
