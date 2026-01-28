import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  Divider,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import { useLocation } from "react-router-dom";

const PendingPaymentsClient: React.FC = () => {
  const { clientDebts } = dataStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const clientName = location.state?.clientName || "Cliente no especificado";

  const [payments, setPayments] = useState(clientDebts);
  const [search, setSearch] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  console.log(setPayments);
  useEffect(() => {
    const total = payments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );
    const paid = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    const remaining = total - paid;

    setTotalAmount(total);
    setPaidAmount(paid);
    setRemainingBalance(remaining);
  }, [payments]);

  const filteredProducts = payments.flatMap((payment) =>
    payment.products
      .filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((product) => ({ ...product, client: payment.client }))
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Botón regresar */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
          }}
        >
          Regresar
        </Button>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 1, color: theme.palette.primary.main }}
        >
          Adeudos Pendientes de {clientName}
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary", mb: 4 }}
        >
          Consulta los productos con pagos pendientes.
        </Typography>

        <TextField
          fullWidth
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3, borderRadius: 2 }}
        />

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Imagen
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Cantidad
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Precio
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No hay productos que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Card
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Card>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    ${(product.quantity * product.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 4 }} />

        {/* Totales */}
        <Card
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}20)`,
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            label="Total"
            value={`$${totalAmount.toFixed(2)}`}
            disabled
            sx={{
              width: 150,
              backgroundColor: "white",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Pagado"
            value={`$${paidAmount.toFixed(2)}`}
            disabled
            sx={{
              width: 150,
              backgroundColor: "white",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Faltante"
            value={`$${remainingBalance.toFixed(2)}`}
            disabled
            sx={{
              width: 150,
              backgroundColor: "white",
              borderRadius: 2,
            }}
          />
        </Card>
      </Paper>
    </Container>
  );
};

export default PendingPaymentsClient;
