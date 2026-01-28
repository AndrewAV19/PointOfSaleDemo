import type { Categories } from "./categories.interface";
import type { Supplier } from "./supplier.interface";

export interface Product {
  id?: number;
  name: string;
  barCode?: string;
  qrCode?: string;
  description?: string;
  price: number;
  stock?: number;
  category?: Categories;
  suppliers?: Supplier[];
  costPrice: number;
  discount?: number;
  taxRate?: number;
  image?: string;
  total?: number;
  quantity?: number;
}

export interface ProductRequest {
  id?: number;
  barCode?: string;
  qrCode?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category?: { id: number };
  suppliers?: [{ id: number }];
  costPrice: number;
  discount?: number;
  taxRate?: number;
  image?: string;
}

export interface CartProduct extends Product {
  discountedPrice: number;
  total: number;
  quantity: number;
}
