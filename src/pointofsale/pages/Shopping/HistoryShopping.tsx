import { useEffect, useState, useRef, useMemo } from "react";
//import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
  FormControl,
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
} from "@mui/material";
import {
  Search,
  Visibility,
  Download,
  Refresh,
  Delete,
  CalendarToday,
  Clear,
  LocalShipping,
  Business,
  AttachMoney,
  Receipt,
  MoreVert,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
//import { storeShoppings } from "../../../stores/shopping.store";
//import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import type { Shopping } from "../../interfaces/shopping.interface";
import { mockShopping } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export default function HistoryShopping() {
  // const { listShoppings, getShoppings, deleteShopping } = storeShoppings();
  //const { getShoppingById } = dataStore();
  //const navigate = useNavigate();
  const theme = useTheme();
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);

  // Estados
  const [search, setSearch] = useState("");
  const [compras, setCompras] = useState<Shopping[]>(mockShopping);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShoppingId, setSelectedShoppingId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para filtros de fecha
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  const pdfRef = useRef<HTMLDivElement>(null);

  // Efectos
  // useEffect(() => {
  //   const fetchShoppings = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getShoppings();
  //     } catch (err) {
  //       setError("Error al cargar el historial de compras");
  //       console.error("Error fetching shoppings:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchShoppings();
  // }, [getShoppings]);

  // useEffect(() => {
  //   setCompras(listShoppings);
  // }, [listShoppings]);

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [search, dateRange]);

  // Filtrado memoizado
  const filteredCompras = useMemo(() => {
    return compras.filter((compra) => {
      // Filtro por búsqueda
      const matchesSearch = compra.supplier?.name
        ? compra.supplier.name.toLowerCase().includes(search.toLowerCase())
        : search === "";

      // Filtro por fecha
      const matchesDate = (() => {
        if (!dateRange.start && !dateRange.end) return true;

        const purchaseDate = new Date(compra.createdAt ?? "");
        purchaseDate.setHours(0, 0, 0, 0);

        if (dateRange.start && dateRange.end) {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return purchaseDate >= start && purchaseDate <= end;
        }

        if (dateRange.start) {
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          return purchaseDate >= start;
        }

        if (dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          return purchaseDate <= end;
        }

        return true;
      })();

      return matchesSearch && matchesDate;
    });
  }, [compras, search, dateRange]);

  // Datos paginados
  const paginatedCompras = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredCompras.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCompras, page, rowsPerPage]);

  // Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedShoppingId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedShoppingId) {
      try {
        //await deleteShopping(selectedShoppingId);
        setCompras((prevCompras) =>
          prevCompras.filter((compra) => compra.id !== selectedShoppingId),
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar la compra");
        console.error("Error al eliminar esta compra:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getShoppings();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (shoppingId: number) => {
    try {
     //await getShoppingById(shoppingId);
      //navigate(`/compras/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles de la compra");
      console.error(err);
    }
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

  // Handlers de fecha
  const handleStartDateChange = (date: Date | null) => {
    setDateRange((prev) => ({ ...prev, start: date }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setDateRange((prev) => ({ ...prev, end: date }));
  };

  const clearDateFilter = () => {
    setDateRange({ start: null, end: null });
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

      pdf.save(`Historial_Compras_${new Date().toLocaleDateString()}.pdf`);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calcular total general
  const totalGeneral = useMemo(() => {
    return filteredCompras.reduce((sum, compra) => sum + compra.total, 0);
  }, [filteredCompras]);

  // Loading state
  if (loading && compras.length === 0) {
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
          Cargando historial de compras...
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
                <LocalShipping
                  sx={{ fontSize: 32, color: theme.palette.primary.main }}
                />
                <Typography variant="h4" component="h1" fontWeight="600">
                  Historial de Compras
                </Typography>
              </Box>
            }
            subheader={
              <Typography variant="body1" color="textSecondary">
                Gestión y seguimiento de todas las compras a proveedores
              </Typography>
            }
            action={
              <Tooltip title="Actualizar datos">
                <IconButton
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
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

            {/* Controles de filtrado y búsqueda */}
            <Box display="flex" flexDirection="column" gap={3} mb={4}>
              {/* Primera fila: Búsqueda */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 300, flexGrow: 1 }}
                >
                  <Input
                    placeholder="Buscar por nombre del proveedor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startAdornment={
                      <Search
                        sx={{
                          color: "text.secondary",
                          mr: 1,
                          fontSize: "20px",
                        }}
                      />
                    }
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 1,
                      pl: 1,
                    }}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<Download sx={{ fontSize: "20px" }} />}
                  onClick={exportToPDF}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "600",
                    minWidth: 140,
                    height: "40px",
                  }}
                >
                  Exportar PDF
                </Button>
              </Box>

              {/* Segunda fila: Filtros por fecha */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarToday fontSize="small" />
                  Filtrar por fecha:
                </Typography>

                <DatePicker
                  label="Fecha inicial"
                  value={dateRange.start}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { minWidth: 180 },
                    },
                  }}
                />

                <Typography variant="body2" color="textSecondary">
                  hasta
                </Typography>

                <DatePicker
                  label="Fecha final"
                  value={dateRange.end}
                  onChange={handleEndDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { minWidth: 180 },
                    },
                  }}
                />

                {(dateRange.start || dateRange.end) && (
                  <Tooltip title="Limpiar filtro de fecha">
                    <IconButton
                      size="small"
                      onClick={clearDateFilter}
                      color="primary"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2,
                          ),
                        },
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {/* Resumen */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <Chip
                icon={<Receipt sx={{ fontSize: "16px" }} />}
                label={`Total compras: ${filteredCompras.length}`}
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<AttachMoney sx={{ fontSize: "16px" }} />}
                label={`Inversión total: ${formatCurrency(totalGeneral)}`}
                variant="filled"
                color="secondary"
              />
              <Chip
                icon={<Business sx={{ fontSize: "16px" }} />}
                label={`Promedio: ${formatCurrency(
                  filteredCompras.length > 0
                    ? totalGeneral / filteredCompras.length
                    : 0,
                )}`}
                variant="outlined"
                color="info"
              />
              {(dateRange.start || dateRange.end) && (
                <Chip
                  icon={<CalendarToday sx={{ fontSize: "16px" }} />}
                  label={`Filtrado por fecha`}
                  variant="outlined"
                  onDelete={clearDateFilter}
                />
              )}
            </Box>

            {/* Tabla de compras */}
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
                    <TableCell sx={{ fontWeight: "600", width: 80 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Receipt
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        ID
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Business
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        Proveedor
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "600", minWidth: 120 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AttachMoney
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        Total
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        Fecha
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MoreVert
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        Acciones
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCompras.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Box textAlign="center">
                          <Search
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            gutterBottom
                          >
                            {search || dateRange.start || dateRange.end
                              ? "No se encontraron compras"
                              : "Aún no se han registrado compras"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {search || dateRange.start || dateRange.end
                              ? "Intenta ajustar los filtros de búsqueda"
                              : "Las compras aparecerán aquí una vez registradas"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCompras.map((compra) => (
                      <TableRow
                        key={compra.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.02,
                            ),
                          },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell
                          sx={{ fontFamily: "monospace", fontWeight: "medium" }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Receipt
                              sx={{ fontSize: "16px", color: "text.secondary" }}
                            />
                            #{compra.id}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Business
                              sx={{ fontSize: "16px", color: "text.secondary" }}
                            />
                            <Typography variant="body2" fontWeight="500">
                              {compra.supplier?.name ||
                                "Proveedor no disponible"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color="primary"
                            >
                              {formatCurrency(compra.total)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday
                              sx={{ fontSize: "16px", color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {formatDate(compra.createdAt ?? "")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalles">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  handleViewDetails(compra.id ?? 0)
                                }
                                sx={{ borderRadius: 2 }}
                              >
                                Ver
                              </Button>
                            </Tooltip>

                            <Tooltip title="Eliminar compra">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                onClick={() =>
                                  handleDeleteClick(compra.id ?? 0)
                                }
                                sx={{ borderRadius: 2 }}
                              >
                                Eliminar
                              </Button>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Paginación */}
              {filteredCompras.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredCompras.length}
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
            {filteredCompras.length > 0 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="body2" color="textSecondary">
                  Mostrando {paginatedCompras.length} de{" "}
                  {filteredCompras.length} compras filtradas
                  {compras.length !== filteredCompras.length &&
                    ` (de ${compras.length} totales)`}
                </Typography>

                {loading && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="textSecondary">
                      Actualizando...
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer."
        />
        <Snackbar
          open={showNotAvailableMessage}
          autoHideDuration={4000}
          onClose={() => setShowNotAvailableMessage(false)}
          message="La función de ver detalles no está disponible en esta versión."
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
    </LocalizationProvider>
  );
}
