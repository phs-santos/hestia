import { useEffect, useRef } from "react";
type DataType = "tickets" | "categories" | "companies" | "users" | "contacts";

interface UseDataLoaderOptions {
	/**
	 * Forçar reload mesmo se cache válido
	 */
	force?: boolean;
	filters?: {
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

	useEffect(() => {
		if (loadedRef.current && !force && !filters) return;
		loadedRef.current = true;

		const loaders: Promise<void>[] = [];

		// Carrega todos em paralelo
		Promise.all(loaders);
	}, [force, JSON.stringify(filters)]); // JSON.stringify to compare filters object by value

	return {
		loading: false
	};
}


/**
 * Hook para invalidar cache e forçar reload
 */
export function useInvalidateCache() {
	return {
		invalidateAll: () => { },

		// invalidateTickets: () => {},

	};
}
