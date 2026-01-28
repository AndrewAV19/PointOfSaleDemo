import api from "../lib/axios";
import { Shopping, ShoppingRequest } from "../pointofsale/interfaces/shopping.interface";

export class ShoppingService {
  static readonly getShoppings = async (): Promise<Shopping[]> => {
    try {
      const response = await api.get<Shopping[]>("/shoppings", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };

  static readonly getShoppingById = async (id: number): Promise<Shopping> => {
    try {
      const response = await api.get<Shopping>(`/shoppings/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener la compra");
    }
  };

  static readonly createShopping = async (dataSend: ShoppingRequest): Promise<Shopping> => {
    try {
      const response = await api.post<Shopping>("/shoppings", dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear la compra");
    }
  };

  static readonly updateShopping = async (
    id: number,
    dataSend: Partial<ShoppingRequest>
  ): Promise<Shopping> => {
    try {
      const currentShopping = await ShoppingService.getShoppingById(id);

      const updatedFields: Partial<Shopping> = {};

      const fieldsToCheck: {
        key: keyof Shopping;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [
        { key: "supplier", value: dataSend.supplier },
        { key: "shoppingProducts", value: dataSend.shoppingProducts },
        { key: "amount", value: dataSend.amount },
        { key: "total", value: dataSend.total },
      ];

      fieldsToCheck.forEach(({ key, value, compare }) => {
        if (
          value !== undefined &&
          (compare
            ? compare(value, currentShopping[key])
            : value !== currentShopping[key])
        ) {
          updatedFields[key] = value;
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Shopping>(
          `/shoppings/${id}`,
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
        return currentShopping;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar la compra");
    }
  };

  static readonly deleteShopping = async (id: number): Promise<void> => {
    try {
      await api.delete(`/shoppings/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Shopping with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar la compra");
    }
  };
}