import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  styled,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigationMenu } from "./NavigationMenu";
import useLogout from "../hooks/useLogout";
import { storeDataPointOfSale } from "../stores/data-point-of-sale.store";
import ConfirmLogoutModal from "../pointofsale/modales/ConfirmLogoutModal";
import { useThemeStore } from "../stores/theme.store";

interface MenuItem {
  id: string;
  text: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: SubMenuItem[];
  isHeader?: boolean;
}

interface SubMenuItem {
  text: string;
  path: string;
  icon?: React.ReactNode;
}

interface ColorPalette {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  active: string;
  hover: string;
  secondary?: string;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "colorPalette",
})<{ colorPalette: ColorPalette }>(({ colorPalette }) => ({
  width: 280,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 280,
    boxSizing: "border-box",
    position: "relative",
    background: `linear-gradient(180deg, ${colorPalette.background} 0%, ${colorPalette.surface} 100%)`,
    color: colorPalette.textPrimary,
    borderRight: `1px solid ${colorPalette.border}`,
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: colorPalette.primary,
      borderRadius: 3,
    },
  },
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) =>
    !["isActive", "isSubItem", "colorPalette"].includes(prop as string),
})<{ isActive?: boolean; isSubItem?: boolean; colorPalette: ColorPalette }>(
  ({ isActive, isSubItem, colorPalette }) => ({
    padding: isSubItem ? "10px 20px 10px 40px" : "12px 20px",
    margin: "4px 16px",
    borderRadius: "8px",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",

    "&::before": isActive
      ? {
          content: '""',
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "4px",
          height: "60%",
          backgroundColor: colorPalette.active,
          borderRadius: "0 2px 2px 0",
        }
      : {},

    backgroundColor: isActive ? `${colorPalette.active}15` : "transparent",
    border: isActive
      ? `1px solid ${colorPalette.active}30`
      : "1px solid transparent",

    "&:hover": {
      backgroundColor: isActive
        ? `${colorPalette.active}20`
        : colorPalette.hover,
      transform: "translateX(2px)",
      border: isActive
        ? `1px solid ${colorPalette.active}40`
        : `1px solid ${colorPalette.primary}30`,
    },
  })
);

const StyledListItemText = styled(ListItemText)({
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
    fontWeight: "500",
    letterSpacing: "0.2px",
  },
});

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) =>
    !["isActive", "colorPalette"].includes(prop as string),
})<{ isActive?: boolean; colorPalette: ColorPalette }>(
  ({ isActive, colorPalette }) => ({
    color: isActive ? colorPalette.active : colorPalette.textSecondary,
    minWidth: 36,
    transition: "all 0.2s ease",
    "& .MuiSvgIcon-root": {
      fontSize: "1.25rem",
    },
  })
);

const LogoContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorPalette",
})<{ colorPalette: ColorPalette }>(({ colorPalette }) => ({
  padding: "24px 20px 20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.background} 100%)`,
  marginBottom: "8px",
  borderBottom: `1px solid ${colorPalette.border}`,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: "1px",
    background: `linear-gradient(90deg, transparent 0%, ${colorPalette.active} 50%, transparent 100%)`,
  },
}));

// Nuevo componente para la bienvenida del usuario
const UserWelcomeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorPalette",
})<{ colorPalette: ColorPalette }>(({ colorPalette }) => ({
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: `linear-gradient(135deg, ${colorPalette.surface} 0%, ${colorPalette.background} 100%)`,
  borderBottom: `1px solid ${colorPalette.border}`,
  marginBottom: "8px",
}));

const SubmenuIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorPalette",
})<{ colorPalette: ColorPalette }>(({ colorPalette }) => ({
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  transition: "transform 0.2s ease",
  color: colorPalette.textSecondary,
}));

const MenuSection = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorPalette",
})<{ colorPalette: ColorPalette }>(({ colorPalette }) => ({
  fontSize: "0.75rem",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: colorPalette.textSecondary,
  padding: "16px 24px 8px",
  marginTop: "8px",
}));

