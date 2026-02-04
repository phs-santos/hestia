import { api, handleApiError } from "@/lib/api";
import { TicketReminder, CreateReminderInput } from "@/types/reminder";

export const reminderApi = {
    /**
     * Get all reminders (optionally filtered by ticketId)
     */
    getAll: async (): Promise<TicketReminder[]> => {
        try {
            const response = await api.get<TicketReminder[]>("/ticket-reminders");
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get reminder by ID
     */
    getById: async (id: string): Promise<TicketReminder> => {
        try {
            const response = await api.get<TicketReminder>(`/ticket-reminders/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Create new reminder
     */
    create: async (data: CreateReminderInput): Promise<TicketReminder> => {
        try {
            const response = await api.post<TicketReminder>("/ticket-reminders", data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update reminder
     */
    update: async (id: string, data: Partial<TicketReminder>): Promise<TicketReminder> => {
        try {
            const response = await api.put<TicketReminder>(`/ticket-reminders/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete reminder
     */
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/ticket-reminders/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
