import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("token"); 

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />; 
  }

 
  return children || <Outlet />;
};

export default ProtectedRoute;