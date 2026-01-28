import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
  CircularProgress,
  alpha,
  Fade,
  Zoom,
  Slide,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import InventoryTableReport from "../../tables/InventoryTableReport";
import { storeProducts } from "../../../stores/products.store";

// Interfaces para tipado
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  status: "Disponible" | "Poco Stock" | "Agotado";
  price: number;
  lastRestock?: string;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

// Mock data para productos
const MOCK_PRODUCTS = [
  { id: 1, name: "Arroz Integral 1kg", category: "Abarrotes Secos", stock: 25, price: 28.50 },
  { id: 2, name: "Aceite de Oliva Extra Virgen 500ml", category: "Aceites y Condimentos", stock: 8, price: 95.00 },
  { id: 3, name: "Leche Entera 1L", category: "Lácteos", stock: 0, price: 24.50 },
  { id: 4, name: "Refresco de Cola 2L", category: "Bebidas", stock: 15, price: 32.00 },
  { id: 5, name: "Atún en Agua 140g", category: "Conservas", stock: 3, price: 18.75 },
  { id: 6, name: "Detergente Líquido 3L", category: "Limpieza", stock: 12, price: 89.90 },
  { id: 7, name: "Pan Integral Bolsa 680g", category: "Panadería", stock: 2, price: 42.50 },
  { id: 8, name: "Café Molido 500g", category: "Abarrotes Secos", stock: 18, price: 125.00 },
  { id: 9, name: "Queso Manchego 250g", category: "Lácteos", stock: 4, price: 67.80 },
  { id: 10, name: "Agua Mineral 6x1L", category: "Bebidas", stock: 0, price: 48.00 },
  { id: 11, name: "Jabón de Tocador 3 unidades", category: "Limpieza", stock: 9, price: 36.50 },
  { id: 12, name: "Salsa de Tomate 400g", category: "Conservas", stock: 22, price: 15.25 },
  { id: 13, name: "Aceitunas Verdes 200g", category: "Conservas", stock: 7, price: 28.90 },
  { id: 14, name: "Galletas Integrales 300g", category: "Abarrotes Secos", stock: 14, price: 32.75 },
  { id: 15, name: "Yogur Natural 1kg", category: "Lácteos", stock: 1, price: 56.00 },
  { id: 16, name: "Jugo de Naranja 1L", category: "Bebidas", stock: 11, price: 38.50 },
  { id: 17, name: "Cloro 1L", category: "Limpieza", stock: 6, price: 24.80 },
  { id: 18, name: "Tortillas de Maíz 1kg", category: "Panadería", stock: 5, price: 28.00 },
  { id: 19, name: "Frijol Negro 1kg", category: "Abarrotes Secos", stock: 20, price: 45.00 },
  { id: 20, name: "Vinagre de Manzana 500ml", category: "Aceites y Condimentos", stock: 10, price: 42.30 },
];

// Sistema de colores profesional
const COLORS = {
  primary: {
    main: "#6366F1",
    light: "#818CF8",
    dark: "#4F46E5",
  },
  status: {
    disponible: "#10B981",
    pocoStock: "#F59E0B",
    agotado: "#EF4444",
  },
  background: {
    light: "#F8FAFC",
    card: "#FFFFFF",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    light: "#94A3B8",
  }
};

// Estilos mejorados y profesionales
const styles = {
  card: {
    borderRadius: "20px",
    boxShadow: "0px 12px 48px rgba(0, 0, 0, 0.08)",
    backgroundColor: COLORS.background.card,
    border: "1px solid rgba(0, 0, 0, 0.03)",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
    '&:hover': {
      boxShadow: "0px 16px 56px rgba(0, 0, 0, 0.12)",
    }
  },

  header: {
    background: COLORS.background.gradient,
    color: "white",
    padding: { xs: "20px", md: "32px" },
    margin: { xs: "-16px -16px 24px -16px", md: "-24px -24px 32px -24px" },
    position: "relative" as const,
    overflow: "hidden",
    '&::before': {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
    }
  },

  title: {
    fontSize: { xs: "1.5rem", md: "2rem" },
    fontWeight: "800",
    letterSpacing: "-0.5px",
    marginBottom: "8px",
    position: "relative" as const,
    textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
  },

  subtitle: {
    fontSize: { xs: "0.8rem", md: "0.95rem" },
    fontWeight: "400",
    opacity: 0.9,
    letterSpacing: "0.3px",
    position: "relative" as const,
  },

  chartContainer: {
    width: "100%",
    height: "400px",
    position: "relative" as const,
    transition: "all 0.3s ease",
  },

  customTooltip: {
    backgroundColor: "white",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.15)",
    padding: "16px",
    backdropFilter: "blur(10px)",
  },

  statCard: {
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease-in-out",
    height: "100%",
    '&:hover': {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
    }
  },

  statusChip: {
    disponible: {
      backgroundColor: alpha(COLORS.status.disponible, 0.1),
      color: COLORS.status.disponible,
      fontWeight: "700",
      borderRadius: "8px",
    },
    pocoStock: {
      backgroundColor: alpha(COLORS.status.pocoStock, 0.1),
      color: COLORS.status.pocoStock,
      fontWeight: "700",
      borderRadius: "8px",
    },
    agotado: {
      backgroundColor: alpha(COLORS.status.agotado, 0.1),
      color: COLORS.status.agotado,
      fontWeight: "700",
      borderRadius: "8px",
    },
  },

  metricValue: {
    fontSize: { xs: "1.75rem", md: "2.25rem" },
    fontWeight: "800",
    background: COLORS.background.gradient,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1.2,
  },

  metricLabel: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: COLORS.text.secondary,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

const InventoryReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { listProducts, getProducts, loading } = storeProducts();
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Función para determinar el estado del stock
  const getStockStatus = (stock: number, minStock: number): "Disponible" | "Poco Stock" | "Agotado" => {
    if (stock === 0) return "Agotado";
    if (stock <= minStock) return "Poco Stock";
    return "Disponible";
  };

  // Función para calcular el stock mínimo basado en la categoría
  const getMinStockByCategory = (category: string): number => {
    const minStockMap: { [key: string]: number } = {
      "Abarrotes Secos": 10,
      "Aceites y Condimentos": 8,
      "Lácteos": 15,
      "Bebidas": 12,
      "Conservas": 6,
      "Limpieza": 8,
      "Panadería": 5,
    };
    return minStockMap[category] || 5;
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError(null);
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usar datos mock en lugar de la API real
        setUseMockData(true);
        setIsLoaded(true);
        
        // Si quieres simular una llamada real, descomenta esto:
        // await getProducts();
        // setTimeout(() => setIsLoaded(true), 300);
        
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("Error loading products:", err);
        setIsLoaded(true);
      }
    };

    loadProducts();
  }, [getProducts]);

  // Convertir productos mock a InventoryItem
  const inventoryData: InventoryItem[] = useMockData 
    ? MOCK_PRODUCTS.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stock: product.stock,
        minStock: getMinStockByCategory(product.category),
        status: getStockStatus(product.stock, getMinStockByCategory(product.category)),
        price: product.price,
        lastRestock: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    : listProducts.map(product => ({
        id: product.id || 0,
        name: product.name,
        category: product.category?.name || "Sin categoría",
        stock: product.stock || 0,
        minStock: getMinStockByCategory(product.category?.name || "Sin categoría"),
        status: getStockStatus(product.stock || 0, getMinStockByCategory(product.category?.name || "Sin categoría")),
        price: product.price,
        lastRestock: new Date().toISOString().split('T')[0]
      }));

  // Filtrar productos con problemas de stock
  const filteredInventoryData = inventoryData.filter(
    (item) => item.status === "Poco Stock" || item.status === "Agotado"
  );

  // Datos para la gráfica
  const pieChartData: PieChartData[] = [
    {
      name: "Disponible",
      value: inventoryData.filter(item => item.status === "Disponible").length,
      color: COLORS.status.disponible
    },
    {
      name: "Poco Stock",
      value: inventoryData.filter(item => item.status === "Poco Stock").length,
      color: COLORS.status.pocoStock
    },
    {
      name: "Agotado",
      value: inventoryData.filter(item => item.status === "Agotado").length,
      color: COLORS.status.agotado
    }
  ];

  // Tooltip personalizado mejorado
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalProducts = inventoryData.length;
      const percentage = ((data.value / totalProducts) * 100).toFixed(1);
      
      return (
        <Box sx={styles.customTooltip}>
          <Typography variant="subtitle2" fontWeight="700" color={COLORS.text.primary}>
            {data.name}
          </Typography>
          <Typography variant="body2" color={COLORS.text.secondary} sx={{ mt: 0.5 }}>
            {data.value} productos ({percentage}%)
          </Typography>
          {useMockData && (
            <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}>
              Datos de demostración
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  // Calcular estadísticas
  const totalProducts = inventoryData.length;
  const productosDisponibles = inventoryData.filter(item => item.status === "Disponible").length;
  const productosPocoStock = inventoryData.filter(item => item.status === "Poco Stock").length;
  const productosAgotados = inventoryData.filter(item => item.status === "Agotado").length;
  
  const valorInventarioTotal = inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const productosConProblemas = productosPocoStock + productosAgotados;
  const porcentajeProblemas = totalProducts > 0 ? ((productosConProblemas / totalProducts) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Fade in={true}>
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} sx={{ color: COLORS.primary.main, mb: 2 }} />
            <Typography variant="h6" color={COLORS.text.secondary}>
              Cargando inventario...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (error) {
    return (
      <Zoom in={true}>
        <Alert severity="error" sx={{ m: 2, borderRadius: "12px" }}>
          {error}
        </Alert>
      </Zoom>
    );
  }

  return (
    <Fade in={isLoaded} timeout={800}>
      <Card sx={styles.card}>
        <CardContent sx={{ padding: 0 }}>
          {/* Header con gradiente profesional */}
          <Box sx={styles.header}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h1" sx={styles.title}>
                  Informe de Inventario
                </Typography>
                <Typography variant="subtitle1" sx={styles.subtitle}>
                  Estado completo del stock • Alertas inteligentes • Análisis en tiempo real
                </Typography>
              </Box>
              {useMockData && (
                <Chip
                  label="Datos de demostración"
                  color="warning"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                    mb: 1,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ padding: { xs: "0 16px 24px 16px", md: "0 24px 32px 24px" } }}>
            {totalProducts === 0 ? (
              <Slide direction="up" in={true} timeout={500}>
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color={COLORS.text.secondary} gutterBottom>
                    No hay productos en el inventario
                  </Typography>
                  <Typography variant="body2" color={COLORS.text.light}>
                    Comienza agregando productos para ver el análisis completo
                  </Typography>
                </Box>
              </Slide>
            ) : (
              <Grid container spacing={3}>
                {/* Métricas principales */}
                <Grid item xs={12}>
                  <Slide direction="down" in={isLoaded} timeout={600}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={styles.statCard}>
                          <Typography sx={styles.metricValue}>
                            {totalProducts}
                          </Typography>
                          <Typography sx={styles.metricLabel}>
                            Total Productos
                          </Typography>
                          {useMockData && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                              20 productos mock
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={styles.statCard}>
                          <Typography sx={styles.metricValue}>
                            ${(valorInventarioTotal / 1000).toFixed(1)}K
                          </Typography>
                          <Typography sx={styles.metricLabel}>
                            Valor Inventario
                          </Typography>
                          {useMockData && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                              Valor estimado
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={styles.statCard}>
                          <Typography sx={styles.metricValue}>
                            {productosConProblemas}
                          </Typography>
                          <Typography sx={styles.metricLabel}>
                            Requieren Atención
                          </Typography>
                          {useMockData && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                              6 productos críticos
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{
                          ...styles.statCard,
                          backgroundColor: productosConProblemas > 0 
                            ? alpha(COLORS.status.agotado, 0.05) 
                            : alpha(COLORS.status.disponible, 0.05),
                          borderColor: productosConProblemas > 0 
                            ? alpha(COLORS.status.agotado, 0.2) 
                            : alpha(COLORS.status.disponible, 0.2),
                        }}>
                          <Typography sx={styles.metricValue}>
                            {porcentajeProblemas}%
                          </Typography>
                          <Typography sx={styles.metricLabel}>
                            {productosConProblemas > 0 ? "Con Problemas" : "Saludable"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Slide>
                </Grid>

                {/* Gráfica y detalles */}
                <Grid item xs={12} lg={8}>
                  <Slide direction="right" in={isLoaded} timeout={800}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography sx={styles.sectionTitle}>
                          📊 Distribución del Inventario
                        </Typography>
                        {useMockData && (
                          <Chip
                            label="Datos simulados"
                            color="warning"
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                      <Box sx={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={isMobile ? 70 : 90}
                              outerRadius={isMobile ? 110 : 130}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => 
                                `${name}\n${(percent * 100).toFixed(0)}%`
                              }
                              labelLine={false}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                  stroke="white"
                                  strokeWidth={3}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                              wrapperStyle={{
                                paddingTop: "20px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                              formatter={(value) => (
                                <span style={{ color: COLORS.text.primary }}>
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </Slide>
                </Grid>

                {/* Estado del inventario */}
                <Grid item xs={12} lg={4}>
                  <Slide direction="left" in={isLoaded} timeout={800}>
                    <Box>
                      <Typography sx={styles.sectionTitle}>
                        🚨 Estado del Stock
                      </Typography>
                      <Box sx={styles.statCard}>
                        <Box display="flex" flexDirection="column" gap={2}>
                          {[
                            { label: "Disponible", value: productosDisponibles, type: "disponible" as const },
                            { label: "Poco Stock", value: productosPocoStock, type: "pocoStock" as const },
                            { label: "Agotado", value: productosAgotados, type: "agotado" as const },
                          ].map((item, index) => (
                            <Fade in={isLoaded} timeout={1000 + (index * 200)} key={item.type}>
                              <Box 
                                display="flex" 
                                justifyContent="space-between" 
                                alignItems="center"
                                sx={{ py: 1 }}
                              >
                                <Typography variant="body1" fontWeight="600" color={COLORS.text.primary}>
                                  {item.label}
                                </Typography>
                                <Chip 
                                  label={item.value} 
                                  size="medium"
                                  sx={styles.statusChip[item.type]}
                                />
                              </Box>
                            </Fade>
                          ))}
                        </Box>
                        {useMockData && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 2, display: 'block', textAlign: 'center' }}>
                            Datos de ejemplo para demostración
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Slide>
                </Grid>

                {/* Tabla de productos con problemas */}
                <Grid item xs={12}>
                  <Slide direction="up" in={isLoaded} timeout={1000}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography sx={styles.sectionTitle}>
                          ⚠️ Productos que Requieren Atención ({filteredInventoryData.length})
                        </Typography>
                        {useMockData && (
                          <Typography variant="caption" color="text.secondary">
                            Mostrando datos de prueba
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <InventoryTableReport inventoryData={filteredInventoryData} />
                      </Box>
                    </Box>
                  </Slide>
                </Grid>
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default InventoryReport;