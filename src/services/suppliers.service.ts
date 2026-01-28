import api from "../lib/axios";
import { Supplier } from "../pointofsale/interfaces/supplier.interface";

export class SuppliersService {
  static readonly getSuppliers = async (): Promise<Supplier[]> => {
    try {
      const response = await api.get<Supplier[]>("/suppliers", {
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

  static readonly getSupplierById = async (id: number): Promise<Supplier> => {
    try {
      const response = await api.get<Supplier>(`/suppliers/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el proveedor");
    }
  };

  static readonly createSupplier = async (dataSend: {
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
  }): Promise<Supplier[]> => {
    try {
      const response = await api.post<Supplier[]>("/suppliers", dataSend, {
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

  static readonly updateSupplier = async (
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
  ): Promise<Supplier> => {
    try {
      const currentUser = await SuppliersService.getSupplierById(id);

      // Crear un objeto con solo los campos que han cambiado
      const updatedFields: Partial<Supplier> = {};

      // Definir los campos a verificar
      const fieldsToCheck: {
        key: keyof Supplier;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [
        { key: "name", value: dataSend.name },
        { key: "contactName", value: dataSend.contactName },
        { key: "email", value: dataSend.email },
        { key: "phone", value: dataSend.phone },
        { key: "address", value: dataSend.address },
        { key: "city", value: dataSend.city },
        { key: "state", value: dataSend.state },
        { key: "zipCode", value: dataSend.zipCode },
        { key: "country", value: dataSend.country },
        { key: "taxId", value: dataSend.taxId },
        { key: "website", value: dataSend.website },
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
        const response = await api.put<Supplier>(
          `/suppliers/${id}`,
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
      throw new Error("Error al actualizar el proveedor");
    }
  };

  static readonly deleteSupplier = async (id: number): Promise<void> => {
    try {
      await api.delete(`/suppliers/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Supplier with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el proveedor");
    }
  };
}
