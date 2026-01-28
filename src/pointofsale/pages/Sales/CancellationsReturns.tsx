import { useEffect, useState, useRef, useMemo, JSX } from "react";
import { useNavigate } from "react-router-dom";
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
  TablePagination,
} from "@mui/material";
import {
  Search,
  Visibility,
  Download,
  Refresh,
  CalendarToday,
  Clear,
  Receipt,
  Person,
  AttachMoney,
  Block,
  AssignmentReturn,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { storeSales } from "../../../stores/sales.store";
import { dataStore } from "../../../stores/generalData.store";
import { Sale } from "../../interfaces/sales.interface";

interface StatusConfig {
  label: string;
  color: "success" | "warning" | "error" | "default" | "info";
  icon: JSX.Element;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export default function CancellationsReturns() {
  const { listSales, getSales } = storeSales();
  const { getSaleById } = dataStore();
  const navigate = useNavigate();
  
  // Estados
  const [search, setSearch] = useState("");
  const [cancelaciones, setCancelaciones] = useState<Sale[]>([]);
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

  // Configuración de estados para cancelaciones
  const statusConfig: Record<string, StatusConfig> = {
    cancelada: {
      label: "Cancelada",
      color: "error",
      icon: <Block fontSize="small" sx={{ fontSize: '16px' }} />
    }
  };

  // Colores personalizados para una apariencia más elegante
  const elegantColors = {
    primary: '#2D3748',
    secondary: '#4A5568',
    accent: '#E53E3E',
    background: '#F7FAFC',
    surface: '#FFFFFF',
    textPrimary: '#1A202C',
    textSecondary: '#718096',
    border: '#E2E8F0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: '#38A169',
    warning: '#D69E2E',
    error: '#E53E3E',
  };

  // Efectos
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        await getSales();
      } catch (err) {
        setError("Error al cargar el historial de cancelaciones");
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [getSales]);

  useEffect(() => {
    // Filtrar solo las ventas canceladas
    const ventasCanceladas = listSales.filter(venta => venta.state === "cancelada");
    setCancelaciones(ventasCanceladas);
  }, [listSales]);

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [search, dateRange]);

  // Filtrado memoizado - solo cancelaciones
  const filteredCancelaciones = useMemo(() => {
    return cancelaciones.filter((cancelacion) => {
      // Filtro por búsqueda
      const matchesSearch = cancelacion.client?.name
        ? cancelacion.client.name.toLowerCase().includes(search.toLowerCase())
        : search === "";

      // Filtro por fecha
      const matchesDate = (() => {
        if (!dateRange.start && !dateRange.end) return true;
        
        const cancelacionDate = new Date(cancelacion.createdAt ?? "");
        cancelacionDate.setHours(0, 0, 0, 0);

        if (dateRange.start && dateRange.end) {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return cancelacionDate >= start && cancelacionDate <= end;
        }

        if (dateRange.start) {
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          return cancelacionDate >= start;
        }

        if (dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          return cancelacionDate <= end;
        }

        return true;
      })();

      return matchesSearch && matchesDate;
    });
  }, [cancelaciones, search, dateRange]);

  // Datos paginados
  const paginatedCancelaciones = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredCancelaciones.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCancelaciones, page, rowsPerPage]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await getSales();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (saleId: number) => {
    try {
      await getSaleById(saleId);
      navigate(`/ventas/editar`);
    } catch (err) {
      setError("Error al cargar los detalles de la cancelación");
      console.error(err);
    }
  };

  // Handlers de paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers de fecha
  const handleStartDateChange = (date: Date | null) => {
    setDateRange(prev => ({ ...prev, start: date }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setDateRange(prev => ({ ...prev, end: date }));
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
        logging: false 
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

      pdf.save(`Historial_Cancelaciones_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Formateadores
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
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
  if (loading && cancelaciones.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
        gap={2}
        sx={{ background: elegantColors.background }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: elegantColors.accent }}
        />
        <Typography variant="h6" sx={{ color: elegantColors.textSecondary }}>
          Cargando historial de cancelaciones...
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box className="p-6 mx-auto max-w-7xl" sx={{ background: elegantColors.background, minHeight: '100vh' }}>
        <Card 
          elevation={0}
          sx={{ 
            background: elegantColors.surface,
            border: `1px solid ${elegantColors.border}`,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
          ref={pdfRef}
        >
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    background: elegantColors.gradient,
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AssignmentReturn sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    fontWeight="700"
                    sx={{ 
                      color: elegantColors.textPrimary,
                      background: elegantColors.gradient,
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Historial de Cancelaciones
                  </Typography>
                  <Typography variant="body1" sx={{ color: elegantColors.textSecondary, mt: 0.5 }}>
                    Gestión y seguimiento de todas las transacciones canceladas
                  </Typography>
                </Box>
              </Box>
            }
            action={
              <Tooltip title="Actualizar datos">
                <IconButton 
                  onClick={handleRefresh} 
                  disabled={loading}
                  sx={{ 
                    background: elegantColors.gradient,
                    color: 'white',
                    '&:hover': {
                      background: elegantColors.gradient,
                      opacity: 0.9,
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            }
            sx={{ 
              pb: 2,
              borderBottom: `1px solid ${elegantColors.border}`,
              background: `linear-gradient(135deg, ${alpha(elegantColors.surface, 0.9)} 0%, ${alpha(elegantColors.background, 0.5)} 100%)`
            }}
          />

          <CardContent sx={{ pt: 3 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(elegantColors.error, 0.2)}`,
                  background: `linear-gradient(135deg, ${alpha(elegantColors.error, 0.05)} 0%, ${alpha(elegantColors.error, 0.02)} 100%)`
                }} 
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* Controles de filtrado y búsqueda */}
            <Box display="flex" flexDirection="column" gap={3} mb={4}>
              {/* Primera fila: Búsqueda */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <FormControl variant="outlined" sx={{ minWidth: 300, flexGrow: 1 }}>
                  <Input
                    placeholder="Buscar por nombre del cliente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startAdornment={
                      <Search 
                        sx={{ 
                          color: elegantColors.textSecondary, 
                          mr: 1,
                          fontSize: '20px'
                        }} 
                      />
                    }
                    sx={{
                      backgroundColor: alpha(elegantColors.background, 0.8),
                      borderRadius: 2,
                      pl: 1.5,
                      py: 0.5,
                      border: `1px solid ${elegantColors.border}`,
                      '&:before, &:after': { display: 'none' },
                      '&:hover': {
                        borderColor: elegantColors.accent,
                      },
                      '&.Mui-focused': {
                        borderColor: elegantColors.accent,
                        boxShadow: `0 0 0 2px ${alpha(elegantColors.accent, 0.2)}`
                      }
                    }}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<Download sx={{ fontSize: '20px' }} />}
                  onClick={exportToPDF}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "600",
                    minWidth: 140,
                    height: '40px',
                    background: elegantColors.gradient,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: elegantColors.gradient,
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Exportar PDF
                </Button>
              </Box>

              {/* Segunda fila: Filtros por fecha */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: elegantColors.textSecondary }}>
                  <CalendarToday fontSize="small" />
                  Filtrar por fecha de cancelación:
                </Typography>
                
                <DatePicker
                  label="Fecha inicial"
                  value={dateRange.start}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { 
                        minWidth: 180,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: elegantColors.accent,
                          },
                        }
                      }
                    }
                  }}
                />
                
                <Typography variant="body2" sx={{ color: elegantColors.textSecondary }}>
                  hasta
                </Typography>
                
                <DatePicker
                  label="Fecha final"
                  value={dateRange.end}
                  onChange={handleEndDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { 
                        minWidth: 180,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: elegantColors.accent,
                          },
                        }
                      }
                    }
                  }}
                />

                {(dateRange.start || dateRange.end) && (
                  <Tooltip title="Limpiar filtro de fecha">
                    <IconButton 
                      size="small" 
                      onClick={clearDateFilter}
                      sx={{
                        backgroundColor: alpha(elegantColors.accent, 0.1),
                        color: elegantColors.accent,
                        '&:hover': {
                          backgroundColor: alpha(elegantColors.accent, 0.2),
                        },
                        borderRadius: 2
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
                icon={<AssignmentReturn sx={{ fontSize: '16px' }} />}
                label={`Total: ${filteredCancelaciones.length} cancelaciones`}
                variant="outlined"
                sx={{
                  borderColor: alpha(elegantColors.primary, 0.3),
                  color: elegantColors.primary,
                  backgroundColor: alpha(elegantColors.primary, 0.05),
                  fontWeight: '500'
                }}
              />
              <Chip 
                icon={<AttachMoney sx={{ fontSize: '16px' }} />}
                label={`Monto total: ${formatCurrency(filteredCancelaciones.reduce((sum, cancelacion) => sum + cancelacion.total, 0))}`}
                sx={{
                  background: elegantColors.gradient,
                  color: 'white',
                  fontWeight: '500',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              />
              {(dateRange.start || dateRange.end) && (
                <Chip 
                  icon={<CalendarToday sx={{ fontSize: '16px' }} />}
                  label={`Filtrado por fecha`}
                  variant="outlined"
                  onDelete={clearDateFilter}
                  sx={{
                    borderColor: alpha(elegantColors.accent, 0.3),
                    color: elegantColors.accent,
                    backgroundColor: alpha(elegantColors.accent, 0.05),
                  }}
                />
              )}
            </Box>

            {/* Tabla de cancelaciones */}
            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${elegantColors.border}`,
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead sx={{ 
                  background: `linear-gradient(135deg, ${alpha(elegantColors.primary, 0.02)} 0%, ${alpha(elegantColors.primary, 0.05)} 100%)` 
                }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "700", width: 80, color: elegantColors.primary }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Receipt sx={{ fontSize: '18px', color: elegantColors.accent }} />
                        ID
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", minWidth: 200, color: elegantColors.primary }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Person sx={{ fontSize: '18px', color: elegantColors.accent }} />
                        Cliente
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", minWidth: 120, color: elegantColors.primary }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AttachMoney sx={{ fontSize: '18px', color: elegantColors.accent }} />
                        Total
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", minWidth: 180, color: elegantColors.primary }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday sx={{ fontSize: '18px', color: elegantColors.accent }} />
                        Fecha de Cancelación
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", minWidth: 130, color: elegantColors.primary }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Block sx={{ fontSize: '18px', color: elegantColors.accent }} />
                        Estado
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "700", minWidth: 120, color: elegantColors.primary }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCancelaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Box textAlign="center">
                          <AssignmentReturn sx={{ fontSize: 48, color: elegantColors.textSecondary, mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" sx={{ color: elegantColors.textSecondary }} gutterBottom>
                            {search || dateRange.start || dateRange.end 
                              ? "No se encontraron cancelaciones" 
                              : "No hay cancelaciones registradas"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: elegantColors.textSecondary }}>
                            {search || dateRange.start || dateRange.end 
                              ? "Intenta ajustar los filtros de búsqueda" 
                              : "Las cancelaciones aparecerán aquí una vez registradas"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCancelaciones.map((cancelacion) => (
                      <TableRow 
                        key={cancelacion.id}
                        sx={{ 
                          '&:hover': { 
                            background: `linear-gradient(135deg, ${alpha(elegantColors.accent, 0.02)} 0%, ${alpha(elegantColors.background, 0.3)} 100%)` 
                          },
                          transition: 'all 0.2s ease-in-out',
                          borderBottom: `1px solid ${elegantColors.border}`
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: '600', color: elegantColors.textPrimary }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Receipt sx={{ fontSize: '16px', color: elegantColors.accent }} />
                            #{cancelacion.id}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Person sx={{ fontSize: '16px', color: elegantColors.textSecondary }} />
                            <Typography variant="body2" fontWeight="500" sx={{ color: elegantColors.textPrimary }}>
                              {cancelacion.client?.name || "Cliente no disponible"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="600" sx={{ color: elegantColors.accent }}>
                              {formatCurrency(cancelacion.total)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday sx={{ fontSize: '16px', color: elegantColors.textSecondary }} />
                            <Typography variant="body2" sx={{ color: elegantColors.textPrimary }}>
                              {formatDate(cancelacion.createdAt ?? "")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusConfig[cancelacion.state]?.label || cancelacion.state}
                            color={statusConfig[cancelacion.state]?.color || "error"}
                            icon={statusConfig[cancelacion.state]?.icon}
                            size="small"
                            variant="filled"
                            sx={{
                              background: elegantColors.gradient,
                              color: 'white',
                              fontWeight: '500',
                              '& .MuiChip-icon': {
                                marginLeft: '4px',
                                color: 'white'
                              }
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
                                onClick={() => handleViewDetails(cancelacion.id ?? 0)}
                                sx={{ 
                                  borderRadius: 2,
                                  borderColor: elegantColors.accent,
                                  color: elegantColors.accent,
                                  '&:hover': {
                                    borderColor: elegantColors.accent,
                                    backgroundColor: alpha(elegantColors.accent, 0.1),
                                    transform: 'translateY(-1px)'
                                  },
                                  transition: 'all 0.2s ease-in-out'
                                }}
                              >
                                Ver
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
              {filteredCancelaciones.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredCancelaciones.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                  sx={{
                    borderTop: `1px solid ${elegantColors.border}`,
                    color: elegantColors.textSecondary
                  }}
                />
              )}
            </TableContainer>

            {/* Información de resultados */}
            {filteredCancelaciones.length > 0 && (
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="body2" sx={{ color: elegantColors.textSecondary }}>
                  Mostrando {paginatedCancelaciones.length} de {filteredCancelaciones.length} cancelaciones filtradas
                  {cancelaciones.length !== filteredCancelaciones.length && 
                    ` (de ${cancelaciones.length} totales)`
                  }
                </Typography>
                
                {loading && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} sx={{ color: elegantColors.accent }} />
                    <Typography variant="body2" sx={{ color: elegantColors.textSecondary }}>
                      Actualizando...
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}