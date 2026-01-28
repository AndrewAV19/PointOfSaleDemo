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
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Map as MapIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import type { Clients } from "../../interfaces/clients.interface";
//import { storeClients } from "../../../stores/clients.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const AddClient: React.FC = () => {
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

  const { form: client, handleChange, resetForm } = useForm(initialClientState);
  const requiredFields = ["name", "email", "phone"];
  const { validateRequiredFields, validateEmail } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleConfirm = async () => {
    if (!validateRequiredFields(client, requiredFields)) {
      showSnackbar("error", "Por favor, completa los campos obligatorios.");
      return;
    }

    if (!validateEmail(client.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      // await storeClients.getState().createClient({
      //   name: client.name,
      //   email: client.email,
      //   phone: client.phone,
      //   address: client.address,
      //   city: client.city,
      //   state: client.state,
      //   zipCode: client.zipCode,
      //   country: client.country,
      // });

      showSnackbar("success", "Cliente agregado correctamente.");
      resetForm(); 
    } catch (error) {
      showSnackbar("error", "Error al crear el cliente.");
      console.error(error);
    }
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
            Nuevo Cliente
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Registra y gestiona la información de tus clientes
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
                        value={client.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!client.name}
                        helperText={!client.name ? "Este campo es obligatorio" : ""}
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
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        value={client.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={client.email !== "" && !validateEmail(client.email)}
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
                              step: 1
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
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Resumen de Información */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {client.name || "No definido"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {client.email || "No definido"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {client.phone || "No definido"}
                      </Typography>
                    </Box>
                    {(client.city || client.state) && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Ubicación:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {[client.city, client.state].filter(Boolean).join(", ")}
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
                        client.name && client.email && client.phone && validateEmail(client.email)
                          ? "success.50"
                          : "warning.50",
                      borderColor: 
                        client.name && client.email && client.phone && validateEmail(client.email)
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
                        color={client.name ? "success" : "default"}
                        variant={client.name ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Email"
                        size="small"
                        color={client.email && validateEmail(client.email) ? "success" : "default"}
                        variant={client.email && validateEmail(client.email) ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Teléfono"
                        size="small"
                        color={client.phone ? "success" : "default"}
                        variant={client.phone ? "filled" : "outlined"}
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
                      disabled={!client.name || !client.email || !client.phone || !validateEmail(client.email)}
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Crear Cliente
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<ClearIcon />}
                      onClick={resetForm}
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

export default AddClient;