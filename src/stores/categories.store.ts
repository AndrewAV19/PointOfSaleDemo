import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Categories } from "../pointofsale/interfaces/categories.interface";
import { CategoriesService } from "../services/categories.service";

interface CategoriesState {
  listCategories: Categories[];
  loading: boolean;
  getCategories: () => Promise<void>;

  createCategory: (dataSend: {
    name: string;
    description?: string;
  }) => Promise<Categories[]>;

  updateCategory: (
    id: number,
    dataSend: {
      name: string;
      description: string;
    }
  ) => Promise<Categories>;

  deleteCategory: (id: number) => Promise<void>;
}

const categoriesStore: StateCreator<CategoriesState> = (set, get) => ({
  listCategories: [],
  loading: false,

  getCategories: async () => {
    try {
      const data = await CategoriesService.getCategories();
      console.log(data);
      set({ listCategories: data, loading: true });
    } catch (error) {
      set({ listCategories: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  createCategory: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await CategoriesService.createCategory(dataSend);
      return data;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw new Error("Error al crear la categoría");
    }
  },

  updateCategory: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedCategory = await CategoriesService.updateCategory(id, dataSend);

      const updatedCategories = get().listCategories.map((category) =>
        category.id === id ? updatedCategory : category
      );

      set({ listCategories: updatedCategories, loading: false });
      return updatedCategory;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar la categoría");
    }
  },

  deleteCategory: async (id: number) => {
    try {
      set({ loading: true });
      await CategoriesService.deleteCategory(id);
      const updatedCategories = get().listCategories.filter(
        (category) => category.id !== id
      );
      set({ listCategories: updatedCategories, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar la categoría");
    }
  },
});

export const storeCategories = create<CategoriesState>()(
  persist(categoriesStore, {
    name: "categories-data",
  })
);
