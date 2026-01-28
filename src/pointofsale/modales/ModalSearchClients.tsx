import {
  Close as CloseIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
//import { storeClients } from "../../stores/clients.store";
import { mockClients } from "../mocks/tiendaAbarrotes.mock";

interface ModalSearchToClientProps {
  open: boolean;
  handleClose: () => void;
  handleSelect: (item: any) => void;
}

export const ModalSearchClients: React.FC<ModalSearchToClientProps> = ({
  open,
  handleClose,
  handleSelect,
}) => {
  //const { getClients, listClients } = storeClients();
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   getClients();
  // }, [getClients]);

  // Filtrar clientes según el texto de búsqueda
  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Seleccionar Cliente
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Campo de búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar cliente..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ marginBottom: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Tabla de clientes */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <PersonIcon fontSize="small" />
                </TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell align="center">
                      <PersonIcon color="primary" />
                    </TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          handleSelect(client);
                          handleClose();
                        }}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="textSecondary">
                      No se encontraron resultados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
