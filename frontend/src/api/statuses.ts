import { fetcher } from './client';
import type { GetStatusesResponse } from '@/types/api';

// Get all statuses
export const getStatuses = async (): Promise<GetStatusesResponse> => {
    return fetcher<GetStatusesResponse>('/api/other/statuses');
}; 