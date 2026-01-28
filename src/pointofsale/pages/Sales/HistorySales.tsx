import { useEffect, useState, useRef, useMemo } from "react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Grid,
} from "@mui/material";
import {
  Search,
  Visibility,
  Download,
  FilterList,
  Refresh,
  CheckCircle,
  CalendarToday,
  Clear,
  Receipt,
  Person,
  AttachMoney,
  Schedule,
  Block,
  MoreVert,
  PointOfSale,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
//import { storeSales } from "../../../stores/sales.store";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmCancelDialog from "../../../components/ConfirmCancelModal";
import type { Sale } from "../../interfaces/sales.interface";
import { mockSales } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

interface StatusConfig {
  label: string;
  color: "success" | "warning" | "error" | "default";
  icon: JSX.Element;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DailySummary {
  totalSales: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export default function HistorySales() {
  //const { listSales, getSales, cancelSale } = storeSales();
  const { getSaleById } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);

  // Estados
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [ventas, setVentas] = useState<Sale[]>(mockSales);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
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

  // Configuración de estados mejorada con iconos más descriptivos
  const statusConfig: Record<string, StatusConfig> = {
    pagada: {
      label: "Pagada",
      color: "success",
      icon: <CheckCircle fontSize="small" sx={{ fontSize: "16px" }} />,
    },
    pendiente: {
      label: "Pendiente",
      color: "warning",
      icon: <Schedule fontSize="small" sx={{ fontSize: "16px" }} />,
    },
    cancelada: {
      label: "Cancelada",
      color: "error",
      icon: <Block fontSize="small" sx={{ fontSize: "16px" }} />,
    },
  };

  // Efectos
  // useEffect(() => {
  //   const fetchSales = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getSales();
  //     } catch (err) {
  //       setError("Error al cargar el historial de ventas");
  //       console.error("Error fetching sales:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSales();
  // }, [getSales]);

  // useEffect(() => {
  //   setVentas(listSales);
  // }, [listSales]);

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [search, estadoFilter, dateRange]);

  // Resumen del día
  const dailySummary = useMemo((): DailySummary => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Solo ventas del día que NO estén canceladas
    const todaySales = ventas.filter((venta) => {
      const saleDate = new Date(venta.createdAt ?? "");
      saleDate.setHours(0, 0, 0, 0);
      return (
        saleDate.getTime() === today.getTime() && venta.state !== "cancelada"
      );
    });

    const paidSales = todaySales.filter((venta) => venta.state === "pagada");
    const pendingSales = todaySales.filter(
      (venta) => venta.state === "pendiente",
    );

    return {
      totalSales: todaySales.length,
      totalAmount: todaySales.reduce((sum, venta) => sum + venta.total, 0),
      paidAmount: paidSales.reduce((sum, venta) => sum + venta.total, 0),
      pendingAmount: pendingSales.reduce((sum, venta) => sum + venta.total, 0),
    };
  }, [ventas]);

  // Filtrado memoizado
  const filteredVentas = useMemo(() => {
    return ventas.filter((venta) => {
      // Filtro por búsqueda
      const matchesSearch = venta.client?.name
        ? venta.client.name.toLowerCase().includes(search.toLowerCase())
        : search === "";

      // Filtro por estado
      const matchesEstado = estadoFilter ? venta.state === estadoFilter : true;

      // Filtro por fecha
      const matchesDate = (() => {
        if (!dateRange.start && !dateRange.end) return true;

        const saleDate = new Date(venta.createdAt ?? "");
        saleDate.setHours(0, 0, 0, 0);

        if (dateRange.start && dateRange.end) {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return saleDate >= start && saleDate <= end;
        }

        if (dateRange.start) {
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          return saleDate >= start;
        }

        if (dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          return saleDate <= end;
        }

        return true;
      })();

      return matchesSearch && matchesEstado && matchesDate;
    });
  }, [ventas, search, estadoFilter, dateRange]);

  // Datos paginados
  const paginatedVentas = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredVentas.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredVentas, page, rowsPerPage]);

  // Handlers
  const handleCancelClick = (id: number) => {
    setSelectedSaleId(id);
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedSaleId) {
      try {
        //await cancelSale(selectedSaleId);
        setVentas((prevVentas) =>
          prevVentas.map((venta) =>
            venta.id === selectedSaleId
              ? { ...venta, state: "cancelada" }
              : venta,
          ),
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al cancelar la venta");
        console.error("Error al cancelar esta venta:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getSales();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (saleId: number) => {
    try {
      //await getSaleById(saleId);
      //navigate(`/ventas/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles de la venta");
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

      pdf.save(`Historial_Ventas_${new Date().toLocaleDateString()}.pdf`);
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

  // Loading state
  if (loading && ventas.length === 0) {
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
          Cargando historial de ventas...
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
                <Receipt
                  sx={{ fontSize: 32, color: theme.palette.primary.main }}
                />
                <Typography variant="h4" component="h1" fontWeight="600">
                  Historial de Ventas
                </Typography>
              </Box>
            }
            subheader={
              <Typography variant="body1" color="textSecondary">
                Gestión y seguimiento de todas las transacciones
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

            {/* Resumen de Caja del Día */}
            <Card
              sx={{
                mb: 4,
                background: `linear-gradient(145deg, ${alpha(
                  theme.palette.background.paper,
                  0.98,
                )} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <PointOfSale
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: "50%",
                      padding: 1,
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="h2"
                    fontWeight="700"
                    color="text.primary"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Caja del Día —{" "}
                    {new Date().toLocaleDateString("es-MX", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {[
                    {
                      label: "Ventas Totales",
                      value: dailySummary.totalSales,
                      color: "primary.main",
                    },
                    {
                      label: "Monto Total",
                      value: formatCurrency(dailySummary.totalAmount),
                      color: "success.main",
                    },
                    {
                      label: "Pagado",
                      value: formatCurrency(dailySummary.paidAmount),
                      color: "success.dark",
                    },
                    {
                      label: "Pendiente",
                      value: formatCurrency(dailySummary.pendingAmount),
                      color: "warning.main",
                    },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box
                        textAlign="center"
                        p={2.5}
                        sx={{
                          borderRight:
                            index !== 3
                              ? {
                                  xs: "none",
                                  md: `1px solid ${alpha(
                                    theme.palette.divider,
                                    0.1,
                                  )}`,
                                }
                              : "none",
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          color={item.color}
                          sx={{ mb: 0.5 }}
                        >
                          {item.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Controles de filtrado y búsqueda */}
            <Box display="flex" flexDirection="column" gap={3} mb={4}>
              {/* Primera fila: Búsqueda y Estado */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <FormControl
                  variant="outlined"
                  sx={{ minWidth: 300, flexGrow: 1 }}
                >
                  <Input
                    placeholder="Buscar por nombre del cliente..."
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

                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={estadoFilter}
                    onChange={(e) => setEstadoFilter(e.target.value)}
                    label="Estado"
                    startAdornment={
                      <FilterList
                        sx={{
                          mr: 1,
                          color: "text.secondary",
                          fontSize: "20px",
                        }}
                      />
                    }
                  >
                    <MenuItem value="">Todos los estados</MenuItem>
                    <MenuItem value="pagada">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircle
                          sx={{ fontSize: "18px", color: "success.main" }}
                        />
                        Pagada
                      </Box>
                    </MenuItem>
                    <MenuItem value="pendiente">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Schedule
                          sx={{ fontSize: "18px", color: "warning.main" }}
                        />
                        Pendiente
                      </Box>
                    </MenuItem>
                    <MenuItem value="cancelada">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Block sx={{ fontSize: "18px", color: "error.main" }} />
                        Cancelada
                      </Box>
                    </MenuItem>
                  </Select>
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
                label={`Total: ${filteredVentas.length} ventas`}
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<CheckCircle sx={{ fontSize: "16px" }} />}
                label={`Pagadas: ${
                  filteredVentas.filter((v) => v.state === "pagada").length
                }`}
                variant="filled"
                color="success"
              />
              <Chip
                icon={<Schedule sx={{ fontSize: "16px" }} />}
                label={`Pendientes: ${
                  filteredVentas.filter((v) => v.state === "pendiente").length
                }`}
                variant="filled"
                color="warning"
              />
              <Chip
                icon={<Block sx={{ fontSize: "16px" }} />}
                label={`Canceladas: ${
                  filteredVentas.filter((v) => v.state === "cancelada").length
                }`}
                variant="filled"
                color="error"
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

            {/* Resto del código de la tabla permanece igual */}
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
                        <Person
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        Cliente
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
                    <TableCell sx={{ fontWeight: "600", minWidth: 130 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MoreVert
                          sx={{ fontSize: "18px", color: "text.secondary" }}
                        />
                        Estado
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedVentas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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
                            {search ||
                            estadoFilter ||
                            dateRange.start ||
                            dateRange.end
                              ? "No se encontraron ventas"
                              : "Aún no se han registrado ventas"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {search ||
                            estadoFilter ||
                            dateRange.start ||
                            dateRange.end
                              ? "Intenta ajustar los filtros de búsqueda"
                              : "Las ventas aparecerán aquí una vez registradas"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedVentas.map((venta) => (
                      <TableRow
                        key={venta.id}
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
                            #{venta.id}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Person
                              sx={{ fontSize: "16px", color: "text.secondary" }}
                            />
                            <Typography variant="body2" fontWeight="500">
                              {venta.client?.name || "Cliente no disponible"}
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
                              {formatCurrency(venta.total)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday
                              sx={{ fontSize: "16px", color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {formatDate(venta.createdAt ?? "")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              statusConfig[venta.state]?.label || venta.state
                            }
                            color={
                              statusConfig[venta.state]?.color || "default"
                            }
                            icon={statusConfig[venta.state]?.icon}
                            size="small"
                            variant="filled"
                            sx={{
                              "& .MuiChip-icon": {
                                marginLeft: "4px",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalles">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => handleViewDetails(venta.id ?? 0)}
                                sx={{ borderRadius: 2 }}
                              >
                                Ver
                              </Button>
                            </Tooltip>

                            {venta.state !== "cancelada" && (
                              <Tooltip title="Cancelar venta">
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleCancelClick(venta.id ?? 0)
                                  }
                                  sx={{ borderRadius: 2 }}
                                >
                                  Cancelar
                                </Button>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Paginación */}
              {filteredVentas.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredVentas.length}
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
            {filteredVentas.length > 0 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="body2" color="textSecondary">
                  Mostrando {paginatedVentas.length} de {filteredVentas.length}{" "}
                  ventas filtradas
                  {ventas.length !== filteredVentas.length &&
                    ` (de ${ventas.length} totales)`}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <ConfirmCancelDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmCancel}
          title="Confirmar Cancelación"
          message="¿Estás seguro de que deseas cancelar esta venta? Esta acción no se puede deshacer."
        />
        <Snackbar
          open={showNotAvailableMessage}
          autoHideDuration={4000}
          onClose={() => setShowNotAvailableMessage(false)}
          message="La función de ver detalles no está disponible en esta versión."
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />

        <ConfirmCancelDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmCancel}
          title="Confirmar Cancelación"
          message="¿Estás seguro de que deseas cancelar esta venta? Esta acción no se puede deshacer."
        />
      </Box>
    </LocalizationProvider>
  );
}