const SideMenu: React.FC = () => {
  const { getData, data } = storeDataPointOfSale();
  const { colorPalette } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const handleLogout = useLogout();
  const navigationMenu = useNavigationMenu();

  console.log(activeItem);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("name_usuario");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const currentItem = navigationMenu.find(
      (item) =>
        item.subItems?.some((subItem) => subItem.path === location.pathname) ||
        item.path === location.pathname
    );

    setActiveItem(currentItem?.id ?? null);
  }, [location.pathname, navigationMenu]);

  const handleToggleSubmenu = (id: string) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
    setActiveItem(id);
  };

  const handleClickItemWithoutSubmenu = (path: string, id: string) => {
    if (id === "logout") {
      setLogoutModalOpen(true);
    } else {
      navigate(path);
    }
    setOpenSubmenu(null);
    setActiveItem(id);
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path === location.pathname) return true;
    if (item.subItems) {
      return item.subItems.some(
        (subItem: SubMenuItem) => subItem.path === location.pathname
      );
    }
    return false;
  };

  return (
    <StyledDrawer variant="permanent" anchor="left" colorPalette={colorPalette}>
      <LogoContainer colorPalette={colorPalette}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${colorPalette.border}20`,
            overflow: "hidden",
          }}
        >
          <img
            src="/Images/logo-pv.png"
            alt="Logo Punto de Venta"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "700",
              fontSize: "1.1rem",
              color: colorPalette.textPrimary,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.name || "Punto de Venta"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: colorPalette.textSecondary,
              fontSize: "0.75rem",
              fontWeight: "500",
              display: "block",
            }}
          >
            Sistema Profesional
          </Typography>
        </Box>
      </LogoContainer>

      {userName && (
        <UserWelcomeContainer colorPalette={colorPalette}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.active} 100%)`,
              borderRadius: "50%",
              boxShadow: `0 2px 8px ${colorPalette.primary}30`,
            }}
          >
            <PersonIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "600",
                fontSize: "0.875rem",
                color: colorPalette.textPrimary,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Bienvenido
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colorPalette.textSecondary,
                fontSize: "0.75rem",
                fontWeight: "500",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </Typography>
          </Box>
        </UserWelcomeContainer>
      )}

      <Divider sx={{ borderColor: colorPalette.border, my: 1 }} />

      <List sx={{ padding: "8px 0", flex: 1 }}>
        {navigationMenu.map((item) => {
          const isActive = isItemActive(item);
          const isSubmenuOpen = openSubmenu === item.id;

          return (
            <React.Fragment key={item.id}>
              {item.isHeader ? (
                <MenuSection colorPalette={colorPalette}>
                  {item.text}
                </MenuSection>
              ) : item.subItems ? (
                <>
                  <Tooltip title={item.text} placement="right" arrow>
                    <StyledListItemButton
                      isActive={isActive}
                      colorPalette={colorPalette}
                      onClick={() => handleToggleSubmenu(item.id)}
                    >
                      <StyledListItemIcon
                        isActive={isActive}
                        colorPalette={colorPalette}
                      >
                        {item.icon}
                      </StyledListItemIcon>
                      <StyledListItemText
                        primary={item.text}
                        sx={{
                          color: isActive
                            ? colorPalette.active
                            : colorPalette.textPrimary,
                          fontWeight: isActive ? "600" : "500",
                        }}
                      />
                      <SubmenuIndicator colorPalette={colorPalette}>
                        {isSubmenuOpen ? (
                          <ExpandLess
                            sx={{
                              color: isActive
                                ? colorPalette.active
                                : colorPalette.textSecondary,
                            }}
                          />
                        ) : (
                          <ExpandMore
                            sx={{
                              color: isActive
                                ? colorPalette.active
                                : colorPalette.textSecondary,
                            }}
                          />
                        )}
                      </SubmenuIndicator>
                    </StyledListItemButton>
                  </Tooltip>
                  <Collapse
                    in={isSubmenuOpen}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                      background: "rgba(0, 0, 0, 0.1)",
                      margin: "2px 16px",
                      borderRadius: "6px",
                    }}
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => {
                        const isSubItemActive =
                          location.pathname === subItem.path;
                        return (
                          <Tooltip
                            key={subItem.text}
                            title={subItem.text}
                            placement="right"
                            arrow
                          >
                            <StyledListItemButton
                              isActive={isSubItemActive}
                              isSubItem
                              colorPalette={colorPalette}
                              onClick={() => handleSubItemClick(subItem.path)}
                              sx={{
                                "&::before": isSubItemActive
                                  ? {
                                      content: '""',
                                      position: "absolute",
                                      left: "28px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      width: "6px",
                                      height: "6px",
                                      backgroundColor: colorPalette.active,
                                      borderRadius: "50%",
                                    }
                                  : {},
                              }}
                            >
                              <StyledListItemIcon
                                isActive={isSubItemActive}
                                colorPalette={colorPalette}
                              >
                                {subItem.icon}
                              </StyledListItemIcon>
                              <StyledListItemText
                                primary={subItem.text}
                                sx={{
                                  color: isSubItemActive
                                    ? colorPalette.active
                                    : colorPalette.textSecondary,
                                  fontWeight: isSubItemActive ? "600" : "400",
                                }}
                              />
                            </StyledListItemButton>
                          </Tooltip>
                        );
                      })}
                    </List>
                  </Collapse>
                </>
              ) : (
                <Tooltip title={item.text} placement="right" arrow>
                  <StyledListItemButton
                    isActive={isActive}
                    colorPalette={colorPalette}
                    onClick={() =>
                      handleClickItemWithoutSubmenu(item.path!, item.id)
                    }
                  >
                    <StyledListItemIcon
                      isActive={isActive}
                      colorPalette={colorPalette}
                    >
                      {item.icon}
                    </StyledListItemIcon>
                    <StyledListItemText
                      primary={item.text}
                      sx={{
                        color: isActive
                          ? colorPalette.active
                          : colorPalette.textPrimary,
                        fontWeight: isActive ? "600" : "500",
                      }}
                    />
                  </StyledListItemButton>
                </Tooltip>
              )}
            </React.Fragment>
          );
        })}
      </List>
      
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${colorPalette.border}`,
          background: "rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colorPalette.textSecondary,
              fontSize: "0.7rem",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Mi Punto de Venta v2.0.1 © {new Date().getFullYear()}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: colorPalette.textSecondary,
            fontSize: "0.65rem",
            textAlign: "center",
            display: "block",
            mb: 0.5,
          }}
        >
          Creado por AlonsDev
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colorPalette.textSecondary,
            fontSize: "0.65rem",
            textAlign: "center",
            display: "block",
          }}
        >
          {new Date().toLocaleDateString("es-ES", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>
      </Box>
      <ConfirmLogoutModal
        open={logoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </StyledDrawer>
  );
};

export default SideMenu;
