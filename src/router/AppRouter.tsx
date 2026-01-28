import { Route, Routes } from "react-router-dom";
import AuthRoutes from "../auth/routes/AuthRoutes";
import PointOfSaleRoutes from "../pointofsale/routes/PointOfSaleRoutes";
import ProtectedRoute from "./ProtectedRoute";
import useAutoLogout from "../hooks/useAutoLogout";
import useActivityTracker from "../hooks/useActivityTracker";

const AppRouter = () => {
  useAutoLogout();
  useActivityTracker();

  return (
    <Routes>
      {/* Login y Registro */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Punto de venta */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <PointOfSaleRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;