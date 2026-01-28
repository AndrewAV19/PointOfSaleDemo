import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Cancel as CancelIcon, Done as DoneIcon } from "@mui/icons-material";


interface ActivarLicenciaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (claveLicencia: string) => Promise<void>;
}

const ActivarLicenciaModal: React.FC<ActivarLicenciaModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [claveLicencia, setClaveLicencia] = useState<string>("");

  const handleConfirm = async () => {
    await onConfirm(claveLicencia);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: "400px",
          width: "100%",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Activar Licencia
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Ingresa la clave de licencia para activar el sistema.
        </Typography>
        <TextField
          fullWidth
          label="Clave de Licencia"
          variant="outlined"
          value={claveLicencia}
          onChange={(e) => setClaveLicencia(e.target.value)}
          sx={{ mb: 3 }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          py: 2,
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #e9ecef",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          sx={{
            px: 4,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          startIcon={<DoneIcon />}
          sx={{
            px: 4,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Activar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivarLicenciaModal;