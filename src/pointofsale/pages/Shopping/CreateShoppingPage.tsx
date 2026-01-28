import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Grid,
  Card,
  Chip,
  Badge,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardContent,
  Stack,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Payment as PaymentIcon,
  QrCode as QrCodeIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import { ModalSearchSuppliers } from "../../modales/ModalSearchSuppliers";
import type { Product } from "../../interfaces/product.interface";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";
// import type { ShoppingRequest } from "../../interfaces/shopping.interface";
// import { storeShoppings } from "../../../stores/shopping.store";
import { mockProducts } from "../../mocks/tiendaAbarrotes.mock";
//import { storeProducts } from "../../../stores/products.store";

const CreateShoppingPage: React.FC = () => {
  const [supplier, setSupplier] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(0);
  const [change, setChange] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [cartDrawer, setCartDrawer] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // const { getProducts, listProducts } = storeProducts();

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("es-ES", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    setCurrentTime(formatTime(new Date()));

    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect(() => {
  //   getProducts();
  // }, [getProducts]);

  //const userId = parseInt(localStorage.getItem("id_usuario") ?? "0", 10);

  const calculateTotal = () => {
    return productsList.reduce((acc, product) => acc + (product.total ?? 0), 0);
  };

  const calculateItemsCount = () => {
    return productsList.reduce(
      (acc, product) => acc + (product.quantity ?? 0),
      0,
    );
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity > 0 ? newQuantity : 1);
  };

  const handleAmountGivenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amount = parseFloat(e.target.value);
    if (isNaN(amount)) {
      amount = 0;
    }
    setAmountGiven(amount);
    setChange(amount - calculateTotal());
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredBarcode = e.target.value.trim();

    if (enteredBarcode) {
      const selectedProduct = mockProducts.find(
        (p) => p.barCode?.toString() === enteredBarcode,
      );

      if (selectedProduct) {
        setProduct(selectedProduct);
        setSnackbarSeverity("success");
        handleOpenSnackbar("Producto encontrado");
      } else {
        setProduct(null);
        setSnackbarSeverity("error");
        handleOpenSnackbar("Producto no encontrado");
      }
    } else {
      setProduct(null);
    }
  };

  const handleBarcodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && product) {
      handleAddProduct();
    }
  };

  const handleAddProduct = () => {
    if (product) {
      const existingProduct = productsList.find((p) => p.id === product.id);

      if (existingProduct) {
        setProductsList((prevList) =>
          prevList.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: (p.quantity ?? 0) + quantity,
                  total: ((p.quantity ?? 0) + quantity) * p.costPrice,
                }
              : p,
          ),
        );
      } else {
        const newProduct: Product = {
          ...product,
          quantity,
          costPrice: product.costPrice,
          total: product.costPrice * quantity,
          image: product.image,
          barCode: product.barCode,
        };
        setProductsList((prevList) => [...prevList, newProduct]);
      }

      setSnackbarSeverity("success");
      handleOpenSnackbar("Producto agregado a la compra");
      setProduct(null);
      setQuantity(1);
      setTimeout(() => {
        const barcodeInput = document.querySelector(
          'input[placeholder*="código de barras"]',
        ) as HTMLInputElement;
        if (barcodeInput) {
          barcodeInput.value = "";
          barcodeInput.focus();
        }
      }, 100);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProductsList((prevList) =>
      prevList.filter((p) => (p.id ?? 0) !== (productId ?? 0)),
    );
  };

  const handleReset = () => {
    setSupplier("");
    setProduct(null);
    setQuantity(1);
    setAmountGiven(0);
    setChange(0);
    setProductsList([]);
  };

  const handleOpenSnackbar = (message: string) => {
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleIncreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: (product.quantity ?? 0) + 1,
              total: ((product.quantity ?? 0) + 1) * product.costPrice,
            }
          : product,
      ),
    );
  };

  const handleDecreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId && (product.quantity ?? 0) > 1
          ? {
              ...product,
              quantity: (product.quantity ?? 0) - 1,
              total: ((product.quantity ?? 0) - 1) * product.costPrice,
            }
          : product,
      ),
    );
  };

  // const handleConfirmPurchase = async () => {
  //   if (productsList.length === 0) {
  //     setSnackbarSeverity("warning");
  //     handleOpenSnackbar("No hay productos agregados.");
  //     return;
  //   }

  //   try {
  //     // Filtrar productos que tengan id y quantity válidos
  //     const validProducts = productsList.filter(
  //       (product) =>
  //         product.id !== undefined &&
  //         product.quantity !== undefined &&
  //         product.quantity > 0
  //     );

  //     if (validProducts.length === 0) {
  //       setSnackbarSeverity("warning");
  //       handleOpenSnackbar("No hay productos válidos para la compra.");
  //       return;
  //     }

  //     const shoppingData: ShoppingRequest = {
  //       supplier: supplier ? { id: parseInt(supplier, 10) } : undefined,
  //       shoppingProducts: validProducts.map((product) => ({
  //         product: { id: product.id! },
  //         quantity: product.quantity!,
  //       })),
  //       amount: amountGiven,
  //       total: calculateTotal(),
  //       user: { id: userId },
  //     };

  //     await storeShoppings.getState().createShopping(shoppingData);

  //     setSnackbarSeverity("success");
  //     handleOpenSnackbar("Compra creada exitosamente");
  //     handleReset();
  //   } catch (error) {
  //     console.error(error);
  //     setSnackbarSeverity("error");
  //     handleOpenSnackbar("Error al crear la compra");
  //   }
  // };

  const handleConfirmPurchase = async () => {
    if (productsList.length === 0) {
      setSnackbarSeverity("warning");
      handleOpenSnackbar("No hay productos agregados.");
      return;
    }

    // 👉 Simulación (NO guarda en BD)
    setSnackbarSeverity("success");
    handleOpenSnackbar("Compra creada exitosamente (simulada)");

    setTimeout(() => {
      handleReset();
    }, 800);
  };

  useEffect(() => {
    setChange(amountGiven - calculateTotal());
  }, [productsList, amountGiven]);

  return (
    <Box
      sx={{
        backgroundColor: "grey.50",
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Mejorado CON HORA */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="600"
                color="primary.main"
                gutterBottom
              >
                Nueva Compra
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona y procesa compras de manera eficiente
              </Typography>
            </Box>
            <Paper
              sx={{
                p: 2,
                minWidth: 140,
                textAlign: "center",
                backgroundColor: "primary.50",
                border: "1px solid",
                borderColor: "primary.100",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Hora Actual
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight="600">
                {currentTime}
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Panel Principal - Mejorado */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Tarjeta de Búsqueda */}
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
                    <SearchIcon sx={{ mr: 1, color: "primary.main" }} />
                    Búsqueda Rápida
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Proveedor"
                        fullWidth
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="Buscar proveedor"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalShippingIcon color="action" />
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
                      <ModalSearchSuppliers
                        open={openModal}
                        handleClose={() => setOpenModal(false)}
                        handleSelect={(selectedSupplier) =>
                          setSupplier(selectedSupplier.id)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Código de Barras"
                        fullWidth
                        onChange={handleBarcodeChange}
                        onKeyPress={handleBarcodeKeyPress}
                        placeholder="Escanear código de barras"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <QrCodeIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setOpenModalProducts(true)}
                                  size="small"
                                  color="primary"
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                        autoFocus
                      />
                      <ModalSearchProducts
                        open={openModalProducts}
                        handleClose={() => setOpenModalProducts(false)}
                        handleSelect={(selectedProduct) =>
                          setProduct(selectedProduct)
                        }
                        showPrice={false}
                        disabled={false}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Resto del código permanece igual... */}
              {/* Producto Seleccionado */}
              {product && (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: "2px solid",
                    borderColor: "primary.light",
                    backgroundColor: "primary.50",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container alignItems="center" spacing={3}>
                      <Grid item>
                        <Avatar
                          src={product.image}
                          sx={{ width: 80, height: 80, borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6" fontWeight="600">
                          {product.name}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ mt: 1 }}
                        >
                          <Typography variant="body1" fontWeight="500">
                            ${product.costPrice?.toFixed(2) || "0.00"}
                          </Typography>
                          <Chip label="COSTO" color="secondary" size="small" />
                        </Stack>
                        {product.barCode && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: "block" }}
                          >
                            Código: {product.barCode}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Cantidad"
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{
                            inputProps: {
                              min: 1,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={handleAddProduct}
                          size="large"
                          sx={{ minWidth: 120 }}
                        >
                          Agregar
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Lista de Productos */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <InventoryIcon sx={{ mr: 1, color: "primary.main" }} />
                      Productos en Compra
                    </Typography>
                    <Chip
                      label={`${productsList.length} productos`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {productsList.length > 0 ? (
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: "600" }}>
                              Producto
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "600" }}
                            >
                              Cantidad
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: "600" }}>
                              Costo Unit.
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: "600" }}>
                              Total
                            </TableCell>
                            <TableCell width={80}></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productsList.map((product) => (
                            <TableRow
                              key={product.id}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    src={product.image}
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      mr: 2,
                                      borderRadius: 1,
                                    }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="500"
                                    >
                                      {product.name}
                                    </Typography>
                                    <Chip
                                      label="COMPRA"
                                      size="small"
                                      color="secondary"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        mt: 0.5,
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDecreaseQuantity(product.id ?? 0)
                                    }
                                    color="primary"
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mx: 1,
                                      minWidth: 30,
                                      fontWeight: "500",
                                      backgroundColor: "primary.50",
                                      borderRadius: 1,
                                      py: 0.5,
                                      px: 1,
                                    }}
                                  >
                                    {product.quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleIncreaseQuantity(product.id ?? 0)
                                    }
                                    color="primary"
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  fontWeight="500"
                                  color="secondary.main"
                                >
                                  ${product.costPrice.toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  fontWeight="600"
                                  color="primary.main"
                                >
                                  ${(product.total ?? 0).toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleDeleteProduct(product.id ?? 0)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Paper
                      sx={{
                        p: 6,
                        textAlign: "center",
                        backgroundColor: "grey.50",
                        borderRadius: 3,
                      }}
                    >
                      <InventoryIcon
                        sx={{ fontSize: 64, color: "grey.400", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        Lista de compra vacía
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Busca y agrega productos para comenzar la compra
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Panel de Resumen - Mejorado */}
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
                    backgroundColor: "secondary.main",
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
                    <ReceiptIcon sx={{ mr: 1 }} />
                    Resumen de Compra
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Información de Pago */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <TextField
                      label="Monto Pagado"
                      type="text"
                      fullWidth
                      size="small"
                      value={amountGiven}
                      onChange={handleAmountGivenChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Cambio
                      </Typography>
                      <Chip
                        label={`$${Math.abs(change).toFixed(2)}`}
                        color={change < 0 ? "warning" : "success"}
                        variant={change < 0 ? "outlined" : "filled"}
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          height: "32px",
                          minWidth: "100px",
                          backgroundColor:
                            change < 0 ? "transparent" : "success.light",
                          color:
                            change < 0
                              ? "warning.dark"
                              : "success.contrastText",
                          borderColor:
                            change < 0 ? "warning.main" : "transparent",
                        }}
                        icon={
                          change < 0 ? (
                            <RemoveIcon fontSize="small" />
                          ) : (
                            <AddIcon fontSize="small" />
                          )
                        }
                      />
                      {change < 0 && (
                        <Typography
                          variant="caption"
                          color="warning.main"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          Faltan ${Math.abs(change).toFixed(2)} para completar
                          el pago
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Totales */}
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Subtotal:
                      </Typography>
                      <Typography variant="body2">
                        ${calculateTotal().toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        Total Compra:
                      </Typography>
                      <Typography
                        variant="h6"
                        color="secondary"
                        fontWeight="700"
                      >
                        ${calculateTotal().toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Acciones */}
                  <Stack spacing={1.5}>
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
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PaymentIcon />}
                      fullWidth
                      onClick={handleConfirmPurchase}
                      disabled={
                        productsList.length === 0 ||
                        amountGiven < calculateTotal()
                      }
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Confirmar Compra
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAB para carrito - Mejorado */}
        <Fab
          color="secondary"
          aria-label="cart"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
          }}
          onClick={() => setCartDrawer(true)}
        >
          <Badge
            badgeContent={calculateItemsCount()}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                height: 20,
                minWidth: 20,
              },
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </Fab>

        {/* Drawer del Carrito - Mejorado */}
        <Drawer
          anchor="right"
          open={cartDrawer}
          onClose={() => setCartDrawer(false)}
          PaperProps={{
            sx: { width: 360, borderRadius: "12px 0 0 12px" },
          }}
        >
          <Box
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <InventoryIcon sx={{ mr: 1 }} />
              Resumen Rápido
            </Typography>

            <List sx={{ flex: 1, overflow: "auto" }}>
              {productsList.map((product) => (
                <ListItem key={product.id} divider sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar
                      src={product.image}
                      sx={{ width: 48, height: 48, borderRadius: 1 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="500">
                        {product.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {product.quantity} x ${product.costPrice.toFixed(2)}
                        </Typography>
                        <Chip
                          label="COMPRA"
                          size="small"
                          color="secondary"
                          sx={{ height: 18, fontSize: "0.6rem", mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="secondary.main"
                  >
                    ${(product.total ?? 0).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            {productsList.length > 0 && (
              <Box
                sx={{
                  mt: "auto",
                  p: 2,
                  backgroundColor: "secondary.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "secondary.100",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="secondary.main"
                  >
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {calculateItemsCount()} productos
                </Typography>
              </Box>
            )}
          </Box>
        </Drawer>

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

export default CreateShoppingPage;
