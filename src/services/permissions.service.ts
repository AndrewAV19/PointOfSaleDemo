import api from "../lib/axios";
import { Permission } from "../pointofsale/interfaces/permissions.interface";

export class PermissionsService {
  static readonly getPermissions = async (): Promise<Permission[]> => {
    try {
      const response = await api.get<Permission[]>("/permissions", {
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

  static readonly getPermissionById = async (id: number): Promise<Permission> => {
    try {
      const response = await api.get<Permission>(`/permissions/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el permiso");
    }
  };

  static readonly createPermission = async (dataSend: {
    name: string;
    description: string;
  }): Promise<Permission> => {
    try {
      const response = await api.post<Permission>("/permissions", dataSend, {
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

  static readonly updatePermission = async (
    id: number,
    dataSend: {
      name?: string;
      description?: string;
    }
  ): Promise<Permission> => {
    try {
      const currentPermission = await PermissionsService.getPermissionById(id);

      // Crear un objeto con solo los campos que han cambiado
      const updatedFields: Partial<Permission> = {};

      // Verificar y actualizar los campos
      if (dataSend.name !== undefined && dataSend.name !== currentPermission.name) {
        updatedFields.name = dataSend.name;
      }
      if (dataSend.description !== undefined && dataSend.description !== currentPermission.description) {
        updatedFields.description = dataSend.description;
      }

      // Solo enviar la solicitud si hay campos actualizados
      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Permission>(`/permissions/${id}`, updatedFields, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        console.log(response.data);
        return response.data;
      } else {
        console.log("No hay campos para actualizar");
        return currentPermission;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el permiso");
    }
  };

  static readonly deletePermission = async (id: number): Promise<void> => {
    try {
      await api.delete(`/permissions/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Permission with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el permiso");
    }
  };
}