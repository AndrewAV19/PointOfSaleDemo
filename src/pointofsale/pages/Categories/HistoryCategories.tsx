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
  Category,
  Description,
  Label,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { dataStore } from "../../../stores/generalData.store";
//import { storeCategories } from "../../../stores/categories.store";
import type { Categories } from "../../interfaces/categories.interface";
import { mockCategories } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

export default function HistoryCategories() {
  //const { listCategories, getCategories, deleteCategory } = storeCategories();
  const { getCategoryById } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Categories[]>(mockCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pdfRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getCategories();
  //     } catch (err) {
  //       setError("Error al cargar el historial de categorías");
  //       console.error("Error fetching categories:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchCategories();
  // }, [getCategories]);

  // useEffect(() => {
  //   setCategories(listCategories);
  // }, [listCategories]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category?.name?.toLowerCase().includes(search.toLowerCase()) ||
        category?.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const paginatedCategories = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCategories, page, rowsPerPage]);

  const handleDeleteClick = (id: number) => {
    setSelectedCategoryId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategoryId) {
      try {
        //await deleteCategory(selectedCategoryId);
        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) => category.id !== selectedCategoryId
          )
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar la categoría");
        console.error("Error al eliminar la categoría:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getCategories();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (categoryId: number) => {
    try {
      //await getCategoryById(categoryId);
      //navigate(`/inventario/categorias/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles de la categoría");
      console.error(err);
    }
  };

  // Handlers de paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
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

      pdf.save(`Historial_Categorias_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Loading state
  if (loading && categories.length === 0) {
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
          Cargando historial de categorías...
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
              <Category color="primary" />
              <Typography variant="h4" component="h1" fontWeight="600">
                Historial de Categorías
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Gestión y administración de categorías del inventario
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
                placeholder="Buscar por nombre o descripción..."
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
              label={`Total: ${filteredCategories.length} categorías`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Con descripción: ${
                filteredCategories.filter((c) => c.description).length
              }`}
              variant="filled"
              color="info"
            />
            <Chip
              label={`Sin descripción: ${
                filteredCategories.filter((c) => !c.description).length
              }`}
              variant="filled"
              color="warning"
            />
            {filteredCategories.length > 0 && (
              <Chip
                label={`Categorías en esta página: ${paginatedCategories.length}`}
                variant="filled"
                color="secondary"
              />
            )}
          </Box>

          {/* Tabla de categorías */}
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
                  <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Label fontSize="small" />
                      Nombre
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 300 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Description fontSize="small" />
                      Descripción
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Category
                          sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search
                            ? "No se encontraron categorías"
                            : "Aún no se han agregado categorías"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search
                            ? "Intenta ajustar los términos de búsqueda"
                            : "Las categorías aparecerán aquí una vez agregadas"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.02
                          ),
                        },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell
                        sx={{ fontFamily: "monospace", fontWeight: "medium" }}
                      >
                        #{category.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {category.description || (
                            <Chip
                              label="Sin descripción"
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
                                handleViewDetails(category.id ?? 0)
                              }
                              sx={{ borderRadius: 2 }}
                            >
                              Ver
                            </Button>
                          </Tooltip>

                          <Tooltip title="Eliminar categoría">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              onClick={() =>
                                handleDeleteClick(category.id ?? 0)
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
            {filteredCategories.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredCategories.length}
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
          {filteredCategories.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedCategories.length} de{" "}
                {filteredCategories.length} categorías filtradas
                {categories.length !== filteredCategories.length &&
                  ` (de ${categories.length} totales)`}
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
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
      <Snackbar
  open={showNotAvailableMessage}
  autoHideDuration={4000}
  onClose={() => setShowNotAvailableMessage(false)}
  message="La función de ver detalles no está disponible en esta versión."
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
/>
    </Box>
  );
}
