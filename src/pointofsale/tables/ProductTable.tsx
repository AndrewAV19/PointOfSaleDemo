import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  Chip,
  Box,
  Avatar,
  Skeleton,
  Tooltip,
  TablePagination,
  useTheme,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { Product } from "../interfaces/product.interface";

interface ProductListProps {
  products: Product[];
  onSelect: (product: Product) => void;
  showPrice: boolean;
  loading?: boolean;
  itemsPerPage?: number;
  disabled?: boolean;
}

export const ProductTable: React.FC<ProductListProps> = ({
  products,
  onSelect,
  showPrice,
  loading = false,
  itemsPerPage = 10,
  disabled = false,
}) => {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);

  const handleSelectProduct = (product: Product) => {
    if (!isProductDisabled(product)) {
      onSelect(product);
    }
  };

  const getStockChip = (stock: number) => {
    if (stock === 0) {
      return (
        <Chip label="Sin stock" color="error" size="small" variant="outlined" />
      );
    } else if (stock === 1) {
      return <Chip label="Última unidad" color="warning" size="small" />;
    } else if (stock <= 5) {
      return (
        <Chip label={`Poco stock (${stock})`} color="warning" size="small" />
      );
    } else {
      return (
        <Chip
          label={`${stock} disponibles`}
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }
  };

  const getPriceColor = (product: Product) => {
    if (product.stock === 0) return "text.disabled";
    if (showPrice && product.price > (product.costPrice || 0) * 1.5)
      return "success.main";
    return "text.primary";
  };

  const isProductDisabled = (product: Product) => {
    return disabled && product.stock === 0;
  };

  // Paginación
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const paginatedProducts = products.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const renderSkeletonRows = () => {
    return Array.from(new Array(5)).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton variant="rectangular" width={50} height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </TableCell>
        <TableCell align="center">
          <Skeleton variant="rectangular" width={80} height={24} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={60} />
        </TableCell>
        <TableCell align="center">
          <Skeleton variant="rectangular" width={120} height={36} />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        transition: "opacity 0.2s ease",
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell
                width="70px"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Imagen
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Producto
              </TableCell>
              <TableCell
                align="center"
                width="140px"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Disponibilidad
              </TableCell>
              <TableCell
                width="120px"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                {showPrice ? "Precio venta" : "Precio compra"}
              </TableCell>
              <TableCell
                align="center"
                width="150px"
                sx={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
                const productDisabled = isProductDisabled(product);

                return (
                  <TableRow
                    key={product.id}
                    hover={!productDisabled}
                    sx={{
                      backgroundColor: productDisabled
                        ? "rgba(0, 0, 0, 0.02)"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: productDisabled
                          ? "rgba(0, 0, 0, 0.02)"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                      transition: "background-color 0.2s ease",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {/* Columna de imagen */}
                    <TableCell>
                      <Tooltip title={product.name} arrow>
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          variant="rounded"
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "grey.100",
                            fontSize: "1rem",
                            border: `1px solid ${theme.palette.divider}`,
                            "&:hover": {
                              transform: productDisabled
                                ? "none"
                                : "scale(1.05)",
                              transition: "transform 0.2s ease",
                            },
                            opacity: productDisabled ? 0.6 : 1,
                          }}
                        >
                          {!product.image &&
                            product.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    </TableCell>

                    {/* Columna de nombre y descripción */}
                    <TableCell>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color={
                            productDisabled ? "text.disabled" : "text.primary"
                          }
                          sx={{ mb: 0.5 }}
                        >
                          {product.name}
                        </Typography>
                        {product.description && (
                          <Tooltip title={product.description} arrow>
                            <Typography
                              variant="caption"
                              color={
                                productDisabled
                                  ? "text.disabled"
                                  : "text.secondary"
                              }
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.2,
                                opacity: productDisabled ? 0.7 : 1,
                              }}
                            >
                              {product.description}
                            </Typography>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>

                    {/* Columna de stock */}
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {getStockChip(product.stock ?? 0)}
                      </Box>
                    </TableCell>

                    {/* Columna de precio */}
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={getPriceColor(product)}
                        sx={{
                          fontSize: "1rem",
                          opacity: productDisabled ? 0.6 : 1,
                        }}
                      >
                        $
                        {showPrice
                          ? product.price.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : product.costPrice?.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "0.00"}
                      </Typography>
                    </TableCell>

                    {/* Columna de acción */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip
                          title={
                            productDisabled
                              ? "Producto sin stock"
                              : `Seleccionar ${product.name}`
                          }
                          arrow
                        >
                          <span>
                            <Button
                              variant="contained"
                              color={productDisabled ? "inherit" : "primary"}
                              size="small"
                              onClick={() => handleSelectProduct(product)}
                              disabled={productDisabled}
                              startIcon={<ShoppingCart />}
                              sx={{
                                minWidth: 120,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                boxShadow: "none",
                                "&:hover": {
                                  boxShadow: productDisabled
                                    ? "none"
                                    : theme.shadows[2],
                                  transform: productDisabled
                                    ? "none"
                                    : "translateY(-1px)",
                                },
                                transition: "all 0.2s ease",
                                opacity: productDisabled ? 0.7 : 1,
                              }}
                            >
                              {productDisabled ? "Sin stock" : "Seleccionar"}
                            </Button>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No se encontraron productos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Intenta ajustar los filtros de búsqueda
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {!loading && products.length > itemsPerPage && (
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={products.length}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={(_, newPage) => handleChangePage(newPage)}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            "& .MuiTablePagination-toolbar": {
              minHeight: "60px",
            },
          }}
        />
      )}
    </Paper>
  );
};
