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
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import type { Categories } from "../../interfaces/categories.interface";
//import { storeCategories } from "../../../stores/categories.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const AddCategory: React.FC = () => {
  const initialCategoryState: Categories = {
    name: "",
    description: "",
  };

  const { form: category, handleChange, resetForm } = useForm(initialCategoryState);
  const requiredFields = ["name"];
  const { validateRequiredFields } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleConfirm = async () => {
    if (!validateRequiredFields(category, requiredFields)) {
      showSnackbar("error", "Por favor, completa los campos obligatorios.");
      return;
    }

    try {
      // await storeCategories.getState().createCategory({
      //   name: category.name,
      //   description: category.description,
      // });

      showSnackbar("success", "Categoría agregada correctamente.");
      resetForm(); 
    } catch (error) {
      showSnackbar("error", "Error al crear la categoría.");
      console.error(error);
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
            Nueva Categoría
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crea y gestiona categorías para organizar tus productos
          </Typography>
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
                            color: "primary.main" 
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
                        helperText={!category.name ? "Este campo es obligatorio" : ""}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          }
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
                            color: "primary.main" 
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
                          }
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Resumen de Información */}
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
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" color="text.secondary">
                                Nombre:
                              </Typography>
                              <Typography variant="body2" fontWeight="500">
                                {category.name}
                              </Typography>
                            </Box>
                          )}
                          {category.description && (
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Descripción:
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
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
                        color="success"
                        startIcon={<SaveIcon />}
                        onClick={handleConfirm}
                        disabled={!category.name}
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
                        Crear Categoría
                      </Button>
                      
                      <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ClearIcon />}
                        onClick={resetForm}
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
                        Limpiar Campos
                      </Button>
                    </Stack>
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
                💡 Información útil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Las categorías te ayudan a organizar tus productos de manera eficiente. 
                Usa nombres descriptivos y claros para facilitar la búsqueda y filtrado.
              </Typography>
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
      </Container>
    </Box>
  );
};

export default AddCategory;