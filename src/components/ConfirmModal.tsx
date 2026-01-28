import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
interface ConfirmDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly message: string;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
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
        id="confirm-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          py: 2,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 3, textAlign: "center" }}>
        <Typography
          id="confirm-dialog-description"
          variant="body1"
          color="text.secondary"
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          py: 2,
          px: 3,
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #e9ecef",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          startIcon={<CloseIcon />}
          sx={{
            px: 4,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          sx={{
            px: 4,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
