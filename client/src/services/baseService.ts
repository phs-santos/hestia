import { api, handleApiError } from "@/services/api";

// Interface para o formato padrão de resposta do backend
export interface ApiResponse<T> {
	data: T;
	error: boolean;
	message?: string;
}

// Serviço base genérico para evitar duplicação de código
export function createBaseService<T, CreateDTO, UpdateDTO = Partial<CreateDTO>>(
	endpoint: string
) {
	return {
		getAll: async (params?: Record<string, any>): Promise<T[]> => {
			try {
				const response = await api.get<ApiResponse<T[]>>(endpoint, { params });
				return response.data.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		getById: async (id: string): Promise<T> => {
			try {
				const response = await api.get<ApiResponse<T>>(`${endpoint}/${id}`);
				return response.data.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		create: async (data: CreateDTO): Promise<T> => {
			try {
				const response = await api.post<ApiResponse<T>>(endpoint, data);
				return response.data.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		update: async (id: string, data: UpdateDTO): Promise<T> => {
			try {
				const response = await api.patch<ApiResponse<T>>(`${endpoint}/${id}`, data);
				return response.data.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		delete: async (id: string): Promise<void> => {
			try {
				await api.delete(`${endpoint}/${id}`);
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	};
}
