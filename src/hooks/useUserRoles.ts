import { useMemo } from "react";

export const useUserRoles = () => {
  const getUserRoles = (): string[] => {
    try {
      const roles = localStorage.getItem("roles");
      if (!roles) return [];

      if (roles.startsWith("[")) {
        return JSON.parse(roles);
      }

      return roles.split(",").map((role) => role.trim());
    } catch (error) {
      console.error("Error parsing user roles:", error);
      const roles = localStorage.getItem("roles");
      if (roles) {
        return roles.split(",").map((role) => role.trim());
      }
      return [];
    }
  };

  const hasRole = (role: string): boolean => {
    const roles = getUserRoles();
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    const userRoles = getUserRoles();
    return requiredRoles.some((role) => userRoles.includes(role));
  };

  const hasAllRoles = (requiredRoles: string[]): boolean => {
    const userRoles = getUserRoles();
    return requiredRoles.every((role) => userRoles.includes(role));
  };

  const isAdmin = useMemo(() => {
    const roles = getUserRoles();
    return roles.includes("ROLE_ADMIN");
  }, []);

  const isUserOnly = useMemo(() => {
    const roles = getUserRoles();
    return roles.includes("ROLE_USER") && !roles.includes("ROLE_ADMIN");
  }, []);

  return {
    getUserRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isUserOnly,
  };
};
