import { api } from "@/lib/api";
import { SystemSetting } from "@/types/system";

export const systemService = {
    async getSettings(): Promise<SystemSetting[]> {
        const response = await api.get<SystemSetting[]>("/settings");
        return response.data;
    },

    async createSetting(setting: Omit<SystemSetting, 'createdAt' | 'updatedAt'>): Promise<SystemSetting> {
        const response = await api.post<SystemSetting>("/settings/", setting);
        return response.data;
    },

    async updateSetting(key: string, data: Partial<SystemSetting>): Promise<SystemSetting> {
        const response = await api.put<SystemSetting>(`/settings/${key}`, data);
        return response.data;
    }
};
