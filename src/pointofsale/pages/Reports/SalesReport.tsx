import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import ProductTableReport from "../../tables/ProductTableReport";
import { storeSales } from "../../../stores/sales.store";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#EC4899",
];

// Mock data para ventas
const MOCK_SALES = [
  {
    id: 1,
    date: "2024-01-15T10:30:00Z",
    saleProducts: [
      { id: 1, quantity: 5, product: { id: 101, name: "Laptop Pro", price: 1200 } },
      { id: 2, quantity: 3, product: { id: 102, name: "Mouse Inalámbrico", price: 35 } },
    ]
  },
  {
    id: 2,
    date: "2024-01-16T14:45:00Z",
    saleProducts: [
      { id: 3, quantity: 2, product: { id: 101, name: "Laptop Pro", price: 1200 } },
      { id: 4, quantity: 10, product: { id: 103, name: "Teclado Mecánico", price: 89 } },
      { id: 5, quantity: 7, product: { id: 104, name: "Monitor 24\"", price: 250 } },
    ]
  },
  {
    id: 3,
    date: "2024-01-17T09:15:00Z",
    saleProducts: [
      { id: 6, quantity: 8, product: { id: 105, name: "Smartphone X", price: 800 } },
      { id: 7, quantity: 15, product: { id: 106, name: "Cargador USB-C", price: 25 } },
      { id: 8, quantity: 4, product: { id: 107, name: "Tablet Pro", price: 450 } },
    ]
  },
  {
    id: 4,
    date: "2024-01-18T16:20:00Z",
    saleProducts: [
      { id: 9, quantity: 6, product: { id: 105, name: "Smartphone X", price: 800 } },
      { id: 10, quantity: 12, product: { id: 108, name: "Auriculares Bluetooth", price: 75 } },
      { id: 11, quantity: 9, product: { id: 109, name: "Disco SSD 1TB", price: 120 } },
    ]
  },
  {
    id: 5,
    date: "2024-01-19T11:30:00Z",
    saleProducts: [
      { id: 12, quantity: 3, product: { id: 110, name: "Impresora Laser", price: 300 } },
      { id: 13, quantity: 20, product: { id: 111, name: "Cable HDMI", price: 15 } },
      { id: 14, quantity: 5, product: { id: 112, name: "Webcam 4K", price: 95 } },
      { id: 15, quantity: 7, product: { id: 113, name: "Router WiFi 6", price: 180 } },
    ]
  },
  {
    id: 6,
    date: "2024-01-20T13:45:00Z",
    saleProducts: [
      { id: 16, quantity: 4, product: { id: 114, name: "Altavoz Inteligente", price: 130 } },
      { id: 17, quantity: 11, product: { id: 115, name: "Power Bank 20000mAh", price: 45 } },
      { id: 18, quantity: 6, product: { id: 116, name: "Smart Watch", price: 220 } },
    ]
  }
];

// Mock adicional para más variedad de productos
const MOCK_ADDITIONAL_SALES = [
  {
    id: 7,
    date: "2024-01-21T10:00:00Z",
    saleProducts: [
      { id: 19, quantity: 8, product: { id: 117, name: "Consola de Videojuegos", price: 499 } },
      { id: 20, quantity: 25, product: { id: 118, name: "Control Remoto", price: 30 } },
    ]
  },
  {
    id: 8,
    date: "2024-01-22T15:30:00Z",
    saleProducts: [
      { id: 21, quantity: 3, product: { id: 119, name: "Drone Profesional", price: 1200 } },
      { id: 22, quantity: 18, product: { id: 120, name: "Soporte para Laptop", price: 40 } },
    ]
  }
];

const SalesReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  const { listSales, getSales } = storeSales();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Usar datos mock en lugar de la API real
        setUseMockData(true);
        
      } catch (err) {
        setError("Error al cargar los datos de ventas");
        console.error("Error fetching sales:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getSales]);

  // Combinar datos mock si es necesario
  const salesData = useMemo(() => {
    if (useMockData) {
      return [...MOCK_SALES, ...MOCK_ADDITIONAL_SALES];
    }
    return listSales;
  }, [useMockData, listSales]);

  const products = useMemo(() => {
    const map = new Map<
      number,
      {
        id: number;
        name: string;
        sales: number;
        revenue: number;
      }
    >();

    salesData.forEach((sale) => {
      sale.saleProducts.forEach((sp) => {
        const id = sp.product.id!;
        const name = sp.product.name;
        const price = sp.product.price;
        const quantity = sp.quantity;
        const revenue = quantity * price;

        if (!map.has(id)) {
          map.set(id, {
            id,
            name,
            sales: quantity,
            revenue,
          });
        } else {
          const existing = map.get(id)!;
          existing.sales += quantity;
          existing.revenue += revenue;
        }
      });
    });

    return Array.from(map.values());
  }, [salesData]);

  const top10Products = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const chartData = top10Products.map((p, index) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    fullName: p.name,
    sales: p.sales,
    revenue: p.revenue,
    rank: index + 1,
  }));

  const totalSales = products.reduce((s, p) => s + p.sales, 0);
  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const topProduct = top10Products[0];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Box textAlign="center">
          <CircularProgress size={50} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Cargando informe de ventas...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: "12px", mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header con indicador de datos mock */}
      <Box sx={{ mb: 4, position: "relative" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              variant="h4"
              fontWeight="700"
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Informe de Ventas por Producto
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Top 10 productos más vendidos y métricas clave de ventas
            </Typography>
          </Box>
          {useMockData && (
            <Chip
              label="Datos de demostración"
              color="warning"
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Box>

      {products.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: "12px" }}>
          No hay datos de ventas disponibles
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Métricas principales */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    background: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#3B82F6",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Total Ventas
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    color="text.primary"
                  >
                    {totalSales.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    background: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#10B981",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Ingresos Totales
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    color="text.primary"
                  >
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    background: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#F59E0B",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Productos
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="700"
                    color="text.primary"
                  >
                    {products.length}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    background: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#EF4444",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Producto Top
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="text.primary"
                    noWrap
                  >
                    {topProduct?.name || "N/A"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Gráfico de Barras */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                background: "white",
                height: "100%",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" fontWeight="600">
                  Top 10 Productos por Ventas
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={`${top10Products.length} productos`}
                    size="small"
                    variant="outlined"
                  />
                  {useMockData && (
                    <Chip
                      label="Mock data"
                      size="small"
                      color="warning"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "sales")
                          return [value.toLocaleString(), "Ventas"];
                        if (name === "revenue")
                          return [`$${value.toLocaleString()}`, "Ingresos"];
                        return [value, name];
                      }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Gráfico Circular */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                background: "white",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight="600" mb={3}>
                Distribución de Ventas
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="sales"
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "sales")
                          return [value.toLocaleString(), "Ventas"];
                        if (name === "revenue")
                          return [`$${value.toLocaleString()}`, "Ingresos"];
                        return [value, name];
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                        marginTop: "20px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Tabla de Productos */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                background: "white",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "#fafafa",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="600">
                    Lista Completa de Productos
                  </Typography>
                  {useMockData && (
                    <Typography variant="caption" color="text.secondary">
                      Mostrando {products.length} productos de demostración
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                <ProductTableReport products={products} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SalesReport;