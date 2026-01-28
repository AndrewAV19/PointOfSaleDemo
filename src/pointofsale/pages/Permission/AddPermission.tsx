import React from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  VerifiedUser as PermissionIcon,
} from "@mui/icons-material";
import { Permission } from "../../interfaces/permissions.interface";
import { storePermissions } from "../../../stores/permissions.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const AddPermission: React.FC = () => {
  const initialPermissionState: Omit<Permission, 'id'> = {
    name: "",
    description: "",
  };

  const { form: permission, handleChange, resetForm } = useForm(initialPermissionState);
  const requiredFields = ["name", "description"];
  const { validateRequiredFields } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleConfirm = async () => {
    // Validar campos obligatorios
    if (!validateRequiredFields(permission, requiredFields)) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    // Validar longitud mínima del nombre
    if (permission.name.length < 3) {
      showSnackbar("error", "El nombre debe tener al menos 3 caracteres.");
      return;
    }

    // Validar longitud mínima de la descripción
    if (permission.description.length < 10) {
      showSnackbar("error", "La descripción debe tener al menos 10 caracteres.");
      return;
    }

    try {
      await storePermissions.getState().createPermission({
        name: permission.name,
        description: permission.description,
      });

      showSnackbar("success", "Permiso creado correctamente.");
      resetForm();
    } catch (error) {
      console.error("Error creating permission:", error);
      showSnackbar(
        "error", 
        error instanceof Error 
          ? error.message 
          : "Error al crear el permiso. Por favor, intenta nuevamente."
      );
    }
  };

  const handleReset = () => {
    resetForm();
  };

  // Función para generar sugerencias de nombre basado en el input
  const generateNameSuggestions = (input: string) => {
    if (input.length < 2) return [];
    
    const baseName = input.toLowerCase().replace(/\s+/g, '.');
    return [
      `${baseName}.create`,
      `${baseName}.read`,
      `${baseName}.update`,
      `${baseName}.delete`,
      `${baseName}.manage`
    ];
  };

  const nameSuggestions = generateNameSuggestions(permission.name);

  return (
    <Box
      sx={{
        backgroundColor: "grey.50",
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary.main"
            gutterBottom
          >
            Nuevo Permiso
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crea y gestiona permisos del sistema para controlar accesos
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Información del Permiso */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <SecurityIcon sx={{ mr: 1, color: "primary.main" }} />
                    Información del Permiso
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre del Permiso *"
                        name="name"
                        value={permission.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!permission.name || permission.name.length < 3}
                        helperText={
                          !permission.name 
                            ? "Este campo es obligatorio" 
                            : permission.name.length < 3
                            ? "El nombre debe tener al menos 3 caracteres"
                            : "Usa formato snake_case o dot.notation (ej: users.create)"
                        }
                        placeholder="Ej: ROLES_CREATE, ROLES_READ"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PermissionIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      
                      {/* Sugerencias de nombres */}
                      {nameSuggestions.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            Sugerencias:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                            {nameSuggestions.map((suggestion, index) => (
                              <Chip
                                key={index}
                                label={suggestion}
                                size="small"
                                variant="outlined"
                                onClick={() => handleChange({
                                  target: { name: "name", value: suggestion }
                                } as React.ChangeEvent<HTMLInputElement>)}
                                clickable
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción *"
                        name="description"
                        value={permission.description}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        multiline
                        rows={4}
                        error={!permission.description || permission.description.length < 10}
                        helperText={
                          !permission.description 
                            ? "Este campo es obligatorio" 
                            : permission.description.length < 10
                            ? "La descripción debe tener al menos 10 caracteres"
                            : `${permission.description.length}/200 caracteres`
                        }
                        inputProps={{ maxLength: 200 }}
                        placeholder="Describe detalladamente qué permite hacer este permiso en el sistema..."
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <DescriptionIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Convenciones de Nomenclatura */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  borderColor: "info.light",
                  backgroundColor: "info.50",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", color: "info.dark" }}
                  >
                    <SecurityIcon sx={{ mr: 1 }} />
                    Convenciones de Nomenclatura
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom color="info.dark">
                        📝 Formato Recomendado:
                      </Typography>
                      <Stack spacing={0.5}>
                        <Chip label="PRODUCTS_CREATE" size="small" variant="filled" color="info" />
                        <Chip label="PRODUCTS_READ" size="small" variant="filled" color="info" />
                        <Chip label="INCOME_READ" size="small" variant="outlined" />
                        <Chip label="EXPENSES_READ" size="small" variant="outlined" />
                        <Chip label="REPORTS_READ" size="small" variant="outlined" />
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom color="info.dark">
                        🎯 Acciones Comunes:
                      </Typography>
                      <Stack spacing={0.5}>
                        <Chip label="Crear" size="small" color="success" />
                        <Chip label="Leer" size="small" color="info" />
                        <Chip label="Actualizar" size="small" color="warning" />
                        <Chip label="Eliminar" size="small" color="error" />
                        <Chip label="Gestionar" size="small" color="primary" />
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Panel de Resumen y Acciones */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                position: "sticky",
                top: 24,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Header del Resumen */}
                <Box
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    p: 3,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "600",
                    }}
                  >
                    <SecurityIcon sx={{ mr: 1 }} />
                    Resumen del Permiso
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Resumen de Información */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Nombre del Permiso:
                      </Typography>
                      {permission.name ? (
                        <Chip
                          label={permission.name}
                          color="primary"
                          variant="filled"
                          size="medium"
                          sx={{ fontWeight: "500" }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin nombre asignado
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Descripción:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="500"
                        sx={{
                          wordBreak: "break-word",
                          minHeight: "40px",
                          fontStyle: permission.description ? "normal" : "italic",
                          color: permission.description ? "text.primary" : "text.secondary"
                        }}
                      >
                        {permission.description || "Sin descripción"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Estado de Validación */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 
                        permission.name && 
                        permission.description && 
                        permission.name.length >= 3 && 
                        permission.description.length >= 10
                          ? "success.50"
                          : "warning.50",
                      borderColor: 
                        permission.name && 
                        permission.description && 
                        permission.name.length >= 3 && 
                        permission.description.length >= 10
                          ? "success.100"
                          : "warning.100",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Estado del Formulario:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip
                        label="Nombre"
                        size="small"
                        color={
                          permission.name && permission.name.length >= 3 
                            ? "success" 
                            : "default"
                        }
                        variant={
                          permission.name && permission.name.length >= 3 
                            ? "filled" 
                            : "outlined"
                        }
                      />
                      <Chip
                        label="Descripción"
                        size="small"
                        color={
                          permission.description && permission.description.length >= 10 
                            ? "success" 
                            : "default"
                        }
                        variant={
                          permission.description && permission.description.length >= 10 
                            ? "filled" 
                            : "outlined"
                        }
                      />
                    </Box>
                  </Paper>

                  <Divider sx={{ my: 3 }} />

                  {/* Botones de Acción */}
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SaveIcon />}
                      fullWidth
                      onClick={handleConfirm}
                      disabled={
                        !permission.name || 
                        !permission.description || 
                        permission.name.length < 3 || 
                        permission.description.length < 10
                      }
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Crear Permiso
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<ClearIcon />}
                      onClick={handleReset}
                      fullWidth
                      size="large"
                    >
                      Limpiar Todo
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              fontSize: "0.9rem",
              borderRadius: 2,
              fontWeight: "500",
            }}
            iconMapping={{
              success: <SecurityIcon fontSize="inherit" />,
              error: <SecurityIcon fontSize="inherit" />,
              warning: <SecurityIcon fontSize="inherit" />,
              info: <SecurityIcon fontSize="inherit" />,
            }}
          >
            {messageSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AddPermission;