export interface Clients {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: number;
    country: string;
  }

  export interface ClientDebtDTO {
    client: {
      id: number;
      name: string;
      email?: string;
      phone?: string;
      address?: string;

    };
    products: {
      id: number;
      name: string;
      price: number;
      stock: number;
      costPrice: number;
      quantity: number;
    }[];
    totalAmount: number;
    paidAmount: number;
    remainingBalance: number;
    state: string;
  }
  