export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  roles: string[];
  token: string;
  message: string;
  permissions: string[];
}
