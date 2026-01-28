import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { purpleTheme } from "./purpleTheme";

interface AppThemeProps {
  children: ReactNode;
}

const AppTheme = ({ children }: AppThemeProps) => {
  return (
    <ThemeProvider theme={purpleTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;
