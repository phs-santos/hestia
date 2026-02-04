import { api, handleApiError } from "@/lib/api";
import { Ticket } from "@/types";

export interface CreateTicketRequest {
    userId: string | null;
    companyId: string;
    categoryId: string;
    title: string;
    description: string;
    contactChannel: string;
    priority?: string;

    startAt?: Date | string;
}

export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    resolution?: string;
    status?: string;
    priority?: string;
    userId?: string;
}

export const ticketApi = {
    /**
     * Get all tickets
     */
    getStats: async (): Promise<{ total: number; open: number; resolved: number; avgResolutionTime: number }> => {
        try {
            const response = await api.get("/tickets/statistics");
            return response.data;
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
            throw new Error(handleApiError(error));
        }
    },

    getAll: async (filters?: { status?: string[]; startDate?: Date; endDate?: Date; userId?: string; categoryId?: string }): Promise<Ticket[]> => {
        try {
            const params = new URLSearchParams();
            if (filters?.status && filters.status.length > 0) {
                params.append('status', filters.status.join(','));
            }
            if (filters?.startDate) {
                params.append('startDate', filters.startDate.toISOString());
            }
            if (filters?.endDate) {
                params.append('endDate', filters.endDate.toISOString());
            }
            if (filters?.userId) {
                params.append('userId', filters.userId);
            }
            if (filters?.categoryId) {
                params.append('categoryId', filters.categoryId);
            }

            const queryString = params.toString();
            const url = queryString ? `/tickets?${queryString}` : '/tickets';

            const response = await api.get<any[]>(url);

            const tickets = response.data.map(ticket => ({
                ...ticket,
                companyName: ticket.company.name,
                userName: ticket.user.name,
            })) as Ticket[];

            return tickets;
        } catch (error) {
            console.error("Erro ao carregar tickets:", error);
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get ticket by ID
     */
    getById: async (id: string): Promise<Ticket> => {
        try {
            const response = await api.get<any>(`/tickets/${id}`);
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get ticket by Code
     */
    getByCode: async (code: number): Promise<Ticket> => {
        try {
            const response = await api.get<any>(`/tickets/code/${code}`);
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Create new ticket
     */
    create: async (data: CreateTicketRequest): Promise<Ticket> => {
        try {
            const response = await api.post<any>("/tickets", data);
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update ticket
     */
    update: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
        try {
            const response = await api.put<any>(`/tickets/${id}`, data);
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Finalize ticket
     */
    finalize: async (id: string, resolution: string, userId: string): Promise<Ticket> => {
        try {
            const response = await api.patch<any>(`/tickets/${id}/status`, {
                status: "resolved",
                userId,
                endAt: new Date().toISOString(),
                resolution,
            });
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Abandon ticket
     */
    abandon: async (id: string, resolution: string, userId: string): Promise<Ticket> => {
        try {
            const response = await api.patch<any>(`/tickets/${id}/status`, {
                status: "abandoned",
                userId,
                endAt: new Date().toISOString(),
                resolution,
            });
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update ticket status
     */
    updateStatus: async (id: string, status: string, userId: string): Promise<Ticket> => {
        try {
            const response = await api.patch<any>(`/tickets/${id}/status`, {
                status,
                userId,
                updatedAt: new Date().toISOString()
            });
            const ticket = {
                ...response.data,
                companyName: response.data.company?.name,
                userName: response.data.user?.name,
            };
            return ticket;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete ticket
     */
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/tickets/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};
