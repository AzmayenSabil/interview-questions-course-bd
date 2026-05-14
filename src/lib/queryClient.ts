import { QueryClient } from '@tanstack/react-query'
import { APP_CONFIG } from '@/config/app'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: APP_CONFIG.query.retry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
