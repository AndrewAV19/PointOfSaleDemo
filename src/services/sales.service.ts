import api from "../lib/axios";
import { ClientDebtDTO } from "../pointofsale/interfaces/clients.interface";
import { Sale, SaleRequest } from "../pointofsale/interfaces/sales.interface";

export class SaleService {
  static readonly getSales = async (): Promise<Sale[]> => {
    try {
      const response = await api.get<Sale[]>("/sales", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("UnAuthorized");
    }
  };

  static readonly getSaleById = async (id: number): Promise<Sale> => {
    try {
      const response = await api.get<Sale>(`/sales/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener la venta");
    }
  };

  static readonly createSale = async (dataSend: SaleRequest): Promise<Sale> => {
    try {
      const response = await api.post<Sale>("/sales", dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear la venta");
    }
  };

  static readonly updateSale = async (
    id: number,
    dataSend: Partial<SaleRequest>
  ): Promise<Sale> => {
    try {
      const currentSale = await SaleService.getSaleById(id);

      const updatedFields: Partial<Sale> = {};

      const fieldsToCheck: {
        key: keyof Sale;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [
        { key: "client", value: dataSend.client },
        { key: "saleProducts", value: dataSend.saleProducts },
        { key: "amount", value: dataSend.amount },
        { key: "state", value: dataSend.state },
        { key: "total", value: dataSend.total },
      ];

      fieldsToCheck.forEach(({ key, value, compare }) => {
        if (
          value !== undefined &&
          (compare
            ? compare(value, currentSale[key])
            : value !== currentSale[key])
        ) {
          updatedFields[key] = value;
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Sale>(`/sales/${id}`, updatedFields, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        console.log(response.data);
        return response.data;
      } else {
        console.log("No hay campos para actualizar");
        return currentSale;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar la venta");
    }
  };

  static readonly deleteSale = async (id: number): Promise<void> => {
    try {
      await api.delete(`/sales/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Sale with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar la venta");
    }
  };

  static readonly cancelSale = async (id: number): Promise<void> => {
    try {
      await api.put(
        `/sales/cancel/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        } // Configuración
      );
      console.log(`Sale with id ${id} canceled successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al cancelar la venta");
    }
  };

  static readonly getClientDebts = async (
    clientId: number
  ): Promise<ClientDebtDTO[]> => {
    try {
      const response = await api.get<ClientDebtDTO[]>(
        `/sales/client-debts/${clientId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener las deudas del cliente");
    }
  };
}