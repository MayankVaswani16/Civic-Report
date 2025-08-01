import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createComplaint,
    getComplaints,
    getComplaint,
    searchComplaints,
} from '../api/complaints';
import type {
    CreateComplaintRequest,
    GetComplaintsParams,
    SearchComplaintsParams,
} from '@/types/api';

// Query keys for complaints
export const complaintsKeys = {
    all: ['complaints'] as const,
    lists: () => [...complaintsKeys.all, 'list'] as const,
    list: (params: GetComplaintsParams) => [...complaintsKeys.lists(), params] as const,
    details: () => [...complaintsKeys.all, 'detail'] as const,
    detail: (id: number) => [...complaintsKeys.details(), id] as const,
    searches: () => [...complaintsKeys.all, 'search'] as const,
    search: (params: SearchComplaintsParams) => [...complaintsKeys.searches(), params] as const,
};

// Hook to create a new complaint
export const useCreateComplaint = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreateComplaintRequest) => createComplaint(data),
        onSuccess: () => {
            // Invalidate and refetch complaints lists
            queryClient.invalidateQueries({ queryKey: complaintsKeys.lists() });
        },
    });
};

// Hook to get complaints for the current user
export const useGetComplaints = (params: GetComplaintsParams = {}) => {
    return useQuery({
        queryKey: complaintsKeys.list(params),
        queryFn: () => getComplaints(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to get a specific complaint by ID
export const useGetComplaint = (complaintId: number) => {
    return useQuery({
        queryKey: complaintsKeys.detail(complaintId),
        queryFn: () => getComplaint(complaintId),
        enabled: !!complaintId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to search complaints
export const useSearchComplaints = (params: SearchComplaintsParams) => {
    return useQuery({
        queryKey: complaintsKeys.search(params),
        queryFn: () => searchComplaints(params),
        enabled: !!params.query,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}; 