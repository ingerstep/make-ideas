import z from 'zod'
import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '../../../shared/src/zod'

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  HOST_ENV: zEnvHost,
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
  VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  VITE_S3_URL: zEnvNonemptyTrimmed,
})

export const env = zEnv.parse(process.env)
