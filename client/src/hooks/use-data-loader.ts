import { useEffect, useRef } from "react";
import { useTicketStore } from "@/stores/ticketStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useUserStore } from "@/stores/userStore";

type DataType = "tickets" | "categories" | "companies" | "users" | "contacts";

interface UseDataLoaderOptions {
	/**
	 * Forçar reload mesmo se cache válido
	 */
	force?: boolean;
	filters?: {
		tickets?: {
			startDate?: Date;
			endDate?: Date;
			status?: string[];
		}
	}
}

/**
 * Hook centralizado para carregar dados sob demanda.
 * Evita múltiplas chamadas desnecessárias à API usando cache.
 */
export function useDataLoader(
	dataTypes: DataType[],
	options: UseDataLoaderOptions = {}
) {
	const { force = false, filters } = options;
	const loadedRef = useRef(false);

	const { getAllTickets, loading: ticketsLoading } = useTicketStore();
	const { getAllCategories, loading: categoriesLoading } = useCategoryStore();
	const { getAllCompanies, loading: companiesLoading } = useCompanyStore();
	const { getAllUsers, loading: usersLoading } = useUserStore();
	const { getAllContacts, loading: contactsLoading } = useContactStore();

	useEffect(() => {
		if (loadedRef.current && !force && !filters) return;
		loadedRef.current = true;

		const loaders: Promise<void>[] = [];

		if (dataTypes.includes("tickets")) {
			loaders.push(getAllTickets(force, filters?.tickets));
		}
		if (dataTypes.includes("categories")) {
			loaders.push(getAllCategories(force));
		}
		if (dataTypes.includes("companies")) {
			loaders.push(getAllCompanies(force));
		}
		if (dataTypes.includes("users")) {
			loaders.push(getAllUsers(force));
		}

		if (dataTypes.includes("contacts")) {
			loaders.push(getAllContacts(force));
		}

		// Carrega todos em paralelo
		Promise.all(loaders);
	}, [force, JSON.stringify(filters)]); // JSON.stringify to compare filters object by value

	return {
		loading:
			(dataTypes.includes("tickets") && ticketsLoading) ||
			(dataTypes.includes("categories") && categoriesLoading) ||
			(dataTypes.includes("companies") && companiesLoading) ||
			(dataTypes.includes("users") && usersLoading) ||
			(dataTypes.includes("contacts") && contactsLoading)
	};
}

import { useCameraStore } from "@/stores/cameraStore";
import { useCommandStore } from "@/stores/commandStore";
import { useContactStore } from "@/stores/contactStore";

/**
 * Hook para invalidar cache e forçar reload
 */
export function useInvalidateCache() {
	return {
		invalidateAll: () => {
			useTicketStore.getState().invalidateCache();
			useCategoryStore.getState().invalidateCache();
			useCompanyStore.getState().invalidateCache();
			useUserStore.getState().invalidateCache();
			useCameraStore.getState().invalidateCache();
			useCommandStore.getState().invalidateCache();
			useContactStore.getState().invalidateCache();
		},

		invalidateTickets: () => useTicketStore.getState().invalidateCache(),
		invalidateCategories: () => useCategoryStore.getState().invalidateCache(),
		invalidateCompanies: () => useCompanyStore.getState().invalidateCache(),
		invalidateUsers: () => useUserStore.getState().invalidateCache(),
		invalidateCameras: () => useCameraStore.getState().invalidateCache(),
		invalidateCommands: () => useCommandStore.getState().invalidateCache(),
		invalidateContacts: () => useContactStore.getState().invalidateCache(),
	};
}
