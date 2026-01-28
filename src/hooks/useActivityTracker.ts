import { useEffect } from "react";

const useActivityTracker = () => {
  useEffect(() => {
    const resetLoginTime = () => {
      localStorage.setItem("loginTime", new Date().toISOString()); 
    };

    window.addEventListener("mousemove", resetLoginTime);
    window.addEventListener("keydown", resetLoginTime);

    return () => {
      window.removeEventListener("mousemove", resetLoginTime);
      window.removeEventListener("keydown", resetLoginTime);
    };
  }, []);
};

export default useActivityTracker;