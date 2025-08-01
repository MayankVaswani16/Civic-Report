import { useQuery } from '@tanstack/react-query';
import { getStatuses } from '../api/statuses';

// Query keys for statuses
export const statusesKeys = {
    all: ['statuses'] as const,
    lists: () => [...statusesKeys.all, 'list'] as const,
    list: () => [...statusesKeys.lists()] as const,
};

// Hook to get all statuses
export const useGetStatuses = () => {
    return useQuery({
        queryKey: statusesKeys.list(),
        queryFn: getStatuses,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}; 