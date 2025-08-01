import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/stats';

// Query keys for stats
export const statsKeys = {
    all: ['stats'] as const,
    lists: () => [...statsKeys.all, 'list'] as const,
    list: () => [...statsKeys.lists()] as const,
};

// Hook to get statistics
export const useGetStats = () => {
    return useQuery({
        queryKey: statsKeys.list(),
        queryFn: getStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}; 