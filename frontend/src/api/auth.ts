import { fetcher } from "./client"
import type {
    RegisterRequest,
    RegisterSuccessResponse,
    LoginRequest,
    LoginSuccessResponse,
    GetProfileResponse,
    GetUserResponse,
} from "@/types/api"

/**
 * Registers a new user.
 * @param data - The registration data (name, email, password)
 * @returns A promise resolving to the registration success response
 * @throws Error if registration fails
 */
export async function register(
    data: RegisterRequest
): Promise<RegisterSuccessResponse> {
    try {
        return await fetcher<RegisterSuccessResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        })
    } catch (err: any) {
        // Try to parse error response if possible
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw err
    }
}

/**
 * Logs in a user.
 * @param data - The login data (email, password)
 * @returns A promise resolving to the login success response (token)
 * @throws Error if login fails
 */
export async function login(
    data: LoginRequest
): Promise<LoginSuccessResponse> {
    try {
        const response = await fetcher<LoginSuccessResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        })
        // Store token in localStorage for future requests
        if (response.token) {
            localStorage.setItem("access_token", response.token)
        }
        return response
    } catch (err: any) {
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw err
    }
}

/**
 * Gets the current user's profile.
 * @returns A promise resolving to the user profile
 * @throws Error if the request fails or user is not authenticated
 */
export async function getProfile(): Promise<GetProfileResponse> {
    try {
        return await fetcher<GetProfileResponse>("/api/auth/profile")
    } catch (err: any) {
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw err
    }
}


export async function getUser(user_id: number): Promise<GetUserResponse> {
    try {
        return await fetcher<GetUserResponse>(`/api/auth/user/${user_id}`)
    } catch (err: any) {
        if (err instanceof Error) {
            throw new Error(err.message)
        }
        throw err
    }
}