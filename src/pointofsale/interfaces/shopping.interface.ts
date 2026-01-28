import { Product } from "./product.interface";
import { Supplier } from "./supplier.interface";
import { Users } from "./users.interface";

export interface Shopping {
  id?: number;
  supplier?: Supplier;
  user?: Users;
  shoppingProducts: ShoppingProduct[];
  amount: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingProduct {
  id?: number;
  product: Product;
  quantity: number;
}

export interface ShoppingRequest {
  supplier?: { id: number };
  user: { id: number };
  shoppingProducts: ShoppingProductRequest[];
  amount?: number;
  total?: number;
}

export interface ShoppingProductRequest {
  shopping_id?: number;
  id?: number;
  product: { id: number };
  quantity: number;
}
