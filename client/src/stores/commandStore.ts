import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OpeningCommand, CreateOpeningCommandInput } from "@/types/command";
import { commandService } from "@/services/commandService";
import { toast } from "sonner";

interface CommandStore {
    commands: OpeningCommand[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    executingId: string | null;

    getAllCommands: (force?: boolean) => Promise<void>;
    addCommand: (command: CreateOpeningCommandInput) => Promise<OpeningCommand>;
    updateCommand: (id: string, updates: Partial<OpeningCommand>) => Promise<void>;
    deleteCommand: (id: string) => Promise<void>;
    executeCommand: (id: string) => Promise<void>;
    invalidateCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useCommandStore = create<CommandStore>()(
    persist(
        (set, get) => ({
            commands: [],
            loading: false,
            error: null,
            lastFetched: null,
            executingId: null,

            getAllCommands: async (force = false) => {
                const { lastFetched, commands } = get();

                if (!force && lastFetched && commands.length > 0) {
                    if (Date.now() - lastFetched < CACHE_DURATION) {
                        return;
                    }
                }

                set({ loading: true });
                try {
                    const data = await commandService.getAll();
                    set({
                        commands: data,
                        loading: false,
                        error: null,
                        lastFetched: Date.now()
                    });
                } catch (error: any) {
                    console.error("Erro ao carregar comandos:", error);
                    set({ loading: false, error: error.message });
                    toast.error("Erro ao carregar comandos");
                }
            },

            addCommand: async (commandData: CreateOpeningCommandInput) => {
                try {
                    const newCommand = await commandService.create(commandData);
                    set((state) => ({
                        commands: [newCommand, ...state.commands],
                        lastFetched: Date.now()
                    }));
                    toast.success("Comando adicionado com sucesso");
                    return newCommand;
                } catch (error: any) {
                    toast.error(error.message || "Erro ao adicionar comando");
                    throw error;
                }
            },

            updateCommand: async (id, updates) => {
                try {
                    const updated = await commandService.update(id, updates);
                    set((state) => ({
                        commands: state.commands.map((c) => (c.id === id ? updated : c)),
                        lastFetched: Date.now()
                    }));
                    toast.success("Comando atualizado com sucesso");
                } catch (error: any) {
                    toast.error(error.message || "Erro ao atualizar comando");
                    throw error;
                }
            },

            deleteCommand: async (id) => {
                try {
                    await commandService.delete(id);
                    set((state) => ({
                        commands: state.commands.filter((c) => c.id !== id),
                        lastFetched: Date.now()
                    }));
                    toast.success("Comando removido com sucesso");
                } catch (error: any) {
                    toast.error(error.message || "Erro ao excluir comando");
                    throw error;
                }
            },

            executeCommand: async (id) => {
                set({ executingId: id });
                try {
                    const result = await commandService.execute(id);
                    toast.success(result.message || "Comando executado com sucesso");
                } catch (error: any) {
                    toast.error(error.message || "Erro ao executar comando");
                    throw error;
                } finally {
                    set({ executingId: null });
                }
            },

            invalidateCache: () => {
                set({ lastFetched: null, commands: [] });
            },
        }),
        {
            name: "commands-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ commands: state.commands, lastFetched: state.lastFetched }),
        }
    )
);
