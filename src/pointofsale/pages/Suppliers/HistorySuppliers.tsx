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
} from "@mui/material";
import {
  Search,
  Visibility,
  Download,
  Refresh,
  Delete,
  Business,
  Email,
  Phone,
  LocationOn,
  LocalShipping,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { dataStore } from "../../../stores/generalData.store";
//import { storeSuppliers } from "../../../stores/suppliers.store";
import type { Supplier } from "../../interfaces/supplier.interface";
import { mockSuppliers } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

export default function HistorySuppliers() {
  //const { listSuppliers, getSuppliers, deleteSupplier } = storeSuppliers();
  const { getSupplierById } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();

  // Estados
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Efectos
  // useEffect(() => {
  //   const fetchSuppliers = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getSuppliers();
  //     } catch (err) {
  //       setError("Error al cargar el historial de proveedores");
  //       console.error("Error fetching suppliers:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSuppliers();
  // }, [getSuppliers]);

  // useEffect(() => {
  //   setSuppliers(listSuppliers);
  // }, [listSuppliers]);

  // Resetear paginación cuando cambia la búsqueda
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Filtrado memoizado
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (supplier) =>
        supplier?.name?.toLowerCase().includes(search.toLowerCase()) ||
        supplier?.email?.toLowerCase().includes(search.toLowerCase()) ||
        supplier?.phone?.includes(search) ||
        supplier?.address?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [suppliers, search]);

  // Datos paginados
  const paginatedSuppliers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSuppliers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSuppliers, page, rowsPerPage]);

  // Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedSupplierId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplierId) {
      try {
        //await deleteSupplier(selectedSupplierId);
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter(
            (supplier) => supplier.id !== selectedSupplierId,
          ),
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar el proveedor");
        console.error("Error al eliminar el proveedor:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getSuppliers();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (supplierId: number) => {
    try {
      // await getSupplierById(supplierId);
      // navigate(`/proveedores/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles del proveedor");
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

      pdf.save(`Historial_Proveedores_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Loading state
  if (loading && suppliers.length === 0) {
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
          Cargando historial de proveedores...
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
              <LocalShipping color="primary" />
              <Typography variant="h4" component="h1" fontWeight="600">
                Historial de Proveedores
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Gestión y administración de proveedores del sistema
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

          {/* Controles de búsqueda */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={4}
            flexWrap="wrap"
          >
            <FormControl variant="outlined" sx={{ minWidth: 300, flexGrow: 1 }}>
              <Input
                placeholder="Buscar por nombre, email, teléfono o dirección..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startAdornment={<Search className="text-gray-500" />}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                }}
              />
            </FormControl>

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
              label={`Total: ${filteredSuppliers.length} proveedores`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Con email: ${
                filteredSuppliers.filter((s) => s.email).length
              }`}
              variant="filled"
              color="info"
            />
            <Chip
              label={`Con teléfono: ${
                filteredSuppliers.filter((s) => s.phone).length
              }`}
              variant="filled"
              color="success"
            />
            <Chip
              label={`Con dirección: ${
                filteredSuppliers.filter((s) => s.address).length
              }`}
              variant="filled"
              color="warning"
            />
          </Box>

          {/* Tabla de proveedores */}
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
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Business fontSize="small" />
                      Nombre
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" />
                      Email
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 150 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone fontSize="small" />
                      Teléfono
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 250 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn fontSize="small" />
                      Dirección
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search
                            ? "No se encontraron proveedores"
                            : "Aún no se han agregado proveedores"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search
                            ? "Intenta ajustar los términos de búsqueda"
                            : "Los proveedores aparecerán aquí una vez agregados"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSuppliers.map((proveedor) => (
                    <TableRow
                      key={proveedor.id}
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
                        #{proveedor.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {proveedor.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {proveedor.email || (
                            <Chip
                              label="No especificado"
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {proveedor.phone || (
                            <Chip
                              label="No especificado"
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {proveedor.address || (
                            <Chip
                              label="No especificada"
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Ver detalles">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() =>
                                handleViewDetails(proveedor.id ?? 0)
                              }
                              sx={{ borderRadius: 2 }}
                            >
                              Ver
                            </Button>
                          </Tooltip>

                          <Tooltip title="Eliminar proveedor">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              onClick={() =>
                                handleDeleteClick(proveedor.id ?? 0)
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
            {filteredSuppliers.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredSuppliers.length}
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
          {filteredSuppliers.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedSuppliers.length} de{" "}
                {filteredSuppliers.length} proveedores filtrados
                {suppliers.length !== filteredSuppliers.length &&
                  ` (de ${suppliers.length} totales)`}
              </Typography>

              {/* {loading && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="textSecondary">
                    Actualizando...
                  </Typography>
                </Box>
              )} */}
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
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
