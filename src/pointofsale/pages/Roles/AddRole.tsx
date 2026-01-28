// components/AddRole.tsx
import React, { useState, useEffect } from "react";
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
  Checkbox,
  Autocomplete,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  SupervisorAccount as RoleIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import type { Role as RoleRequest } from "../../interfaces/roles.interface";
//import { storeRoles } from "../../../stores/roles.store";
//import { storePermissions } from "../../../stores/permissions.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";
import type { Permission } from "../../interfaces/permissions.interface";

const AddRole: React.FC = () => {
  const initialRoleState: RoleRequest = {
    name: "",
    description: "",
    permissionIds: [],
  };

  const {
    form: role,
    handleChange,
    resetForm,
    setFormField,
  } = useForm(initialRoleState);
  const requiredFields = ["name", "description"];
  const { validateRequiredFields } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  // Estados para permisos
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Cargar permisos disponibles solo una vez
  // useEffect(() => {
  //   const loadPermissions = async () => {
  //     // Evitar recargas innecesarias
  //     if (permissionsLoaded || loadingPermissions) {
  //       return;
  //     }

  //     try {
  //       setLoadingPermissions(true);

  //       // Verificar si ya tenemos permisos en el store
  //       const currentPermissions = storePermissions.getState().listPermissions;
  //       if (currentPermissions.length > 0) {
  //         setAvailablePermissions(currentPermissions);
  //         setPermissionsLoaded(true);
  //         return;
  //       }

  //       // Si no hay permisos, cargarlos
  //       //await storePermissions.getState().getPermissions();
  //       //const permissions = storePermissions.getState().listPermissions;
  //       setAvailablePermissions(permissions);
  //       setPermissionsLoaded(true);
  //     } catch (error) {
  //       //console.error("Error loading permissions:", error);
  //       showSnackbar("error", "Error al cargar los permisos disponibles");
  //     } finally {
  //       setLoadingPermissions(false);
  //     }
  //   };

  //   loadPermissions();
  // }, [permissionsLoaded, loadingPermissions, showSnackbar]);

  const handlePermissionChange = (_: any, newValue: Permission[]) => {
    setSelectedPermissions(newValue);
    const permissionIds = newValue.map((permission) => permission.id);
    setFormField("permissionIds", permissionIds);
  };

  const handleRemovePermission = (permissionId: number) => {
    const newSelectedPermissions = selectedPermissions.filter(
      (p) => p.id !== permissionId
    );
    setSelectedPermissions(newSelectedPermissions);
    const permissionIds = newSelectedPermissions.map((p) => p.id);
    setFormField("permissionIds", permissionIds);
  };

  const handleClearPermissions = () => {
    setSelectedPermissions([]);
    setFormField("permissionIds", []);
  };

  const handleConfirm = async () => {
    if (!validateRequiredFields(role, requiredFields)) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    if (role.name.length < 3) {
      showSnackbar(
        "error",
        "El nombre del rol debe tener al menos 3 caracteres."
      );
      return;
    }

    if (role.description.length < 10) {
      showSnackbar(
        "error",
        "La descripción debe tener al menos 10 caracteres."
      );
      return;
    }

    const existingRoles = storeRoles.getState().listRoles;
    const roleNameExists = existingRoles.some(
      (existingRole) =>
        existingRole.name.toLowerCase() === role.name.trim().toLowerCase()
    );

    if (roleNameExists) {
      showSnackbar(
        "error",
        "Ya existe un rol con este nombre. Por favor, elige otro."
      );
      return;
    }

    const permissionIds = Array.isArray(role.permissionIds)
      ? role.permissionIds.filter((id) => typeof id === "number" && !isNaN(id))
      : [];

    const payload = {
      name: role.name.trim(),
      description: role.description.trim(),
      permissionIds: permissionIds,
    };

    try {
      await storeRoles.getState().createRole(payload);
      showSnackbar("success", "Rol creado correctamente.");
      resetForm();
      setSelectedPermissions([]);
    } catch (error) {
      if (error instanceof Error && error.message.includes("constraint")) {
        showSnackbar(
          "error",
          "Ya existe un rol con este nombre. Por favor, elige otro nombre."
        );
      } else {
        showSnackbar(
          "error",
          error instanceof Error
            ? error.message
            : "Error al crear el rol. Por favor, intenta nuevamente."
        );
      }
    }
  };

  const handleReset = () => {
    resetForm();
    setSelectedPermissions([]);
  };

  const getPermissionTypeColor = (permissionName: string) => {
    const name = permissionName.toLowerCase();
    if (name.includes(".create") || name.includes(".write")) return "success";
    if (name.includes(".read") || name.includes(".view")) return "info";
    if (name.includes(".update") || name.includes(".edit")) return "warning";
    if (name.includes(".delete") || name.includes(".remove")) return "error";
    if (name.includes(".manage") || name.includes(".admin")) return "primary";
    return "default";
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey.50",
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Mejorado */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary.main"
            gutterBottom
          >
            Nuevo Rol
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crea y gestiona roles del sistema con permisos específicos
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Información del Rol */}
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
                    <RoleIcon sx={{ mr: 1, color: "primary.main" }} />
                    Información del Rol
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre del Rol *"
                        name="name"
                        value={role.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!role.name || role.name.length < 3}
                        helperText={
                          !role.name
                            ? "Este campo es obligatorio"
                            : role.name.length < 3
                            ? "El nombre debe tener al menos 3 caracteres"
                            : "Usa un nombre descriptivo para el rol (ej: ADMIN, USER, MANAGER)"
                        }
                        placeholder="Ej: Administrador, Empleado, Supervisor"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <RoleIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción *"
                        name="description"
                        value={role.description}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        multiline
                        rows={4}
                        error={
                          !role.description || role.description.length < 10
                        }
                        helperText={
                          !role.description
                            ? "Este campo es obligatorio"
                            : role.description.length < 10
                            ? "La descripción debe tener al menos 10 caracteres"
                            : `${role.description.length}/200 caracteres`
                        }
                        inputProps={{ maxLength: 200 }}
                        placeholder="Describe las responsabilidades y alcance de este rol en el sistema..."
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

              {/* Permisos del Rol */}
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
                    Permisos del Rol
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Selecciona los permisos que tendrá este rol:
                      </Typography>

                      {/* Selector de permisos con Autocomplete */}
                      <Autocomplete
                        multiple
                        options={availablePermissions}
                        value={selectedPermissions}
                        onChange={handlePermissionChange}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Buscar y seleccionar permisos..."
                            helperText={`${selectedPermissions.length} permisos seleccionados`}
                            error={false}
                          />
                        )}
                        renderOption={(
                          { key, ...otherProps },
                          option,
                          { selected }
                        ) => (
                          <li key={key} {...otherProps}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Checkbox checked={selected} />
                              <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" fontWeight="500">
                                  {option.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {option.description}
                                </Typography>
                              </Box>
                            </Box>
                          </li>
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.id}
                              label={option.name}
                              size="small"
                              color={getPermissionTypeColor(option.name) as any}
                              onDelete={() => handleRemovePermission(option.id)}
                            />
                          ))
                        }
                        loading={loadingPermissions}
                        sx={{ mb: 3 }}
                      />

                      {/* Permisos seleccionados */}
                      {selectedPermissions.length > 0 && (
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "success.50",
                            borderColor: "success.100",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="600">
                              Permisos Seleccionados (
                              {selectedPermissions.length})
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<RemoveIcon />}
                              onClick={handleClearPermissions}
                              color="error"
                            >
                              Limpiar Todos
                            </Button>
                          </Box>

                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {selectedPermissions.map((permission) => (
                              <Chip
                                key={permission.id}
                                label={permission.name}
                                color={
                                  getPermissionTypeColor(permission.name) as any
                                }
                                variant="filled"
                                onDelete={() =>
                                  handleRemovePermission(permission.id)
                                }
                                size="medium"
                              />
                            ))}
                          </Box>
                        </Paper>
                      )}
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
                    <RoleIcon sx={{ mr: 1 }} />
                    Resumen del Rol
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Resumen de Información */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Nombre del Rol:
                      </Typography>
                      {role.name ? (
                        <Chip
                          label={role.name}
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Descripción:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{
                          wordBreak: "break-word",
                          minHeight: "40px",
                          fontStyle: role.description ? "normal" : "italic",
                          color: role.description
                            ? "text.primary"
                            : "text.secondary",
                        }}
                      >
                        {role.description || "Sin descripción"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Permisos Asignados:
                      </Typography>
                      {selectedPermissions.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight="500">
                            {selectedPermissions.length} permisos
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selectedPermissions
                              .slice(0, 5)
                              .map((permission) => (
                                <Chip
                                  key={permission.id}
                                  label={permission.name}
                                  size="small"
                                  color={
                                    getPermissionTypeColor(
                                      permission.name
                                    ) as any
                                  }
                                  variant="filled"
                                />
                              ))}
                            {selectedPermissions.length > 5 && (
                              <Chip
                                label={`+${selectedPermissions.length - 5} más`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin permisos asignados
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  {/* Estado de Validación */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        role.name &&
                        role.description &&
                        role.name.length >= 3 &&
                        role.description.length >= 10
                          ? "success.50"
                          : "warning.50",
                      borderColor:
                        role.name &&
                        role.description &&
                        role.name.length >= 3 &&
                        role.description.length >= 10
                          ? "success.100"
                          : "warning.100",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      gutterBottom
                    >
                      Estado del Formulario:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip
                        label="Nombre"
                        size="small"
                        color={
                          role.name && role.name.length >= 3
                            ? "success"
                            : "default"
                        }
                        variant={
                          role.name && role.name.length >= 3
                            ? "filled"
                            : "outlined"
                        }
                      />
                      <Chip
                        label="Descripción"
                        size="small"
                        color={
                          role.description && role.description.length >= 10
                            ? "success"
                            : "default"
                        }
                        variant={
                          role.description && role.description.length >= 10
                            ? "filled"
                            : "outlined"
                        }
                      />
                      <Chip
                        label="Permisos"
                        size="small"
                        color={
                          selectedPermissions.length > 0 ? "success" : "default"
                        }
                        variant={
                          selectedPermissions.length > 0 ? "filled" : "outlined"
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
                        !role.name ||
                        !role.description ||
                        role.name.length < 3 ||
                        role.description.length < 10
                      }
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Crear Rol
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
              success: <RoleIcon fontSize="inherit" />,
              error: <RoleIcon fontSize="inherit" />,
              warning: <RoleIcon fontSize="inherit" />,
              info: <RoleIcon fontSize="inherit" />,
            }}
          >
            {messageSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AddRole;
