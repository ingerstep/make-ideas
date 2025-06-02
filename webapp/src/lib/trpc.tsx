import { type TrpcRouter } from '@make-ideas/backend/src/router/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import Cookies from 'js-cookie'
import { type ReactNode } from 'react'
import SuperJSON from 'superjson'
import { env } from './env'

export const trpc = createTRPCReact<TrpcRouter>()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: env.VITE_BACKEND_TRPC_URL,
      headers() {
        const token = Cookies.get('token')
        return {
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      },
    }),
  ],
  transformer: SuperJSON,
})

export const TrpcProvider = ({ children }: { children: ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
