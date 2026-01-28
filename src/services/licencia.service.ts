import api from "../lib/axios";

export class LicenciaService {

  static readonly activarLicencia = async (claveLicencia: string): Promise<string> => {
    try {
      const response = await api.post<string>("/licencia/activar", null, {
        params: { claveLicencia },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al activar la licencia");
    }
  };

  static readonly verificarActivacion = async (): Promise<boolean> => {
    try {
      const response = await api.get<boolean>("/licencia/verificar", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al verificar la activación de la licencia");
    }
  };
}