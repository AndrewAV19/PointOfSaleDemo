import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthTimeout = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const now = new Date();
        const loginTimestamp = new Date(loginTime).getTime();
        const eightHoursInMillis = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

        if (now.getTime() - loginTimestamp > eightHoursInMillis) {
          localStorage.removeItem("token");
          localStorage.removeItem("loginTime");
          navigate("/auth/login");
        }
      }
    };

    const interval = setInterval(checkAuthTimeout, 60000);

    return () => clearInterval(interval);
  }, [navigate]);
};

export default useAutoLogout;