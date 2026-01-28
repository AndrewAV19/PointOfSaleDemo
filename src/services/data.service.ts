import api from "../lib/axios";
import { DataPointOfSale } from "../pointofsale/interfaces/data-point-of-sale.interface";

export class DataPointOfSaleService {
  static readonly getData = async (): Promise<DataPointOfSale> => {
    try {
      const response = await api.get<DataPointOfSale>("/data/1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("No autorizado");
    }
  };

  static readonly getDataById = async (id: number): Promise<DataPointOfSale> => {
    try {
      const response = await api.get<DataPointOfSale>(`/data/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener la información");
    }
  };

  static readonly updateData = async (
    id: number,
    dataSend: {
      name?: string;
      address?: string;
      phone?: string;
      printTicket?: boolean;
    }
  ): Promise<DataPointOfSale> => {
    try {
      const currentData = await DataPointOfSaleService.getData();

      // Crear un objeto con solo los campos que han cambiado
      const updatedFields: Partial<DataPointOfSale> = {};

      // Verificar y actualizar los campos
      if (dataSend.name !== undefined && dataSend.name !== currentData.name) {
        updatedFields.name = dataSend.name;
      }
      if (dataSend.address !== undefined && dataSend.address !== currentData.address) {
        updatedFields.address = dataSend.address;
      }
      if (dataSend.phone !== undefined && dataSend.phone !== currentData.phone) {
        updatedFields.phone = dataSend.phone;
      }
      if (
        dataSend.printTicket !== undefined &&
        dataSend.printTicket !== currentData.printTicket
      ) {
        updatedFields.printTicket = dataSend.printTicket;
      }

      // Solo enviar la solicitud si hay campos actualizados
      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<DataPointOfSale>(`/data/${id}`, updatedFields, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        return response.data;
      } else {
        console.log("No hay campos para actualizar");
        return currentData;
      }
    } catch (error) {
      throw new Error("Error al actualizar los datos del negocio");
    }
  };
}