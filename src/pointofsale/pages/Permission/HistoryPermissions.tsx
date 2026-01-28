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
  Security,
  Description,
  Badge,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { storePermissions } from "../../../stores/permissions.store";
import { Permission } from "../../interfaces/permissions.interface";

export default function HistoryPermissions() {
  const { listPermissions, getPermissions, deletePermission } = storePermissions();
  const navigate = useNavigate();
  const theme = useTheme();

  // Estados
  const [search, setSearch] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(listPermissions);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pdfRef = useRef<HTMLDivElement>(null);

  // Configuración de tipos de permisos
  const permissionTypeConfig = {
    create: {
      label: "CREAR",
      color: "success" as const,
    },
    read: {
      label: "LEER",
      color: "info" as const,
    },
    update: {
      label: "ACTUALIZAR",
      color: "warning" as const,
    },
    delete: {
      label: "ELIMINAR",
      color: "error" as const,
    },
    manage: {
      label: "GESTIONAR",
      color: "primary" as const,
    },
    admin: {
      label: "ADMIN",
      color: "secondary" as const,
    }
  };

  // Efectos
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);
        await getPermissions();
      } catch (err) {
        setError("Error al cargar el historial de permisos");
        console.error("Error fetching permissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [getPermissions]);

  useEffect(() => {
    setPermissions(listPermissions);
  }, [listPermissions]);

  // Resetear paginación cuando cambia la búsqueda
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Filtrado memoizado
  const filteredPermissions = useMemo(() => {
    return permissions.filter(
      (permission) =>
        permission?.name?.toLowerCase().includes(search.toLowerCase()) ||
        permission?.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [permissions, search]);

  // Datos paginados
  const paginatedPermissions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPermissions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPermissions, page, rowsPerPage]);

  // Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedPermissionId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPermissionId) {
      try {
        await deletePermission(selectedPermissionId);
        setPermissions((prevPermissions) =>
          prevPermissions.filter((permission) => permission.id !== selectedPermissionId)
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar el permiso");
        console.error("Error al eliminar el permiso:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await getPermissions();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (permissionId: number) => {
    navigate(`/permisos/editar/${permissionId}`);
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

      pdf.save(`Historial_Permisos_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Detectar tipo de permiso basado en el nombre
  const detectPermissionType = (permissionName: string) => {
    const name = permissionName.toLowerCase();
    
    if (name.includes('.create') || name.includes('.write')) return 'create';
    if (name.includes('.read') || name.includes('.view')) return 'read';
    if (name.includes('.update') || name.includes('.edit')) return 'update';
    if (name.includes('.delete') || name.includes('.remove')) return 'delete';
    if (name.includes('.manage') || name.includes('.admin')) return 'manage';
    if (name.includes('admin') || name.includes('super')) return 'admin';
    
    return 'manage';
  };

  const getPermissionTypeColor = (permissionName: string) => {
    const type = detectPermissionType(permissionName);
    return permissionTypeConfig[type]?.color || 'default';
  };

  const getPermissionTypeLabel = (permissionName: string) => {
    const type = detectPermissionType(permissionName);
    return permissionTypeConfig[type]?.label || 'PERMISO';
  };

  // Contar permisos por tipo
  const countPermissionsByType = () => {
    const counts = {
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
      manage: 0,
      admin: 0
    };

    filteredPermissions.forEach(permission => {
      const type = detectPermissionType(permission.name);
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });

    return counts;
  };

  const permissionCounts = countPermissionsByType();

  // Loading state
  if (loading && permissions.length === 0) {
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
          Cargando historial de permisos...
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
              <Security color="primary" />
              <Typography variant="h4" component="h1" fontWeight="600">
                Historial de Permisos
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Gestión y administración de permisos del sistema
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
              label={`Total: ${filteredPermissions.length} permisos`}
              variant="outlined"
              color="primary"
            />
            {permissionCounts.create > 0 && (
              <Chip
                label={`Crear: ${permissionCounts.create}`}
                variant="filled"
                color="success"
                size="small"
              />
            )}
            {permissionCounts.read > 0 && (
              <Chip
                label={`Leer: ${permissionCounts.read}`}
                variant="filled"
                color="info"
                size="small"
              />
            )}
            {permissionCounts.update > 0 && (
              <Chip
                label={`Actualizar: ${permissionCounts.update}`}
                variant="filled"
                color="warning"
                size="small"
              />
            )}
            {permissionCounts.delete > 0 && (
              <Chip
                label={`Eliminar: ${permissionCounts.delete}`}
                variant="filled"
                color="error"
                size="small"
              />
            )}
            {permissionCounts.manage > 0 && (
              <Chip
                label={`Gestionar: ${permissionCounts.manage}`}
                variant="filled"
                color="primary"
                size="small"
              />
            )}
            {permissionCounts.admin > 0 && (
              <Chip
                label={`Admin: ${permissionCounts.admin}`}
                variant="filled"
                color="secondary"
                size="small"
              />
            )}
          </Box>

          {/* Tabla de permisos */}
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
                      <Security fontSize="small" />
                      Nombre del Permiso
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 150 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge fontSize="small" />
                      Tipo
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 300 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Description fontSize="small" />
                      Descripción
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 120 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge fontSize="small" />
                      Roles Asignados
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search
                            ? "No se encontraron permisos"
                            : "Aún no se han agregado permisos"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search
                            ? "Intenta ajustar los términos de búsqueda"
                            : "Los permisos aparecerán aquí una vez agregados"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPermissions.map((permission) => (
                    <TableRow
                      key={permission.id}
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
                        #{permission.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500" fontFamily="monospace">
                          {permission.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getPermissionTypeLabel(permission.name)}
                          color={getPermissionTypeColor(permission.name)}
                          size="small"
                          variant="filled"
                          sx={{
                            fontSize: "0.7rem",
                            height: 24,
                            fontWeight: "600",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {permission.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {permission.roles?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {permission.roles?.length === 1 ? 'rol' : 'roles'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Ver detalles">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewDetails(permission.id)}
                              sx={{ borderRadius: 2 }}
                            >
                              Ver
                            </Button>
                          </Tooltip>

                          <Tooltip title="Eliminar permiso">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteClick(permission.id)}
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
            {filteredPermissions.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredPermissions.length}
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
          {filteredPermissions.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedPermissions.length} de {filteredPermissions.length}{" "}
                permisos filtrados
                {permissions.length !== filteredPermissions.length &&
                  ` (de ${permissions.length} totales)`}
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
        message="¿Estás seguro de que deseas eliminar este permiso? Esta acción afectará a los roles que tengan este permiso asignado y no se puede deshacer."
      />
    </Box>
  );
}