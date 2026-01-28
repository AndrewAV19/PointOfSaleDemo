import { useUserRoles } from "./useUserRoles";
import { useUserPermissions } from "./useUserPermissions";

export const useAuth = () => {
  const {
    getUserRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isUserOnly,
  } = useUserRoles();

  const {
    getPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
  } = useUserPermissions();

  // Verificar acceso basado en permisos específicos
  const canAccess = (
    requiredPermissions: string[],
    requireAll: boolean = false
  ): boolean => {
    if (isAdmin) return true;

    if (requireAll) {
      return hasAllPermissions(requiredPermissions);
    }

    return hasAnyPermission(requiredPermissions);
  };

  return {
    // Roles
    getUserRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isUserOnly,

    // Permissions
    getPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,

    // Combined
    canAccess,
  };
};
