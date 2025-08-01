import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, getProfile, getUser } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '@/types/api';
import { updateComplaint } from '@/api/complaints';
import type { UpdateComplaintRequest } from '@/types/api';

// Query keys for auth
export const authKeys = {
    profile: ['auth', 'profile'] as const,
    user: (user_id: number) => ['auth', 'user', user_id] as const,
};

// use mutation to register a user
export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data),
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginRequest) => login(data),
    });
};

export const useProfile = () => {
    return useQuery({
        queryKey: authKeys.profile,
        queryFn: getProfile,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useLogout = () => {
    return () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };
};

export const useGetUser = (user_id: number) => {
    return useQuery({
        queryKey: authKeys.user(user_id),
        queryFn: () => getUser(user_id),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateComplaint = () => {
    return useMutation({
        mutationFn: ({ complaintId, data }: { complaintId: number; data: UpdateComplaintRequest }) => 
            updateComplaint(complaintId, data),
    });
};
