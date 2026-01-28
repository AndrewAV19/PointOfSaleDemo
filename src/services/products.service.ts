import api from "../lib/axios";
import { Product } from "../pointofsale/interfaces/product.interface";

export class ProductService {
  static readonly getProducts = async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>("/products", {
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

  static readonly getProductById = async (id: number): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el producto");
    }
  };

  static readonly createProduct = async (dataSend: {
    barCode?: string;
    qrCode?: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    category?: {id: number};
    suppliers?: { id: number }[];
    costPrice: number;
    discount?: number;
    taxRate?: number;
    image?: string;
  }): Promise<Product> => {
    try {
      const response = await api.post<Product>("/products", dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear el producto");
    }
  };

  static readonly updateProduct = async (
    id: number,
    dataSend: {
      barCode?: string;
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      category?: {id: number};
      suppliers?: { id: number }[];
      costPrice?: number;
      discount?: number;
      taxRate?: number;
      image?: string;
    }
  ): Promise<Product> => {
    try {
      const currentProduct = await ProductService.getProductById(id);

      const updatedFields: Partial<Product> = {};

      const fieldsToCheck: {
        key: keyof Product;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [
        { key: "barCode", value: dataSend.barCode },
        { key: "name", value: dataSend.name },
        { key: "description", value: dataSend.description },
        { key: "price", value: dataSend.price },
        { key: "stock", value: dataSend.stock },
        { key: "category", value: dataSend.category },
        { key: "suppliers", value: dataSend.suppliers },
        { key: "costPrice", value: dataSend.costPrice },
        { key: "discount", value: dataSend.discount },
        { key: "taxRate", value: dataSend.taxRate },
        { key: "image", value: dataSend.image },
      ];

      fieldsToCheck.forEach(({ key, value, compare }) => {
        if (
          value !== undefined &&
          (compare
            ? compare(value, currentProduct[key])
            : value !== currentProduct[key])
        ) {
          updatedFields[key] = value;
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Product>(
          `/products/${id}`,
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
        return currentProduct;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el producto");
    }
  };

  static readonly deleteProduct = async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Product with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el producto");
    }
  };

  static readonly generateQrCode = async (id: number): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/products/${id}/generate-qr`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al generar el código QR");
    }
  };

  static readonly generateProductLabel = async (id: number): Promise<Blob> => {
    try {
      const response = await api.get(`/products/${id}/label`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al generar la etiqueta del producto");
    }
  };
  
}