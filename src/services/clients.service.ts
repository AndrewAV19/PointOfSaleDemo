import api from "../lib/axios";
import { Clients } from "../pointofsale/interfaces/clients.interface";

export class ClientsService {
  static readonly getClients = async (): Promise<Clients[]> => {
    try {
      const response = await api.get<Clients[]>("/clients", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };

  static readonly getClientById = async (id: number): Promise<Clients> => {
    try {
      const response = await api.get<Clients>(`/clients/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el cliente");
    }
  };

  static readonly createClient = async (dataSend: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
  }): Promise<Clients[]> => {
    try {
      const response = await api.post<Clients[]>("/clients", dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("UnAuthorized");
    }
  };

  static readonly updateClient = async (
    id: number,
    dataSend: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: number;
      country?: string;
    }
  ): Promise<Clients> => {
    try {
      const currentUser = await ClientsService.getClientById(id);

      const updatedFields: Partial<Clients> = {};

      const fieldsToCheck: {
        key: keyof Clients;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [
        { key: "name", value: dataSend.name },
        { key: "email", value: dataSend.email },
        { key: "phone", value: dataSend.phone },
        { key: "address", value: dataSend.address },
        { key: "city", value: dataSend.city },
        { key: "state", value: dataSend.state },
        { key: "zipCode", value: dataSend.zipCode },
        { key: "country", value: dataSend.country },
      ];

      // Verificar y actualizar los campos
      fieldsToCheck.forEach(({ key, value, compare }) => {
        if (
          value !== undefined &&
          (compare
            ? compare(value, currentUser[key])
            : value !== currentUser[key])
        ) {
          updatedFields[key] = value;
        }
      });

      // Solo enviar la solicitud si hay campos actualizados
      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Clients>(
          `/clients/${id}`,
          updatedFields,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        console.log(response.data);
        return response.data;
      } else {
        console.log("No hay campos para actualizar");
        return currentUser;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el cliente");
    }
  };

  static readonly deleteClient = async (id: number): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Client with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el cliente");
    }
  };

  static readonly getClientsWithPendingPayments = async (): Promise<Clients[]> => {
    try {
      const response = await api.get<Clients[]>("/clients/pending-payments", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };
}
