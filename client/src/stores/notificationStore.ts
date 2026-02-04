import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SocketNotification, NotificationConfig } from '@/types/notification';

interface NotificationState {
  notifications: SocketNotification[];
  config: NotificationConfig;
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<SocketNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateConfig: (config: Partial<NotificationConfig>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      config: {
        enabled: true,
        sound: true,
        browser: true,
        toast: true,
        soundFile: 'notification-v1',
      },
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: SocketNotification = {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      updateConfig: (config) => {
        set((state) => ({
          config: { ...state.config, ...config },
        }));
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        config: state.config,
        // Don't persist notifications themselves
      }),
    }
  )
);
