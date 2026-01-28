import React, { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  QrCode as QrCodeIcon,
  LocalShipping as LocalShippingIcon,
  Warning as WarningIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";
import { products } from "../../mocks/productMock";
import { Product } from "../../interfaces/product.interface";
import { useNavigate } from "react-router-dom";
import { dataStore } from "../../../stores/generalData.store";
import { storeShoppings } from "../../../stores/shopping.store";
import {
  ShoppingProduct,
  ShoppingProductRequest,
  ShoppingRequest,
} from "../../interfaces/shopping.interface";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EditShoppingPage: React.FC = () => {
  const { selectedShopping } = dataStore();
  const { deleteShopping, updateShopping } = storeShoppings();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [supplier, setSupplier] = useState(selectedShopping?.supplier?.id);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(selectedShopping?.amount ?? 0);
  const [change, setChange] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<ShoppingProduct[]>(
    selectedShopping?.shoppingProducts || []
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [cartDrawer, setCartDrawer] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState<any>(null);

  // Cargar información de la tienda desde localStorage
  useEffect(() => {
    const loadStoreInfo = () => {
      try {
        const storedData = localStorage.getItem("data-point-of-sale");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setStoreInfo(parsedData.state.data);
        }
      } catch (error) {
        console.error("Error loading store info:", error);
      }
    };

    loadStoreInfo();
  }, []);

  // Función para formatear la fecha y hora de la compra
  const formatShoppingDateTime = (dateString?: string) => {
    if (!dateString) return "Fecha no disponible";

    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("es-ES"),
      time: date.toLocaleTimeString("es-ES", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Obtener fecha y hora formateadas de la compra
  const shoppingDateTime = formatShoppingDateTime(selectedShopping?.createdAt);

  // Función para calcular el total de la compra
  const calculateTotal = () => {
    return productsList.reduce(
      (acc, shoppingProduct) =>
        acc + shoppingProduct.product.costPrice * shoppingProduct.quantity,
      0
    );
  };

  const calculateItemsCount = () => {
    return productsList.reduce((acc, product) => acc + product.quantity, 0);
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
    setHasChanges(true);
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredBarcode = e.target.value.trim();
    if (enteredBarcode) {
      const selectedProduct = products.find(
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
      const existingProduct = productsList.find(
        (p) => p.product.id === product.id
      );

      if (existingProduct) {
        setProductsList((prevList) =>
          prevList.map((p) =>
            p.product.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + quantity,
                }
              : p
          )
        );
      } else {
        const newShoppingProduct: ShoppingProduct = {
          product,
          quantity,
        };
        setProductsList((prevList) => [...prevList, newShoppingProduct]);
      }

      setSnackbarSeverity("success");
      handleOpenSnackbar("Producto agregado a la compra");
      setProduct(null);
      setQuantity(1);
      setHasChanges(true);

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

  const handleDeleteProduct = (productId: number) => {
    setProductsList((prevList) =>
      prevList.filter((p) => p.product.id !== productId)
    );
    setHasChanges(true);
  };

  const handleReset = () => {
    setSupplier(selectedShopping?.supplier?.id);
    setProduct(null);
    setQuantity(1);
    setAmountGiven(selectedShopping?.amount ?? 0);
    setChange(0);
    setProductsList(selectedShopping?.shoppingProducts ?? []);
    setHasChanges(false);
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
      prevList.map((shoppingProduct) =>
        shoppingProduct.product.id === productId
          ? {
              ...shoppingProduct,
              quantity: shoppingProduct.quantity + 1,
            }
          : shoppingProduct
      )
    );
    setHasChanges(true);
  };

  const handleDecreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((shoppingProduct) =>
        shoppingProduct.product.id === productId && shoppingProduct.quantity > 1
          ? {
              ...shoppingProduct,
              quantity: shoppingProduct.quantity - 1,
            }
          : shoppingProduct
      )
    );
    setHasChanges(true);
  };

  // Funciones para el ticket
  const handleViewTicket = () => {
    setTicketDialogOpen(true);
  };

  const handleDownloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [80, 200], // Tamaño ticket
        });

        const imgWidth = 70;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
        pdf.save(`ticket-compra-${selectedShopping?.id || Date.now()}.pdf`);

        setSnackbarSeverity("success");
        handleOpenSnackbar("Ticket descargado exitosamente");
      } catch (error) {
        console.error("Error al generar PDF:", error);
        setSnackbarSeverity("error");
        handleOpenSnackbar("Error al descargar el ticket");
      }
    }
  };

  const handlePrintTicket = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Ticket de Compra</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 10px; 
                    font-family: Arial, sans-serif;
                    -webkit-print-color-adjust: exact;
                  }
                  img { 
                    max-width: 100%; 
                    height: auto; 
                  }
                </style>
              </head>
              <body>
                <img src="${canvas.toDataURL("image/png")}" />
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      } catch (error) {
        console.error("Error al imprimir:", error);
        setSnackbarSeverity("error");
        handleOpenSnackbar("Error al imprimir el ticket");
      }
    }
  };

  const handleConfirmEdit = async () => {
    if (productsList.length === 0) {
      setSnackbarSeverity("warning");
      handleOpenSnackbar("No hay productos agregados.");
      return;
    }

    try {
      const shoppingProductsRequest: ShoppingProductRequest[] =
        productsList.map((item) => {
          if (!item.product.id) {
            throw new Error("El ID del producto es requerido.");
          }
          return {
            id: item.id,
            product: {
              id: item.product.id,
            },
            quantity: item.quantity,
            sale_id: selectedShopping?.id ?? 0,
          };
        });

      const updatedShoppingData: Partial<ShoppingRequest> = {
        supplier: supplier ? { id: supplier } : undefined,
        shoppingProducts: shoppingProductsRequest,
        amount: amountGiven,
        total: calculateTotal(),
      };

      await updateShopping(selectedShopping?.id ?? 0, updatedShoppingData);

      setSnackbarSeverity("success");
      handleOpenSnackbar("Compra editada exitosamente");
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al actualizar la compra");
    }
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteShopping(selectedShopping?.id ?? 0);
      navigate(`/compras/historial`);
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
        {/* Header Mejorado CON FECHA Y HORA DE LA COMPRA */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{ mb: 2 }}
              >
                Regresar
              </Button>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="600"
                color="primary.main"
                gutterBottom
              >
                Editar Compra
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Modifica los detalles de la compra existente
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
                Fecha de Compra
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {shoppingDateTime.toString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hora
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {shoppingDateTime.toString()}
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
                        value={supplier || ""}
                        disabled
                        placeholder="Proveedor actual"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalShippingIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
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
                          {productsList.map((shoppingProduct) => (
                            <TableRow
                              key={shoppingProduct.product.id}
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
                                    src={shoppingProduct.product.image}
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
                                      {shoppingProduct.product.name}
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
                                      handleDecreaseQuantity(
                                        shoppingProduct.product.id!
                                      )
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
                                    {shoppingProduct.quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleIncreaseQuantity(
                                        shoppingProduct.product.id!
                                      )
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
                                  $
                                  {shoppingProduct.product.costPrice.toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="body2"
                                  fontWeight="600"
                                  color="primary.main"
                                >
                                  $
                                  {(
                                    shoppingProduct.product.costPrice *
                                    shoppingProduct.quantity
                                  ).toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleDeleteProduct(
                                      shoppingProduct.product.id!
                                    )
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
                        Busca y agrega productos para editar la compra
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
                  {/* Botón para ver ticket */}
                  {productsList.length > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ViewIcon />}
                      fullWidth
                      onClick={handleViewTicket}
                      sx={{ mb: 2 }}
                    >
                      Ver Ticket
                    </Button>
                  )}

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
                            <WarningIcon fontSize="small" />
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
                      disabled={!hasChanges}
                    >
                      Deshacer Cambios
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<SaveIcon />}
                      fullWidth
                      onClick={handleConfirmEdit}
                      disabled={
                        !hasChanges ||
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
                      Actualizar Compra
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
                      Eliminar Compra
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
              {productsList.map((shoppingProduct) => (
                <ListItem
                  key={shoppingProduct.product.id}
                  divider
                  sx={{ px: 0 }}
                >
                  <ListItemIcon>
                    <Avatar
                      src={shoppingProduct.product.image}
                      sx={{ width: 48, height: 48, borderRadius: 1 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="500">
                        {shoppingProduct.product.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {shoppingProduct.quantity} x $
                          {shoppingProduct.product.costPrice.toFixed(2)}
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
                    $
                    {(
                      shoppingProduct.product.costPrice *
                      shoppingProduct.quantity
                    ).toFixed(2)}
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

        {/* Modal del Ticket */}
        <Dialog
          open={ticketDialogOpen}
          onClose={() => setTicketDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              Ticket de Compra #{selectedShopping?.id}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {/* Ticket para impresión/descarga */}
            <Box ref={ticketRef} sx={{ p: 2, backgroundColor: "white" }}>
              {/* Encabezado del Ticket */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {storeInfo?.name || "Mi Tiendita"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {storeInfo?.address || "Dirección no especificada"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tel: {storeInfo?.phone || "N/A"}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  Compra #: {selectedShopping?.id || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Fecha: {shoppingDateTime.date}
                </Typography>
                <Typography variant="body2">
                  Hora: {shoppingDateTime.time}
                </Typography>
                <Typography variant="body2">
                  Proveedor: {selectedShopping?.supplier?.name || "N/A"}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>

              {/* Productos */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  PRODUCTOS COMPRADOS
                </Typography>
                {productsList.map((shoppingProduct) => (
                  <Box key={shoppingProduct.product.id} sx={{ mb: 1 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" fontWeight="500">
                        {shoppingProduct.product.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        $
                        {(
                          shoppingProduct.product.costPrice *
                          shoppingProduct.quantity
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {shoppingProduct.quantity} x $
                        {shoppingProduct.product.costPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="secondary.main">
                        COSTO
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Totales */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight="bold">
                    TOTAL COMPRA:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Información de pago */}
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Pagado:</Typography>
                  <Typography variant="body2">
                    ${amountGiven.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Cambio:</Typography>
                  <Typography variant="body2">${change.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Pie del Ticket */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  ¡Gracias por su compra al proveedor!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {shoppingDateTime.date} {shoppingDateTime.time}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTicketDialogOpen(false)}>Cerrar</Button>
            <Button
              onClick={handleDownloadTicket}
              startIcon={<PdfIcon />}
              variant="outlined"
            >
              Descargar PDF
            </Button>
            <Button
              onClick={handlePrintTicket}
              startIcon={<PrintIcon />}
              variant="contained"
              color="primary"
            >
              Imprimir
            </Button>
          </DialogActions>
        </Dialog>

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

        {/* Dialog de Confirmación */}
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer."
        />
      </Container>
    </Box>
  );
};

export default EditShoppingPage;
