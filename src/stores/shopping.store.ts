import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { ShoppingService } from "../services/shopping.service";
import { Shopping, ShoppingRequest } from "../pointofsale/interfaces/shopping.interface";

interface ShoppingState {
  listShoppings: Shopping[];
  loading: boolean;
  getShoppings: () => Promise<void>;

  createShopping: (dataSend: ShoppingRequest) => Promise<Shopping>;

  updateShopping: (
    id: number,
    dataSend: Partial<ShoppingRequest>
  ) => Promise<Shopping>;

  deleteShopping: (id: number) => Promise<void>;
}

const shoppingStore: StateCreator<ShoppingState> = (set, get) => ({
  listShoppings: [],
  loading: false,

  getShoppings: async () => {
    try {
      set({ loading: true });
      const data = await ShoppingService.getShoppings();
      set({ listShoppings: data, loading: false });
    } catch (error) {
      set({ listShoppings: [], loading: false });
      throw new Error("Error al obtener las compras");
    }
  },

  createShopping: async (dataSend) => {
    try {
      set({ loading: true });
      const newShopping = await ShoppingService.createShopping(dataSend);
      const updatedShoppings = [...get().listShoppings, newShopping];
      set({ listShoppings: updatedShoppings, loading: false });
      return newShopping;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al crear la compra");
    }
  },

  updateShopping: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedShopping = await ShoppingService.updateShopping(id, dataSend);

      const updatedShoppings = get().listShoppings.map((shopping) =>
        shopping.id === id ? updatedShopping : shopping
      );

      set({ listShoppings: updatedShoppings, loading: false });
      return updatedShopping;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar la compra");
    }
  },

  deleteShopping: async (id: number) => {
    try {
      set({ loading: true });
      await ShoppingService.deleteShopping(id);

      const updatedShoppings = get().listShoppings.filter(
        (shopping) => shopping.id !== id
      );

      set({ listShoppings: updatedShoppings, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar la compra");
    }
  },
});

// Crear el store con persistencia
export const storeShoppings = create<ShoppingState>()(
  persist(shoppingStore, {
    name: "shoppings-data",
  })
);