import { createHash } from 'crypto'
import { env } from '../lib/env'

export const getPasswordHash = (password: string) => {
  return createHash('sha256').update(`${env.PASSWORD_SALT}${password}`).digest('hex')
}
