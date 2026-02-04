import { api, handleApiError } from "@/lib/api";
import { User } from "@/types";

export interface CreateUserRequest {
    name: string;
    email: string;
    role: "admin" | "technician" | "user" | "sdr" | "closer" | "marketing" | "developer" | "owner_developer";
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    role?: "admin" | "technician" | "user" | "sdr" | "closer" | "marketing" | "developer" | "owner_developer";
    password?: string;
}

export const userApi = {
    /**
     * Get all users
     */
    getAll: async (): Promise<User[]> => {
        try {
            const response = await api.get<User[]>("/users");
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get user by ID
     */
    getById: async (id: string): Promise<User> => {
        try {
            const response = await api.get<User>(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Create new user
     */
    create: async (data: CreateUserRequest): Promise<User> => {
        try {
            const response = await api.post<User>("/users", data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update user
     */
    update: async (id: string, data: UpdateUserRequest): Promise<User> => {
        try {
            const response = await api.put<User>(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete user
     */
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/users/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Approve user
     */
    approve: async (id: string): Promise<User> => {
        try {
            const response = await api.patch<User>(`/users/${id}/approve`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
