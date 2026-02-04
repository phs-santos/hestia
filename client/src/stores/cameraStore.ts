import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Camera, CreateCameraInput } from "@/types";
import { cameraService } from "@/services/cameraService";
import { toast } from "sonner";

interface CameraStore {
    cameras: Camera[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;

    getAllCameras: (force?: boolean) => Promise<void>;
    addCamera: (camera: CreateCameraInput) => Promise<Camera>;
    updateCamera: (id: string, updates: Partial<Camera>) => Promise<void>;
    deleteCamera: (id: string) => Promise<void>;
    invalidateCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useCameraStore = create<CameraStore>()(
    persist(
        (set, get) => ({
            cameras: [],
            loading: false,
            error: null,
            lastFetched: null,

            getAllCameras: async (force = false) => {
                const { lastFetched, cameras } = get();

                if (!force && lastFetched && cameras.length > 0) {
                    if (Date.now() - lastFetched < CACHE_DURATION) {
                        return;
                    }
                }

                set({ loading: true });
                try {
                    const data = await cameraService.getAll();
                    set({
                        cameras: data,
                        loading: false,
                        error: null,
                        lastFetched: Date.now()
                    });
                } catch (error: any) {
                    console.error("Erro ao carregar câmeras:", error);
                    set({ loading: false, error: error.message });
                    toast.error("Erro ao carregar câmeras");
                }
            },

            addCamera: async (cameraData: CreateCameraInput) => {
                try {
                    const newCamera = await cameraService.create(cameraData);
                    set((state) => ({
                        cameras: [newCamera, ...state.cameras],
                        lastFetched: Date.now()
                    }));
                    toast.success("Câmera adicionada com sucesso");
                    return newCamera;
                } catch (error: any) {
                    toast.error(error.message || "Erro ao adicionar câmera");
                    throw error;
                }
            },

            updateCamera: async (id, updates) => {
                try {
                    const updated = await cameraService.update(id, updates);
                    set((state) => ({
                        cameras: state.cameras.map((c) => (c.id === id ? updated : c)),
                        lastFetched: Date.now()
                    }));
                    toast.success("Câmera atualizada com sucesso");
                } catch (error: any) {
                    toast.error(error.message || "Erro ao atualizar câmera");
                    throw error;
                }
            },

            deleteCamera: async (id) => {
                try {
                    await cameraService.delete(id);
                    set((state) => ({
                        cameras: state.cameras.filter((c) => c.id !== id),
                        lastFetched: Date.now()
                    }));
                    toast.success("Câmera removida com sucesso");
                } catch (error: any) {
                    toast.error(error.message || "Erro ao excluir câmera");
                    throw error;
                }
            },

            invalidateCache: () => {
                set({ lastFetched: null, cameras: [] });
            },
        }),
        {
            name: "cameras-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ cameras: state.cameras, lastFetched: state.lastFetched }),
        }
    )
);
