import { fetcher } from './client';
import type { GetStatsResponse } from '@/types/api';

// Get statistics
export const getStats = async (): Promise<GetStatsResponse> => {
    return fetcher<GetStatsResponse>('/api/other/stats');
}; 