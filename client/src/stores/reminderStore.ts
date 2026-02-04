import { create } from "zustand";
import { TicketReminder, CreateReminderInput } from "@/types/reminder";
import { reminderApi } from "@/services/reminderService";
import { toast } from "sonner";

const STORAGE_KEY = "athena_reminders";

// Load reminders from localStorage
const loadRemindersFromStorage = (): TicketReminder[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load reminders from localStorage:", error);
  }
  return [];
};

// Save reminders to localStorage
const saveRemindersToStorage = (reminders: TicketReminder[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error("Failed to save reminders to localStorage:", error);
  }
};

interface ReminderStore {
  reminders: TicketReminder[];
  loading: boolean;
  error: string | null;

  fetchReminders: () => Promise<void>;
  addReminder: (input: CreateReminderInput) => Promise<TicketReminder>;
  updateReminder: (id: string, data: Partial<TicketReminder>) => Promise<TicketReminder>;
  removeReminder: (id: string) => Promise<void>;
  markAsNotified: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;

  // Helpers (can still filter locally from the fetched list)
  getRemindersForTicket: (ticketId: string) => TicketReminder[];
  getActiveReminders: () => TicketReminder[];
  getDueReminders: () => TicketReminder[];
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: loadRemindersFromStorage(),
  loading: false,
  error: null,

  fetchReminders: async () => {
    set({ loading: true, error: null });
    try {
      const reminders = await reminderApi.getAll();
      set({ reminders, loading: false });
      saveRemindersToStorage(reminders);
    } catch (error: any) {
      set({ loading: false, error: error.message || "Falha ao buscar lembretes" });
      // toast.error("Erro ao carregar lembretes"); // Optional: prevent spam on auto-fetch
    }
  },

  addReminder: async (input: CreateReminderInput) => {
    try {
      const newReminder = await reminderApi.create(input);
      set((state) => {
        const updatedReminders = [...state.reminders, newReminder];
        saveRemindersToStorage(updatedReminders);
        return { reminders: updatedReminders };
      });
      return newReminder;
    } catch (error: any) {
      toast.error("Erro ao criar lembrete");
      throw error;
    }
  },

  updateReminder: async (id: string, data: Partial<TicketReminder>) => {
    try {
      const updated = await reminderApi.update(id, data);
      set((state) => {
        const updatedReminders = state.reminders.map((r) => (r.id === id ? updated : r));
        saveRemindersToStorage(updatedReminders);
        return { reminders: updatedReminders };
      });
      return updated;
    } catch (error: any) {
      toast.error("Erro ao atualizar lembrete");
      throw error;
    }
  },

  removeReminder: async (id: string) => {
    try {
      await reminderApi.delete(id);
      set((state) => {
        const updatedReminders = state.reminders.filter((r) => r.id !== id);
        saveRemindersToStorage(updatedReminders);
        return { reminders: updatedReminders };
      });
    } catch (error: any) {
      toast.error("Erro ao remover lembrete");
      throw error;
    }
  },

  markAsNotified: async (id: string) => {
    try {
      // Optimistic update
      set((state) => {
        const updatedReminders = state.reminders.map((r) =>
          r.id === id ? { ...r, notified: true } : r
        );
        saveRemindersToStorage(updatedReminders);
        return { reminders: updatedReminders };
      });

      await reminderApi.update(id, { notified: true });
    } catch (error: any) {
      // Revert on error? Or just log.
      console.error("Failed to mark as notified", error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      set((state) => {
        const updatedReminders = state.reminders.map((r) =>
          r.id === id ? { ...r, read: true } : r
        );
        saveRemindersToStorage(updatedReminders);
        return { reminders: updatedReminders };
      });
      await reminderApi.update(id, { read: true });
    } catch (error: any) {
      console.error("Failed to mark as read", error);
    }
  },

  getRemindersForTicket: (ticketId: string) => {
    return get().reminders.filter((r) => r.ticketId === ticketId);
  },

  getActiveReminders: () => {
    return get().reminders.filter((r) => !r.read && !r.notified);
    // "Active" usually means not processed. Adjust logic if needed. 
    // Original was !r.notified. But now we have 'read'. 
    // Let's keep !r.notified as "active" for notification purposes.
  },

  getDueReminders: () => {
    const now = new Date();
    return get().reminders.filter(
      (r) => !r.notified && new Date(r.scheduledAt) <= now
    );
  },
}));

// Listen for storage changes from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const reminders = JSON.parse(e.newValue);
        useReminderStore.setState({ reminders });
      } catch (error) {
        console.error("Failed to sync reminders from storage event:", error);
      }
    }
  });
}
