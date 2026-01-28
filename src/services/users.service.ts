import api from "../lib/axios";
import { Users } from "../pointofsale/interfaces/users.interface";

export class UsersService {
  static readonly getUsers = async (): Promise<Users[]> => {
    try {
      const response = await api.get<[Users]>("/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("UnAuthorized");
    }
  };

  static readonly getUserById = async (id: number): Promise<Users> => {
    try {
      const response = await api.get<Users>(`/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el usuario");
    }
  };

  static readonly createUser = async (dataSend: {
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
  }): Promise<Users[]> => {
    try {
      const response = await api.post<Users[]>("/users", dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("UnAuthorized");
    }
  };

  static readonly updateUser = async (
    id: number,
    dataSend: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: number;
      country?: string;
      roleIds?: number[];
    }
  ): Promise<Users> => {
    try {
      const currentUser = await UsersService.getUserById(id);

      // Crear un objeto con solo los campos que han cambiado
      const updatedFields: Partial<Users> = {};

      // Definir los campos a verificar
      const fieldsToCheck: {
        key: keyof Users;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [
        { key: "name", value: dataSend.name },
        { key: "email", value: dataSend.email },
        { key: "phone", value: dataSend.phone },
        { key: "address", value: dataSend.address },
        { key: "city", value: dataSend.city },
        { key: "state", value: dataSend.state },
        { key: "zipCode", value: dataSend.zipCode },
        { key: "country", value: dataSend.country },
        {
          key: "roleIds",
          value: dataSend.roleIds,
          compare: (a: number[], b: number[]) =>
            JSON.stringify(a) !== JSON.stringify(b),
        },
      ];

      // Verificar y actualizar los campos
      fieldsToCheck.forEach(({ key, value, compare }) => {
        if (
          value !== undefined &&
          (compare
            ? compare(value, currentUser[key])
            : value !== currentUser[key])
        ) {
          updatedFields[key] = value;
        }
      });

      // Solo enviar la solicitud si hay campos actualizados
      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Users>(`/users/${id}`, updatedFields, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        console.log(response.data);
        return response.data;
      } else {
        console.log("No hay campos para actualizar");
        return currentUser;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el usuario");
    }
  };

  static readonly deleteUser = async (id: number): Promise<void> => {
    try {
      // Ahora usamos DELETE normal que hará eliminación lógica
      const response = await api.delete(`/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(`User with id ${id} deleted (logically) successfully`);
      return response.data;
    } catch (error: any) {
      console.error("Error completo al eliminar usuario:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Error del servidor: ${error.response.status}`;

        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor");
      } else {
        throw new Error("Error de configuración de la solicitud");
      }
    }
  };

  static readonly changePassword = async (
    id: number,
    currentPassword: string,
    newPassword: string
  ): Promise<string> => {
    try {
      const response = await api.post(
        `/users/${id}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      console.error(error);
      throw new Error("Error al cambiar la contraseña");
    }
  };
}
