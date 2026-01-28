import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Skeleton,
  alpha,
  Paper,
  Container,
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
import {
  TrendingUp,
  LocalShipping,
  AccountBalanceWallet,
  Group,
} from "@mui/icons-material";
import FrequentSuppliersTableReport from "../../tables/FrequentSuppliersTableReport";
import { storeShoppings } from "../../../stores/shopping.store";

// Paleta de colores profesional y armoniosa
const COLORS = [
  "#2E86AB", "#A23B72", "#F18F01", "#1B5E20", "#4A148C",
  "#006064", "#5D4037", "#827717", "#37474F", "#6A1B9A",
];

// Gradientes sofisticados
const GRADIENTS = {
  primary: "linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)",
  success: "linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)",
  warning: "linear-gradient(135deg, #E67E22 0%, #F39C12 100%)",
  info: "linear-gradient(135deg, #2980B9 0%, #3498DB 100%)",
  premium: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
  danger: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)",
};

// Mock data para proveedores
const MOCK_SUPPLIERS = [
  { id: 1, name: "Distribuidora Norte S.A.", category: "Alimentos", deliveries: 45, totalTransactions: 234500 },
  { id: 2, name: "Bebidas y Refrescos S.A.", category: "Bebidas", deliveries: 38, totalTransactions: 187600 },
  { id: 3, name: "Cárnicos Premium", category: "Carnes", deliveries: 32, totalTransactions: 156800 },
  { id: 4, name: "Lácteos del Valle", category: "Lácteos", deliveries: 28, totalTransactions: 134200 },
  { id: 5, name: "Distribuidora Sur", category: "Variados", deliveries: 25, totalTransactions: 112500 },
  { id: 6, name: "Importadora de Especias", category: "Condimentos", deliveries: 22, totalTransactions: 98700 },
  { id: 7, name: "Granos y Cereales", category: "Abarrotes", deliveries: 19, totalTransactions: 85600 },
  { id: 8, name: "Productos de Limpieza Pro", category: "Limpieza", deliveries: 18, totalTransactions: 78900 },
  { id: 9, name: "Frutas y Verduras Frescas", category: "Frutas", deliveries: 15, totalTransactions: 67200 },
  { id: 10, name: "Panadería Industrial", category: "Panadería", deliveries: 12, totalTransactions: 54300 },
  { id: 11, name: "Distribuidora Oeste", category: "Variados", deliveries: 10, totalTransactions: 45600 },
  { id: 12, name: "Mariscos y Pescados", category: "Mariscos", deliveries: 8, totalTransactions: 38900 },
  { id: 13, name: "Café Selecto", category: "Bebidas", deliveries: 7, totalTransactions: 32400 },
  { id: 14, name: "Dulces y Chocolates", category: "Dulces", deliveries: 6, totalTransactions: 27800 },
  { id: 15, name: "Distribuidora Este", category: "Variados", deliveries: 5, totalTransactions: 21500 },
];

// Mock data para compras
const MOCK_SHOPPINGS = [
  { id: 1, supplier: MOCK_SUPPLIERS[0], total: 8500, createdAt: "2024-01-20T14:30:00Z" },
  { id: 2, supplier: MOCK_SUPPLIERS[1], total: 6200, createdAt: "2024-01-19T11:45:00Z" },
  { id: 3, supplier: MOCK_SUPPLIERS[2], total: 7800, createdAt: "2024-01-18T09:15:00Z" },
  { id: 4, supplier: MOCK_SUPPLIERS[3], total: 4500, createdAt: "2024-01-17T16:20:00Z" },
  { id: 5, supplier: MOCK_SUPPLIERS[4], total: 5200, createdAt: "2024-01-16T13:10:00Z" },
  { id: 6, supplier: MOCK_SUPPLIERS[5], total: 3100, createdAt: "2024-01-15T10:30:00Z" },
  { id: 7, supplier: MOCK_SUPPLIERS[0], total: 9200, createdAt: "2024-01-14T15:45:00Z" },
  { id: 8, supplier: MOCK_SUPPLIERS[1], total: 5800, createdAt: "2024-01-13T12:20:00Z" },
  { id: 9, supplier: MOCK_SUPPLIERS[2], total: 6700, createdAt: "2024-01-12T09:30:00Z" },
  { id: 10, supplier: MOCK_SUPPLIERS[3], total: 3900, createdAt: "2024-01-11T17:15:00Z" },
];

