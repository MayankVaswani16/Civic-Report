import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';

// Query keys for categories
export const categoriesKeys = {
    all: ['categories'] as const,
    lists: () => [...categoriesKeys.all, 'list'] as const,
    list: () => [...categoriesKeys.lists()] as const,
};

// Hook to get all categories
export const useGetCategories = () => {
    return useQuery({
        queryKey: categoriesKeys.list(),
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}; 