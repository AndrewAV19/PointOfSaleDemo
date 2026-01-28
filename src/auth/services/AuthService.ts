import api from "../../lib/axios";
import { LoginResponse } from "../interfaces/loginResponse.interface";

export class AuthService {
  static readonly login = async (credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("UnAuthorized");
    }
  };
}