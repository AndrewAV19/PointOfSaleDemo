import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Permission } from "../pointofsale/interfaces/permissions.interface";
import { PermissionsService } from "../services/permissions.service";

interface PermissionsState {
  listPermissions: Permission[];
  loading: boolean;

  getPermissions: () => Promise<void>;
  getPermissionById: (id: number) => Promise<Permission>;

  createPermission: (dataSend: {
    name: string;
    description: string;
  }) => Promise<Permission>;

  updatePermission: (
    id: number,
    dataSend: {
      name?: string;
      description?: string;
    }
  ) => Promise<Permission>;

  deletePermission: (id: number) => Promise<void>;
}

const permissionsStore: StateCreator<PermissionsState> = (set, get) => ({
  listPermissions: [],
  loading: false,

  getPermissions: async () => {
    try {
      set({ loading: true });
      const data = await PermissionsService.getPermissions();
      set({ listPermissions: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ listPermissions: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  getPermissionById: async (id: number) => {
    try {
      set({ loading: true });
      const data = await PermissionsService.getPermissionById(id);
      set({ loading: false });
      return data;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al obtener el permiso");
    }
  },

  createPermission: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await PermissionsService.createPermission(dataSend);

      // Actualizar la lista de permisos
      const currentPermissions = get().listPermissions;
      set({ listPermissions: [...currentPermissions, data], loading: false });

      return data;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw new Error("Error al crear el permiso");
    }
  },

  updatePermission: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedPermission = await PermissionsService.updatePermission(
        id,
        dataSend
      );

      const updatedPermissions = get().listPermissions.map((permission) =>
        permission.id === id ? updatedPermission : permission
      );

      set({ listPermissions: updatedPermissions, loading: false });
      return updatedPermission;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar el permiso");
    }
  },

  deletePermission: async (id: number) => {
    try {
      set({ loading: true });
      await PermissionsService.deletePermission(id);
      const updatedPermissions = get().listPermissions.filter(
        (permission) => permission.id !== id
      );
      set({ listPermissions: updatedPermissions, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar el permiso");
    }
  },
});

export const storePermissions = create<PermissionsState>()(
  persist(permissionsStore, {
    name: "permissions-data",
  })
);
