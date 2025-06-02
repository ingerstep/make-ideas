import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { trpcRouter } from '.'

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
