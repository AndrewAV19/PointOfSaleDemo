import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  IconButton,
  CircularProgress,
  alpha
} from "@mui/material";
import { Delete as DeleteIcon, Close as CloseIcon, Warning as WarningIcon } from "@mui/icons-material";

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly severity?: "error" | "warning" | "info";
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function ConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  severity = "error",
  loading = false,
  disabled = false,
  maxWidth = "sm"
}: ConfirmDialogProps) {
  
  const getSeverityConfig = () => {
    const configs = {
      error: {
        color: "#d32f2f",
        lightColor: "#fdeded",
        icon: <DeleteIcon />,
        gradient: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
        darkGradient: "linear-gradient(135deg, #c62828 0%, #b71c1c 100%)"
      },
      warning: {
        color: "#ed6c02",
        lightColor: "#fff4e5",
        icon: <WarningIcon />,
        gradient: "linear-gradient(135deg, #ed6c02 0%, #f57c00 100%)",
        darkGradient: "linear-gradient(135deg, #e65100 0%, #d84315 100%)"
      },
      info: {
        color: "#0288d1",
        lightColor: "#e3f2fd",
        icon: <WarningIcon />,
        gradient: "linear-gradient(135deg, #0288d1 0%, #029be5 100%)",
        darkGradient: "linear-gradient(135deg, #0277bd 0%, #01579b 100%)"
      }
    };
    return configs[severity] || configs.error;
  };

  const severityConfig = getSeverityConfig();

  const handleConfirm = () => {
    if (!loading && !disabled) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth={maxWidth}
      fullWidth
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(4px)",
        },
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1)",
          margin: { xs: 2, sm: 4 },
          width: { xs: "calc(100% - 32px)", sm: "auto" },
          overflow: "hidden",
          background: "white",
          backgroundImage: `
            radial-gradient(at top left, ${alpha(severityConfig.color, 0.03)} 0%, transparent 50%),
            radial-gradient(at top right, ${alpha(severityConfig.color, 0.03)} 0%, transparent 50%),
            radial-gradient(at bottom left, ${alpha(severityConfig.color, 0.02)} 0%, transparent 50%)
          `,
        },
      }}
    >
      {/* Header con gradiente sutil */}
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${severityConfig.lightColor} 0%, ${alpha(severityConfig.lightColor, 0.7)} 100%)`,
          borderBottom: `1px solid ${alpha(severityConfig.color, 0.1)}`,
          py: 2.5,
          px: 3.5,
          gap: 1,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${alpha(severityConfig.color, 0.2)} 50%, transparent 100%)`,
          }
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: severityConfig.gradient,
              color: "white",
              boxShadow: `0 6px 16px ${alpha(severityConfig.color, 0.3)}`,
            }}
          >
            {severityConfig.icon}
          </Box>
          <Typography 
            variant="h6" 
            fontWeight={600}
            sx={{
              background: `linear-gradient(135deg, ${severityConfig.color} 0%, ${alpha(severityConfig.color, 0.8)} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.25rem",
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          size="small" 
          disabled={loading}
          sx={{ 
            color: "text.secondary",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            width: 32,
            height: 32,
            borderRadius: "8px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
              transform: "rotate(90deg)",
              color: "text.primary",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Contenido con tipografía mejorada */}
      <DialogContent sx={{ py: 4, px: 3.5 }}>
        <Box textAlign="center" sx={{ px: 1, mt: 2 }}>
          <Typography 
            id="confirm-dialog-description" 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              lineHeight: 1.7,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>

      {/* Acciones con botones elegantes */}
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          py: 3,
          px: 3.5,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          borderTop: `1px solid ${alpha("#000", 0.06)}`,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={loading}
          startIcon={<CloseIcon />}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            minWidth: { xs: "100%", sm: "140px" },
            order: { xs: 2, sm: 1 },
            border: "1.5px solid",
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "text.secondary",
            backgroundColor: "white",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "rgba(0, 0, 0, 0.2)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            "&:disabled": {
              opacity: 0.5,
              transform: "none",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={disabled || loading}
          startIcon={loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <DeleteIcon />}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            boxShadow: `0 4px 20px ${alpha(severityConfig.color, 0.3)}`,
            minWidth: { xs: "100%", sm: "140px" },
            order: { xs: 1, sm: 2 },
            background: severityConfig.gradient,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: `0 6px 24px ${alpha(severityConfig.color, 0.4)}`,
              transform: "translateY(-2px)",
              background: severityConfig.darkGradient,
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.26)",
              boxShadow: "none",
              transform: "none",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transition: "left 0.5s",
            },
            "&:hover::before": {
              left: "100%",
            },
          }}
        >
          {loading ? "Procesando..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}