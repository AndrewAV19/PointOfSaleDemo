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
  Person,
  Email,
  Phone,
  LocationOn,
  Group,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { dataStore } from "../../../stores/generalData.store";
//import { storeClients } from "../../../stores/clients.store";
import type { Clients } from "../../interfaces/clients.interface";
import { mockClients } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

export default function HistoryClients() {
  //const { listClients, getClients, deleteClient } = storeClients();
  const { getClientById } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);
  // Estados
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Clients[]>(mockClients);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pdfRef = useRef<HTMLDivElement>(null);

  // Efectos
  // useEffect(() => {
  //   const fetchClients = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getClients();
  //     } catch (err) {
  //       setError("Error al cargar el historial de clientes");
  //       console.error("Error fetching clients:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchClients();
  // }, [getClients]);

  // useEffect(() => {
  //   setClients(listClients);
  // }, [listClients]);

  // Resetear paginación cuando cambia la búsqueda
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Filtrado memoizado
  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client?.name?.toLowerCase().includes(search.toLowerCase()) ||
        client?.email?.toLowerCase().includes(search.toLowerCase()) ||
        client?.phone?.includes(search) ||
        client?.address?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [clients, search]);

  // Datos paginados
  const paginatedClients = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredClients.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredClients, page, rowsPerPage]);

  // Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedClientId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedClientId) {
      try {
        //await deleteClient(selectedClientId);
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== selectedClientId),
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar el cliente");
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getClients();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (clientId: number) => {
    try {
      //await getClientById(clientId);
      //navigate(`/clientes/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles del cliente");
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

      pdf.save(`Historial_Clientes_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Loading state
  if (loading && clients.length === 0) {
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
          Cargando historial de clientes...
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
              <Group color="primary" />
              <Typography variant="h4" component="h1" fontWeight="600">
                Historial de Clientes
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Gestión y administración de clientes del sistema
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
              label={`Total: ${filteredClients.length} clientes`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Con email: ${
                filteredClients.filter((c) => c.email).length
              }`}
              variant="filled"
              color="info"
            />
            <Chip
              label={`Con teléfono: ${
                filteredClients.filter((c) => c.phone).length
              }`}
              variant="filled"
              color="success"
            />
            <Chip
              label={`Con dirección: ${
                filteredClients.filter((c) => c.address).length
              }`}
              variant="filled"
              color="warning"
            />
            <Chip
              label={`Completos: ${
                filteredClients.filter((c) => c.email && c.phone && c.address)
                  .length
              }`}
              variant="filled"
              color="secondary"
            />
          </Box>

          {/* Tabla de clientes */}
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
                      <Person fontSize="small" />
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
                {paginatedClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search
                            ? "No se encontraron clientes"
                            : "Aún no se han agregado clientes"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search
                            ? "Intenta ajustar los términos de búsqueda"
                            : "Los clientes aparecerán aquí una vez agregados"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedClients.map((client) => (
                    <TableRow
                      key={client.id}
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
                        #{client.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {client.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {client.email || (
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
                          {client.phone || (
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
                          {client.address || (
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
                              onClick={() => handleViewDetails(client.id ?? 0)}
                              sx={{ borderRadius: 2 }}
                            >
                              Ver
                            </Button>
                          </Tooltip>

                          <Tooltip title="Eliminar cliente">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteClick(client.id ?? 0)}
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
            {filteredClients.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredClients.length}
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
          {filteredClients.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedClients.length} de {filteredClients.length}{" "}
                clientes filtrados
                {clients.length !== filteredClients.length &&
                  ` (de ${clients.length} totales)`}
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
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
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