// Estilos consistentes para cards
const cardStyles = {
  borderRadius: 3,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: `1px solid ${alpha("#000", 0.05)}`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-2px)",
  },
};

const FrequentSuppliersReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const { listShoppings, getShoppings } = storeShoppings();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usar datos mock en lugar de la API real
        setUseMockData(true);
        setLoading(false);
        
        // Si quieres simular una llamada real, descomenta esto:
        // await getShoppings();
        // setLoading(false);
      } catch (error) {
        console.error("Error loading shopping data:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const suppliers = useMemo(() => {
    // Usar datos mock si está activado
    if (useMockData) {
      return MOCK_SUPPLIERS.map(supplier => ({
        ...supplier,
        reliability: Math.floor(Math.random() * 5) + 1,
        lastDelivery: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentTerms: ["30 días", "45 días", "15 días"][Math.floor(Math.random() * 3)],
        status: ["Excelente", "Bueno", "Regular"][Math.floor(Math.random() * 3)],
      }));
    }
    
    // Usar datos reales
    const map = new Map<number, any>();

    listShoppings.forEach((shop) => {
      if (!shop.supplier) return;

      const id = shop.supplier.id;

      if (!map.has(id)) {
        map.set(id, {
          id: id,
          name: shop.supplier.name,
          category: shop.supplier.category ?? "General",
          deliveries: 0,
          totalTransactions: 0,
          reliability: 3,
          lastDelivery: shop.createdAt,
          paymentTerms: "30 días",
          status: "Bueno",
        });
      }

      const data = map.get(id);
      data.deliveries++;
      data.totalTransactions += shop.total;
      data.lastDelivery = shop.createdAt;
    });

    return Array.from(map.values());
  }, [listShoppings, useMockData]);

  const top10Suppliers = suppliers
    .sort((a, b) => b.deliveries - a.deliveries)
    .slice(0, 10);

  const pieChartData = top10Suppliers.map((supplier, index) => ({
    name: supplier.name.length > 15 ? `${supplier.name.substring(0, 15)}...` : supplier.name,
    fullName: supplier.name,
    value: supplier.deliveries,
    amount: supplier.totalTransactions,
    color: COLORS[index % COLORS.length],
  }));

  const barChartData = top10Suppliers.map((supplier, index) => ({
    name: supplier.name.length > 12 ? `${supplier.name.substring(0, 12)}...` : supplier.name,
    fullName: supplier.name,
    entregas: supplier.deliveries,
    monto: supplier.totalTransactions,
    color: COLORS[index % COLORS.length],
  }));

  // Métricas clave
  const metrics = {
    totalProveedores: suppliers.length,
    totalTransacciones: suppliers.reduce((acc, s) => acc + s.totalTransactions, 0),
    promedioEntregas: suppliers.length > 0 ? (suppliers.reduce((acc, s) => acc + s.deliveries, 0) / suppliers.length).toFixed(1) : 0,
    proveedorMasConfiable: suppliers[0] ?? null,
  };

  // Custom Tooltip mejorado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper
          elevation={8}
          sx={{
            padding: 2,
            background: alpha(theme.palette.background.paper, 0.95),
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: "blur(10px)",
            minWidth: 200,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {data.fullName}
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="body2" color="text.secondary">
              📦 Entregas: <strong>{data.value || data.entregas}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              💰 Total: <strong>${(data.amount || data.monto).toLocaleString()}</strong>
            </Typography>
          </Box>
          {useMockData && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}>
              Datos de demostración
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  // Componente de carga mejorado
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Skeletons para métricas */}
          <Grid item xs={12} md={3}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
          
          {/* Skeleton para gráficos */}
          <Grid item xs={12} lg={8}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          
          {/* Skeleton para tabla */}
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Mejorado */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="h3" 
            fontWeight={700}
            sx={{ 
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 1,
              background: GRADIENTS.primary,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Proveedores Frecuentes
          </Typography>
          <Typography 
            variant="h6"
            color="text.secondary"
            sx={{ 
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Análisis detallado basado en tu historial de compras
          </Typography>
        </Box>
        {useMockData && (
          <Chip
            label="Datos de demostración"
            color="warning"
            size="medium"
            sx={{
              backgroundColor: alpha("#FF9800", 0.1),
              color: "#E65100",
              border: "1px solid rgba(255, 152, 0, 0.3)",
            }}
          />
        )}
      </Box>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...cardStyles,
              p: 3,
              textAlign: "center",
              background: GRADIENTS.info,
              color: "white",
              position: "relative",
            }}
          >
            <Group sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={700}>
              {metrics.totalProveedores}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Proveedores Activos
            </Typography>
            {useMockData && (
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                15 proveedores de prueba
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...cardStyles,
              p: 3,
              textAlign: "center",
              background: GRADIENTS.success,
              color: "white",
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={700}>
              ${(metrics.totalTransacciones / 1000).toFixed(0)}K
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Volumen Total
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...cardStyles,
              p: 3,
              textAlign: "center",
              background: GRADIENTS.warning,
              color: "white",
            }}
          >
            <LocalShipping sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={700}>
              {metrics.promedioEntregas}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Avg. Entregas
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              ...cardStyles,
              p: 3,
              textAlign: "center",
              background: GRADIENTS.primary,
              color: "white",
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={700}>
              {top10Suppliers.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Top Proveedores
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Gráfico de Barras - Vista Principal */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ ...cardStyles, p: 3, height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Desempeño de Proveedores Top 10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comparación de entregas y montos por proveedor
                </Typography>
              </Box>
              {useMockData && (
                <Chip
                  label="Datos simulados"
                  color="warning"
                  size="small"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
            <Box sx={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="entregas" 
                    name="Entregas" 
                    fill={COLORS[0]}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="monto" 
                    name="Monto Total" 
                    fill={COLORS[1]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico Circular y Estadísticas */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* PieChart Mejorado */}
            <Grid item xs={12}>
              <Paper sx={{ ...cardStyles, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Distribución de Entregas
                  </Typography>
                  {useMockData && (
                    <Typography variant="caption" color="text.secondary">
                      Ejemplo
                    </Typography>
                  )}
                </Box>
                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 40 : 60}
                        outerRadius={isMobile ? 80 : 100}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={index} 
                            fill={entry.color} 
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Proveedor Destacado */}
            {metrics.proveedorMasConfiable && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    ...cardStyles,
                    p: 3,
                    background: GRADIENTS.premium,
                    color: "white",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      fontSize: "3rem",
                      opacity: 0.3,
                    }}
                  >
                    🏆
                  </Box>
                  <Box position="relative" zIndex={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Proveedor del Mes
                      </Typography>
                      {useMockData && (
                        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                          Ejemplo
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      {metrics.proveedorMasConfiable.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {metrics.proveedorMasConfiable.deliveries} entregas • ${metrics.proveedorMasConfiable.totalTransactions.toLocaleString()}
                    </Typography>
                    <Chip
                      label="Más Confiable"
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Tabla Mejorada */}
        <Grid item xs={12}>
          <Paper sx={{ ...cardStyles, overflow: "hidden" }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Lista Completa de Proveedores
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detalles y métricas de rendimiento
                </Typography>
              </Box>
              {useMockData && (
                <Typography variant="caption" color="text.secondary">
                  Mostrando {suppliers.length} proveedores de prueba
                </Typography>
              )}
            </Box>
            <FrequentSuppliersTableReport suppliers={suppliers} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FrequentSuppliersReport;