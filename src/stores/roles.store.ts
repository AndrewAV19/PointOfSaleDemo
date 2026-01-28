import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, RoleRequest } from "../pointofsale/interfaces/roles.interface";
import { RolesService } from "../services/roles.service";

interface RolesState {
  listRoles: Role[];
  loading: boolean;

  getRoles: () => Promise<void>;
  getRoleById: (id: number) => Promise<Role>;
  createRole: (dataSend: RoleRequest) => Promise<Role>;
  updateRole: (id: number, dataSend: Partial<RoleRequest>) => Promise<Role>;
  deleteRole: (id: number) => Promise<void>;
}

const rolesStore: StateCreator<RolesState> = (set, get) => ({
  listRoles: [],
  loading: false,

  getRoles: async () => {
    try {
      set({ loading: true });
      const data = await RolesService.getRoles();
      set({ listRoles: data, loading: false });
    } catch (error) {
      console.error(error);
      set({ listRoles: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  getRoleById: async (id: number) => {
    try {
      set({ loading: true });
      const data = await RolesService.getRoleById(id);
      set({ loading: false });
      return data;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al obtener el rol");
    }
  },

  createRole: async (dataSend) => {
    try {
      set({ loading: true });
      const newRole = await RolesService.createRole(dataSend);
      const updatedRoles = [...get().listRoles, newRole];
      set({ listRoles: updatedRoles, loading: false });
      return newRole;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw new Error("Error al crear el rol");
    }
  },

  updateRole: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedRole = await RolesService.updateRole(id, dataSend);

      const updatedRoles = get().listRoles.map((role) =>
        role.id === id ? updatedRole : role
      );

      set({ listRoles: updatedRoles, loading: false });
      return updatedRole;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar el rol");
    }
  },

  deleteRole: async (id: number) => {
    try {
      set({ loading: true });
      await RolesService.deleteRole(id);
      const updatedRoles = get().listRoles.filter((role) => role.id !== id);
      set({ listRoles: updatedRoles, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar el rol");
    }
  },
});

export const storeRoles = create<RolesState>()(
  persist(rolesStore, {
    name: "roles-data",
  })
);
