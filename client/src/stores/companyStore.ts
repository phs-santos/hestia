import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Company, CompanyLastTen } from "@/types";
import { companyApi } from "@/services/companyService";
import { toast } from "sonner";

interface CompanyStore {
	companies: Company[]            // summary
	companyById: Company | null     // FULL
	lastTenCompanies: CompanyLastTen     // summary

	loading: boolean
	error: string | null
	lastFetched: number | null

	getAllCompanies: (force?: boolean) => Promise<void>
	fetchCompanyById: (id: number | string) => Promise<void>
	getLastTenCompanies: () => Promise<void>
	clearCompanyById: () => void
	invalidateCache: () => void
	handleRealTimeUpdate: (data: any) => void
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useCompanyStore = create<CompanyStore>()(
	persist(
		(set, get) => ({
			// ===== STATE =====
			companies: [],
			companyById: null,
			lastTenCompanies: null,

			loading: false,
			error: null,
			lastFetched: null,

			// ===== ACTIONS =====
			getAllCompanies: async (force = false) => {
				const { lastFetched, companies } = get();

				if (!force && lastFetched && companies.length > 0) {
					if (Date.now() - lastFetched < CACHE_DURATION) {
						return;
					}
				}

				set({ loading: true });

				try {
					const data = await companyApi.getAll();
					set({
						companies: data,
						loading: false,
						error: null,
						lastFetched: Date.now(),
					});
				} catch (error: any) {
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar empresas");
				}
			},

			fetchCompanyById: async (id) => {
				set({ loading: true });

				try {
					const company = await companyApi.getById(id);

					set({
						companyById: company,
						loading: false,
						error: null,
					});
				} catch (error: any) {
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar detalhes da empresa");
					throw error;
				}
			},

			getLastTenCompanies: async () => {
				set({ loading: true });

				try {
					const data = await companyApi.getLastTen();

					set({
						lastTenCompanies: data,
						loading: false,
						error: null,
					});
				} catch (error: any) {
					set({ loading: false, error: error.message });
					toast.error("Erro ao carregar empresas");
				}
			},

			clearCompanyById: () => {
				set({ companyById: null });
			},

			invalidateCache: () => {
				set({
					lastFetched: null,
					companies: [],
					companyById: null,
				});
			},

			handleRealTimeUpdate: (companyData: any) => {
				set((state) => {
					const company = companyData as Company;
					const exists = state.companies.some(c => c.id === company.id);

					if (exists) {
						return {
							companies: state.companies.map(c => c.id === company.id ? { ...c, ...company } : c)
						};
					} else {
						return {
							companies: [...state.companies, company]
						};
					}
				});
			},
		}),
		{
			name: "companies-storage",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				companies: state.companies,
				lastFetched: state.lastFetched,
			}),
		}
	)
);
