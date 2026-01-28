import api from "../lib/axios";
import { Categories } from "../pointofsale/interfaces/categories.interface";

export class CategoriesService {
  static readonly getCategories = async (): Promise<Categories[]> => {
    try {
      const response = await api.get<Categories[]>("/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };

  static readonly getCategoryById = async (id: number): Promise<Categories> => {
    try {
      const response = await api.get<Categories>(`/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener la categoría");
    }
  };

  static readonly createCategory = async (dataSend: {
    name: string;
    description?: string;
  }): Promise<Categories[]> => {
    try {
      const response = await api.post<Categories[]>("/categories", dataSend, {
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

  static readonly updateCategory = async (
    id: number,
    dataSend: { name: string; description: string }
  ): Promise<Categories> => {
    try {
      const currentCategory = await CategoriesService.getCategoryById(id);
      
      const updatedFields: Partial<Categories> = {};
      
      if (dataSend.name && dataSend.name !== currentCategory.name) {
        updatedFields.name = dataSend.name;
      }
      if (dataSend.description && dataSend.description !== currentCategory.description) {
        updatedFields.description = dataSend.description;
      }

      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<Categories>(
          `/categories/${id}`,
          updatedFields,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response.data);
        return response.data;
      } else {
        console.log("No hay cambios para actualizar");
        return currentCategory;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar la categoría");
    }
  };

  static readonly deleteCategory = async (id: number): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Category with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar la categoría");
    }
  };
}
