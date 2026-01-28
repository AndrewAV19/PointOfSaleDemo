import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { Cancel as CancelIcon, Done as DoneIcon } from "@mui/icons-material";

interface ConfirmLiquidarModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalAmount: number;
}

const ConfirmLiquidarModal: React.FC<ConfirmLiquidarModalProps> = ({
  open,
  onClose,
  onConfirm,
  totalAmount,
}) => {
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
          Confirmar Liquidación
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Estás a punto de liquidar la cuenta completa por un monto total de:
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{ mb: 3, fontSize: "1.75rem" }}
        >
          ${totalAmount.toFixed(2)}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          ¿Estás seguro de continuar?
        </Typography>
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
          onClick={onConfirm}
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
          Liquidar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLiquidarModal;