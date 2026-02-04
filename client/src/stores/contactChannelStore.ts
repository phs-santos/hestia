import { create } from "zustand";
import { ContactChannel } from "@/types";
import { contactChannelApi, CreateContactChannelRequest, UpdateContactChannelRequest } from "@/services/contactChannelService";
import { toast } from "sonner";

interface ContactChannelStore {
    channels: ContactChannel[];
    loading: boolean;
    error: string | null;

    fetchChannels: () => Promise<void>;
    addChannel: (data: CreateContactChannelRequest) => Promise<void>;
    updateChannel: (id: string, data: UpdateContactChannelRequest) => Promise<void>;
    deleteChannel: (id: string) => Promise<void>;
}

export const useContactChannelStore = create<ContactChannelStore>((set, get) => ({
    channels: [],
    loading: false,
    error: null,

    fetchChannels: async () => {
        set({ loading: true, error: null });
        try {
            const data = await contactChannelApi.getAll();
            set({ channels: data, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message });
            toast.error("Erro ao carregar canais de contato");
        }
    },

    addChannel: async (data) => {
        set({ loading: true, error: null });
        try {
            const newChannel = await contactChannelApi.create(data);
            set((state) => ({
                channels: [...state.channels, newChannel],
                loading: false
            }));
            toast.success("Canal de contato criado com sucesso");
        } catch (error: any) {
            set({ loading: false, error: error.message });
            toast.error("Erro ao criar canal de contato");
            throw error;
        }
    },

    updateChannel: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedChannel = await contactChannelApi.update(id, data);
            set((state) => ({
                channels: state.channels.map((c) => (c.id === id ? updatedChannel : c)),
                loading: false
            }));
            toast.success("Canal de contato atualizado com sucesso");
        } catch (error: any) {
            set({ loading: false, error: error.message });
            toast.error("Erro ao atualizar canal de contato");
            throw error;
        }
    },

    deleteChannel: async (id) => {
        set({ loading: true, error: null });
        try {
            await contactChannelApi.delete(id);
            set((state) => ({
                channels: state.channels.filter((c) => c.id !== id),
                loading: false
            }));
            toast.success("Canal de contato removido com sucesso");
        } catch (error: any) {
            set({ loading: false, error: error.message });
            toast.error("Erro ao remover canal de contato");
            throw error;
        }
    },
}));
