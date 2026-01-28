import api from "../lib/axios";
import { Role, RoleRequest } from "../pointofsale/interfaces/roles.interface";

export class RolesService {
  static readonly getRoles = async (): Promise<Role[]> => {
    try {
      const response = await api.get<Role[]>("/roles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("UnAuthorized");
    }
  };

  static readonly getRoleById = async (id: number): Promise<Role> => {
    try {
      const response = await api.get<Role>(`/roles/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el rol");
    }
  };

  static readonly createRole = async (dataSend: RoleRequest): Promise<Role> => {
    try {
      const response = await api.post<Role>("/roles", dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error detallado creating role:", error);
      throw new Error("Error al crear el rol");
    }
  };

  static readonly updateRole = async (
    id: number,
    dataSend: Partial<RoleRequest>
  ): Promise<Role> => {
    try {
      const response = await api.put<Role>(`/roles/${id}`, dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log("Rol actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw new Error("Error al actualizar el rol");
    }
  };

  static readonly deleteRole = async (id: number): Promise<void> => {
    try {
      await api.delete(`/roles/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Role with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el rol");
    }
  };
}
