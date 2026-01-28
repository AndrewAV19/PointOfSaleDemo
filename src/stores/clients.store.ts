import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Clients } from "../pointofsale/interfaces/clients.interface";
import { ClientsService } from "../services/clients.service";

interface ClientsState {
  listClients: Clients[];
  listClientsWithPendingPayments: Clients[];
  loading: boolean;
  getClients: () => Promise<void>;

  createClient: (dataSend: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
  }) => Promise<Clients[]>;

  updateClient: (
    id: number,
    dataSend: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: number;
      country: string;
    }
  ) => Promise<Clients>;

  deleteClient: (id: number) => Promise<void>;

  getClientsWithPendingPayments: () => Promise<void>;
}

const clientsStore: StateCreator<ClientsState> = (set, get) => ({
  listClients: [],
  listClientsWithPendingPayments: [],
  loading: false,

  getClients: async () => {
    try {
      const data = await ClientsService.getClients();
      console.log(data);
      set({ listClients: data, loading: true });
    } catch (error) {
      set({ listClients: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  createClient: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await ClientsService.createClient(dataSend);
      return data;
    } catch (error) {
      console.log(error);

      set({ loading: false });
      throw new Error("Error al crear la célula");
    }
  },

  updateClient: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedClient = await ClientsService.updateClient(id, dataSend);

      const updatedClients = get().listClients.map((client) =>
        client.id === id ? updatedClient : client
      );

      set({ listClients: updatedClients, loading: false });
      return updatedClient;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar el cliente");
    }
  },

  deleteClient: async (id: number) => {
    try {
      set({ loading: true });
      await ClientsService.deleteClient(id);
      const updatedClients = get().listClients.filter(
        (client) => client.id !== id
      );
      set({ listClients: updatedClients, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar el cliente");
    }
  },

  getClientsWithPendingPayments: async () => {
    try {
      const data = await ClientsService.getClientsWithPendingPayments();
      console.log(data);
      set({ listClientsWithPendingPayments: data, loading: true });
    } catch (error) {
      set({ listClients: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

});

export const storeClients = create<ClientsState>()(
  persist(clientsStore, {
    name: "clients-data",
  })
);
