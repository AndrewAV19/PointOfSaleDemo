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
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import type { Categories } from "../../interfaces/categories.interface";
import { storeCategories } from "../../../stores/categories.store";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const EditCategoryPage: React.FC = () => {
  const initialCategoryState: Categories = {
    name: "",
    description: "",
  };

  const convertToCategoryRequest = (
    selectedCategory: Categories
  ): Categories => {
    return {
      name: selectedCategory.name,
      description: selectedCategory.description,
    };
  };

  const navigate = useNavigate();
  const { selectedCategory } = dataStore();
  const { deleteCategory } = storeCategories();

  const {
    form: category,
    handleChange,
    resetForm,
  } = useForm(
    selectedCategory
      ? convertToCategoryRequest(selectedCategory)
      : initialCategoryState
  );

  const { validateRequiredFields } = useValidation();

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
    if (selectedCategory) {
      resetForm();
    }
  }, [selectedCategory]);

  // Verificar cambios en los campos
  useEffect(() => {
    if (selectedCategory) {
      const hasNameChanged = category.name !== selectedCategory.name;
      const hasDescriptionChanged =
        category.description !== selectedCategory.description;
      setHasChanges(hasNameChanged || hasDescriptionChanged);
    }
  }, [category, selectedCategory]);

  const handleSaveChanges = async () => {
    if (!validateRequiredFields(category, ["name"])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    try {
      const originalCategory = selectedCategory;

      const updatedFields = originalCategory
        ? getUpdatedFields(category, originalCategory)
        : {};

      const finalUpdateFields = {
        name: updatedFields.name ?? category.name,
        description: updatedFields.description ?? category.description,
      };

      await storeCategories
        .getState()
        .updateCategory(selectedCategory?.id ?? 0, finalUpdateFields);

      showSnackbar("success", "Categoría actualizada correctamente.");
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      showSnackbar("error", "Error al actualizar la categoría.");
    }
  };

  const getUpdatedFields = (
    category: Categories,
    originalCategory: Categories
  ): Partial<Categories> => {
    const updatedFields: Partial<Categories> = {};

    if (category.name !== originalCategory.name)
      updatedFields.name = category.name;
    if (category.description !== originalCategory.description)
      updatedFields.description = category.description;

    return updatedFields;
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(selectedCategory?.id ?? 0);
      navigate(`/categorias/historial`);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
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
              Editar Categoría
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Modifica y gestiona la información de la categoría
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Header de la Card */}
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
                    variant="h5"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "600",
                    }}
                  >
                    <CategoryIcon sx={{ mr: 2 }} />
                    Información de la Categoría
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

                {/* Formulario */}
                <Box sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    {/* Campo Nombre */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="text.primary"
                        sx={{ mb: 1, display: "flex", alignItems: "center" }}
                      >
                        <CategoryIcon
                          sx={{
                            mr: 1,
                            fontSize: 20,
                            color: "primary.main",
                          }}
                        />
                        Nombre de la Categoría *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Ingresa el nombre de la categoría"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={!category.name}
                        helperText={
                          !category.name ? "Este campo es obligatorio" : ""
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>

                    {/* Campo Descripción */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="text.primary"
                        sx={{ mb: 1, display: "flex", alignItems: "center" }}
                      >
                        <DescriptionIcon
                          sx={{
                            mr: 1,
                            fontSize: 20,
                            color: "primary.main",
                          }}
                        />
                        Descripción
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Describe la categoría (opcional)"
                        name="description"
                        value={category.description}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Resumen de Cambios */}
                    {hasChanges && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "warning.50",
                          borderColor: "warning.100",
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
                        <Stack spacing={1}>
                          {category.name !== selectedCategory?.name && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Nombre:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "error.main",
                                  }}
                                >
                                  {selectedCategory?.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="500"
                                  color="success.main"
                                >
                                  {category.name}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          {category.description !==
                            selectedCategory?.description && (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Descripción:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                {selectedCategory?.description && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: "error.main",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    "{selectedCategory.description}"
                                  </Typography>
                                )}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontStyle: "italic",
                                    color: "success.main",
                                  }}
                                >
                                  "{category.description}"
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    )}

                    {/* Vista Previa */}
                    {(category.name || category.description) && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "primary.50",
                          borderColor: "primary.100",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                          color="primary.main"
                          gutterBottom
                        >
                          Vista Previa:
                        </Typography>
                        <Stack spacing={1}>
                          {category.name && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Nombre:
                              </Typography>
                              <Typography variant="body2" fontWeight="500">
                                {category.name}
                              </Typography>
                            </Box>
                          )}
                          {category.description && (
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
                                sx={{ fontStyle: "italic" }}
                              >
                                "{category.description}"
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    )}

                    {/* Botones de Acción */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveChanges}
                        disabled={!category.name || !hasChanges}
                        fullWidth
                        size="large"
                        sx={{
                          fontWeight: "600",
                          py: 1.5,
                          fontSize: "1rem",
                          borderRadius: 2,
                          textTransform: "none",
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
                          borderRadius: 2,
                          textTransform: "none",
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
                    </Stack>

                    {/* Botón de Eliminar */}
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
                      Eliminar Categoría
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Paper
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                backgroundColor: "info.50",
                border: "1px solid",
                borderColor: "info.100",
              }}
            >
              <Typography
                variant="h6"
                color="info.main"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <InfoIcon sx={{ mr: 1 }} />
                Información importante
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  • Los cambios se reflejarán en todos los productos asociados a
                  esta categoría.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Asegúrate de que el nombre sea claro y descriptivo para
                  facilitar la búsqueda.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • La eliminación de categorías puede afectar la organización
                  de tus productos.
                </Typography>
              </Stack>
            </Paper>
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
              success: <CategoryIcon fontSize="inherit" />,
              error: <CategoryIcon fontSize="inherit" />,
              warning: <CategoryIcon fontSize="inherit" />,
              info: <CategoryIcon fontSize="inherit" />,
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
          message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer y puede afectar a los productos asociados."
        />
      </Container>
    </Box>
  );
};

export default EditCategoryPage;
