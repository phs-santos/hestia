import { pabxLabel } from "@/constants/commons";
import { useCompanyStore } from "@/stores/companyStore";

export function useFormat() {
    const { companies } = useCompanyStore();

    const getNameCompanyById = (id: number | string) => {
        const idString = id.toString();

        const company = companies.find((c) => c.id === idString);
        return company?.name || 'Desconhecido';
    };

    const getCondominiumType = (type: string) => {
        const condominiumType = {
            remote_condominium: 'Remoto',
            autonomous_condominium: 'Autônomo'
        };
        return condominiumType[type as keyof typeof condominiumType] || type;
    };

    const formatNamePabx = (pabx: string) => {
        return pabxLabel[pabx] || pabx;
    }

    const formatIdTicket = (id: string) => {
        return id.slice(-8).toUpperCase();
    }

    const formatPhone = (phone: string) => {
        if (!phone) return '';
        const phoneFormated = phone.replace(/\D/g, '');

        if (phoneFormated.length === 11) {
            return `(${phoneFormated.slice(0, 2)}) ${phoneFormated.slice(2, 7)}-${phoneFormated.slice(7)}`;
        }

        if (phoneFormated.length === 10) {
            return `(${phoneFormated.slice(0, 2)}) ${phoneFormated.slice(2, 6)}-${phoneFormated.slice(6)}`;
        }

        return phoneFormated;
    }

    return {
        getNameCompanyById,
        getCondominiumType,
        formatNamePabx,
        formatIdTicket,
        formatPhone
    };
}
