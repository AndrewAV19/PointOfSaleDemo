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
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  SupervisorAccount as RoleIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Map as MapIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import type { UserRequest, Role } from "../../interfaces/users.interface";
//import { storeUsers } from "../../../stores/users.store";
//import { storeRoles } from "../../../stores/roles.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { mockRolesStore } from "../../mocks/tiendaAbarrotes.mock";

const AddUser: React.FC = () => {
  const initialUserState: UserRequest = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
    roleIds: [],
  };

  const { form: user, handleChange, resetForm } = useForm(initialUserState);
  const requiredFields = ["name", "email", "phone", "password", "roleIds"];
  const { validateRequiredFields, validateEmail } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Cargar roles disponibles al montar el componente
  useEffect(() => {
    const loadRoles = async () => {
      try {
        //await storeRoles.getState().getRoles();
        const roles = mockRolesStore.getState().listRoles;
        setAvailableRoles(roles);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        showSnackbar("error", "Error al cargar los roles disponibles");
      }
    };

    loadRoles();
  }, [showSnackbar]);


  const handleRoleChange = (event: any) => {
    const selectedRoleId = event.target.value as number;
    setRolSeleccionado(selectedRoleId);

    // Actualizar el form con el ID seleccionado
    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        name: "roleIds",
        value: [selectedRoleId],
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);
  };

  // MODIFICADO: Función para obtener el nombre del rol seleccionado
  const getSelectedRoleName = () => {
    if (rolSeleccionado === null) return null;
    const role = availableRoles.find((r) => r.id === rolSeleccionado);
    return role ? role.name : `Rol ${rolSeleccionado}`;
  };

  // Función para manejar campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "zipCode") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      if (!isNaN(numericValue)) {
        handleChange(e);
      }
    } else {
      handleChange(e);
    }
  };

  const handleConfirm = async () => {
    // Validar campos obligatorios
    if (!validateRequiredFields(user, requiredFields)) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    // Validar formato de correo electrónico
    if (!validateEmail(user.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    // MODIFICADO: Validar que se haya seleccionado un rol
    if (rolSeleccionado === null) {
      showSnackbar("error", "Por favor, selecciona un rol.");
      return;
    }

    try {
      // await storeUsers.getState().createUser({
      //   name: user.name,
      //   email: user.email,
      //   password: user.password || "",
      //   phone: user.phone,
      //   address: user.address,
      //   city: user.city,
      //   state: user.state,
      //   zipCode: user.zipCode,
      //   country: user.country,
      //   roleIds: [rolSeleccionado],
      // });

      showSnackbar("success", "Usuario agregado correctamente.");
      resetForm();
      setRolSeleccionado(null); // MODIFICADO: resetear a null
    } catch (error) {
      console.log(error);
      showSnackbar("error", "Error al crear el usuario.");
    }
  };

  const handleReset = () => {
    resetForm();
    setRolSeleccionado(null);
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
            Nuevo Usuario
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Registra y gestiona usuarios del sistema
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Información Personal */}
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
                    <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                    Información Personal
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre Completo *"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!user.name}
                        helperText={
                          !user.name ? "Este campo es obligatorio" : ""
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Correo Electrónico *"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={user.email !== "" && !validateEmail(user.email)}
                        helperText={
                          user.email !== "" && !validateEmail(user.email)
                            ? "Correo electrónico no válido"
                            : ""
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Teléfono *"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        variant="outlined"
                        helperText={
                          !user.phone ? "Este campo es obligatorio" : ""
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contraseña *"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={user.password}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!user.password}
                        helperText={
                          !user.password ? "Este campo es obligatorio" : ""
                        }
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <SecurityIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* MODIFICADO: Rol del Usuario - Ahora selección simple */}
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
                    Rol del Usuario
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        required
                        error={rolSeleccionado === null}
                      >
                        <InputLabel id="role-select-label">
                          Seleccionar Rol *
                        </InputLabel>
                        <Select
                          labelId="role-select-label"
                          id="role-select"
                          // MODIFICADO: No es multiple
                          value={rolSeleccionado || ""}
                          onChange={handleRoleChange}
                          input={<OutlinedInput label="Seleccionar Rol *" />}
                          startAdornment={
                            <InputAdornment position="start">
                              <RoleIcon color="action" />
                            </InputAdornment>
                          }
                        >
                          {availableRoles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {rolSeleccionado === null && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 1, display: "block" }}
                          >
                            Este campo es obligatorio
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "grey.50",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                          gutterBottom
                        >
                          Rol Seleccionado:
                        </Typography>
                        {rolSeleccionado !== null ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 1,
                            }}
                          >
                            <Chip
                              label={getSelectedRoleName()}
                              color="primary"
                              variant="filled"
                              size="small"
                            />
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Sin rol asignado
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          Solo se puede asignar un rol por usuario
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Dirección (Opcional) - Se mantiene igual */}
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
                    <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                    Dirección (Opcional)
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Ciudad"
                        name="city"
                        value={user.city}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <MapIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Estado/Provincia"
                        name="state"
                        value={user.state}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Código Postal"
                        name="zipCode"
                        type="number"
                        value={user.zipCode === 0 ? "" : user.zipCode}
                        onChange={handleNumberChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            inputProps: {
                              min: 0,
                              step: 1,
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="País"
                        name="country"
                        value={user.country}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PublicIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Panel de Resumen y Acciones - ACTUALIZADO */}
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
                    <PersonIcon sx={{ mr: 1 }} />
                    Resumen del Usuario
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Resumen de Información */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Nombre:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {user.name || "No definido"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {user.email || "No definido"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Teléfono:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {user.phone || "No definido"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Rol:
                      </Typography>
                      <Box sx={{ textAlign: "right" }}>
                        {rolSeleccionado !== null ? (
                          <Chip
                            label={getSelectedRoleName()}
                            size="small"
                            color="primary"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin asignar
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {(user.city || user.state) && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Ubicación:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {[user.city, user.state].filter(Boolean).join(", ")}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Estado de Validación - ACTUALIZADO */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        user.name &&
                        user.email &&
                        user.phone &&
                        user.password &&
                        rolSeleccionado !== null &&
                        validateEmail(user.email)
                          ? "success.50"
                          : "warning.50",
                      borderColor:
                        user.name &&
                        user.email &&
                        user.phone &&
                        user.password &&
                        rolSeleccionado !== null &&
                        validateEmail(user.email)
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
                        color={user.name ? "success" : "default"}
                        variant={user.name ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Email"
                        size="small"
                        color={
                          user.email && validateEmail(user.email)
                            ? "success"
                            : "default"
                        }
                        variant={
                          user.email && validateEmail(user.email)
                            ? "filled"
                            : "outlined"
                        }
                      />
                      <Chip
                        label="Teléfono"
                        size="small"
                        color={user.phone ? "success" : "default"}
                        variant={user.phone ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Contraseña"
                        size="small"
                        color={user.password ? "success" : "default"}
                        variant={user.password ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Rol"
                        size="small"
                        color={rolSeleccionado !== null ? "success" : "default"}
                        variant={
                          rolSeleccionado !== null ? "filled" : "outlined"
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
                        !user.name ||
                        !user.email ||
                        !user.phone ||
                        !user.password ||
                        rolSeleccionado === null ||
                        !validateEmail(user.email)
                      }
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Crear Usuario
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

        {/* Snackbar Mejorado */}
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
              success: <PersonIcon fontSize="inherit" />,
              error: <PersonIcon fontSize="inherit" />,
              warning: <PersonIcon fontSize="inherit" />,
              info: <PersonIcon fontSize="inherit" />,
            }}
          >
            {messageSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AddUser;
