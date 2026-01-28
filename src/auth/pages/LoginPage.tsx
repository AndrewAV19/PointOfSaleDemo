import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { LoginResponse } from "../interfaces/loginResponse.interface";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Fade,
  Zoom,
  Container,
  Divider,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Store,
  SupportAgent,
  HelpOutline,
  Security,
  Business,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ActivarLicenciaModal from "../../pointofsale/modales/ModalActivarLicencia";
import { mockLicenciaService } from "../mocks/Licencia.mock";
import { mockAuthService } from "../mocks/AuthService.mock";

interface Credentials {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("error");
  const [openActivarLicenciaModal, setOpenActivarLicenciaModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const whatsappNumber = "3931023952";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleContactSupport = () => {
    const message = "Hola, necesito ayuda con el sistema de punto de venta.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!credentials.username || !credentials.password) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Debes llenar todos los campos");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    try {
      const licenciaActivada = await mockLicenciaService.verificarActivacion();

      if (!licenciaActivada) {
        setSnackbarSeverity("error");
        setMessageSnackbar("Aún no has activado la licencia");
        setOpenSnackbar(true);
        setOpenActivarLicenciaModal(true);
        setIsLoading(false);
        return;
      }

      const response: LoginResponse = await mockAuthService.login({
        email: credentials.username,
        password: credentials.password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("id_usuario", response.id.toString());
      localStorage.setItem("name_usuario", response.nombre);
      localStorage.setItem("loginTime", new Date().toISOString());
      localStorage.setItem("roles", JSON.stringify(response.roles));
      localStorage.setItem("permissions", JSON.stringify(response.permissions));

      setSnackbarSeverity("success");
      setMessageSnackbar(`¡Bienvenido, ${response.nombre}!`);
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setSnackbarSeverity("error");
      setMessageSnackbar("Email o contraseña incorrectos");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleActivarLicencia = async (claveLicencia: string) => {
    try {
      setIsLoading(true);
      await mockLicenciaService.activarLicencia(claveLicencia);
      setSnackbarSeverity("success");
      setMessageSnackbar("✅ Licencia activada correctamente");
      setOpenSnackbar(true);
      setOpenActivarLicenciaModal(false);
    } catch (error) {
      console.error("Error al activar la licencia:", error);
      setSnackbarSeverity("error");
      setMessageSnackbar(
        "❌ Error al activar la licencia. Usa la clave: 123456",
      );
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverPassword = () => {
    setSnackbarSeverity("info");
    setMessageSnackbar("Funcionalidad de recuperación en desarrollo");
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        position: "relative",
        overflow: "hidden",
        py: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          maxWidth: 800,
          maxHeight: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          top: "-20%",
          left: "-10%",
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          maxWidth: 500,
          maxHeight: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
          bottom: "-10%",
          right: "-5%",
          animation: "float 15s ease-in-out infinite reverse",
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Card
          elevation={16}
          sx={{
            display: "flex",
            overflow: "hidden",
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #303f9f 100%)",
                color: "white",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                }}
              />

              <Zoom in timeout={800} style={{ transitionDelay: "100ms" }}>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      mb: 3,
                      overflow: "hidden",
                    }}
                  >
                    <img src="/Images/logo-pv.png" alt="Logo" style={{}} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Mi Punto de Venta
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.9,
                      maxWidth: 320,
                      mx: "auto",
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    Solución integral para la gestión de ventas, inventario y
                    crecimiento de su negocio.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Security sx={{ fontSize: 16, opacity: 0.8 }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Modo Mock
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Business sx={{ fontSize: 16, opacity: 0.8 }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Credenciales de prueba
                      </Typography>
                    </Box>
                  </Box>

                  {/* Información de usuarios de prueba */}
                  <Box
                    sx={{
                      mt: 4,
                      p: 2,
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.9, display: "block", mb: 1 }}
                    >
                      Usuarios de prueba:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.8, fontSize: "0.75rem" }}
                    >
                      admin@correo.com / 123 (Administrador)
                    </Typography>
                    <br />
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.8, fontSize: "0.75rem" }}
                    >
                      empleado@correo.com / 123 (Empleado)
                    </Typography>
                  </Box>
                </Box>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{ height: "100%", background: "transparent" }}
              >
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Fade in timeout={600} style={{ transitionDelay: "200ms" }}>
                    <Box>
                      <Box textAlign="center" mb={4}>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color="text.primary"
                          gutterBottom
                        >
                          Acceso al Sistema
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ingrese sus credenciales para continuar
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          (Modo de prueba - sin base de datos)
                        </Typography>
                      </Box>

                      <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                          fullWidth
                          name="username"
                          label="Correo Electrónico"
                          type="email"
                          value={credentials.username}
                          onChange={handleChange}
                          margin="normal"
                          disabled={isLoading}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                          placeholder="admin@correo.com"
                        />
                        <TextField
                          fullWidth
                          name="password"
                          label="Contraseña"
                          type={showPassword ? "text" : "password"}
                          value={credentials.password}
                          onChange={handleChange}
                          margin="normal"
                          disabled={isLoading}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: "primary.main" }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                  edge="end"
                                  disabled={isLoading}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 1 }}
                          placeholder="123"
                        />

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={isLoading}
                          size="large"
                          sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: "1rem",
                            background:
                              "linear-gradient(135deg, #1976d2 0%, #303f9f 100%)",
                            boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                            "&:hover": {
                              boxShadow: "0 12px 35px rgba(25, 118, 210, 0.4)",
                              transform: "translateY(-1px)",
                            },
                            "&:disabled": {
                              background: "grey.300",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Iniciar Sesión (Mock)"
                          )}
                        </Button>
                      </Box>

                      <Divider sx={{ my: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Soporte
                        </Typography>
                      </Divider>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Button
                          startIcon={<HelpOutline />}
                          onClick={handleRecoverPassword}
                          disabled={isLoading}
                          sx={{
                            textTransform: "none",
                            color: "text.secondary",
                          }}
                        >
                          Recuperar contraseña
                        </Button>

                        <Button
                          startIcon={<SupportAgent />}
                          onClick={handleContactSupport}
                          disabled={isLoading}
                          sx={{
                            textTransform: "none",
                            color: "text.secondary",
                          }}
                        >
                          Soporte técnico
                        </Button>
                      </Box>

                      <Box mt={4} textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                          <Store
                            sx={{
                              fontSize: 14,
                              mr: 0.5,
                              verticalAlign: "middle",
                            }}
                          />
                          Mi Punto de Venta v2.0.1 © {new Date().getFullYear()}
                          <br />
                          <Typography variant="caption" color="primary">
                            Versión Mock - Sin conexión a BD
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                </CardContent>
              </Paper>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{
            borderRadius: 2,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          {messageSnackbar}
        </Alert>
      </Snackbar>

      <ActivarLicenciaModal
        open={openActivarLicenciaModal}
        onClose={() => setOpenActivarLicenciaModal(false)}
        onConfirm={handleActivarLicencia}
      />
    </Box>
  );
};

export default LoginPage;
