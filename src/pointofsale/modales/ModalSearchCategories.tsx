import {
  Close as CloseIcon,
  Store as StoreIcon,
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
import { useEffect, useState } from "react";
//import { categories } from "../mocks/categoriesMock";
import { storeCategories } from "../../stores/categories.store";

interface ModalSearchToCategoriesProps {
  open: boolean;
  handleClose: () => void;
  handleSelect: (item: any) => void;
}

export const ModalSearchCategories: React.FC<ModalSearchToCategoriesProps> = ({
  open,
  handleClose,
  handleSelect,
}) => {
   const { getCategories, listCategories } = storeCategories();
  const [search, setSearch] = useState("");

     useEffect(() => {
        getCategories();
      }, [getCategories]);

  // Filtrar categorias según el texto de búsqueda
  const filteredCategories = listCategories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Seleccionar Categoría
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
          placeholder="Buscar Categoría..."
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

        {/* Tabla de categorias */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <StoreIcon fontSize="small" />
                </TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell align="center">
                      <StoreIcon color="primary" />
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          handleSelect(category);
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
