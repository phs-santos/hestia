import { api, handleApiError } from "@/lib/api";
import type { ExportFilters, ReportItem } from "@/types/export";

// Mock data structures matching user provided examples
const MOCK_DATA = {
	extension: {
		onlyExtension: [
			{ "Tipo": "Ramal", "Nome": "PORTEIRO ", "Extensão": "301" },
			{ "Tipo": "Ramal", "Nome": "INTERFONE HIK ENTRADA", "Extensão": "300" }
		],
		onlyFollowMe: [
			{ "Extensao": "3005", "Nome do contato": "Posição de discagem do próprio ramal", "Phone": "" },
			{ "Extensao": "3005", "Nome do contato": "Casa Vidal", "Phone": "16997401727" },
			{ "Extensao": "3005", "Nome do contato": "Lucas", "Phone": "16993338087" },
			{ "Extensao": "3005", "Nome do contato": "Implantação", "Phone": "68cebd2c0760c3fce9cd206e" },
			{ "Extensao": "5656", "Nome do contato": "Posição de discagem do próprio ramal", "Phone": "" },
		],
		all: [
			{
				"Tipo": "Ramal", "Nome": "Porteiro302TecnoHouse", "Extensão": "302",
				"Numero do Tronco": "", "Nome do Tronco": "",
				"Followme": { "enabled": false, "list": [] }
			},
			{
				"Tipo": "Ramal", "Nome": "CASA 5 BLOCO 30", "Extensão": "3005",
				"Numero do Tronco": "", "Nome do Tronco": "",
				"Followme": {
					"enabled": true,
					"list": [
						{ "name": "Posição de discagem do próprio ramal", "phone": "", "type": "himself_item" },
						{ "name": "Casa Vidal", "phone": "16997401727", "type": "celular" },
						{ "name": "Lucas", "phone": "16993338087", "type": "celular" },
						{ "name": "Implantação", "phone": "68cebd2c0760c3fce9cd206e", "type": "queue" }
					]
				}
			}
		]
	},
	intercom: {
		onlyIntercom: [
			{ "Tipo": "Ramal", "Nome": "N/FUNCIONA 200", "Extensão": "200", "Numero do Tronco": "03", "Nome do Tronco": "ATA TECNO HOUSE" },
			{ "Tipo": "Ramal", "Nome": "201", "Extensão": "201", "Numero do Tronco": "03", "Nome do Tronco": "ATA TECNO HOUSE" },
		],
		onlyFollowMe: [
			{ "Extensao": "200", "Nome do contato": "Posição de discagem do próprio intercom", "Phone": "" },
			{ "Extensao": "200", "Nome do contato": "Paulo Aqui", "Phone": "16920031071" },
			{ "Extensao": "56", "Nome do contato": "Celular ", "Phone": "11984720182" },
			{ "Extensao": "56", "Nome do contato": "Vidal", "Phone": "16997401727" },
		],
		all: [
			{
				"Tipo": "Ramal", "Nome": "N/FUNCIONA 200", "Extensão": "200",
				"Numero do Tronco": "03", "Nome do Tronco": "ATA TECNO HOUSE",
				"Followme": {
					"enabled": true,
					"list": [
						{ "name": "Posição de discagem do próprio intercom", "phone": "", "type": "himself_item" },
						{ "name": "Paulo Aqui", "phone": "16920031071", "type": "celular" }
					]
				}
			},
			{
				"Tipo": "Ramal", "Nome": "201", "Extensão": "201",
				"Numero do Tronco": "03", "Nome do Tronco": "ATA TECNO HOUSE",
				"Followme": { "enabled": false, "list": [] }
			},
		]
	}
};

export const exportService = {
	fetchIntercoms: async (filters: ExportFilters): Promise<ReportItem[]> => {
		try {
			const response = await api.get<ReportItem[]>('/reports/exports/condominium', {
				params: {
					accountcode: filters.accountcode,
					sectorCode: filters.sectorCode,
					branchType: filters.branchType,
					exportType: filters.exportType,
					includeDialPosition: filters.includeDialPosition,
				}
			});
			return response.data;
		} catch (error) {
			console.warn("API Error, using mock data for demo:", error);
			await new Promise(resolve => setTimeout(resolve, 600));

			// Return mock data based on filters to simulate API behavior
			const bType = filters.branchType || 'intercom';
			const eType = filters.exportType || 'all';

			// @ts-ignore - indexing into mock object
			let data = MOCK_DATA[bType]?.[eType] || [];

			// Simple client-side simulation of filtering 'himself_item' for ALL types 
			// (Only relevant for 'all' exportType where structure is nested)
			if (!filters.includeDialPosition && eType === 'all') {
				data = data.map((item: any) => {
					if (item.Followme && item.Followme.list) {
						return {
							...item,
							Followme: {
								...item.Followme,
								list: item.Followme.list.filter((c: any) => c.type !== 'himself_item')
							}
						};
					}
					return item;
				});
			}
			// For 'onlyFollowMe', the structure is flat, filtering would be removing rows
			if (!filters.includeDialPosition && eType === 'onlyFollowMe') {
				data = data.filter((item: any) => item["Nome do contato"] !== "Posição de discagem do próprio ramal" && item["Nome do contato"] !== "Posição de discagem do próprio intercom");
			}

			return data;
		}
	},

	// Deprecated alias
	fetchFollowMe: async (filters: ExportFilters): Promise<ReportItem[]> => {
		return exportService.fetchIntercoms(filters);
	},
};
