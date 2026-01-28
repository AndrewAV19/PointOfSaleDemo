import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  Alert,
  TableContainer,
  alpha,
  useTheme,
  TablePagination,
  FormControl,
  Avatar,
  Badge,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Search,
  Visibility,
  Download,
  Refresh,
  Delete,
  Inventory,
  Category,
  AttachMoney,
  Storage,
  Warning,
  FilterList,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
//import { storeProducts } from "../../../stores/products.store";
import { dataStore } from "../../../stores/generalData.store";
import type { Product } from "../../interfaces/product.interface";
import { mockProducts } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

// Tipo para el ordenamiento por stock
type StockSortOrder = "none" | "most-stock" | "least-stock";

export default function HistoryProducts() {
  // const { listProducts, getProducts, deleteProduct } = storeProducts();
  const { getProductById } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockSortOrder, setStockSortOrder] = useState<StockSortOrder>("none");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const pdfRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getProducts();
  //     } catch (err) {
  //       setError("Error al cargar el historial de productos");
  //       console.error("Error fetching products:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, [getProducts]);

  // useEffect(() => {
  //   setProducts(listProducts);
  // }, [listProducts]);

  useEffect(() => {
    setPage(0);
  }, [search, selectedCategory, stockSortOrder]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach((product) => {
      if (product.category?.name) {
        uniqueCategories.add(product.category.name);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        product?.barCode?.includes(search) ||
        product?.category?.name?.toLowerCase().includes(search.toLowerCase());

      // Filtro por categoría
      const matchesCategory =
        selectedCategory === "all" ||
        product?.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Aplicar ordenamiento
    filtered = [...filtered].sort((a, b) => {
      // Si hay ordenamiento por stock, priorizar ese
      if (stockSortOrder !== "none") {
        const stockA = a.stock ?? 0;
        const stockB = b.stock ?? 0;

        if (stockSortOrder === "most-stock") {
          return stockB - stockA; // Mayor stock primero
        } else {
          return stockA - stockB; // Menor stock primero
        }
      }

      // Si no hay ordenamiento por stock, ordenar alfabéticamente por nombre
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });

    return filtered;
  }, [products, search, selectedCategory, stockSortOrder]);

  // Datos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  // Cálculos para el resumen
  const totalStock = useMemo(() => {
    return filteredProducts.reduce(
      (sum, product) => sum + (product.stock ?? 0),
      0,
    );
  }, [filteredProducts]);

  const totalValue = useMemo(() => {
    return filteredProducts.reduce(
      (sum, product) => sum + product.price * (product.stock ?? 0),
      0,
    );
  }, [filteredProducts]);

  const outOfStockCount = useMemo(() => {
    return filteredProducts.filter((product) => (product.stock ?? 0) === 0)
      .length;
  }, [filteredProducts]);

  const lowStockCount = useMemo(() => {
    return filteredProducts.filter(
      (product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 10,
    ).length;
  }, [filteredProducts]);

  // Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        //await deleteProduct(selectedProductId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProductId),
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar el producto");
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getProducts();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (productId: number) => {
    try {
      //await getProductById(productId);
      //navigate(`/inventario/productos/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles del producto");
      console.error(err);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const handleStockSortChange = (event: SelectChangeEvent<StockSortOrder>) => {
    setStockSortOrder(event.target.value as StockSortOrder);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setStockSortOrder("none");
  };

  // Handlers de paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Historial_Productos_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Formateadores
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "error";
    if (stock <= 10) return "warning";
    return "success";
  };

  const getStockVariant = (stock: number) => {
    if (stock === 0) return "filled";
    if (stock <= 10) return "filled";
    return "outlined";
  };

  const getStockSortIcon = () => {
    switch (stockSortOrder) {
      case "most-stock":
        return <ArrowDownward fontSize="small" />;
      case "least-stock":
        return <ArrowUpward fontSize="small" />;
    }
  };

  const getStockSortLabel = () => {
    switch (stockSortOrder) {
      case "most-stock":
        return "Mayor stock";
      case "least-stock":
        return "Menor stock";
      default:
        return "Orden alfabético";
    }
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Cargando historial de productos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6 mx-auto max-w-7xl">
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 2,
        }}
        ref={pdfRef}
      >
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Inventory color="primary" />
              <Typography variant="h4" component="h1" fontWeight="600">
                Historial de Productos
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Gestión y administración del inventario de productos
            </Typography>
          }
          action={
            <Tooltip title="Actualizar datos">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          }
          sx={{ pb: 1 }}
        />

        <CardContent>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Controles de búsqueda y filtros */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={4}
            flexWrap="wrap"
          >
            {/* Búsqueda general */}
            <FormControl variant="outlined" sx={{ minWidth: 300, flexGrow: 1 }}>
              <Input
                placeholder="Buscar por nombre, código de barras o categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startAdornment={<Search className="text-gray-500" />}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                }}
              />
            </FormControl>

            {/* Filtro por categoría */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="category-filter-label">Categoría</InputLabel>
              <Select
                labelId="category-filter-label"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Categoría"
                startAdornment={
                  <FilterList
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                }
                sx={{
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <MenuItem value="all">
                  <em>Todas las categorías</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Ordenamiento por stock */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="stock-sort-label">Ordenar productos</InputLabel>
              <Select
                labelId="stock-sort-label"
                value={stockSortOrder}
                onChange={handleStockSortChange}
                label="Ordenar productos"
                startAdornment={getStockSortIcon()}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <MenuItem value="none">
                  <Box display="flex" alignItems="center" gap={1}>
                    Orden alfabético
                  </Box>
                </MenuItem>
                <MenuItem value="most-stock">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ArrowDownward fontSize="small" />
                    Mayor stock primero
                  </Box>
                </MenuItem>
                <MenuItem value="least-stock">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ArrowUpward fontSize="small" />
                    Menor stock primero
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Botón para limpiar filtros */}
            {(search ||
              selectedCategory !== "all" ||
              stockSortOrder !== "none") && (
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Limpiar
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={exportToPDF}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "600",
                minWidth: 140,
              }}
            >
              Exportar PDF
            </Button>
          </Box>

          {/* Resumen */}
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <Chip
              label={`Total: ${filteredProducts.length} productos`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Stock total: ${totalStock} unidades`}
              variant="filled"
              color="info"
              icon={<Storage />}
            />
            <Chip
              label={`Valor total: ${formatCurrency(totalValue)}`}
              variant="filled"
              color="success"
              icon={<AttachMoney />}
            />
            <Chip
              label={`Sin stock: ${outOfStockCount}`}
              variant="filled"
              color="error"
              icon={<Warning />}
            />
            <Chip
              label={`Stock bajo: ${lowStockCount}`}
              variant="filled"
              color="warning"
              icon={<Warning />}
            />
            {selectedCategory !== "all" && (
              <Chip
                label={`Categoría: ${selectedCategory}`}
                variant="filled"
                color="secondary"
                icon={<Category />}
                onDelete={() => setSelectedCategory("all")}
              />
            )}
            <Chip
              label={getStockSortLabel()}
              variant="filled"
              color="primary"
              icon={getStockSortIcon()}
            />
          </Box>

          {/* Tabla de productos */}
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            <Table>
              <TableHead
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: "600", width: 80 }}></TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Inventory fontSize="small" />
                      Nombre
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 150 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <QrCode2Icon fontSize="small" />
                      Código
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 150 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Category fontSize="small" />
                      Categoría
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 120 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AttachMoney fontSize="small" />
                      Precio
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 120 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Storage fontSize="small" />
                      Stock
                      {stockSortOrder === "most-stock" && (
                        <ArrowDownward fontSize="small" color="primary" />
                      )}
                      {stockSortOrder === "least-stock" && (
                        <ArrowUpward fontSize="small" color="primary" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Inventory
                          sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search ||
                          selectedCategory !== "all" ||
                          stockSortOrder !== "none"
                            ? "No se encontraron productos"
                            : "Aún no se han registrado productos"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search ||
                          selectedCategory !== "all" ||
                          stockSortOrder !== "none"
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "Los productos aparecerán aquí una vez registrados"}
                        </Typography>
                        {(search ||
                          selectedCategory !== "all" ||
                          stockSortOrder !== "none") && (
                          <Button
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{ mt: 2 }}
                          >
                            Limpiar filtros
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((producto) => (
                    <Tooltip
                      key={producto.id}
                      title={
                        producto.stock === 0
                          ? "Producto sin stock"
                          : (producto.stock ?? 0) <= 10
                            ? "Stock bajo"
                            : ""
                      }
                      arrow
                    >
                      <TableRow
                        sx={{
                          backgroundColor:
                            producto.stock === 0
                              ? alpha(theme.palette.error.main, 0.04)
                              : (producto.stock ?? 0) <= 10
                                ? alpha(theme.palette.warning.main, 0.04)
                                : "inherit",
                          "&:hover": {
                            backgroundColor:
                              producto.stock === 0
                                ? alpha(theme.palette.error.main, 0.08)
                                : (producto.stock ?? 0) <= 10
                                  ? alpha(theme.palette.warning.main, 0.08)
                                  : alpha(theme.palette.primary.main, 0.02),
                          },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Badge
                            color={getStockColor(producto.stock ?? 0)}
                            variant="dot"
                            invisible={(producto.stock ?? 0) > 10}
                          >
                            <Avatar
                              src={producto.image}
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            >
                              <Inventory />
                            </Avatar>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {producto.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {producto.barCode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={producto.category?.name || "Sin categoría"}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="primary"
                          >
                            {formatCurrency(producto.price)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={producto.stock}
                            color={getStockColor(producto.stock ?? 0)}
                            variant={
                              getStockVariant(producto.stock ?? 0) as
                                | "filled"
                                | "outlined"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalles">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  handleViewDetails(producto.id ?? 0)
                                }
                                sx={{ borderRadius: 2 }}
                              >
                                Ver
                              </Button>
                            </Tooltip>

                            <Tooltip title="Eliminar producto">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                onClick={() =>
                                  handleDeleteClick(producto.id ?? 0)
                                }
                                sx={{ borderRadius: 2 }}
                              >
                                Eliminar
                              </Button>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Tooltip>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Paginación */}
            {filteredProducts.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              />
            )}
          </TableContainer>

          {/* Información de resultados */}
          {filteredProducts.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedProducts.length} de{" "}
                {filteredProducts.length} productos filtrados
                {products.length !== filteredProducts.length &&
                  ` (de ${products.length} totales)`}
                {selectedCategory !== "all" &&
                  ` - Categoría: ${selectedCategory}`}
                {` - Ordenado por: ${getStockSortLabel()}`}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
      <Snackbar
        open={showNotAvailableMessage}
        autoHideDuration={4000}
        onClose={() => setShowNotAvailableMessage(false)}
        message="La función de ver detalles no está disponible en esta versión."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
