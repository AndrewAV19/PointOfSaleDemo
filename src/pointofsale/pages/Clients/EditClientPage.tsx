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
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Map as MapIcon,
  Public as PublicIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Clients } from "../../interfaces/clients.interface";
import { storeClients } from "../../../stores/clients.store";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const EditClientPage: React.FC = () => {
  const initialClientState: Clients = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
  };

  const convertToClientRequest = (selectedClient: Clients): Clients => {
    return {
      name: selectedClient.name,
      email: selectedClient.email,
      phone: selectedClient.phone,
      address: selectedClient.address,
      city: selectedClient.city,
      state: selectedClient.state,
      zipCode: selectedClient.zipCode,
      country: selectedClient.country,
    };
  };

  const navigate = useNavigate();
  const { selectedClient } = dataStore();
  const { deleteClient } = storeClients();

  const {
    form: client,
    handleChange,
    resetForm,
  } = useForm(
    selectedClient ? convertToClientRequest(selectedClient) : initialClientState
  );

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

  useEffect(() => {
    if (selectedClient) {
      resetForm();
    }
  }, [selectedClient]);

  // Verificar cambios en los campos
  useEffect(() => {
    if (selectedClient) {
      const hasNameChanged = client.name !== selectedClient.name;
      const hasEmailChanged = client.email !== selectedClient.email;
      const hasPhoneChanged = client.phone !== selectedClient.phone;
      const hasAddressChanged = client.address !== selectedClient.address;
      const hasCityChanged = client.city !== selectedClient.city;
      const hasStateChanged = client.state !== selectedClient.state;
      const hasZipCodeChanged = client.zipCode !== selectedClient.zipCode;
      const hasCountryChanged = client.country !== selectedClient.country;

      setHasChanges(
        hasNameChanged ||
          hasEmailChanged ||
          hasPhoneChanged ||
          hasAddressChanged ||
          hasCityChanged ||
          hasStateChanged ||
          hasZipCodeChanged ||
          hasCountryChanged
      );
    }
  }, [client, selectedClient]);

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

  const handleSaveChanges = async () => {
    if (!validateRequiredFields(client, ["name", "email", "phone"])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    if (!validateEmail(client.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      const originalClient = selectedClient;

      const updatedFields = originalClient
        ? getUpdatedFields(client, originalClient)
        : {};

      const finalUpdateFields = {
        name: updatedFields.name ?? client.name,
        email: updatedFields.email ?? client.email,
        phone: updatedFields.phone ?? client.phone,
        address: updatedFields.address ?? client.address,
        city: updatedFields.city ?? client.city,
        state: updatedFields.state ?? client.state,
        zipCode: updatedFields.zipCode ?? client.zipCode,
        country: updatedFields.country ?? client.country,
      };

      await storeClients
        .getState()
        .updateClient(selectedClient?.id ?? 0, finalUpdateFields);

      showSnackbar("success", "Cliente actualizado correctamente.");
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      showSnackbar("error", "Error al actualizar el cliente.");
    }
  };

  const getUpdatedFields = (
    client: Clients,
    originalClient: Clients
  ): Partial<Clients> => {
    const updatedFields: Partial<Clients> = {};

    if (client.name !== originalClient.name) updatedFields.name = client.name;
    if (client.email !== originalClient.email)
      updatedFields.email = client.email;
    if (client.phone !== originalClient.phone)
      updatedFields.phone = client.phone;
    if (client.address !== originalClient.address)
      updatedFields.address = client.address;
    if (client.city !== originalClient.city) updatedFields.city = client.city;
    if (client.state !== originalClient.state)
      updatedFields.state = client.state;
    if (client.zipCode !== originalClient.zipCode)
      updatedFields.zipCode = client.zipCode;
    if (client.country !== originalClient.country)
      updatedFields.country = client.country;

    return updatedFields;
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteClient(selectedClient?.id ?? 0);
      navigate(`/clientes/historial`);
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReset = () => {
    resetForm();
    setHasChanges(false);
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
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ borderRadius: 2 }}
          >
            Regresar
          </Button>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="600"
              color="primary.main"
              gutterBottom
            >
              Editar Cliente
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Modifica y gestiona la información del cliente
            </Typography>
          </Box>
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
                        value={client.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!client.name}
                        helperText={
                          !client.name ? "Este campo es obligatorio" : ""
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
                        value={client.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={
                          client.email !== "" && !validateEmail(client.email)
                        }
                        helperText={
                          client.email !== "" && !validateEmail(client.email)
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
                        value={client.phone}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!client.phone}
                        helperText={
                          !client.phone ? "Este campo es obligatorio" : ""
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

              {/* Dirección */}
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
                    Dirección
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        name="address"
                        value={client.address}
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
                        value={client.city}
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
                        value={client.state}
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
                        value={client.zipCode === 0 ? "" : client.zipCode}
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
                        value={client.country}
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
                    Resumen del Cliente
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
                        {client.name || "No definido"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {client.email || "No definido"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Teléfono:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {client.phone || "No definido"}
                      </Typography>
                    </Box>
                    {(client.city || client.state) && (
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
                          {[client.city, client.state]
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Estado de Validación */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        client.name &&
                        client.email &&
                        client.phone &&
                        validateEmail(client.email)
                          ? "success.50"
                          : "warning.50",
                      borderColor:
                        client.name &&
                        client.email &&
                        client.phone &&
                        validateEmail(client.email)
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
                        color={client.name ? "success" : "default"}
                        variant={client.name ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Email"
                        size="small"
                        color={
                          client.email && validateEmail(client.email)
                            ? "success"
                            : "default"
                        }
                        variant={
                          client.email && validateEmail(client.email)
                            ? "filled"
                            : "outlined"
                        }
                      />
                      <Chip
                        label="Teléfono"
                        size="small"
                        color={client.phone ? "success" : "default"}
                        variant={client.phone ? "filled" : "outlined"}
                      />
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
                        cliente.
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
                        !client.name ||
                        !client.email ||
                        !client.phone ||
                        !validateEmail(client.email) ||
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
                      Eliminar Cliente
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

        {/* Modal de Confirmación de Eliminación */}
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer y puede afectar a los registros relacionados."
        />
      </Container>
    </Box>
  );
};

export default EditClientPage;
