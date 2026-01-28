import { Navigate } from "react-router-dom";
import { useUserRoles } from "../hooks/useUserRoles";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  adminOnly = false,
}) => {
  const { hasAnyRole, isUserOnly } = useUserRoles();

  if (adminOnly && isUserOnly) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
