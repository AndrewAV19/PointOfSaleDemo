import { useEffect, useState, useRef, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import {
  Search,
  Download,
  Refresh,
  Delete,
  Edit,
  Security,
  Badge,
  Group,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { storeRoles } from "../../../stores/roles.store";
import { storePermissions } from "../../../stores/permissions.store";
import { Role, RoleRequest } from "../../interfaces/roles.interface";
import { Permission } from "../../interfaces/permissions.interface";

export default function RolesManagement() {
  const { listRoles, getRoles, deleteRole, createRole, updateRole } =
    storeRoles();
  const { listPermissions, getPermissions } = storePermissions();
  const theme = useTheme();

  // Estados
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<Role[]>(listRoles);
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<RoleRequest>({
    name: "",
    description: "",
    permissionIds: [],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pdfRef = useRef<HTMLDivElement>(null);

  // Función para obtener color del rol (funciona con cualquier rol de la BD)
  const getRoleColor = (
    roleName: string
  ): "primary" | "secondary" | "success" | "error" | "warning" | "info" => {
    // Roles comunes con colores específicos para mejor UX
    const roleColorMap: Record<
      string,
      "primary" | "secondary" | "success" | "error" | "warning" | "info"
    > = {
      // Roles de administración - rojo/error
      ROLE_ADMIN: "error",
      ROLE_SUPER_ADMIN: "error",
      ROLE_ROOT: "error",

      // Roles de gestión - naranja/warning
      ROLE_MANAGER: "warning",
      ROLE_SUPERVISOR: "warning",
      ROLE_LEAD: "warning",

      // Roles de usuario base - azul/primary
      ROLE_USER: "primary",
      ROLE_EMPLOYEE: "primary",
      ROLE_MEMBER: "primary",

      // Roles limitados - morado/secondary
      ROLE_GUEST: "secondary",
      ROLE_VIEWER: "secondary",
      ROLE_READONLY: "secondary",

      // Roles técnicos - verde/success
      ROLE_DEVELOPER: "success",
      ROLE_TESTER: "success",
      ROLE_ANALYST: "success",

      // Roles de apoyo - azul claro/info
      ROLE_SUPPORT: "info",
      ROLE_HELPDESK: "info",
      ROLE_AUDITOR: "info",
    };

    // Si encontramos el rol en el mapa, usar ese color
    if (roleColorMap[roleName]) {
      return roleColorMap[roleName];
    }

    // Para roles desconocidos, generar color consistente basado en hash
    const availableColors: (
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "warning"
      | "info"
    )[] = ["primary", "secondary", "success", "error", "warning", "info"];

    let hash = 0;
    for (let i = 0; i < roleName.length; i++) {
      hash = (hash << 5) - hash + roleName.charCodeAt(i);
    }

    return availableColors[Math.abs(hash) % availableColors.length];
  };

  // Función para formatear el nombre del rol
  const formatRoleName = (roleName: string) => {
    return roleName
      .replace(/^ROLE_/, "")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([getRoles(), loadPermissions()]);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getRoles]);

  const loadPermissions = async () => {
    try {
      setLoadingPermissions(true);

      const currentPermissions = listPermissions;
      if (currentPermissions.length > 0) {
        setAvailablePermissions(currentPermissions);
        return;
      }

      await getPermissions();
      const permissions = listPermissions;
      setAvailablePermissions(permissions);
    } catch (error) {
      console.error("Error loading permissions:", error);
      setError("Error al cargar los permisos");
    } finally {
      setLoadingPermissions(false);
    }
  };

  useEffect(() => {
    setRoles(listRoles);
  }, [listRoles]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role?.name?.toLowerCase().includes(search.toLowerCase()) ||
        role?.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  const paginatedRoles = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRoles.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRoles, page, rowsPerPage]);

  const handleDeleteClick = (id: number) => {
    setSelectedRoleId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRoleId) {
      try {
        await deleteRole(selectedRoleId);
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.id !== selectedRoleId)
        );
        setOpenDialog(false);
        setSuccess("Rol eliminado correctamente");
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        setError("Error al eliminar el rol");
        console.error("Error al eliminar el rol:", error);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([getRoles(), loadPermissions()]);
      setSuccess("Datos actualizados correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al actualizar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissionIds: role.permissions?.map((p) => p.id) || [],
    });
    setOpenFormDialog(true);
  };

  const handleFormSubmit = async () => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id ?? 0, formData);
        setSuccess("Rol actualizado correctamente");
      } else {
        await createRole(formData);
        setSuccess("Rol creado correctamente");
      }
      setOpenFormDialog(false);
      await getRoles(); // Refrescar la lista
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Error al ${editingRole ? "actualizar" : "crear"} el rol`);
      console.error(
        `Error ${editingRole ? "updating" : "creating"} role:`,
        error
      );
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
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

      pdf.save(`Gestion_Roles_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      setError("Error al exportar el PDF");
      console.error("Error exporting PDF:", error);
    }
  };

  if (loading && roles.length === 0) {
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
          Cargando gestión de roles...
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
                Gestión de Roles
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant="body1" color="textSecondary">
              Administración y configuración de roles del sistema
            </Typography>
          }
          action={
            <Box display="flex" gap={1}>
              <Tooltip title="Actualizar datos">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
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

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setSuccess(null)}
            >
              {success}
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
              variant="outlined"
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
              label={`Total: ${filteredRoles.length} roles`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Administradores: ${
                filteredRoles.filter((r) => r.name === "ROLE_ADMIN").length
              }`}
              variant="filled"
              color="error"
            />
            <Chip
              label={`Empleados: ${
                filteredRoles.filter((r) => r.name === "ROLE_USER").length
              }`}
              variant="filled"
              color="primary"
            />
          </Box>

          {/* Tabla de roles */}
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
                      <Badge fontSize="small" />
                      Nombre
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 250 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Security fontSize="small" />
                      Descripción
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Group fontSize="small" />
                      Tipo de Rol
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 200 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Security fontSize="small" />
                      Permisos
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", minWidth: 180 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          gutterBottom
                        >
                          {search
                            ? "No se encontraron roles"
                            : "Aún no se han agregado roles"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {search
                            ? "Intenta ajustar los términos de búsqueda"
                            : "Los roles aparecerán aquí una vez agregados"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRoles.map((role) => (
                    <TableRow
                      key={role.id}
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
                        #{role.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {role.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {role.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatRoleName(role.name)}
                          color={getRoleColor(role.name)}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: "600",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          {role.permissions?.slice(0, 3).map((permission) => (
                            <Chip
                              key={permission.id}
                              label={permission.name}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.7rem",
                                height: 22,
                              }}
                            />
                          ))}
                          {role.permissions && role.permissions.length > 3 && (
                            <Tooltip
                              title={
                                <Box>
                                  {role.permissions?.slice(3).map((p) => (
                                    <div key={p.id}>{p.name}</div>
                                  ))}
                                </Box>
                              }
                            >
                              <Chip
                                label={`+${role.permissions.length - 3} más`}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: "0.7rem",
                                  height: 22,
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip
                            title={
                              role.name === "ROLE_ADMIN"
                                ? "No se puede editar el rol de administrador"
                                : "Editar rol"
                            }
                          >
                            <span>
                              {" "}
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => handleEditClick(role)}
                                sx={{ borderRadius: 2 }}
                                disabled={role.name === "ROLE_ADMIN"}
                              >
                                Editar
                              </Button>
                            </span>
                          </Tooltip>

                          <Tooltip
                            title={
                              role.name === "ROLE_ADMIN"
                                ? "No se puede eliminar el rol de administrador"
                                : role.users && role.users.length > 0
                                ? "No se puede eliminar un rol con usuarios asignados"
                                : "Eliminar rol"
                            }
                          >
                            <span>
                              {" "}
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteClick(role.id ?? 0)}
                                sx={{ borderRadius: 2 }}
                                disabled={
                                  role.name === "ROLE_ADMIN" ||
                                  (role.users && role.users.length > 0)
                                }
                              >
                                Eliminar
                              </Button>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Paginación */}
            {filteredRoles.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredRoles.length}
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
          {filteredRoles.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Mostrando {paginatedRoles.length} de {filteredRoles.length}{" "}
                roles filtrados
                {roles.length !== filteredRoles.length &&
                  ` (de ${roles.length} totales)`}
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

      {/* Dialog de confirmación de eliminación */}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
      />

      {/* Dialog de formulario para crear/editar */}
      <Dialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              label="Nombre del Rol"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ej: ROLE_ADMIN, ROLE_MANAGER"
              fullWidth
            />

            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descripción del rol y sus permisos"
              fullWidth
              multiline
              rows={3}
            />

            <Typography variant="h6" gutterBottom>
              Permisos {loadingPermissions && "(Cargando...)"}
            </Typography>

            <Grid container spacing={2}>
              {availablePermissions.map((permission) => (
                <Grid item xs={12} sm={6} md={4} key={permission.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.permissionIds.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {permission.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {permission.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>

            {availablePermissions.length === 0 && !loadingPermissions && (
              <Alert severity="warning">
                No hay permisos disponibles. Contacta al administrador.
              </Alert>
            )}

            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={`${formData.permissionIds.length} permisos seleccionados`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={!formData.name || !formData.description}
          >
            {editingRole ? "Actualizar" : "Crear"} Rol
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
