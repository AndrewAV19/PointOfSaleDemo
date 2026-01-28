import type { Clients } from "./clients.interface";
import type { Product } from "./product.interface";
import type { Users } from "./users.interface";

export interface Sale {
    id?: number;
    client?: Clients;
    user?: Users;
    saleProducts: SaleProduct[];
    amount: number;
    state: string;
    total: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SaleProduct {
    id?: number;
    product: Product;
    quantity: number;
    discount?: number;
}

export interface SaleRequest {
    client?: { id: number };
    user?: { id: number };
    saleProducts: SaleProductRequest[];
    amount?: number;
    state?: string;
    total?: number;
}

export interface SaleProductRequest {
    sale_id?: number;
    id?: number; 
    product: { id: number };
    quantity: number;
    discount?: number;
}