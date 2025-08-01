// Auth API Types

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthErrorResponse {
    error: string;
}

export interface RegisterSuccessResponse {
    message: string;
}

export interface LoginSuccessResponse {
    token: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface JWTPayload {
    user_id: number;
    exp: number;
}

export interface GetProfileResponse {
    user: User;
}

// Categories API Types

export interface Category {
    id: number;
    name: string;
}

export interface GetCategoriesResponse {
    categories: Category[];
}

// Statuses API Types

export interface Status {
    id: number;
    name: string;
}

export interface GetStatusesResponse {
    statuses: Status[];
}

// Stats API Types

export interface Stats {
    total_reports: number;
    pending_reports: number;
    resolved_reports: number;
}

export interface GetStatsResponse {
    stats: Stats;
}

// Complaints API Types

export interface CreateComplaintRequest {
    category_id: number;
    title: string;
    description: string;
    image_url?: string;
    location?: string;
}

export interface CreateComplaintResponse {
    message: string;
    complaint_id: number;
}

export interface Complaint {
    id: number;
    user_id: number;
    category_id: number;
    category_name: string | null;
    user_name: string | null;
    title: string;
    description: string;
    image_url?: string;
    location?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SearchComplaint {
    id: number;
    user_id: number;
    category_id: number;
    category_name: string;
    title: string;
    description: string;
    user_name: string;  
    status: string;
    created_at: string;
}

export interface GetComplaintsResponse {
    complaints: Complaint[];
}

export interface GetComplaintResponse {
    complaint: Complaint;
}

export interface SearchComplaintsResponse {
    complaints: SearchComplaint[];
}

export interface GetComplaintsParams {
    page?: number;
    per_page?: number;
    status?: string;
}

export interface SearchComplaintsParams {
    query: string;
}


export interface GetUserResponse {
    user: User;
}

export interface UpdateComplaintRequest {
    status: string;
}

export interface UpdateComplaintResponse {
    message: string;
}
