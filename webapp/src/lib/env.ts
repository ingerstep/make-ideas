import z from 'zod'

export const zEnv = z.object({
  VITE_BACKEND_TRPC_URL: z.string().trim().min(1),
})

export const env = zEnv.parse({
  VITE_BACKEND_TRPC_URL: import.meta.env.VITE_BACKEND_TRPC_URL,
})
