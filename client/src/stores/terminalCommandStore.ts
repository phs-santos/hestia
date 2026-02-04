import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TerminalCommand, CreateTerminalCommandInput } from "@/types/command";

interface TerminalCommandStore {
    commands: TerminalCommand[];
    loading: boolean;
    searchQuery: string;
    categoryFilter: string | null;

    addCommand: (command: CreateTerminalCommandInput) => void;
    updateCommand: (id: string, updates: Partial<TerminalCommand>) => void;
    deleteCommand: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setCategoryFilter: (category: string | null) => void;
    getFilteredCommands: () => TerminalCommand[];
}

const DEFAULT_COMMANDS: TerminalCommand[] = [
    {
        id: "1",
        title: "SIP Show Peer",
        description: "Exibe informações detalhadas de um peer SIP no Asterisk",
        category: "asterisk",
        template: "sip show peer ${peer}",
        variables: [
            { name: "peer", label: "Nome do Peer", placeholder: "Ex: 1001", required: true }
        ],
        tags: ["sip", "peer", "debug"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "2",
        title: "SIP Show Registry",
        description: "Lista todos os registros SIP ativos",
        category: "asterisk",
        template: "sip show registry",
        variables: [],
        tags: ["sip", "registry"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "3",
        title: "Core Show Channels",
        description: "Mostra canais ativos no Asterisk",
        category: "asterisk",
        template: "core show channels ${verbose}",
        variables: [
            { name: "verbose", label: "Verbose", placeholder: "verbose ou vazio", defaultValue: "" }
        ],
        tags: ["channels", "debug"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "4",
        title: "Docker PS",
        description: "Lista containers Docker em execução",
        category: "docker",
        template: "docker ps ${options}",
        variables: [
            { name: "options", label: "Opções", placeholder: "-a para todos", defaultValue: "" }
        ],
        tags: ["container", "list"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "5",
        title: "Docker Logs",
        description: "Exibe logs de um container",
        category: "docker",
        template: "docker logs ${options} ${container}",
        variables: [
            { name: "options", label: "Opções", placeholder: "-f --tail 100", defaultValue: "-f --tail 100" },
            { name: "container", label: "Container", placeholder: "nome ou ID", required: true }
        ],
        tags: ["logs", "debug"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "6",
        title: "Netstat Portas",
        description: "Lista portas em uso no sistema",
        category: "network",
        template: "netstat -tulpn | grep ${port}",
        variables: [
            { name: "port", label: "Porta", placeholder: "5060", required: true }
        ],
        tags: ["network", "port", "debug"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "7",
        title: "Disk Usage",
        description: "Mostra uso de disco das partições",
        category: "linux",
        template: "df -h ${path}",
        variables: [
            { name: "path", label: "Caminho", placeholder: "/" , defaultValue: "/" }
        ],
        tags: ["disk", "storage"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "8",
        title: "Find Files",
        description: "Busca arquivos no sistema",
        category: "linux",
        template: "find ${path} -name \"${pattern}\" ${options}",
        variables: [
            { name: "path", label: "Diretório", placeholder: "/var/log", required: true },
            { name: "pattern", label: "Padrão", placeholder: "*.log", required: true },
            { name: "options", label: "Opções", placeholder: "-type f", defaultValue: "" }
        ],
        tags: ["search", "files"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "9",
        title: "Git Log",
        description: "Exibe histórico de commits",
        category: "git",
        template: "git log --oneline -n ${count}",
        variables: [
            { name: "count", label: "Quantidade", placeholder: "10", defaultValue: "10" }
        ],
        tags: ["history", "commits"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "10",
        title: "Tail Log",
        description: "Acompanha arquivo de log em tempo real",
        category: "linux",
        template: "tail -f ${lines} ${file}",
        variables: [
            { name: "lines", label: "Linhas", placeholder: "-n 100", defaultValue: "-n 100" },
            { name: "file", label: "Arquivo", placeholder: "/var/log/syslog", required: true }
        ],
        tags: ["logs", "monitor"],
        userId: "system",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const useTerminalCommandStore = create<TerminalCommandStore>()(
    persist(
        (set, get) => ({
            commands: DEFAULT_COMMANDS,
            loading: false,
            searchQuery: "",
            categoryFilter: null,

            addCommand: (commandData) => {
                const newCommand: TerminalCommand = {
                    ...commandData,
                    id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                set((state) => ({
                    commands: [newCommand, ...state.commands]
                }));
            },

            updateCommand: (id, updates) => {
                set((state) => ({
                    commands: state.commands.map((c) =>
                        c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
                    )
                }));
            },

            deleteCommand: (id) => {
                set((state) => ({
                    commands: state.commands.filter((c) => c.id !== id)
                }));
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
            
            setCategoryFilter: (category) => set({ categoryFilter: category }),

            getFilteredCommands: () => {
                const { commands, searchQuery, categoryFilter } = get();
                return commands.filter((cmd) => {
                    const matchesSearch = !searchQuery || 
                        cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        cmd.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        cmd.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    const matchesCategory = !categoryFilter || cmd.category === categoryFilter;
                    
                    return matchesSearch && matchesCategory;
                });
            }
        }),
        {
            name: "terminal-commands-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ commands: state.commands })
        }
    )
);
