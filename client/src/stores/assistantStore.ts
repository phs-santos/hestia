import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AssistantStore {
    isEnabled: boolean;
    setEnabled: (enabled: boolean) => void;
    toggle: () => void;
}

export const useAssistantStore = create<AssistantStore>()(
    persist(
        (set) => ({
            isEnabled: true,
            setEnabled: (enabled) => set({ isEnabled: enabled }),
            toggle: () => set((state) => ({ isEnabled: !state.isEnabled })),
        }),
        {
            name: 'assistant-settings',
        }
    )
);
