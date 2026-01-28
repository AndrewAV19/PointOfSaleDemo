import type { LoginResponse } from "../interfaces/loginResponse.interface";
import { MOCK_USERS } from "./Users.mock";

export const mockAuthService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(
      user => user.email === credentials.email && user.password === credentials.password
    );
    
    if (!user) {
      throw new Error("Credenciales incorrectas");
    }
    
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      roles: user.roles,
      token: `mock-token-${user.id}-${Date.now()}`,
      message: "Login exitoso",
      permissions: user.permissions,
    };
  },
};