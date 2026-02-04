import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import { userApi } from "@/services/userService";
import { toast } from "sonner";

interface UserWithPassword extends User {
	password?: string;
}

interface UserStore {
	users: UserWithPassword[];
	loading: boolean;
	error: string | null;
	lastFetched: number | null;

	handleRealTimeUpdate: (data: any) => void;

	getAllUsers: (force?: boolean) => Promise<void>;
	getUserById: (id: string) => UserWithPassword | undefined;
	addUser: (
		user: Omit<UserWithPassword, "id" | "createdAt" | "updatedAt"> & {
			password: string;
		}
	) => Promise<void>;
	updateUser: (
		id: string,
		updates: Partial<Omit<UserWithPassword, "id" | "createdAt">>
	) => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
	approveUser: (id: string) => Promise<void>;
	invalidateCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			users: [],
			loading: false,
			error: null,
			lastFetched: null,

			getAllUsers: async (force = false) => {
				const { lastFetched, users } = get();

				if (!force && lastFetched && users.length > 0) {
					if (Date.now() - lastFetched < CACHE_DURATION) {
						return;
					}
				}

				set({ loading: true });
				try {
					const data = (await userApi.getAll()) as UserWithPassword[];

					const userSorted = data.sort((a, b) => {
						const nameComparison = a.name.localeCompare(b.name);
						if (nameComparison !== 0) return nameComparison;
						return a.role.localeCompare(b.role);
					});

					set({ users: userSorted, loading: false, error: null, lastFetched: Date.now() });
				} catch (error: any) {
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar usuários");
				}
			},

			getUserById: (id) => get().users.find((u) => u.id === id),

			addUser: async (userData) => {
				try {
					const newUser = (await userApi.create(userData)) as UserWithPassword;
					set((state) => ({
						users: [...state.users, newUser],
						lastFetched: Date.now()
					}));
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			updateUser: async (id, updates) => {
				try {
					const updated = (await userApi.update(id, updates)) as UserWithPassword;
					set((state) => ({
						users: state.users.map((u) => (u.id === id ? updated : u)),
						lastFetched: Date.now()
					}));
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			deleteUser: async (id) => {
				try {
					await userApi.delete(id);
					set((state) => ({
						users: state.users.filter((u) => u.id !== id),
						lastFetched: Date.now()
					}));
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			approveUser: async (id) => {
				try {
					const updated = await userApi.approve(id);
					set((state) => ({
						users: state.users.map((u) => (u.id === id ? { ...u, ...updated } : u)),
						lastFetched: Date.now()
					}));
					toast.success("Usuário aprovado com sucesso!");
				} catch (error: any) {
					toast.error(error.message);
					throw error;
				}
			},

			invalidateCache: () => {
				console.log("Invalidando cache de usuários");
				set({ lastFetched: null, users: [] });
			},

			handleRealTimeUpdate: (userData: any) => {
				set((state) => {
					// Handle deleted action if the payload has it, or if it is just the user object
					// Assuming we receive the User object or an event

					// Basic upsert logic
					const user = userData as UserWithPassword;

					// Check for deletion flag if we decide to implement it that way, 
					// but usually 'deleted' event comes with ID. 
					// For now, let's implement UPSERT.

					const exists = state.users.some(u => u.id === user.id);

					// If we needed to handle delete, we would need the event type passed here.
					// But we will stick to the plan: handle updates.
					// Ideally, the component calling this should handle 'deleted' by calling deleteUser?
					// Or we make this robust. 

					if (exists) {
						return {
							users: state.users.map(u => u.id === user.id ? { ...u, ...user } : u)
						};
					} else {
						return {
							users: [...state.users, user].sort((a, b) => {
								const nameComparison = a.name.localeCompare(b.name);
								if (nameComparison !== 0) return nameComparison;
								return a.role.localeCompare(b.role);
							})
						};
					}
				});
			},
		}),
		{
			name: "users-storage",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ users: state.users, lastFetched: state.lastFetched }),
		}
	)
);
