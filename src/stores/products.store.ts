import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../pointofsale/interfaces/product.interface";
import { ProductService } from "../services/products.service";

interface ProductState {
  listProducts: Product[];
  loading: boolean;
  getProducts: () => Promise<void>;
  generateProductLabel: (id: number) => Promise<Blob>;
  generateQrCode: (id: number) => Promise<Product>;

  createProduct: (dataSend: {
    barCode?: string;
    qrCode?: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    category?: { id: number };
    suppliers?: { id: number }[];
    costPrice: number;
    discount?: number;
    taxRate?: number;
    image?: string;
  }) => Promise<Product>;

  updateProduct: (
    id: number,
    dataSend: {
      barCode?: string;
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      category?: { id: number };
      suppliers?: { id: number }[];
      costPrice?: number;
      discount?: number;
      taxRate?: number;
      image?: string;
    }
  ) => Promise<Product>;

  deleteProduct: (id: number) => Promise<void>;
}

const productStore: StateCreator<ProductState> = (set, get) => ({
  listProducts: [],
  loading: false,

  getProducts: async () => {
    try {
      set({ loading: true });
      const data = await ProductService.getProducts();
      set({ listProducts: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ listProducts: [], loading: false });
      throw new Error("Error al obtener los productos");
    }
  },

  generateProductLabel: async (id) => {
    try {
      set({ loading: true });
      const labelBlob = await ProductService.generateProductLabel(id);
      set({ loading: false });
      return labelBlob;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al generar la etiqueta del producto");
    }
  },

  generateQrCode: async (id) => {
    try {
      set({ loading: true });
      const updatedProduct = await ProductService.generateQrCode(id);

      const updatedProducts = get().listProducts.map((product) =>
        product.id === id ? updatedProduct : product
      );

      set({ listProducts: updatedProducts, loading: false });
      return updatedProduct;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al generar el código QR");
    }
  },

  createProduct: async (dataSend) => {
    try {
      set({ loading: true });
      const newProduct = await ProductService.createProduct(dataSend);
      const updatedProducts = [...get().listProducts, newProduct];
      set({ listProducts: updatedProducts, loading: false });
      return newProduct;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al crear el producto");
    }
  },

  updateProduct: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedProduct = await ProductService.updateProduct(id, dataSend);

      const updatedProducts = get().listProducts.map((product) =>
        product.id === id ? updatedProduct : product
      );

      set({ listProducts: updatedProducts, loading: false });
      return updatedProduct;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar el producto");
    }
  },

  deleteProduct: async (id: number) => {
    try {
      set({ loading: true });
      await ProductService.deleteProduct(id);

      const updatedProducts = get().listProducts.filter(
        (product) => product.id !== id
      );

      set({ listProducts: updatedProducts, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar el producto");
    }
  },
});

export const storeProducts = create<ProductState>()(
  persist(productStore, {
    name: "products-data",
  })
);
