import type { Permission } from "./permissions.interface";

export interface Role {
  id?: number;
  name: string;
  description: string;
  users?: any[];
  permissions?: Permission[];
  permissionIds?: number[];
}

export interface RoleRequest {
  name: string;
  description: string;
  permissionIds: number[];
}

