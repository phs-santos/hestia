import { api, handleApiError } from "@/lib/api";
import { TicketHistory } from "@/types";

export interface CreateTicketHistoryRequest {
    ticketId: string;
    userId: string;
    type: "note" | "update" | "system" | "status_change" | "attachment";
    visibility: "internal" | "public";
    content: string;
    attachmentIds?: string[];
}

export const ticketHistoryApi = {
    /**
     * Get all history entries for a ticket
     */
    getByTicketId: async (ticketId: string): Promise<TicketHistory[]> => {
        try {
            const response = await api.get<TicketHistory[]>(`/ticket-history/ticket/${ticketId}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Add a new history entry
     */
    create: async (data: CreateTicketHistoryRequest): Promise<TicketHistory> => {
        // ticket-history
        try {
            const response = await api.post<TicketHistory>(
                `ticket-history`,
                data
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
