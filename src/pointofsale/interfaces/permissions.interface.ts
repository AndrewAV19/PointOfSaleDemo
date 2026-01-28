import { Role } from "./roles.interface";

export interface Permission {
  id: number;
  name: string;
  description: string;
  roles?: Role[];
}
