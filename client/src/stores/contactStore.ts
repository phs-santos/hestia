import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Contact, CreateContactInput, UpdateContactInput, UpdateContactTemperatureInput } from "@/types";
import { contactService } from "@/services/contactService";
import { toast } from "sonner";

interface ContactStore {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;

    getAllContacts: (force?: boolean) => Promise<void>;
    createContact: (data: CreateContactInput) => Promise<Contact>;
    updateContact: (id: string, data: UpdateContactInput) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    updateContactTemperature: (id: string, data: UpdateContactTemperatureInput) => Promise<void>;
    invalidateCache: () => void;
    handleRealTimeUpdate: (data: any) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useContactStore = create<ContactStore>()(
    persist(
        (set, get) => ({
            contacts: [],
            loading: false,
            error: null,
            lastFetched: null,

            getAllContacts: async (force = false) => {
                const { lastFetched, contacts } = get();

                if (!force && lastFetched && contacts.length > 0) {
                    if (Date.now() - lastFetched < CACHE_DURATION) {
                        return;
                    }
                }

                set({ loading: true });

                try {
                    const data = await contactService.getAll();
                    set({
                        contacts: data,
                        loading: false,
                        error: null,
                        lastFetched: Date.now(),
                    });
                } catch (error: any) {
                    set({ loading: false, error: error.message });
                    toast.error("Erro ao carregar contatos");
                }
            },

            createContact: async (data) => {
                set({ loading: true });
                try {
                    const newContact = await contactService.create(data);
                    set((state) => {
                        const exists = state.contacts.some(c => c.id === newContact.id);
                        if (exists) {
                            return state;
                        }

                        return {
                            contacts: [...state.contacts, newContact],
                            loading: false,
                        };
                    });
                    toast.success("Contato criado com sucesso!");
                    return newContact;
                } catch (error: any) {
                    set({ loading: false });
                    toast.error("Erro ao criar contato");
                    throw error;
                }
            },

            updateContact: async (id, data) => {
                set({ loading: true });
                try {
                    const updatedContact = await contactService.update(id, data);
                    set((state) => ({
                        contacts: state.contacts.map((c) => (c.id === id ? updatedContact : c)),
                        loading: false,
                    }));
                    toast.success("Contato atualizado com sucesso!");
                } catch (error: any) {
                    set({ loading: false });
                    toast.error("Erro ao atualizar contato");
                    throw error;
                }
            },

            deleteContact: async (id) => {
                set({ loading: true });
                try {
                    await contactService.delete(id);
                    set((state) => ({
                        contacts: state.contacts.filter((c) => c.id !== id),
                        loading: false,
                    }));
                    toast.success("Contato removido com sucesso!");
                } catch (error: any) {
                    set({ loading: false });
                    toast.error("Erro ao remover contato");
                    throw error;
                }
            },

            updateContactTemperature: async (id, data) => {
                // Optimistic update could be tricky with history, so we'll wait for response
                try {
                    const updatedContact = await contactService.updateTemperature(id, data);
                    set((state) => ({
                        contacts: state.contacts.map((c) => (c.id === id ? updatedContact : c)),
                    }));
                    toast.success("Temperatura atualizada!");
                } catch (error: any) {
                    toast.error("Erro ao atualizar temperatura");
                    throw error;
                }
            },

            invalidateCache: () => {
                set({
                    lastFetched: null,
                    contacts: [],
                });
            },

            handleRealTimeUpdate: (contactData: any) => {
                set((state) => {
                    const contact = contactData as Contact;
                    const exists = state.contacts.some(c => c.id === contact.id);

                    if (exists) {
                        return {
                            contacts: state.contacts.map(c => c.id === contact.id ? { ...c, ...contact } : c)
                        };
                    } else {
                        return {
                            contacts: [...state.contacts, contact]
                        };
                    }
                });
            },
        }),
        {
            name: "contact-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                contacts: state.contacts,
                lastFetched: state.lastFetched,
            }),
        }
    )
);
