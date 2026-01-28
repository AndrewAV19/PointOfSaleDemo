import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Users, Role } from "../pointofsale/interfaces/users.interface";
import { UsersService } from "../services/users.service";

interface UsersState {
  listUsers: Users[];
  loading: boolean;

  getUsers: () => Promise<void>;

  createUser: (dataSend: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
    roleIds: number[];
  }) => Promise<Users[]>;

  updateUser: (
    id: number,
    dataSend: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: number;
      country: string;
      roleIds: number[];
    }
  ) => Promise<Users>;

  deleteUser: (id: number) => Promise<void>;

  changePassword: (
    id: number,
    currentPassword: string,
    newPassword: string
  ) => Promise<string>;
}

const usersStore: StateCreator<UsersState> = (set, get) => ({
  listUsers: [],
  loading: false,

  getUsers: async () => {
    try {
      const data = await UsersService.getUsers();

      // Normalizar los datos de usuarios
      const normalizedUsers = data.map((user) => {
        // Si roles es un array de números, crear estructura de roles básica
        if (
          user.roles &&
          user.roles.length > 0 &&
          typeof user.roles[0] === "number"
        ) {
          const roleIds = user.roles as number[];
          const roleNames = user.roleNames || [];

          return {
            ...user,
            roles: roleIds.map(
              (id, index) =>
                ({
                  id,
                  name: roleNames[index] || `ROL_${id}`,
                  description: `Rol con ID ${id}`,
                } as Role)
            ),
          };
        }
        return user;
      });

      set({ listUsers: normalizedUsers, loading: false });
    } catch (error) {
      console.error(error);
      set({ listUsers: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  createUser: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await UsersService.createUser(dataSend);
      return data;
    } catch (error) {
      console.log(error);
      set({ loading: false });
      throw new Error("Error al crear el usuario");
    }
  },

  updateUser: async (id, dataSend) => {
    try {
      set({ loading: true });
      const updatedUser = await UsersService.updateUser(id, dataSend);

      const updatedUsers = get().listUsers.map((user) =>
        user.id === id ? updatedUser : user
      );

      set({ listUsers: updatedUsers, loading: false });
      return updatedUser;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al actualizar el usuario");
    }
  },

  deleteUser: async (id: number) => {
    try {
      set({ loading: true });
      await UsersService.deleteUser(id);
      const updatedUsers = get().listUsers.filter((user) => user.id !== id);
      set({ listUsers: updatedUsers, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al eliminar el usuario");
    }
  },

  changePassword: async (id, currentPassword, newPassword) => {
    try {
      set({ loading: true });
      const result = await UsersService.changePassword(
        id,
        currentPassword,
        newPassword
      );
      set({ loading: false });
      return result;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      throw new Error("Error al cambiar la contraseña");
    }
  },
});

export const storeUsers = create<UsersState>()(
  persist(usersStore, {
    name: "users-data",
  })
);
