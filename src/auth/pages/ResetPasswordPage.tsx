import { useState, ChangeEvent, FormEvent } from "react";
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
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [resetData, setResetData] = useState<ResetPasswordData>({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const steps = ["Ingresa tu email", "Verifica el código", "Nueva contraseña"];
  console.log(codeSent);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setResetData({ ...resetData, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!resetData.email) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Por favor ingresa tu correo electrónico");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    // Simulación de envío de código
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCodeSent(true);
      setActiveStep(1);
      setSnackbarSeverity("success");
      setMessageSnackbar("Código de verificación enviado a tu email");
      setOpenSnackbar(true);
    } catch {
      setSnackbarSeverity("error");
      setMessageSnackbar("Error al enviar el código. Intenta nuevamente.");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!resetData.code) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Por favor ingresa el código de verificación");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    // Simulación de verificación de código
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActiveStep(2);
      setSnackbarSeverity("success");
      setMessageSnackbar("Código verificado correctamente");
      setOpenSnackbar(true);
    } catch {
      setSnackbarSeverity("error");
      setMessageSnackbar("Código incorrecto. Intenta nuevamente.");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!resetData.newPassword || !resetData.confirmPassword) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Por favor completa todos los campos");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Las contraseñas no coinciden");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    if (resetData.newPassword.length < 6) {
      setSnackbarSeverity("error");
      setMessageSnackbar("La contraseña debe tener al menos 6 caracteres");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    // Simulación de cambio de contraseña
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSnackbarSeverity("success");
      setMessageSnackbar("¡Contraseña actualizada correctamente!");
      setOpenSnackbar(true);

      // Redirigir al login después de éxito
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch {
      setSnackbarSeverity("error");
      setMessageSnackbar("Error al actualizar la contraseña");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSendCode} noValidate>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={3}
            >
              Ingresa tu correo electrónico y te enviaremos un código de
              verificación
            </Typography>

            <TextField
              fullWidth
              name="email"
              label="Correo Electrónico"
              type="email"
              value={resetData.email}
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
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              size="large"
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #1976d2 0%, #303f9f 100%)",
                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 12px 35px rgba(25, 118, 210, 0.4)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Enviar Código"
              )}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyCode} noValidate>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={3}
            >
              Hemos enviado un código de 6 dígitos a {resetData.email}
            </Typography>

            <TextField
              fullWidth
              name="code"
              label="Código de Verificación"
              type="text"
              value={resetData.code}
              onChange={handleChange}
              margin="normal"
              disabled={isLoading}
              required
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 3 }}
            />

            <Box display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                Atrás
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #303f9f 100%)",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verificar Código"
                )}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword} noValidate>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={3}
            >
              Crea una nueva contraseña para tu cuenta
            </Typography>

            <TextField
              fullWidth
              name="newPassword"
              label="Nueva Contraseña"
              type={showPassword ? "text" : "password"}
              value={resetData.newPassword}
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type={showConfirmPassword ? "text" : "password"}
              value={resetData.confirmPassword}
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
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Box display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                Atrás
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #303f9f 100%)",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Actualizar Contraseña"
                )}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
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
      {/* Elementos decorativos de fondo */}
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

      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Zoom in timeout={600}>
          <Card
            elevation={16}
            sx={{
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.95)",
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              {/* Header */}
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #303f9f 100%)",
                    mb: 2,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color="text.primary"
                  gutterBottom
                >
                  Recuperar Contraseña
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sigue los pasos para restablecer tu contraseña
                </Typography>
              </Box>

              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Form Content */}
              <Fade in timeout={400}>
                <Paper elevation={0} sx={{ background: "transparent" }}>
                  {renderStepContent(activeStep)}
                </Paper>
              </Fade>

              {/* Back to Login */}
              <Box textAlign="center" mt={4}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                  sx={{
                    textTransform: "none",
                    color: "text.secondary",
                  }}
                >
                  Volver al inicio de sesión
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Container>

      {/* Snackbar de notificaciones */}
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
    </Box>
  );
};

export default ResetPasswordPage;
