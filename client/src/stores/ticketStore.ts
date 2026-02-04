import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CreateTicketInput, Ticket, TicketHistory } from "@/types";
import { ticketApi } from "@/services/ticketService";
import { toast } from "sonner";
import { ticketHistoryApi } from "@/services/ticketHistoryService";

interface TicketStore {
	tickets: Ticket[];
	history: TicketHistory[];
	loading: boolean;
	error: string | null;
	// Local storage for waiting reasons (Mock Data)

	localWaitingStatuses: Record<string, string>;
	localWaitingStartTimes: Record<string, number>; // timestamp when waiting started
	lastFetched: number | null;
	isPartial: boolean;
	globalStats: { total: number; open: number; resolved: number; avgResolutionTime: number } | null;

	getAllTickets: (force?: boolean, filters?: { status?: string[]; startDate?: Date; endDate?: Date, userId?: string, categoryId?: string }) => Promise<void>;
	getDashboardTickets: () => Promise<void>;
	getHistory: (ticketId: string) => Promise<void>;
	addTicket: (ticket: CreateTicketInput) => Promise<Ticket>;
	updateTicket: (id: string, updates: Partial<Ticket>, userId?: string) => Promise<void>;
	updateStatus: (id: string, status: string, userId: string) => Promise<void>;
	// Atualiza status de aguardando via API
	setWaitingStatus: (id: string, status: string, userId: string) => Promise<{ waitingDurationMs?: number }>;
	getWaitingStartTime: (id: string) => number | null;
	finalizeTicket: (id: string, resolution: string, userId: string) => Promise<void>;
	abandonTicket: (id: string, resolution: string, userId: string) => Promise<void>;
	deleteTicket: (id: string) => Promise<void>;
	handleRealTimeUpdate: (ticket: Ticket) => void;
	invalidateCache: () => void;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

export const useTicketStore = create<TicketStore>()(
	persist(
		(set, get) => ({
			tickets: [],
			history: [],
			loading: false,
			error: null,

			lastFetched: null,
			isPartial: false,
			globalStats: null,

			localWaitingStatuses: {},
			localWaitingStartTimes: {},

			getAllTickets: async (force = false, filters?: { status?: string[]; startDate?: Date; endDate?: Date; userId?: string; categoryId?: string }) => {
				const { lastFetched, tickets, isPartial } = get();

				// If filters are present, always fetch (bypass cache for now, or implement smarter cache)
				// If isPartial is true, we must fetch (unless filters are same... but simpler to just fetch)
				const isFullFetch = !filters;

				if (!force && isFullFetch && !isPartial && lastFetched && tickets.length > 0) {
					if (Date.now() - lastFetched < CACHE_DURATION) {
						return;
					}
				}

				set({ loading: true });
				try {
					const data = await ticketApi.getAll(filters);

					const uniqueData = Array.from(new Map(data.map(t => [String(t.id), t])).values());

					const { localWaitingStatuses } = get();
					const mergedData = uniqueData.map(t => ({
						...t,
						status: (localWaitingStatuses[t.id] as Ticket['status']) || t.status
					}));

					// If using filters, we might want to MERGE with existing tickets instead of replacing?
					// For getAllTickets (default), we replace.
					// For simplicity, getAllTickets replaces.
					set({
						tickets: mergedData,
						loading: false,
						error: null,
						lastFetched: Date.now(),
						isPartial: !isFullFetch // If we have filters, it's partial. If no filters, it's full.
					});
				} catch (error: any) {
					console.error("Erro ao carregar chamados:", error);
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar chamados");
				}
			},

			getDashboardTickets: async () => {
				set({ loading: true });
				try {
					// 1. Tickets em aberto (All time) - para não perder nada pendente
					const activeStatus = ['open', 'in_progress', 'waiting_operator', 'waiting_customer', 'waiting_team'];
					const activePromise = ticketApi.getAll({ status: activeStatus });

					// 2. Tickets da semana (All status) - para estatísticas
					// Calc start of week
					const now = new Date();
					const startOfWeekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); // Simple start of week (Sunday)
					// Adjust slightly to ensure we get everything if timezone behaves weirdly, maybe -1 day or just set hours 0
					startOfWeekDate.setHours(0, 0, 0, 0);

					const weekPromise = ticketApi.getAll({ startDate: startOfWeekDate });

					// 3. Stats (All time)
					const statsPromise = ticketApi.getStats();

					const [activeTickets, weekTickets, stats] = await Promise.all([activePromise, weekPromise, statsPromise]);

					// Merge and deduplicate
					const combined = [...activeTickets, ...weekTickets];
					const uniqueData = Array.from(new Map(combined.map(t => [String(t.id), t])).values());

					const { localWaitingStatuses } = get();
					const mergedData = uniqueData.map(t => ({
						...t,
						status: (localWaitingStatuses[t.id] as Ticket['status']) || t.status
					}));

					set({
						tickets: mergedData,
						globalStats: stats,
						loading: false,
						error: null,
						lastFetched: Date.now(),
						isPartial: true // Dashboard data is always partial
					});
				} catch (error: any) {
					console.error("Erro ao carregar dados do dashboard:", error);
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar dashboard");
				}
			},

			getHistory: async (ticketId: string) => {
				set({ loading: true });
				try {
					const data = await ticketHistoryApi.getByTicketId(ticketId);
					set({ history: data, loading: false, error: null });
				} catch (error: any) {
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar histórico");
				}
			},

			addTicket: async (ticketData: CreateTicketInput) => {
				try {
					const newTicket = await ticketApi.create(ticketData);
					set((state) => {
						// Prevent duplicates
						const exists = state.tickets.some(t => t.id === newTicket.id);
						if (exists) return state;

						return {
							tickets: [newTicket, ...state.tickets],
							lastFetched: Date.now()
						};
					});
					return newTicket;
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			updateTicket: async (id, updates, userId?: string) => {
				try {
					const state = get();
					const oldTicket = state.tickets.find(t => t.id === id);
					const updated = await ticketApi.update(id, updates);

					// Generate history for changes (if userId provided)
					if (userId && oldTicket) {
						const changes: string[] = [];

						if (updates.categoryId && updates.categoryId !== oldTicket.categoryId) {
							changes.push(`Categoria alterada`);
						}
						if (updates.priority && updates.priority !== oldTicket.priority) {
							const priorityLabels: Record<string, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' };
							changes.push(`Prioridade alterada para ${priorityLabels[updates.priority] || updates.priority}`);
						}
						if (updates.description && updates.description !== oldTicket.description) {
							changes.push(`Descrição atualizada`);
						}
						if (updates.companyId && updates.companyId !== oldTicket.companyId) {
							changes.push(`Empresa alterada`);
						}
						if (updates.contactId && updates.contactId !== oldTicket.contactId) {
							changes.push(`Contato alterado`);
						}
						if (updates.contactChannel && updates.contactChannel !== oldTicket.contactChannel) {
							changes.push(`Canal de contato alterado para ${updates.contactChannel}`);
						}

						// Create history entry for each change
						for (const change of changes) {
							try {
								await ticketHistoryApi.create({
									ticketId: id,
									userId: userId,
									type: 'update',
									visibility: 'internal',
									content: change
								});
							} catch (historyError) {
								console.error("Erro ao criar histórico:", historyError);
							}
						}
					}

					set((state) => {
						// Merge updates with backend result immediately
						const finalUpdated = {
							...updated
						};

						return {
							tickets: state.tickets.map((t) => (t.id === id ? finalUpdated : t)),
							lastFetched: Date.now()
						};
					});
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			updateStatus: async (id, status, userId) => {
				try {
					const updated = await ticketApi.updateStatus(id, status, userId);

					set((state) => ({
						tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
						lastFetched: Date.now()
					}));
					toast.success("Status atualizado com sucesso");
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			finalizeTicket: async (id, resolution, userId) => {
				try {
					const updated = await ticketApi.finalize(id, resolution, userId);
					set((state) => ({
						tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
						lastFetched: Date.now()
					}));
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			abandonTicket: async (id, resolution, userId) => {
				try {
					const updated = await ticketApi.abandon(id, resolution, userId);
					set((state) => ({
						tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
						lastFetched: Date.now()
					}));
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			deleteTicket: async (id) => {
				try {
					await ticketApi.delete(id);
					set((state) => ({
						tickets: state.tickets.filter((t) => t.id !== id),
						lastFetched: Date.now()
					}));
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			handleRealTimeUpdate: (ticketData: any) => {
				if (!ticketData || !ticketData.id) return;

				set((state) => {
					const ticket: Ticket = {
						...ticketData,
						id: String(ticketData.id),
						companyName: ticketData.company?.name ?? ticketData.companyName,
						userName: ticketData.user?.name ?? ticketData.userName,
					};

					if (!ticket.id || ticket.id === 'undefined') return state;

					const exists = state.tickets.some((t) => String(t.id) === String(ticket.id));
					if (exists) {
						return {
							tickets: state.tickets.map((t) => (String(t.id) === String(ticket.id) ? ticket : t)),
						};
					} else {
						return {
							tickets: [ticket, ...state.tickets],
						};
					}
				});
			},

			invalidateCache: () => {
				set({ lastFetched: null, tickets: [] });
			},

			getWaitingStartTime: (id: string) => {
				return get().localWaitingStartTimes[id] || null;
			},

			// Atualiza status de aguardando via API
			setWaitingStatus: async (id: string, status: string, userId: string) => {
				const state = get();
				const newLocalStartTimes = { ...state.localWaitingStartTimes };
				let waitingDurationMs: number | undefined;

				// Save start time if entering waiting
				if (status.startsWith('waiting_')) {
					if (!newLocalStartTimes[id]) {
						newLocalStartTimes[id] = Date.now();
					}
				}

				// Calculate duration if resuming (in_progress)
				if (status === 'in_progress') {
					if (newLocalStartTimes[id]) {
						waitingDurationMs = Date.now() - newLocalStartTimes[id];
					}
					delete newLocalStartTimes[id];
				}

				try {
					const updated = await ticketApi.updateStatus(id, status, userId);

					set({
						tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
						localWaitingStartTimes: newLocalStartTimes,
						lastFetched: Date.now()
					});

					return { waitingDurationMs };
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},
		}),
		{
			name: "tickets-storage",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				// tickets: state.tickets, // Do not persist tickets anymore
				lastFetched: state.lastFetched,
				isPartial: state.isPartial,
				globalStats: state.globalStats,

				localWaitingStatuses: state.localWaitingStatuses,
				localWaitingStartTimes: state.localWaitingStartTimes
			}),
		}
	)
);
