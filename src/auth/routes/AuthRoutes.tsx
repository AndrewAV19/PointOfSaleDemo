import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import ResetPage from "../pages/ResetPasswordPage"
import PublicRoute from "../../router/PublicRoute";

const AuthRoutes = () => {
  return (
    <Routes>
      {/* Protege las rutas de autenticación con PublicRoute */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPage />} />
      </Route>

      {/* Redirige al login si la ruta no coincide */}
      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};

export default AuthRoutes;
