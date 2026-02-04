import { api, handleApiError } from "@/lib/api";

// Serviço base genérico para evitar duplicação de código
export function createBaseService<T, CreateDTO, UpdateDTO = Partial<CreateDTO>>(
	endpoint: string
) {
	return {
		getAll: async (): Promise<T[]> => {
			try {
				const response = await api.get<T[]>(endpoint);
				return response.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		getById: async (id: string): Promise<T> => {
			try {
				const response = await api.get<T>(`${endpoint}${id}`);
				return response.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		create: async (data: CreateDTO): Promise<T> => {
			try {
				const response = await api.post<T>(endpoint, data);
				return response.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		update: async (id: string, data: UpdateDTO): Promise<T> => {
			try {
				const response = await api.put<T>(`${endpoint}${id}`, data);
				return response.data;
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},

		delete: async (id: string): Promise<void> => {
			try {
				await api.delete(`${endpoint}${id}`);
			} catch (error) {
				throw new Error(handleApiError(error));
			}
		},
	};
}
