import { useMemo } from "react";

export const useUserPermissions = () => {
  const getPermissions = (): string[] => {
    try {
      const permissions = localStorage.getItem("permissions");
      if (!permissions) return [];

      if (permissions.startsWith("[")) {
        return JSON.parse(permissions);
      }

      return permissions.split(",").map((perm) => perm.trim());
    } catch (error) {
      console.error("Error parsing user permissions:", error);
      const permissions = localStorage.getItem("permissions");
      if (permissions) {
        return permissions.split(",").map((perm) => perm.trim());
      }
      return [];
    }
  };

  const hasPermission = (permission: string): boolean => {
    const permissions = getPermissions();
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    const userPermissions = getPermissions();
    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    const userPermissions = getPermissions();
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  };

  const permissions = useMemo(() => getPermissions(), []);

  return {
    getPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
  };
};
