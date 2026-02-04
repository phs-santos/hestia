import { api, handleApiError } from "@/lib/api";
import { Category } from "@/types";

export interface CreateCategoryRequest {
    name: string;
    parentId: string | null;
    level: number;
}

export interface UpdateCategoryRequest {
    name?: string;
    parentId?: string | null;
    level?: number;
}

export const categoryApi = {
    /**
     * Get all categories
     */
    getAll: async (): Promise<Category[]> => {
        try {
            const response = await api.get<Category[]>("/categories");
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get category by ID
     */
    getById: async (id: string): Promise<Category> => {
        try {
            const response = await api.get<Category>(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Create new category
     */
    create: async (data: CreateCategoryRequest): Promise<Category> => {
        try {
            const response = await api.post<Category>("/categories", data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update category
     */
    update: async (
        id: string,
        data: UpdateCategoryRequest
    ): Promise<Category> => {
        try {
            const response = await api.put<Category>(`/categories/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete category
     */
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/categories/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
