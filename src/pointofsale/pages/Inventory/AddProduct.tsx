import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Avatar,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { ModalSearchCategories } from "../../modales/ModalSearchCategories";
import type { Supplier } from "../../interfaces/supplier.interface";
import { ModalSearchSuppliers } from "../../modales/ModalSearchSuppliers";
//import { storeProducts } from "../../../stores/products.store";

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    barCode: "",
    name: "",
    description: "",
    price: 0,
    costPrice: 0,
    stock: 0,
    categoryId: 0,
    discount: false,
    discountPercentage: 0,
    photo: null as File | null,
    suppliers: [] as Supplier[],
  });
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // Función mejorada para manejar cambios en campos numéricos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "costPrice" || name === "stock" || name === "discountPercentage") {
      // Permitir campo vacío temporalmente y números válidos
      if (value === "" || value === null) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name as string]: 0,
        }));
        return;
      }

      const numericValue = parseFloat(value as string);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name as string]: numericValue,
        }));
      }
      return;
    }

    // Para campos de texto normales
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name as string]: value,
    }));
  };

  // Función específica para campos de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name as string]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setProduct((prevProduct) => ({
        ...prevProduct,
        photo: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectSupplier = (selectedSupplier: Supplier) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      suppliers: [...prevProduct.suppliers, selectedSupplier],
    }));
    setOpenSupplierModal(false);
  };

  const handleReset = () => {
    setProduct({
      barCode: "",
      name: "",
      description: "",
      price: 0,
      costPrice: 0,
      stock: 0,
      categoryId: 0,
      discount: false,
      discountPercentage: 0,
      photo: null,
      suppliers: [],
    });
    setCategory("");
    setPreview(null);
  };

  const handleOpenSnackbar = (message: string) => {
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleConfirmSale = async () => {
    if (
      !product.name ||
      product.price === undefined ||
      product.stock === undefined
    ) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Todos los campos obligatorios deben ser llenados.");
      return;
    }

    if (product.price <= 0) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("El precio debe ser mayor a 0.");
      return;
    }

    if (product.stock < 0) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("El stock no puede ser negativo.");
      return;
    }

    try {
      // const validSuppliers = product.suppliers
      //   .filter((supplier) => supplier.id !== undefined)
      //   .map((supplier) => ({ id: supplier.id as number }));

      // const categoryIdAsNumber = !isNaN(Number(category))
      //   ? Number(category)
      //   : 0;

      // const imageBase64 = product.photo
      //   ? await convertImageToBase64(product.photo)
      //   : "";

      // await storeProducts.getState().createProduct({
      //   barCode: product.barCode,
      //   name: product.name,
      //   description: product.description,
      //   price: product.price,
      //   stock: product.stock,
      //   category: { id: categoryIdAsNumber },
      //   suppliers: validSuppliers,
      //   costPrice: product.costPrice,
      //   discount: product.discount ? product.discountPercentage : undefined,
      //   taxRate: 0,
      //   image: imageBase64,
      // });

      setSnackbarSeverity("success");
      handleOpenSnackbar("Producto agregado correctamente.");
      handleReset();
    } catch (error) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al crear el producto.");
      console.error(error);
    }
  };

  // const convertImageToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => {
  //       reject(new Error("Error al leer el archivo: " + error.type));
  //     };
  //   });
  // };

  const handleRemoveSupplier = (supplierId: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      suppliers: prevProduct.suppliers.filter(
        (supplier) => supplier.id !== supplierId
      ),
    }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "grey.50",
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Mejorado */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary.main"
            gutterBottom
          >
            Nuevo Producto
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Agrega y gestiona productos en tu inventario
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Panel Principal */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Información Básica */}
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
                    <InventoryIcon sx={{ mr: 1, color: "primary.main" }} />
                    Información Básica
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Foto del Producto */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <label htmlFor="photo-upload">
                          <Avatar
                            src={preview ?? undefined}
                            sx={{ 
                              width: 150, 
                              height: 150, 
                              cursor: "pointer",
                              border: "3px solid",
                              borderColor: "primary.light",
                              "&:hover": {
                                borderColor: "primary.main",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <AddPhotoIcon fontSize="large" color="action" />
                          </Avatar>
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Código de Barras"
                        name="barCode"
                        value={product.barCode}
                        onChange={handleTextChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <ShoppingCartIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombre del Producto *"
                        name="name"
                        value={product.name}
                        onChange={handleTextChange}
                        variant="outlined"
                        required
                        error={!product.name}
                        helperText={!product.name ? "Este campo es requerido" : ""}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción"
                        name="description"
                        value={product.description}
                        onChange={handleTextChange}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Precios y Stock */}
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
                    <AttachMoneyIcon sx={{ mr: 1, color: "primary.main" }} />
                    Precios y Stock
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Precio de Venta *"
                        name="price"
                        type="number"
                        value={product.price === 0 ? "" : product.price}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={product.price <= 0}
                        helperText={product.price <= 0 ? "El precio debe ser mayor a 0" : ""}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            inputProps: { 
                              min: 0,
                              step: 0.01
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Precio de Compra"
                        name="costPrice"
                        type="number"
                        value={product.costPrice === 0 ? "" : product.costPrice}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            inputProps: { 
                              min: 0,
                              step: 0.01
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Stock *"
                        name="stock"
                        type="number"
                        value={product.stock === 0 ? "" : product.stock}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        error={product.stock < 0}
                        helperText={product.stock < 0 ? "El stock no puede ser negativo" : ""}
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
                  </Grid>
                </CardContent>
              </Card>

              {/* Categoría y Descuento */}
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
                    <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                    Categoría y Promociones
                  </Typography>
                  
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Categoría"
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CategoryIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton 
                                  onClick={() => setOpenModal(true)}
                                  size="small"
                                  color="primary"
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      <ModalSearchCategories
                        open={openModal}
                        handleClose={() => setOpenModal(false)}
                        handleSelect={(selectedCategory) =>
                          setCategory(selectedCategory.id)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="discount"
                              checked={product.discount}
                              onChange={(e) =>
                                setProduct((prevProduct) => ({
                                  ...prevProduct,
                                  discount: e.target.checked,
                                  discountPercentage: e.target.checked ? product.discountPercentage : 0
                                }))
                              }
                              color="primary"
                            />
                          }
                          label="Aplicar Descuento"
                        />
                        {product.discount && (
                          <TextField
                            label="% Descuento"
                            name="discountPercentage"
                            type="number"
                            value={product.discountPercentage === 0 ? "" : product.discountPercentage}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            sx={{ width: 120 }}
                            slotProps={{
                              input: {
                                inputProps: { 
                                  min: 0,
                                  max: 100,
                                  step: 1
                                },
                                endAdornment: (
                                  <InputAdornment position="end">%</InputAdornment>
                                ),
                              },
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Proveedores */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                      Proveedores
                    </Typography>
                    <Chip
                      label={`${product.suppliers.length} proveedores`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <TextField
                    label="Buscar Proveedores"
                    fullWidth
                    value={product.suppliers
                      .map((supplier) => supplier.name)
                      .join(", ")}
                    placeholder="Selecciona los proveedores del producto"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setOpenSupplierModal(true)}
                              size="small"
                              color="primary"
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ mb: 3 }}
                  />

                  <ModalSearchSuppliers
                    open={openSupplierModal}
                    handleClose={() => setOpenSupplierModal(false)}
                    handleSelect={handleSelectSupplier}
                  />

                  {product.suppliers.length > 0 && (
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "600" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "600" }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: "600" }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: "600" }}>Teléfono</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "600" }}>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {product.suppliers.map((supplier) => (
                            <TableRow
                              key={supplier.id}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell>
                                <Chip
                                  label={supplier.id}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="500">
                                  {supplier.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {supplier.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {supplier.phone}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveSupplier(supplier.id ?? 0)}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Panel de Acciones */}
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
                    <SaveIcon sx={{ mr: 1 }} />
                    Acciones del Producto
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
                        {product.name || "No definido"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Precio:
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        ${product.price > 0 ? product.price.toFixed(2) : "0.00"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        Stock:
                      </Typography>
                      <Chip
                        label={product.stock || "0"}
                        size="small"
                        color={product.stock > 0 ? "success" : "default"}
                        variant="outlined"
                      />
                    </Box>
                    {product.discount && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Descuento:
                        </Typography>
                        <Chip
                          label={`${product.discountPercentage}%`}
                          size="small"
                          color="success"
                        />
                      </Box>
                    )}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Botones de Acción */}
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SaveIcon />}
                      fullWidth
                      onClick={handleConfirmSale}
                      disabled={!product.name || product.price <= 0 || product.stock < 0}
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Crear Producto
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
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              fontSize: "0.9rem",
              borderRadius: 2,
            }}
          >
            {messageSnackbar}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AddProduct;