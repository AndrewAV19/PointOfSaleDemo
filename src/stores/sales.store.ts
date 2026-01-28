import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { SaleService } from "../services/sales.service";
import { Sale, SaleRequest } from "../pointofsale/interfaces/sales.interface";

interface SaleState {
  listSales: Sale[];
  loading: boolean;
  getSales: () => Promise<void>;

  createSale: (dataSend: SaleRequest) => Promise<Sale>;

  updateSale: (id: number, dataSend: Partial<SaleRequest>) => Promise<Sale>;

  deleteSale: (id: number) => Promise<void>;
  cancelSale: (id: number) => Promise<void>;
}

const saleStore: StateCreator<SaleState> = (set, get) => ({
  listSales: [],
  loading: false,

  getSales: async () => {
    try {
      set({ loading: true });
      const data = await SaleService.getSales();
      set({ listSales: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ listSales: [], loading: false });
      throw new Error("Error al obtener las ventas");
    }
  },

  createSale: async (dataSend) => {
    try {
      set({ loading: true });
      const newSale = await SaleService.createSale(dataSend);
      const updatedSales = [...get().listSales, newSale];
      set({ listSales: updatedSales, loading: false });
      return newSale;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al crear la venta");
    }
  },

  updateSale: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedSale = await SaleService.updateSale(id, dataSend);

      const updatedSales = get().listSales.map((sale) =>
        sale.id === id ? updatedSale : sale
      );

      set({ listSales: updatedSales, loading: false });
      return updatedSale;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar la venta");
    }
  },

  deleteSale: async (id: number) => {
    try {
      set({ loading: true });
      await SaleService.deleteSale(id);

      const updatedSales = get().listSales.filter((sale) => sale.id !== id);

      set({ listSales: updatedSales, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar la venta");
    }
  },

  cancelSale: async (id: number) => {
    try {
      set({ loading: true });

      await SaleService.cancelSale(id);

      const updatedSales = get().listSales.map((sale) =>
        sale.id === id ? { ...sale, state: "cancelada" } : sale
      );

      set({ listSales: updatedSales, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al cancelar la venta");
    }
  },
});

// Crear el store con persistencia
export const storeSales = create<SaleState>()(
  persist(saleStore, {
    name: "sales-data",
  })
);
