import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Supplier } from "../pointofsale/interfaces/supplier.interface";
import { SuppliersService } from "../services/suppliers.service";

interface SuppliersState {
  listSuppliers: Supplier[];
  loading: boolean;
  getSuppliers: () => Promise<void>;

  createSupplier: (dataSend: {
    name: string;
    contactName?: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
    taxId?: string;
    website?: string;
  }) => Promise<Supplier[]>;

  updateSupplier: (
    id: number,
    dataSend: {
      name: string;
      contactName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: number;
      country: string;
      taxId: string;
      website: string;
    }
  ) => Promise<Supplier>;

  deleteSupplier: (id: number) => Promise<void>;
}

const suppliersStore: StateCreator<SuppliersState> = (set, get) => ({
  listSuppliers: [],
  loading: false,

  getSuppliers: async () => {
    try {
      const data = await SuppliersService.getSuppliers();
      console.log(data);
      set({ listSuppliers: data, loading: true });
    } catch (error) {
      set({ listSuppliers: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  createSupplier: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await SuppliersService.createSupplier(dataSend);
      return data;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw new Error("Error al crear el proveedor");
    }
  },

  updateSupplier: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedSupplier = await SuppliersService.updateSupplier(id, dataSend);

      const updatedSuppliers = get().listSuppliers.map((supplier) =>
        supplier.id === id ? updatedSupplier : supplier
      );

      set({ listSuppliers: updatedSuppliers, loading: false });
      return updatedSupplier;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar el proveedor");
    }
  },

  deleteSupplier: async (id: number) => {
    try {
      set({ loading: true });
      await SuppliersService.deleteSupplier(id);
      const updatedSuppliers = get().listSuppliers.filter(
        (supplier) => supplier.id !== id
      );
      set({ listSuppliers: updatedSuppliers, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar el proveedor");
    }
  },
});

export const storeSuppliers = create<SuppliersState>()(
  persist(suppliersStore, {
    name: "suppliers-data",
  })
);
