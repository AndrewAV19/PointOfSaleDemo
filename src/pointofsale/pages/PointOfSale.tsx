import React, { useState } from "react";
import { Box, useMediaQuery, useTheme, Button, Drawer } from "@mui/material";
import SideMenu from "../../components/SideMenu";
import { Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; 

const PointOfSale: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Menú a la izquierda - Oculto en móviles */}
      {!isMobile && <SideMenu />}

      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          padding: isMobile ? 2 : 3, 
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>

      {/* Botón para abrir el sidebar en móviles (ahora en la parte superior izquierda) */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 16, 
            left: 16, 
            zIndex: 1000,
          }}
        >
          <Button variant="contained" onClick={toggleSidebar}>
            <MenuIcon /> {/* Ícono de menú */}
          </Button>
        </Box>
      )}

      {/* Drawer (Sidebar) para dispositivos móviles */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            width: "260px", 
            paddingX: "1px",
            height: "100vh", 
            boxSizing: "border-box",
          },
        }}
      >
        <SideMenu />
      </Drawer>
    </Box>
  );
};

export default PointOfSale;
