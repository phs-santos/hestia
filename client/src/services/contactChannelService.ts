import { api, handleApiError } from "@/lib/api";
import { ContactChannel } from "@/types";

export interface CreateContactChannelRequest {
    name: string;
    active: boolean;
}

export interface UpdateContactChannelRequest {
    name?: string;
    active?: boolean;
}

export const contactChannelApi = {
    getAll: async (): Promise<ContactChannel[]> => {
        try {
            const response = await api.get<ContactChannel[]>("/contact-channels");
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    getById: async (id: string): Promise<ContactChannel> => {
        try {
            const response = await api.get<ContactChannel>(`/contact-channels/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    create: async (data: CreateContactChannelRequest): Promise<ContactChannel> => {
        try {
            const response = await api.post<ContactChannel>("/contact-channels", data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    update: async (id: string, data: UpdateContactChannelRequest): Promise<ContactChannel> => {
        try {
            const response = await api.put<ContactChannel>(`/contact-channels/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/contact-channels/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
