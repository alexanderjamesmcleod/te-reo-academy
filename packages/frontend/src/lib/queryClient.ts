import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 *
 * Default options for queries and mutations:
 * - Queries: Cache for 5 minutes, refetch on window focus
 * - Mutations: No retries by default
 * - Errors: Logged to console in development
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
