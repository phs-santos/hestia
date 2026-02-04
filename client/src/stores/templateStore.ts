import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MessageTemplate {
    id: string;
    name: string;
    category: string;
    template: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTemplateInput {
    name: string;
    category: string;
    template: string;
}

interface TemplateState {
    templates: MessageTemplate[];
    loading: boolean;
    searchQuery: string;
    categoryFilter: string | null;

    // Actions
    addTemplate: (data: CreateTemplateInput) => void;
    updateTemplate: (id: string, data: CreateTemplateInput) => void;
    deleteTemplate: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setCategoryFilter: (category: string | null) => void;
    getFilteredTemplates: () => MessageTemplate[];
    getCategories: () => string[];
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
    {
        id: "1",
        name: "Boas-vindas",
        category: "Início",
        template:
            "Olá {nome}! 👋\n\nSeja bem-vindo(a) ao nosso sistema de monitoramento. Estamos à disposição para ajudá-lo(a).\n\nQualquer dúvida, entre em contato!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Manutenção Agendada",
        category: "Suporte",
        template:
            "Prezado(a) {nome},\n\nInformamos que haverá manutenção programada no sistema no dia {data} às {hora}.\n\nO serviço pode ficar indisponível por aproximadamente {duracao}.\n\nAgradecemos a compreensão.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Chamado Resolvido",
        category: "Suporte",
        template:
            "Olá {nome}!\n\nSeu chamado #{numero} foi resolvido com sucesso. ✅\n\nResumo da solução:\n{solucao}\n\nCaso tenha mais alguma dúvida, estamos à disposição!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "4",
        name: "Lembrete de Pagamento",
        category: "Financeiro",
        template:
            "Prezado(a) {nome},\n\nLembramos que a fatura do mês de {mes} vence no dia {vencimento}.\n\nValor: R$ {valor}\n\nPara mais informações, entre em contato.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "5",
        name: "Novo Recurso",
        category: "Novidades",
        template:
            "🚀 Novidade!\n\nOlá {nome},\n\nLançamos uma nova funcionalidade: {recurso}!\n\n{descricao}\n\nExperimente agora mesmo!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const useTemplateStore = create<TemplateState>()(
    persist(
        (set, get) => ({
            templates: DEFAULT_TEMPLATES,
            loading: false,
            searchQuery: "",
            categoryFilter: null,

            addTemplate: (data) => {
                const newTemplate: MessageTemplate = {
                    id: crypto.randomUUID(),
                    ...data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    templates: [...state.templates, newTemplate],
                }));
            },

            updateTemplate: (id, data) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === id
                            ? { ...t, ...data, updatedAt: new Date().toISOString() }
                            : t
                    ),
                }));
            },

            deleteTemplate: (id) => {
                set((state) => ({
                    templates: state.templates.filter((t) => t.id !== id),
                }));
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
            setCategoryFilter: (category) => set({ categoryFilter: category }),

            getFilteredTemplates: () => {
                const { templates, searchQuery, categoryFilter } = get();
                return templates.filter((t) => {
                    const matchesSearch =
                        !searchQuery ||
                        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.template.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory =
                        !categoryFilter || t.category === categoryFilter;
                    return matchesSearch && matchesCategory;
                });
            },

            getCategories: () => {
                const { templates } = get();
                return [...new Set(templates.map((t) => t.category))];
            },
        }),
        {
            name: "template-storage",
        }
    )
);
