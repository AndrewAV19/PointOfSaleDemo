import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Divider,
  Grid2,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Fade,
  Zoom,
  InputAdornment,
  Tooltip,
  IconButton,
  ListItemButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Palette as PaletteIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../../hooks/useSnackbar";
import type { DataPointOfSale } from "../../interfaces/data-point-of-sale.interface";
import {
  useThemeStore,
  COLOR_THEMES,
} from "../../../stores/theme.store";
import type {ThemeKey} from "../../../stores/theme.store";

// Mock data
const mockPointsOfSale: DataPointOfSale[] = [
  {
    id: 1,
    name: "Punto de Venta",
    address: "Av. Principal #100, Local A",
    phone: "555-1000-001",
    printTicket: true
  },
  {
    id: 2,
    name: "Caja Rápida",
    address: "Av. Principal #100, Local A",
    phone: "555-1000-002",
    printTicket: false
  },
  {
    id: 3,
    name: "Caja de Abarrotes",
    address: "Av. Principal #100, Local A",
    phone: "555-1000-003",
    printTicket: true
  }
];

const Settings: React.FC = () => {
  const { currentTheme, setTheme } = useThemeStore();
  // Estado para manejar los datos del mock
  const [mockData, setMockData] = useState<DataPointOfSale>(mockPointsOfSale[0]);
  const [dataPointOfSale, setDataPointOfSale] = useState<DataPointOfSale>({
    name: mockPointsOfSale[0]?.name ?? "",
    address: mockPointsOfSale[0]?.address ?? "",
    phone: mockPointsOfSale[0]?.phone ?? "",
    printTicket: mockPointsOfSale[0]?.printTicket ?? false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("apariencia");

  // Refs para las secciones
  const aparienciaSectionRef = useRef<HTMLDivElement>(null);
  const negocioSectionRef = useRef<HTMLDivElement>(null);

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  // Simular la carga de datos desde el mock
  useEffect(() => {
    // Simulamos una pequeña demora para hacerlo más realista
    const timer = setTimeout(() => {
      setMockData(mockPointsOfSale[0]);
      setDataPointOfSale({
        name: mockPointsOfSale[0].name,
        address: mockPointsOfSale[0].address,
        phone: mockPointsOfSale[0].phone,
        printTicket: mockPointsOfSale[0].printTicket,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Detectar cambios en los datos
  useEffect(() => {
    const hasUnsavedChanges =
      dataPointOfSale.name !== mockData.name ||
      dataPointOfSale.address !== mockData.address ||
      dataPointOfSale.phone !== mockData.phone ||
      dataPointOfSale.printTicket !== mockData.printTicket;

    setHasChanges(hasUnsavedChanges);
  }, [dataPointOfSale, mockData]);

  // Función para desplazarse a una sección
  const scrollToSection = (section: string) => {
    setActiveSection(section);

    if (section === "apariencia" && aparienciaSectionRef.current) {
      aparienciaSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (section === "negocio" && negocioSectionRef.current) {
      negocioSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSave = async () => {
    if (!dataPointOfSale.name.trim()) {
      showSnackbar("error", "El nombre del negocio no puede estar vacío.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedFields: Partial<DataPointOfSale> = {};

      if (mockData && dataPointOfSale.name !== mockData.name) {
        updatedFields.name = dataPointOfSale.name;
      }
      if (mockData && dataPointOfSale.address !== mockData.address) {
        updatedFields.address = dataPointOfSale.address;
      }
      if (mockData && dataPointOfSale.phone !== mockData.phone) {
        updatedFields.phone = dataPointOfSale.phone;
      }
      if (mockData && dataPointOfSale.printTicket !== mockData.printTicket) {
        updatedFields.printTicket = dataPointOfSale.printTicket;
      }

      if (Object.keys(updatedFields).length > 0) {
        // Simular actualización en el mock
        setTimeout(() => {
          const updatedMock = { ...mockData, ...updatedFields };
          setMockData(updatedMock);
          
          // También actualizar el array del mock si es necesario
          const updatedMockArray = mockPointsOfSale.map(item => 
            item.id === 1 ? updatedMock : item
          );
          // Aquí normalmente actualizarías tu array de mock, pero como es una constante,
          // solo actualizamos el estado local
          
          showSnackbar("success", "Configuración guardada correctamente");
          setHasChanges(false);
          setIsLoading(false);
        }, 500);
      } else {
        showSnackbar("info", "No se detectaron cambios para guardar");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
      showSnackbar("error", "Error al guardar la configuración");
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: keyof DataPointOfSale) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDataPointOfSale({
        ...dataPointOfSale,
        [field]: e.target.value,
      });
    };

  const handleSwitchChange =
    (field: keyof DataPointOfSale) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDataPointOfSale((prevState) => ({
        ...prevState,
        [field]: e.target.checked,
      }));
    };

  const handleThemeChange = (themeKey: ThemeKey) => {
    setTheme(themeKey);
    showSnackbar("success", `Tema "${COLOR_THEMES[themeKey].name}" aplicado`);
  };

  const handleReset = () => {
    setDataPointOfSale({
      name: mockData.name,
      address: mockData.address,
      phone: mockData.phone,
      printTicket: mockData.printTicket,
    });
    showSnackbar("info", "Cambios descartados");
    setHasChanges(false);
  };

  // Componente mejorado para previsualización del tema
  const ThemePreview: React.FC<{ themeKey: ThemeKey; isSelected: boolean }> = ({
    themeKey,
    isSelected,
  }) => {
    const theme = COLOR_THEMES[themeKey];

    return (
      <Zoom in={true} style={{ transitionDelay: isSelected ? "0ms" : "100ms" }}>
        <Card
          sx={{
            border: isSelected
              ? `2px solid ${theme.colors.primary}`
              : "1px solid #e0e0e0",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 4,
              borderColor: theme.colors.primary,
            },
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => handleThemeChange(themeKey)}
        >
          {isSelected && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <CheckIcon
                sx={{
                  color: theme.colors.primary,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: 0.5,
                  boxShadow: 1,
                }}
              />
            </Box>
          )}

          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.colors.primary,
                  mr: 2,
                }}
              >
                <PaletteIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {theme.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isSelected ? "Tema activo" : "Haz clic para aplicar"}
                </Typography>
              </Box>
            </Box>

            {/* Paleta de colores */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                fontWeight="500"
                color="text.secondary"
              >
                PALETA DE COLORES
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
                {Object.entries(theme.colors).map(([key, color]) => (
                  <Tooltip key={key} title={key} arrow>
                    <Box
                      sx={{
                        flex: 1,
                        height: 24,
                        backgroundColor: color,
                        borderRadius: "4px",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>

            {/* Mini preview */}
            <Box
              sx={{
                p: 1.5,
                backgroundColor: theme.colors.surface,
                borderRadius: "6px",
                border: `1px solid ${theme.colors.background}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "2px",
                    backgroundColor: theme.colors.primary,
                    mr: 1,
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: "1px",
                    backgroundColor: theme.colors.secondary,
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: 4,
                  borderRadius: "1px",
                  backgroundColor: theme.colors.accent,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  height: 4,
                  borderRadius: "1px",
                  backgroundColor: theme.colors.background,
                  width: "70%",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    );
  };

  return (
    <Container maxWidth="lg">
      <Fade in={true}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 4,
              borderBottom: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight="700"
              gutterBottom
            >
              Configuración
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Personaliza la apariencia y configuración de tu punto de venta
            </Typography>
          </Box>

          <Grid2 container spacing={0}>
            {/* Sidebar de Navegación */}
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Box
                sx={{ p: 3, borderRight: "1px solid", borderColor: "divider" }}
              >
                <List sx={{ "& .MuiListItemButton-root": { borderRadius: 2 } }}>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeSection === "apariencia"}
                      onClick={() => scrollToSection("apariencia")}
                      sx={{
                        borderRadius: 2,
                        backgroundColor:
                          activeSection === "apariencia"
                            ? "action.selected"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <PaletteIcon
                          color={
                            activeSection === "apariencia"
                              ? "primary"
                              : "inherit"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Apariencia"
                        primaryTypographyProps={{
                          fontWeight: 600,
                          color:
                            activeSection === "apariencia"
                              ? "primary.main"
                              : "text.primary",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeSection === "negocio"}
                      onClick={() => scrollToSection("negocio")}
                      sx={{
                        borderRadius: 2,
                        backgroundColor:
                          activeSection === "negocio"
                            ? "action.selected"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <BusinessIcon
                          color={
                            activeSection === "negocio" ? "primary" : "inherit"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Negocio"
                        primaryTypographyProps={{
                          fontWeight: 600,
                          color:
                            activeSection === "negocio"
                              ? "primary.main"
                              : "text.primary",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>

                {hasChanges && (
                  <Paper
                    sx={{
                      p: 2,
                      mt: 2,
                      backgroundColor: "warning.light",
                      border: "1px solid",
                      borderColor: "warning.main",
                    }}
                  >
                    <Typography variant="body2" fontWeight="500">
                      Tienes cambios sin guardar
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleReset}
                      sx={{ mt: 1 }}
                    >
                      Descartar
                    </Button>
                  </Paper>
                )}
              </Box>
            </Grid2>

            {/* Contenido Principal */}
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Box sx={{ p: 4 }}>
                {/* Sección de Tema */}
                <Box ref={aparienciaSectionRef} sx={{ mb: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: "primary.main",
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      <PaletteIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="600">
                        Personalización de Tema
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Elige un tema que se adapte a la identidad de tu negocio
                      </Typography>
                    </Box>
                  </Box>

                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: "1.1rem",
                      }}
                    >
                      Temas Disponibles
                    </FormLabel>

                    <Grid2 container spacing={2}>
                      {(Object.keys(COLOR_THEMES) as ThemeKey[]).map(
                        (themeKey) => (
                          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }} key={themeKey}>
                            <ThemePreview
                              themeKey={themeKey}
                              isSelected={currentTheme === themeKey}
                            />
                          </Grid2>
                        )
                      )}
                    </Grid2>
                  </FormControl>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Configuración del Negocio */}
                <Box ref={negocioSectionRef} sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: "secondary.main",
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="600">
                        Información del Negocio
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configura los datos básicos de tu punto de venta
                      </Typography>
                    </Box>
                  </Box>

                  <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Nombre del Negocio"
                        variant="outlined"
                        value={dataPointOfSale.name}
                        onChange={handleChange("name")}
                        required
                        error={!dataPointOfSale.name.trim()}
                        helperText={
                          !dataPointOfSale.name.trim()
                            ? "El nombre es obligatorio"
                            : "Nombre que aparecerá en tickets y facturas"
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        variant="outlined"
                        value={dataPointOfSale.address}
                        onChange={handleChange("address")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        variant="outlined"
                        value={dataPointOfSale.phone}
                        onChange={handleChange("phone")}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid2>

                    <Grid2 size={{ xs: 12 }}>
                      <Paper
                        sx={{
                          p: 3,
                          backgroundColor: "action.hover",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={dataPointOfSale.printTicket}
                              onChange={handleSwitchChange("printTicket")}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight="500">
                                Impresión Automática de Tickets
                                <Tooltip title="Habilita la impresión automática de tickets después de cada venta">
                                  <IconButton size="small" sx={{ ml: 1 }}>
                                    <InfoIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Los tickets se imprimirán automáticamente al
                                finalizar cada venta
                              </Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid2>
                  </Grid2>
                </Box>

                {/* Acciones */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {hasChanges && (
                    <Chip
                      label="Cambios sin guardar"
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  )}

                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={!hasChanges || isLoading}
                  >
                    Descartar
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={
                      !hasChanges || isLoading || !dataPointOfSale.name.trim()
                    }
                    sx={{
                      minWidth: 160,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                      },
                    }}
                  >
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
      </Fade>

      {/* Snackbar para mostrar notificaciones */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;