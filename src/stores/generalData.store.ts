import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Users } from "../pointofsale/interfaces/users.interface";
import { UsersService } from "../services/users.service";
import {
  ClientDebtDTO,
  Clients,
} from "../pointofsale/interfaces/clients.interface";
import { ClientsService } from "../services/clients.service";
import { Supplier } from "../pointofsale/interfaces/supplier.interface";
import { SuppliersService } from "../services/suppliers.service";
import { Categories } from "../pointofsale/interfaces/categories.interface";
import { CategoriesService } from "../services/categories.service";
import { Product } from "../pointofsale/interfaces/product.interface";
import { ProductService } from "../services/products.service";
import { Sale } from "../pointofsale/interfaces/sales.interface";
import { SaleService } from "../services/sales.service";
import { Shopping } from "../pointofsale/interfaces/shopping.interface";
import { ShoppingService } from "../services/shopping.service";
import { Role } from "../pointofsale/interfaces/roles.interface";
import { Permission } from "../pointofsale/interfaces/permissions.interface";
import { PermissionsService } from "../services/permissions.service";
import { RolesService } from "../services/roles.service";

interface DataState {
  selectedUser: Users | null;
  setSelectedUser: (user: Users) => void;
  selectedRole: Role | null;
  setSelectedRole: (role: Role) => void;
  selectedPermission: Permission | null;
  setSelectedPermission: (permission: Permission) => void;
  selectedClient: Clients | null;
  setSelectedClient: (client: Clients) => void;
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier) => void;
  selectedCategory: Categories | null;
  setSelectedCategory: (category: Categories) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
  selectedSale: Sale | null;
  setSelectedSale: (sale: Sale) => void;
  selectedShopping: Shopping | null;
  setSelectedShopping: (shopping: Shopping) => void;
  clientDebts: ClientDebtDTO[];
  statusRefresh: boolean;
  getUserById: (idUser: number) => Promise<void>;
  getRoleById: (idRole: number) => Promise<void>;
  getPermissionById: (idPermission: number) => Promise<void>;
  getClientById: (idClient: number) => Promise<void>;
  getSupplierById: (idSupplier: number) => Promise<void>;
  getCategoryById: (idCategory: number) => Promise<void>;
  getProductById: (idProduct: number) => Promise<void>;
  getSaleById: (idSale: number) => Promise<void>;
  getShoppingById: (idShopping: number) => Promise<void>;
  getClientDebts: (clientId: number) => Promise<void>;
}

const storeData: StateCreator<DataState> = (set) => ({
  selectedUser: null,
  setSelectedUser: (user: Users) => set(() => ({ selectedUser: user })),
  selectedRole: null,
  setSelectedRole: (role: Role) => set(() => ({ selectedRole: role })),
  selectedPermission: null,
  setSelectedPermission: (permission: Permission) =>
    set(() => ({ selectedPermission: permission })),
  selectedClient: null,
  setSelectedClient: (client: Clients) =>
    set(() => ({ selectedClient: client })),
  selectedSupplier: null,
  setSelectedSupplier: (supplier: Supplier) =>
    set(() => ({ selectedSupplier: supplier })),
  selectedCategory: null,
  setSelectedCategory: (category: Categories) =>
    set(() => ({ selectedCategory: category })),
  selectedProduct: null,
  setSelectedProduct: (product: Product) =>
    set(() => ({ selectedProduct: product })),
  selectedSale: null,
  setSelectedSale: (sale: Sale) => set(() => ({ selectedSale: sale })),
  selectedShopping: null,
  setSelectedShopping: (shopping: Shopping) =>
    set(() => ({ selectedShopping: shopping })),
  clientDebts: [],
  statusRefresh: false,

  getUserById: async (idUser: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const user = await UsersService.getUserById(idUser);
      set(() => ({ selectedUser: user, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getRoleById: async (idRole: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const role = await RolesService.getRoleById(idRole);
      set(() => ({ selectedRole: role, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getPermissionById: async (idPermission: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const permission = await PermissionsService.getPermissionById(
        idPermission
      );
      set(() => ({ selectedPermission: permission, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getClientById: async (idClient: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const client = await ClientsService.getClientById(idClient);
      set(() => ({ selectedClient: client, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getSupplierById: async (idSupplier: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const supplier = await SuppliersService.getSupplierById(idSupplier);
      set(() => ({ selectedSupplier: supplier, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getCategoryById: async (idCategory: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const category = await CategoriesService.getCategoryById(idCategory);
      set(() => ({ selectedCategory: category, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getProductById: async (idProduct: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const product = await ProductService.getProductById(idProduct);
      set(() => ({ selectedProduct: product, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getSaleById: async (idSale: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const sale = await SaleService.getSaleById(idSale);
      set(() => ({ selectedSale: sale, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getShoppingById: async (idShopping: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const sale = await ShoppingService.getShoppingById(idShopping);
      set(() => ({ selectedShopping: sale, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getClientDebts: async (clientId: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const debts = await SaleService.getClientDebts(clientId);
      set(() => ({ clientDebts: debts, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ clientDebts: [], statusRefresh: false }));
    }
  },
});

export const dataStore = create<DataState>()(
  persist(storeData, {
    name: "general-data",
  })
);
