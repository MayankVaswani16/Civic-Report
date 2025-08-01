import { fetcher } from './client';
import type {
    CreateComplaintRequest,
    CreateComplaintResponse,
    GetComplaintsResponse,
    GetComplaintResponse,
    SearchComplaintsResponse,
    GetComplaintsParams,
    SearchComplaintsParams,
    UpdateComplaintResponse,
    UpdateComplaintRequest,
} from '@/types/api';


// Create a new complaint
export const createComplaint = async (data: CreateComplaintRequest): Promise<CreateComplaintResponse> => {
    return fetcher<CreateComplaintResponse>(`/api/complaints/create`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Get complaints for the current user
export const getComplaints = async (params: GetComplaintsParams = {}): Promise<GetComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const url = queryString ? `/api/complaints/get?${queryString}` : `/api/complaints/get`;
    
    return fetcher<GetComplaintsResponse>(url);
};

// Get a specific complaint by ID
export const getComplaint = async (complaintId: number): Promise<GetComplaintResponse> => {
    return fetcher<GetComplaintResponse>(`/api/complaints/get/${complaintId}`);
};

// Search complaints
export const searchComplaints = async (params: SearchComplaintsParams): Promise<SearchComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', params.query);
    
    return fetcher<SearchComplaintsResponse>(`/api/complaints/search?${searchParams.toString()}`);
}; 

// "/update/<int:complaint_id> PUT
export const updateComplaint = async (complaintId: number, data: UpdateComplaintRequest): Promise<UpdateComplaintResponse> => {
    return fetcher<UpdateComplaintResponse>(`/api/complaints/update/${complaintId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};
