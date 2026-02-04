import { api, handleApiError } from "@/lib/api";
import { Company, CompanyLastTen } from "@/types";

export const companyApi = {
    /**
     * Get all companies
     */
    getAll: async (): Promise<Company[]> => {
        try {
            const response = await api.get<Company[]>("/companies");
            return response.data.map(mapCompany);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get company by ID
     */
    getById: async (id: number | string): Promise<Company> => {
        try {
            const response = await api.get<any>(`/companies/${id}`);
            return mapCompany(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get last 10 companies
     */
    getLastTen: async (): Promise<CompanyLastTen> => {
        try {
            const response = await api.get<any>("/companies/last-ten");
            return mapCompanyLastTen(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

function mapCompany(data: any): Company {
    return {
        ...data,
        id: data.id ?? data._id,
        integrations: data.integrations ?? null,
        configurations: data.configurations ?? null,
    };
}

function mapCompanyLastTen(data: any): CompanyLastTen {
    return {
        remote: data.condominiums.remote,
        autonomous: data.condominiums.autonomous,
        excluded: data.condominiums.excluded,
    };
}

