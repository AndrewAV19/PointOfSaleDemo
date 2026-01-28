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
  Business as BusinessIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Map as MapIcon,
  Public as PublicIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import type { Supplier } from "../../interfaces/supplier.interface";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";
//import { storeSuppliers } from "../../../stores/suppliers.store";

const AddSupplier: React.FC = () => {
  const initialSupplierState: Supplier = {
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
    taxId: "",
    website: "",
  };

  const { form: supplier, handleChange, resetForm } = useForm(initialSupplierState);
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
    if (!validateRequiredFields(supplier, requiredFields)) {
      showSnackbar("error", "Por favor, completa los campos obligatorios.");
      return;
    }

    if (!validateEmail(supplier.email ?? "")) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      // await storeSuppliers.getState().createSupplier({
      //   name: supplier.name,
      //   contactName: supplier.contactName,
      //   email: supplier.email ?? "",
      //   phone: supplier.phone ?? "",
      //   address: supplier.address,
      //   city: supplier.city,
      //   state: supplier.state,
      //   zipCode: supplier.zipCode,
      //   country: supplier.country,
      //   taxId: supplier.taxId,
      //   website: supplier.website,
      // });

      showSnackbar("success", "Proveedor agregado correctamente.");
      resetForm(); 
    } catch (error) {
      showSnackbar("error", "Error al crear el proveedor.");
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
            Nuevo Proveedor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Registra y gestiona la información de tus proveedores
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Información de la Empresa */}
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
                    <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                    Información de la Empresa
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre de la Empresa *"
                        name="name"
                        value={supplier.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!supplier.name}
                        helperText={!supplier.name ? "Este campo es obligatorio" : ""}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <BusinessIcon color="action" />
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
                        value={supplier.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={supplier.email !== "" && !validateEmail(supplier.email ?? "")}
                        helperText={
                          supplier.email !== "" && !validateEmail(supplier.email ?? "") 
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
                        value={supplier.phone}
                        onChange={handleChange}
                        variant="outlined"
                        helperText={!supplier.phone ? "Este campo es obligatorio" : ""}
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

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tax ID / RFC"
                        name="taxId"
                        value={supplier.taxId}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <AssignmentIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sitio Web"
                        name="website"
                        value={supplier.website}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LanguageIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Información de Contacto */}
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
                    Información de Contacto
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre del Contacto"
                        name="contactName"
                        value={supplier.contactName}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Persona de contacto principal"
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
                        value={supplier.address}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                        placeholder="Dirección completa de la empresa"
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
                        value={supplier.city}
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
                        value={supplier.state}
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
                        value={supplier.zipCode === 0 ? "" : supplier.zipCode}
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
                        value={supplier.country}
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
                    <BusinessIcon sx={{ mr: 1 }} />
                    Resumen del Proveedor
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Resumen de Información */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Empresa:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.name || "No definido"}
                      </Typography>
                    </Box>
                    {supplier.contactName && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Contacto:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {supplier.contactName}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.email || "No definido"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.phone || "No definido"}
                      </Typography>
                    </Box>
                    {(supplier.city || supplier.state) && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Ubicación:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {[supplier.city, supplier.state].filter(Boolean).join(", ")}
                        </Typography>
                      </Box>
                    )}
                    {supplier.taxId && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Tax ID:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {supplier.taxId}
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
                        supplier.name && supplier.email && supplier.phone && validateEmail(supplier.email)
                          ? "success.50"
                          : "warning.50",
                      borderColor: 
                        supplier.name && supplier.email && supplier.phone && validateEmail(supplier.email)
                          ? "success.100"
                          : "warning.100",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Estado del Formulario:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip
                        label="Empresa"
                        size="small"
                        color={supplier.name ? "success" : "default"}
                        variant={supplier.name ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Email"
                        size="small"
                        color={supplier.email && validateEmail(supplier.email) ? "success" : "default"}
                        variant={supplier.email && validateEmail(supplier.email) ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Teléfono"
                        size="small"
                        color={supplier.phone ? "success" : "default"}
                        variant={supplier.phone ? "filled" : "outlined"}
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
                      disabled={!supplier.name || !supplier.email || !supplier.phone || !validateEmail(supplier.email)}
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Crear Proveedor
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
              success: <BusinessIcon fontSize="inherit" />,
              error: <BusinessIcon fontSize="inherit" />,
              warning: <BusinessIcon fontSize="inherit" />,
              info: <BusinessIcon fontSize="inherit" />,
            }}
          >
            {messageSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AddSupplier;