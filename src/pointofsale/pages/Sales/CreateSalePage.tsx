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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Payment as PaymentIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";
import { ModalSearchClients } from "../../modales/ModalSearchClients";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";
import type { CartProduct, Product } from "../../interfaces/product.interface";
//import type { SaleRequest } from "../../interfaces/sales.interface";
//import { storeSales } from "../../../stores/sales.store";
//import { storeProducts } from "../../../stores/products.store";
import { mockProducts } from "../../mocks/tiendaAbarrotes.mock";

const CreateSalePage: React.FC = () => {
  const [client, setClient] = useState("");
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
  const [saleStatus, setSaleStatus] = useState<"pendiente" | "pagada">(
    "pagada"
  );
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<CartProduct[]>([]);
  const [cartDrawer, setCartDrawer] = useState(false);
  //const { getProducts, listProducts } = storeProducts();
  const [currentTime, setCurrentTime] = useState<string>("");

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

  const userId = parseInt(localStorage.getItem("id_usuario") ?? "0", 10);

  const calculateTotal = () => {
    return productsList.reduce((acc, product) => acc + product.total, 0);
  };

  const calculateItemsCount = () => {
    return productsList.reduce((acc, product) => acc + product.quantity, 0);
  };

  const calculateTotalDiscount = () => {
    return productsList.reduce((acc, product) => {
      const originalTotal = product.quantity * product.price;
      return acc + (originalTotal - product.total);
    }, 0);
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
        (p) => p.barCode?.toString() === enteredBarcode
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
      if (product.stock === undefined || product.stock <= 0) {
        setSnackbarSeverity("error");
        handleOpenSnackbar("Producto sin stock disponible");
        return;
      }

      const existingProduct = productsList.find((p) => p.id === product.id);
      const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

      const newQuantity = existingProduct
        ? existingProduct.quantity + quantity
        : quantity;

      if (newQuantity > (product.stock || 0)) {
        setSnackbarSeverity("warning");
        handleOpenSnackbar(
          `Stock insuficiente. Solo quedan ${product.stock} unidades`
        );
        return;
      }

      if (existingProduct) {
        setProductsList((prevList) =>
          prevList.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + quantity,
                  total: (p.quantity + quantity) * discountedPrice,
                }
              : p
          )
        );
      } else {
        const newProduct: CartProduct = {
          ...product,
          quantity,
          discountedPrice,
          total: discountedPrice * quantity,
        };
        setProductsList((prevList) => [...prevList, newProduct]);
      }

      setSnackbarSeverity("success");
      handleOpenSnackbar("Producto agregado al carrito");
      setProduct(null);
      setQuantity(1);
      setTimeout(() => {
        const barcodeInput = document.querySelector(
          'input[placeholder*="código de barras"]'
        ) as HTMLInputElement;
        if (barcodeInput) {
          barcodeInput.value = "";
          barcodeInput.focus();
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setClient("");
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

  const handleDeleteProduct = (productId: number) => {
    setProductsList((prevList) => prevList.filter((p) => p.id !== productId));
  };

  const handleIncreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: product.quantity + 1,
              total: (product.quantity + 1) * product.discountedPrice,
            }
          : product
      )
    );
  };

  const handleDecreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId && product.quantity > 1
          ? {
              ...product,
              quantity: product.quantity - 1,
              total: (product.quantity - 1) * product.discountedPrice,
            }
          : product
      )
    );
  };

  // const handleConfirmSale = async () => {
  //   if (productsList.length === 0) {
  //     setSnackbarSeverity("warning");
  //     handleOpenSnackbar("No hay productos agregados.");
  //     return;
  //   }
  //   if (saleStatus === "pendiente" && !client) {
  //     setSnackbarSeverity("warning");
  //     handleOpenSnackbar(
  //       "Debes seleccionar un cliente para ventas pendientes."
  //     );
  //     return;
  //   }

  //   try {
  //     const saleData: SaleRequest = {
  //       client: client ? { id: parseInt(client, 10) } : undefined,
  //       saleProducts: productsList.map((product) => ({
  //         product: { id: product.id! },
  //         quantity: product.quantity,
  //       })),
  //       amount: amountGiven,
  //       state: saleStatus,
  //       total: calculateTotal(),
  //       user: { id: userId },
  //     };
  //     await storeSales.getState().createSale(saleData);
  //     setSnackbarSeverity("success");
  //     handleOpenSnackbar("Venta creada exitosamente");
  //     handleReset();
  //   } catch (error) {
  //     console.error(error);
  //     setSnackbarSeverity("error");
  //     handleOpenSnackbar("Error al crear la venta");
  //   }
  // };

  const handleConfirmSale = async () => {
  if (productsList.length === 0) {
    setSnackbarSeverity("warning");
    handleOpenSnackbar("No hay productos agregados.");
    return;
  }

  if (saleStatus === "pendiente" && !client) {
    setSnackbarSeverity("warning");
    handleOpenSnackbar(
      "Debes seleccionar un cliente para ventas pendientes."
    );
    return;
  }

  // 👉 Simulación (NO guarda en BD)
  setSnackbarSeverity("success");
  handleOpenSnackbar("Venta creada exitosamente (simulada)");

  console.log("🧪 Venta simulada:", {
    client,
    productsList,
    amountGiven,
    saleStatus,
    total: calculateTotal(),
    userId,
  });

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
        {/* Header Mejorado */}
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
                Nueva Venta
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona y procesa ventas de manera eficiente
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
                        label="Cliente"
                        fullWidth
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="Buscar o agregar cliente"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
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
                      <ModalSearchClients
                        open={openModal}
                        handleClose={() => setOpenModal(false)}
                        handleSelect={(selectedClient) =>
                          setClient(selectedClient.id)
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
                        showPrice={true}
                        disabled={true}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Producto Seleccionado */}
              {product && (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: "2px solid",
                    borderColor:
                      product.stock && product.stock > 0
                        ? "primary.light"
                        : "error.light",
                    backgroundColor:
                      product.stock && product.stock > 0
                        ? "primary.50"
                        : "error.50",
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
                            ${product.price.toFixed(2)}
                          </Typography>
                          {(product.discount ?? 0) > 0 && (
                            <Chip
                              label={`${product.discount}% DESCUENTO`}
                              color="success"
                              size="small"
                            />
                          )}
                          <Chip
                            label={
                              product.stock && product.stock > 0
                                ? `${product.stock} en stock`
                                : "SIN STOCK"
                            }
                            color={
                              product.stock && product.stock > 0
                                ? "primary"
                                : "error"
                            }
                            variant="outlined"
                            size="small"
                          />
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
                        {product.stock !== undefined &&
                          product.stock > 0 &&
                          product.stock <= 5 && (
                            <Typography
                              variant="caption"
                              color="warning.main"
                              sx={{ mt: 1, display: "block" }}
                            >
                              ⚠️ Stock bajo
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
                              max: product.stock || 1,
                            },
                          }}
                          error={quantity > (product.stock || 0)}
                          helperText={
                            quantity > (product.stock || 0)
                              ? `Máximo: ${product.stock}`
                              : ""
                          }
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
                          disabled={
                            !product.stock ||
                            product.stock <= 0 ||
                            quantity > product.stock
                          }
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
                      <ShoppingCartIcon sx={{ mr: 1, color: "primary.main" }} />
                      Productos en Venta
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
                              Precio Unit.
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
                                    {(product.discount ?? 0) > 0 && (
                                      <Chip
                                        label={`${product.discount}% OFF`}
                                        size="small"
                                        color="success"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.7rem",
                                          mt: 0.5,
                                        }}
                                      />
                                    )}
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
                                    disabled={
                                      product.quantity >= (product.stock || 0)
                                    }
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 0.5, display: "block" }}
                                >
                                  Stock: {product.stock || 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Box>
                                  {(product.discount ?? 0) > 0 ? (
                                    <>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          textDecoration: "line-through",
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        ${product.price.toFixed(2)}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="success.main"
                                        fontWeight="600"
                                      >
                                        ${product.discountedPrice.toFixed(2)}
                                      </Typography>
                                    </>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      fontWeight="500"
                                    >
                                      ${product.price.toFixed(2)}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  fontWeight="600"
                                  color="primary.main"
                                >
                                  ${product.total.toFixed(2)}
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
                        Carrito vacío
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Busca y agrega productos para comenzar la venta
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
                    <ReceiptIcon sx={{ mr: 1 }} />
                    Resumen de Venta
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Estado de Venta */}
                  <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                    <InputLabel>Estado de Venta</InputLabel>
                    <Select
                      value={saleStatus}
                      onChange={(e) =>
                        setSaleStatus(e.target.value as "pendiente" | "pagada")
                      }
                      label="Estado de Venta"
                      error={saleStatus === "pendiente" && !client}
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="pagada">Pagada</MenuItem>
                    </Select>
                    {saleStatus === "pendiente" && !client && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, display: "block" }}
                      >
                        ⚠️ Debes seleccionar un cliente para ventas pendientes
                      </Typography>
                    )}
                  </FormControl>

                  {/* Información de Pago */}
                  {saleStatus === "pagada" && (
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <TextField
                        label="Monto Recibido"
                        type="text"
                        inputMode="decimal"
                        fullWidth
                        size="small"
                        value={amountGiven}
                        onChange={handleAmountGivenChange}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
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
                  )}

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
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Descuentos:
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -${calculateTotalDiscount().toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        Total:
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="700">
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
                      color="success"
                      startIcon={<PaymentIcon />}
                      fullWidth
                      onClick={handleConfirmSale}
                      disabled={
                        saleStatus === "pagada"
                          ? productsList.length === 0 ||
                            amountGiven < calculateTotal()
                          : productsList.length === 0 || !client
                      }
                      size="large"
                      sx={{
                        fontWeight: "600",
                        py: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      Finalizar Venta
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FAB para carrito - Mejorado */}
        <Fab
          color="primary"
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
              <ShoppingCartIcon sx={{ mr: 1 }} />
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
                          {product.quantity} x $
                          {product.discountedPrice.toFixed(2)}
                        </Typography>
                        {(product.discount ?? 0) > 0 && (
                          <Chip
                            label={`${product.discount}% OFF`}
                            size="small"
                            color="success"
                            sx={{ height: 18, fontSize: "0.6rem", mt: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="primary.main"
                  >
                    ${product.total.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            {productsList.length > 0 && (
              <Box
                sx={{
                  mt: "auto",
                  p: 2,
                  backgroundColor: "primary.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "primary.100",
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
                    color="primary.main"
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

export default CreateSalePage;
