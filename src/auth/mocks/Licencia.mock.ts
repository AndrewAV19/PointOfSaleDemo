export const mockLicenciaService = {
  verificarActivacion: async (): Promise<boolean> => {
   
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  },
  
  activarLicencia: async (claveLicencia: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (claveLicencia === "123456") {
    
      console.log("Licencia activada:", claveLicencia);
      return;
    }
    
    throw new Error("Clave de licencia inválida");
  },
};