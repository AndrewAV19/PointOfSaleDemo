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
  Badge,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
//import { storeUsers } from "../../../stores/users.store";
import { dataStore } from "../../../stores/generalData.store";
import type { Users, Role } from "../../interfaces/users.interface";
import { mockUsers } from "../../mocks/tiendaAbarrotes.mock";
import { Snackbar } from "@mui/material";

export default function HistoryUsers() {
  //const { listUsers, getUsers, deleteUser } = storeUsers();
  const { getUserById } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();

  // Estados
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Users[]>(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotAvailableMessage, setShowNotAvailableMessage] = useState(false);
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pdfRef = useRef<HTMLDivElement>(null);

  // Configuración de roles
  const roleConfig = {
    ROLE_USER: {
      label: "EMPLEADO",
      color: "primary" as const,
      icon: <Badge fontSize="small" />,
    },
    ROLE_ADMIN: {
      label: "ADMINISTRADOR",
      color: "secondary" as const,
      icon: <Badge fontSize="small" />,
    },
  };

  // Función para normalizar los roles sin importar cómo vengan
  const normalizeRoles = (user: Users): Role[] => {
    // Si roles es un array de objetos Role completos
    if (user.roles && user.roles.length > 0 && typeof user.roles[0] === 'object') {
      return user.roles as Role[];
    }
    
    // Si roles es un array de números (IDs) y tenemos roleNames
    if (user.roles && user.roles.length > 0 && typeof user.roles[0] === 'number' && user.roleNames) {
      return (user.roles as number[]).map((roleId, index) => ({
        id: roleId,
        name: user.roleNames![index] || `ROL_${roleId}`,
        description: `Rol con ID ${roleId}`
      }));
    }
    
    // Si tenemos roleNames pero no roles array
    if (user.roleNames && user.roleNames.length > 0) {
      return user.roleNames.map((roleName, index) => ({
        id: index + 1, // ID temporal
        name: roleName,
        description: `Rol ${roleName}`
      }));
    }
    
    // Caso por defecto - sin roles
    return [];
  };

  // Efectos
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       await getUsers();
  //     } catch (err) {
  //       setError("Error al cargar el historial de usuarios");
  //       console.error("Error fetching users:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUsers();
  // }, [getUsers]);

  // useEffect(() => {
  //   setUsers(listUsers);
  // }, [listUsers]);

  // Resetear paginación cuando cambia la búsqueda
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Filtrado memoizado
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        user?.phone?.includes(search)
    );
  }, [users, search]);

  // Datos paginados
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  // Handlers
  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      try {
        //await deleteUser(selectedUserId);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUserId)
        );
        setOpenDialog(false);
      } catch (error) {
        setError("Error al eliminar el usuario");
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      //await getUsers();
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId: number) => {
    try {
      // await getUserById(userId);
      // navigate(`/usuarios/editar`);
      setShowNotAvailableMessage(true);
    } catch (err) {
      setError("Error al cargar los detalles del usuario");
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

      pdf.save(`Historial_Usuarios_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  // Formateador de rol
  const formatRoleName = (roleName: string) => {
    return roleConfig[roleName as keyof typeof roleConfig]?.label || roleName;
  };

  const getRoleColor = (roleName: string) => {
    return roleConfig[roleName as keyof typeof roleConfig]?.color || "default";
  };

  // Funciones auxiliares para contar roles
  const countAdmins = useMemo(() => {
    return filteredUsers.filter((user) => 
      normalizeRoles(user).some((role) => role.name === "ROLE_ADMIN")
    ).length;
  }, [filteredUsers]);

  const countEmployees = useMemo(() => {
    return filteredUsers.filter((user) => 
      normalizeRoles(user).some((role) => role.name === "ROLE_USER")
    ).length;
  }, [filteredUsers]);

  // Loading state
  if (loading && users.length === 0) {
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
          Cargando historial de usuarios...
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
              <Person color="primary" />
              <Typography variant="h4" component="h1" fontWeight="600">
                Historial de Usuarios
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Gestión y administración de usuarios del sistema
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
                placeholder="Buscar por nombre, email o teléfono..."
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
              label={`Total: ${filteredUsers.length} usuarios`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Administradores: ${countAdmins}`}
              variant="filled"
              color="secondary"
            />
            <Chip
              label={`Empleados: ${countEmployees}`}
              variant="filled"
              color="primary"
            />
          </Box>

          {/* Tabla de usuarios */}
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
                  <TableCell sx={{ fontWeight: "600", minWidth: 150 }}>
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
                  <TableCell sx={{ fontWeight: "600", minWidth: 130 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone fontSize="small" />
                      Teléfono
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn fontSize="small" />
                      Dirección
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 150 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge fontSize="small" />
                      Roles
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search
                            ? "No se encontraron usuarios"
                            : "Aún no se han agregado usuarios"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search
                            ? "Intenta ajustar los términos de búsqueda"
                            : "Los usuarios aparecerán aquí una vez agregados"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => {
                    const userRoles = normalizeRoles(user);
                    return (
                      <TableRow
                        key={user.id}
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
                          #{user.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {user.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.phone || "No especificado"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.address || "No especificada"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            {userRoles.length > 0 ? (
                              userRoles.map((role) => (
                                <Chip
                                  key={role.id}
                                  label={formatRoleName(role.name)}
                                  color={getRoleColor(role.name)}
                                  size="small"
                                  variant="filled"
                                  sx={{
                                    fontSize: "0.7rem",
                                    height: 24,
                                    mb: 0.5,
                                  }}
                                />
                              ))
                            ) : (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                fontStyle="italic"
                              >
                                Sin roles asignados
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalles">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => handleViewDetails(user.id)}
                                sx={{ borderRadius: 2 }}
                              >
                                Ver
                              </Button>
                            </Tooltip>

                            <Tooltip title="Eliminar usuario">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteClick(user.id)}
                                sx={{ borderRadius: 2 }}
                              >
                                Eliminar
                              </Button>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Paginación */}
            {filteredUsers.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredUsers.length}
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
          {filteredUsers.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedUsers.length} de {filteredUsers.length}{" "}
                usuarios filtrados
                {users.length !== filteredUsers.length &&
                  ` (de ${users.length} totales)`}
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
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
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