import React, { useEffect, useState } from "react";
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
  // ELIMINAR Checkbox y ListItemText ya que no se usarán
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
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Map as MapIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { UserRequest, Users } from "../../interfaces/users.interface";
import { storeUsers } from "../../../stores/users.store";
import { dataStore } from "../../../stores/generalData.store";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useValidation } from "../../../hooks/useValidation";
import { useUserRoles } from "../../../hooks/useUserRoles";
import { storeRoles } from "../../../stores/roles.store";
import { Role } from "../../interfaces/users.interface";

const EditUserPage: React.FC = () => {
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

  const convertToUserRequest = (selectedUser: Users): UserRequest => {
    return {
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password ?? "",
      phone: selectedUser.phone,
      address: selectedUser.address,
      city: selectedUser.city,
      state: selectedUser.state,
      zipCode: selectedUser.zipCode,
      country: selectedUser.country,
      // Tomar solo el primer rol si existe
      roleIds: selectedUser.roles.length > 0 ? [selectedUser.roles[0].id] : [],
    };
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const { selectedUser, setSelectedUser, getUserById } = dataStore();
  const { deleteUser } = storeUsers();
  const { isAdmin } = useUserRoles();
  const currentUserId = localStorage.getItem("id_usuario");
  const { validateRequiredFields, validateEmail } = useValidation();
  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar roles disponibles al montar el componente
  useEffect(() => {
    const loadRoles = async () => {
      try {
        await storeRoles.getState().getRoles();
        const roles = storeRoles.getState().listRoles;
        setAvailableRoles(roles);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        showSnackbar("error", "Error al cargar los roles disponibles");
      }
    };

    if (isAdmin) {
      loadRoles();
    }
  }, [isAdmin, showSnackbar]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAdmin && currentUserId) {
        try {
          const userId = parseInt(currentUserId);
          if (!isNaN(userId)) {
            await getUserById(userId);
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
          showSnackbar("error", "Error al cargar los datos del usuario.");
        }
      }
    };

    loadUserData();
  }, [isAdmin, currentUserId, getUserById, setSelectedUser]);

  const {
    form: user,
    handleChange,
    resetForm,
  } = useForm(
    selectedUser ? convertToUserRequest(selectedUser) : initialUserState
  );

  useEffect(() => {
    if (selectedUser) {
      const userRequest = convertToUserRequest(selectedUser);
      resetForm();
      setRolesSeleccionados(userRequest.roleIds);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const originalUser = convertToUserRequest(selectedUser);
      const hasNameChanged = user.name !== originalUser.name;
      const hasEmailChanged = user.email !== originalUser.email;
      const hasPhoneChanged = user.phone !== originalUser.phone;
      const hasAddressChanged = user.address !== originalUser.address;
      const hasCityChanged = user.city !== originalUser.city;
      const hasStateChanged = user.state !== originalUser.state;
      const hasZipCodeChanged = user.zipCode !== originalUser.zipCode;
      const hasCountryChanged = user.country !== originalUser.country;

      // Solo considerar cambios en roles si es admin
      const hasRoleChanged = isAdmin
        ? JSON.stringify(rolesSeleccionados) !==
          JSON.stringify(originalUser.roleIds)
        : false;

      const hasPasswordChanged = !!currentPassword || !!newPassword;

      setHasChanges(
        hasNameChanged ||
          hasEmailChanged ||
          hasPhoneChanged ||
          hasAddressChanged ||
          hasCityChanged ||
          hasStateChanged ||
          hasZipCodeChanged ||
          hasCountryChanged ||
          hasRoleChanged ||
          hasPasswordChanged
      );
    }
  }, [
    user,
    rolesSeleccionados,
    currentPassword,
    newPassword,
    selectedUser,
    isAdmin,
  ]);

  // MODIFICADO: Manejar selección de UN solo rol
  const handleRoleChange = (event: any) => {
    // Solo permitir cambiar roles si es admin
    if (!isAdmin) {
      showSnackbar(
        "error",
        "No tienes permisos para modificar roles de usuario."
      );
      return;
    }

    const selectedRoleId = event.target.value as number;

    // Si se selecciona el mismo rol, no hacer nada
    if (rolesSeleccionados[0] === selectedRoleId) {
      return;
    }

    // Establecer solo un rol seleccionado
    setRolesSeleccionados([selectedRoleId]);

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
    if (rolesSeleccionados.length === 0) return null;
    const role = availableRoles.find((r) => r.id === rolesSeleccionados[0]);
    return role ? role.name : `Rol ${rolesSeleccionados[0]}`;
  };

  const handleSaveChanges = async () => {
    if (!validateRequiredFields(user, ["name", "email", "phone"])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    if (!validateEmail(user.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      showSnackbar(
        "error",
        "Para cambiar la contraseña, debes completar ambos campos de contraseña."
      );
      return;
    }

    try {
      const originalUser = selectedUser
        ? convertToUserRequest(selectedUser)
        : null;

      const updatedFields = originalUser
        ? getUpdatedFields(user, originalUser, newPassword, rolesSeleccionados)
        : {};

      if (currentPassword && newPassword) {
        await storeUsers
          .getState()
          .changePassword(selectedUser?.id ?? 0, currentPassword, newPassword);
        showSnackbar("success", "Contraseña actualizada correctamente.");
      }

      if (Object.keys(updatedFields).length > 0) {
        // Crear el objeto final asegurando que roleIds siempre esté presente
        const finalUpdateFields: UserRequest = {
          name: updatedFields.name ?? user.name,
          email: updatedFields.email ?? user.email,
          phone: updatedFields.phone ?? user.phone,
          address: updatedFields.address ?? user.address,
          city: updatedFields.city ?? user.city,
          state: updatedFields.state ?? user.state,
          zipCode: updatedFields.zipCode ?? user.zipCode,
          country: updatedFields.country ?? user.country,
          password: user.password, // Asegurar que password esté presente
          roleIds: isAdmin
            ? updatedFields.roleIds ?? user.roleIds
            : user.roleIds,
        };

        await storeUsers
          .getState()
          .updateUser(selectedUser?.id ?? 0, finalUpdateFields);

        showSnackbar("success", "Usuario actualizado correctamente.");
      }

      clearPasswordFields();
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      showSnackbar("error", "Error al actualizar el usuario.");
    }
  };

  const getUpdatedFields = (
    user: UserRequest,
    originalUser: UserRequest,
    newPassword: string,
    rolesSeleccionados: number[]
  ): Partial<UserRequest> => {
    const updatedFields: Partial<UserRequest> = {};

    if (user.name !== originalUser.name) updatedFields.name = user.name;
    if (user.email !== originalUser.email) updatedFields.email = user.email;
    if (newPassword && newPassword !== originalUser.password)
      updatedFields.password = newPassword;
    if (user.phone !== originalUser.phone) updatedFields.phone = user.phone;
    if (user.address !== originalUser.address)
      updatedFields.address = user.address;
    if (user.city !== originalUser.city) updatedFields.city = user.city;
    if (user.state !== originalUser.state) updatedFields.state = user.state;
    if (user.zipCode !== originalUser.zipCode)
      updatedFields.zipCode = user.zipCode;
    if (user.country !== originalUser.country)
      updatedFields.country = user.country;

    if (
      isAdmin &&
      JSON.stringify(rolesSeleccionados) !==
        JSON.stringify(originalUser.roleIds)
    ) {
      updatedFields.roleIds = rolesSeleccionados;
    }

    return updatedFields;
  };

  const clearPasswordFields = (): void => {
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDeleteClick = () => {
    // Solo permitir eliminar si es admin
    if (!isAdmin) {
      showSnackbar("error", "No tienes permisos para eliminar usuarios.");
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser?.id ?? 0);
      navigate("/usuarios/historial");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReset = () => {
    resetForm();
    clearPasswordFields();
    if (selectedUser) {
      // MODIFICADO: Solo tomar el primer rol
      const firstRoleId =
        selectedUser.roles.length > 0 ? [selectedUser.roles[0].id] : [];
      setRolesSeleccionados(firstRoleId);
    }
    setHasChanges(false);
  };

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

  return (
    <Box
      sx={{
        backgroundColor: "grey.50",
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header con botón de regreso */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ borderRadius: 2 }}
            >
              Regresar
            </Button>
          )}
        </Box>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary.main"
            gutterBottom
          >
            {isAdmin ? "Editar Usuario" : "Mi Perfil"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin
              ? "Modifica y gestiona la información del usuario"
              : "Gestiona tu información personal"}
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
                        required
                        error={!user.phone}
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
                  </Grid>
                </CardContent>
              </Card>

              {/* Cambio de Contraseña */}
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
                    Cambio de Contraseña
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Completa ambos campos solo si deseas cambiar la contraseña
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contraseña Actual"
                        name="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        variant="outlined"
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

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nueva Contraseña"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="outlined"
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
              {isAdmin && (
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
                          error={rolesSeleccionados.length === 0}
                        >
                          <InputLabel id="role-select-label">
                            Seleccionar Rol *
                          </InputLabel>
                          <Select
                            labelId="role-select-label"
                            id="role-select"
                            // MODIFICADO: No es multiple
                            value={
                              rolesSeleccionados.length > 0
                                ? rolesSeleccionados[0]
                                : ""
                            }
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
                          {rolesSeleccionados.length === 0 && (
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
                          {rolesSeleccionados.length > 0 ? (
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
              )}

              {/* MODIFICADO: Mostrar información de rol para no administradores */}
              {!isAdmin && (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LockIcon sx={{ mr: 1, color: "primary.main" }} />
                      Información de Rol
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "grey.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                          gutterBottom
                        >
                          Tu Rol:
                        </Typography>
                        {rolesSeleccionados.length > 0 ? (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            <Chip
                              label={getSelectedRoleName()}
                              color="primary"
                              variant="filled"
                              size="small"
                            />
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin rol asignado
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label="Solo lectura"
                        color="info"
                        variant="outlined"
                        size="small"
                      />
                    </Paper>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Los permisos de rol solo pueden ser modificados por un
                      administrador.
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Dirección (Opcional) */}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    {isAdmin ? "Resumen del Usuario" : "Mi Perfil"}
                  </Typography>
                  {hasChanges && (
                    <Chip
                      label="Cambios sin guardar"
                      color="warning"
                      variant="filled"
                      size="small"
                    />
                  )}
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
                        {rolesSeleccionados.length > 0 ? (
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
                    {(currentPassword || newPassword) && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Cambio de contraseña:
                        </Typography>
                        <Chip label="Pendiente" size="small" color="warning" />
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
                        validateEmail(user.email) &&
                        (isAdmin ? rolesSeleccionados.length > 0 : true)
                          ? "success.50"
                          : "warning.50",
                      borderColor:
                        user.name &&
                        user.email &&
                        user.phone &&
                        validateEmail(user.email) &&
                        (isAdmin ? rolesSeleccionados.length > 0 : true)
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
                      {isAdmin && (
                        <Chip
                          label="Rol"
                          size="small"
                          color={
                            rolesSeleccionados.length > 0
                              ? "success"
                              : "default"
                          }
                          variant={
                            rolesSeleccionados.length > 0
                              ? "filled"
                              : "outlined"
                          }
                        />
                      )}
                      {(currentPassword || newPassword) && (
                        <Chip
                          label="Contraseña"
                          size="small"
                          color="warning"
                          variant="filled"
                        />
                      )}
                    </Box>
                  </Paper>

                  {/* Resumen de Cambios */}
                  {hasChanges && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "warning.50",
                        borderColor: "warning.100",
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        color="warning.main"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <InfoIcon sx={{ mr: 1, fontSize: 18 }} />
                        Cambios pendientes por guardar
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Se han detectado modificaciones en la información del
                        usuario.
                      </Typography>
                    </Paper>
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Botones de Acción */}
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      fullWidth
                      onClick={handleSaveChanges}
                      disabled={
                        !user.name ||
                        !user.email ||
                        !user.phone ||
                        !validateEmail(user.email) ||
                        (isAdmin && rolesSeleccionados.length === 0) ||
                        !hasChanges
                      }
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Guardar Cambios
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<ClearIcon />}
                      onClick={handleReset}
                      disabled={!hasChanges}
                      fullWidth
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        borderColor: "grey.400",
                        color: "text.secondary",
                        "&:hover": {
                          borderColor: "grey.600",
                          backgroundColor: "grey.50",
                        },
                      }}
                    >
                      Descartar Cambios
                    </Button>

                    {/* Botón de eliminar solo para administradores */}
                    {isAdmin && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteClick}
                        fullWidth
                        size="large"
                        sx={{
                          fontWeight: "600",
                          py: 1.5,
                          borderColor: "error.main",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            borderColor: "error.dark",
                            backgroundColor: "rgba(244, 67, 54, 0.04)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        Eliminar Usuario
                      </Button>
                    )}
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

        {/* Modal de Confirmación de Eliminación - Solo para administradores */}
        {isAdmin && (
          <ConfirmDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer y el usuario perderá acceso al sistema inmediatamente."
          />
        )}
      </Container>
    </Box>
  );
};

export default EditUserPage;
