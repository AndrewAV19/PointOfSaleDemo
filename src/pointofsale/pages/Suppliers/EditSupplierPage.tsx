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
  Business as BusinessIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Map as MapIcon,
  Public as PublicIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { Supplier } from "../../interfaces/supplier.interface";
import { storeSuppliers } from "../../../stores/suppliers.store";

const EditSupplierPage: React.FC = () => {
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

  const convertToSupplierRequest = (selectedSupplier: Supplier): Supplier => {
    return {
      name: selectedSupplier.name,
      contactName: selectedSupplier.contactName,
      email: selectedSupplier.email,
      phone: selectedSupplier.phone,
      address: selectedSupplier.address,
      city: selectedSupplier.city,
      state: selectedSupplier.state,
      zipCode: selectedSupplier.zipCode,
      country: selectedSupplier.country,
      taxId: selectedSupplier.taxId,
      website: selectedSupplier.website,
    };
  };

  const navigate = useNavigate();
  const { selectedSupplier } = dataStore();
  const { deleteSupplier } = storeSuppliers();

  const {
    form: supplier,
    handleChange,
    resetForm,
  } = useForm(
    selectedSupplier
      ? convertToSupplierRequest(selectedSupplier)
      : initialSupplierState
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
    if (selectedSupplier) {
      resetForm();
    }
  }, [selectedSupplier]);

  // Verificar cambios en los campos
  useEffect(() => {
    if (selectedSupplier) {
      const hasNameChanged = supplier.name !== selectedSupplier.name;
      const hasContactNameChanged =
        supplier.contactName !== selectedSupplier.contactName;
      const hasEmailChanged = supplier.email !== selectedSupplier.email;
      const hasPhoneChanged = supplier.phone !== selectedSupplier.phone;
      const hasAddressChanged = supplier.address !== selectedSupplier.address;
      const hasCityChanged = supplier.city !== selectedSupplier.city;
      const hasStateChanged = supplier.state !== selectedSupplier.state;
      const hasZipCodeChanged = supplier.zipCode !== selectedSupplier.zipCode;
      const hasCountryChanged = supplier.country !== selectedSupplier.country;
      const hasTaxIdChanged = supplier.taxId !== selectedSupplier.taxId;
      const hasWebsiteChanged = supplier.website !== selectedSupplier.website;

      setHasChanges(
        hasNameChanged ||
          hasContactNameChanged ||
          hasEmailChanged ||
          hasPhoneChanged ||
          hasAddressChanged ||
          hasCityChanged ||
          hasStateChanged ||
          hasZipCodeChanged ||
          hasCountryChanged ||
          hasTaxIdChanged ||
          hasWebsiteChanged
      );
    }
  }, [supplier, selectedSupplier]);

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
    if (!validateRequiredFields(supplier, ["name", "email", "phone"])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    if (!validateEmail(supplier.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      const originalSupplier = selectedSupplier;

      const updatedFields = originalSupplier
        ? getUpdatedFields(supplier, originalSupplier)
        : {};

      const finalUpdateFields = {
        name: updatedFields.name ?? supplier.name,
        contactName: updatedFields.contactName ?? supplier.contactName,
        email: updatedFields.email ?? supplier.email,
        phone: updatedFields.phone ?? supplier.phone,
        address: updatedFields.address ?? supplier.address,
        city: updatedFields.city ?? supplier.city,
        state: updatedFields.state ?? supplier.state,
        zipCode: updatedFields.zipCode ?? supplier.zipCode,
        country: updatedFields.country ?? supplier.country,
        taxId: updatedFields.taxId ?? supplier.taxId,
        website: updatedFields.website ?? supplier.website,
      };

      await storeSuppliers
        .getState()
        .updateSupplier(selectedSupplier?.id ?? 0, finalUpdateFields);

      showSnackbar("success", "Proveedor actualizado correctamente.");
      setHasChanges(false);
    } catch (error) {
      console.log(error);
      showSnackbar("error", "Error al actualizar el proveedor.");
    }
  };

  const getUpdatedFields = (
    supplier: Supplier,
    originalSupplier: Supplier
  ): Partial<Supplier> => {
    const updatedFields: Partial<Supplier> = {};

    if (supplier.name !== originalSupplier.name)
      updatedFields.name = supplier.name;
    if (supplier.contactName !== originalSupplier.contactName)
      updatedFields.contactName = supplier.contactName;
    if (supplier.email !== originalSupplier.email)
      updatedFields.email = supplier.email;
    if (supplier.phone !== originalSupplier.phone)
      updatedFields.phone = supplier.phone;
    if (supplier.address !== originalSupplier.address)
      updatedFields.address = supplier.address;
    if (supplier.city !== originalSupplier.city)
      updatedFields.city = supplier.city;
    if (supplier.state !== originalSupplier.state)
      updatedFields.state = supplier.state;
    if (supplier.zipCode !== originalSupplier.zipCode)
      updatedFields.zipCode = supplier.zipCode;
    if (supplier.country !== originalSupplier.country)
      updatedFields.country = supplier.country;
    if (supplier.taxId !== originalSupplier.taxId)
      updatedFields.taxId = supplier.taxId;
    if (supplier.website !== originalSupplier.website)
      updatedFields.website = supplier.website;

    return updatedFields;
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier(selectedSupplier?.id ?? 0);
      navigate(`/proveedores/historial`);
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
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
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary.main"
            gutterBottom
          >
            Editar Proveedor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Modifica y gestiona la información del proveedor
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
                        helperText={
                          !supplier.name ? "Este campo es obligatorio" : ""
                        }
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
                        label="Correo Electrónico *"
                        name="email"
                        type="email"
                        value={supplier.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={
                          supplier.email !== "" &&
                          !validateEmail(supplier.email)
                        }
                        helperText={
                          supplier.email !== "" &&
                          !validateEmail(supplier.email)
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
                        required
                        error={!supplier.phone}
                        helperText={
                          !supplier.phone ? "Este campo es obligatorio" : ""
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

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tax ID / RFC"
                        name="taxId"
                        value={supplier.taxId}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Identificación fiscal"
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
                        placeholder="https://ejemplo.com"
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
                    <BusinessIcon sx={{ mr: 1 }} />
                    Resumen del Proveedor
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
                        Empresa:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.name || "No definido"}
                      </Typography>
                    </Box>
                    {supplier.contactName && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Contacto:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {supplier.contactName}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.email || "No definido"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Teléfono:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {supplier.phone || "No definido"}
                      </Typography>
                    </Box>
                    {(supplier.city || supplier.state) && (
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
                          {[supplier.city, supplier.state]
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    )}
                    {supplier.taxId && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
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
                        supplier.name &&
                        supplier.email &&
                        supplier.phone &&
                        validateEmail(supplier.email)
                          ? "success.50"
                          : "warning.50",
                      borderColor:
                        supplier.name &&
                        supplier.email &&
                        supplier.phone &&
                        validateEmail(supplier.email)
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
                        label="Empresa"
                        size="small"
                        color={supplier.name ? "success" : "default"}
                        variant={supplier.name ? "filled" : "outlined"}
                      />
                      <Chip
                        label="Email"
                        size="small"
                        color={
                          supplier.email && validateEmail(supplier.email)
                            ? "success"
                            : "default"
                        }
                        variant={
                          supplier.email && validateEmail(supplier.email)
                            ? "filled"
                            : "outlined"
                        }
                      />
                      <Chip
                        label="Teléfono"
                        size="small"
                        color={supplier.phone ? "success" : "default"}
                        variant={supplier.phone ? "filled" : "outlined"}
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
                        proveedor.
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
                        !supplier.name ||
                        !supplier.email ||
                        !supplier.phone ||
                        !validateEmail(supplier.email) ||
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
                      Eliminar Proveedor
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

        {/* Modal de Confirmación de Eliminación */}
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer y puede afectar a los productos asociados."
        />
      </Container>
    </Box>
  );
};

export default EditSupplierPage;
