import { fetcher } from './client';
import type { GetCategoriesResponse } from '@/types/api';

// Get all categories
export const getCategories = async (): Promise<GetCategoriesResponse> => {
    return fetcher<GetCategoriesResponse>('/api/other/categories');
}; 