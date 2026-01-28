import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { DataPointOfSale } from "../pointofsale/interfaces/data-point-of-sale.interface";
import { DataPointOfSaleService } from "../services/data.service";

interface DataPointOfSaleState {
  data: DataPointOfSale | null;
  loading: boolean;
  error: string | null;

  getData: () => Promise<void>;
  updateData: (
    id: number,
    dataSend: { name?: string; address?: string; phone?: string; printTicket?: boolean }
  ) => Promise<void>;
}

const dataPointOfSaleStore: StateCreator<DataPointOfSaleState> = (set) => ({
  data: null,
  loading: false,
  error: null,

  getData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await DataPointOfSaleService.getDataById(1);
      set({ data, loading: false });
    } catch (error) {
      set({ error: "Error al obtener los datos del negocio", loading: false });
      throw new Error("Error al obtener los datos del negocio");
    }
  },

  updateData: async (id, dataSend) => {
    try {
      set({ loading: true, error: null });
      const updatedData = await DataPointOfSaleService.updateData(id, dataSend);
      set({ data: updatedData, loading: false });
    } catch (error) {
      set({ error: "Error al actualizar los datos del negocio", loading: false });
      throw new Error("Error al actualizar los datos del negocio");
    }
  },
});

export const storeDataPointOfSale = create<DataPointOfSaleState>()(
  persist(dataPointOfSaleStore, {
    name: "data-point-of-sale",
  })
);