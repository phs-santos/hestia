import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Category } from "@/types";
import { categoryApi } from "@/services/categoryService";
import { toast } from "sonner";

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  getAllCategories: (force?: boolean) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  invalidateCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,
      lastFetched: null,

      getAllCategories: async (force = false) => {
        const { lastFetched, categories } = get();

        if (!force && lastFetched && categories.length > 0) {
          if (Date.now() - lastFetched < CACHE_DURATION) {
            return;
          }
        }

        set({ loading: true });
        try {
          const data = await categoryApi.getAll();
          set({ categories: data, loading: false, error: null, lastFetched: Date.now() });
        } catch (error: any) {
          set({ loading: false, error: error.message });
          toast.error("Erro ao carregar categorias");
        }
      },

      getCategoryById: (id) => get().categories.find((c) => c.id === id),

      addCategory: async (categoryData) => {
        try {
          const newCategory = await categoryApi.create(categoryData);
          set((state) => ({
            categories: [...state.categories, newCategory],
            lastFetched: Date.now()
          }));
        } catch (error: any) {
          toast.error(error.message);
          throw error;
        }
      },

      updateCategory: async (id, updates) => {
        try {
          const updated = await categoryApi.update(id, updates);
          set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? updated : c)),
            lastFetched: Date.now()
          }));
        } catch (error: any) {
          toast.error(error.message);
          throw error;
        }
      },

      deleteCategory: async (id) => {
        try {
          await categoryApi.delete(id);
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            lastFetched: Date.now()
          }));
        } catch (error: any) {
          toast.error(error.message);
          throw error;
        }
      },

      invalidateCache: () => {
        set({ lastFetched: null, categories: [] });
      },
    }),
    {
      name: "categories-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ categories: state.categories, lastFetched: state.lastFetched }),
    }
  )
);
