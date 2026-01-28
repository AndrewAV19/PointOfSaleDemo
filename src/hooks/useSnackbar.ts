import { useState } from "react";

export const useSnackbar = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const showSnackbar = (
    severity: "error" | "success"| "info",
    message: string
  ): void => {
    setSnackbarSeverity(severity);
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  return {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  };
};