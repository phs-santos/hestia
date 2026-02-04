import { createBaseService } from "./baseService";
import { Contact, CreateContactInput, UpdateContactInput, UpdateContactTemperatureInput } from "@/types";
import { api, handleApiError } from "@/lib/api";

const baseService = createBaseService<Contact, CreateContactInput, UpdateContactInput>("contacts");

export const contactService = {
    ...baseService,

    updateTemperature: async (id: string, data: UpdateContactTemperatureInput): Promise<Contact> => {
        try {
            const response = await api.patch<Contact>(`contacts/${id}/temperature`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
