import { api, handleApiError } from "@/lib/api";
import { createBaseService } from "./baseService";
import { OpeningCommand, CreateOpeningCommandInput } from "@/types/command";

const base = createBaseService<OpeningCommand, CreateOpeningCommandInput>("/commands");

export const commandService = {
    ...base,
    update: async (id: string, data: Partial<CreateOpeningCommandInput>): Promise<OpeningCommand> => {
        try {
            const response = await api.patch<OpeningCommand>(`commands/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
    execute: async (id: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await api.post<{ success: boolean; message: string }>(`commands/${id}/execute`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
