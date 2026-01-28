import { Navigate, Outlet } from "react-router-dom";

interface PublicRouteProps {
  children?: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = localStorage.getItem("token"); 

  // Si el usuario está autenticado, redirige a la página principal
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si no está autenticado, permite el acceso a la ruta pública
  return children || <Outlet />;
};

export default PublicRoute;