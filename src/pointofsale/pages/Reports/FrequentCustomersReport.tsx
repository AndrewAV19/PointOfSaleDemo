import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  Chip,
  alpha,
  Container,
  useMediaQuery,
} from "@mui/material";
import FrequentCustomersTableReport from "../../tables/FrequentCustomersTableReport";
import { storeSales } from "../../../stores/sales.store";

interface CustomerInfo {
  id: number;
  name: string;
  type: string;
  purchases: number;
  totalSpent: number;
  lastPurchase: string;
  frequency: "Alta" | "Media" | "Baja";
}

const TYPE_COLORS: Record<string, string> = {
  Mayorista: "#3B82F6",
  Minorista: "#F59E0B",
  Restaurante: "#10B981",
  Cafetería: "#8B5CF6",
  "Tienda de Conveniencia": "#EC4899",
  "Supermercado": "#06B6D4",
};

const FREQUENCY_COLORS = {
  Alta: "#10B981",
  Media: "#F59E0B",
  Baja: "#EF4444",
};

// Mock data para clientes
const MOCK_CUSTOMERS = [
  { id: 1, name: "Restaurante La Tradición", type: "Restaurante", purchases: 45, totalSpent: 125800 },
  { id: 2, name: "Supermercado El Ahorro", type: "Supermercado", purchases: 38, totalSpent: 98700 },
  { id: 3, name: "Cafetería Aromas", type: "Cafetería", purchases: 32, totalSpent: 45600 },
  { id: 4, name: "Distribuidora Norte", type: "Mayorista", purchases: 28, totalSpent: 234500 },
  { id: 5, name: "Tienda 24/7 Centro", type: "Tienda de Conveniencia", purchases: 25, totalSpent: 56700 },
  { id: 6, name: "Familia Rodríguez", type: "Minorista", purchases: 22, totalSpent: 34200 },
  { id: 7, name: "Comedor Comunitario", type: "Restaurante", purchases: 19, totalSpent: 28900 },
  { id: 8, name: "Cafetería Express", type: "Cafetería", purchases: 18, totalSpent: 23100 },
  { id: 9, name: "Mini Market", type: "Supermercado", purchases: 15, totalSpent: 18900 },
  { id: 10, name: "Distribuidora Sur", type: "Mayorista", purchases: 12, totalSpent: 156700 },
  { id: 11, name: "Familia García", type: "Minorista", purchases: 10, totalSpent: 12700 },
  { id: 12, name: "Tienda Esquina", type: "Tienda de Conveniencia", purchases: 8, totalSpent: 9800 },
  { id: 13, name: "Restaurante El Fogón", type: "Restaurante", purchases: 7, totalSpent: 14500 },
  { id: 14, name: "Cafetería Delicias", type: "Cafetería", purchases: 6, totalSpent: 8700 },
  { id: 15, name: "Super Tienda", type: "Supermercado", purchases: 5, totalSpent: 11200 },
];

// Mock data para ventas (simulando datos de ventas)
const MOCK_SALES = [
  { id: 1, client: MOCK_CUSTOMERS[0], total: 2800, createdAt: "2024-01-20T14:30:00Z" },
  { id: 2, client: MOCK_CUSTOMERS[1], total: 1950, createdAt: "2024-01-19T11:45:00Z" },
  { id: 3, client: MOCK_CUSTOMERS[2], total: 1200, createdAt: "2024-01-18T09:15:00Z" },
  { id: 4, client: MOCK_CUSTOMERS[3], total: 8500, createdAt: "2024-01-17T16:20:00Z" },
  { id: 5, client: MOCK_CUSTOMERS[4], total: 2300, createdAt: "2024-01-16T13:10:00Z" },
  { id: 6, client: MOCK_CUSTOMERS[5], total: 1450, createdAt: "2024-01-15T10:30:00Z" },
  { id: 7, client: MOCK_CUSTOMERS[0], total: 3100, createdAt: "2024-01-14T15:45:00Z" },
  { id: 8, client: MOCK_CUSTOMERS[1], total: 2100, createdAt: "2024-01-13T12:20:00Z" },
  { id: 9, client: MOCK_CUSTOMERS[2], total: 1350, createdAt: "2024-01-12T09:30:00Z" },
  { id: 10, client: MOCK_CUSTOMERS[3], total: 9200, createdAt: "2024-01-11T17:15:00Z" },
];

const FrequentCustomersReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { listSales, getSales } = storeSales();
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usar datos mock en lugar de la API real
        setUseMockData(true);
        
        // Si quieres simular una llamada real, descomenta esto:
        // await getSales();
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };

    fetchData();
  }, [getSales]);

  const customers: CustomerInfo[] = useMemo(() => {
    // Usar datos mock si está activado
    const salesData = useMockData ? MOCK_SALES : listSales;
    
    // Si hay datos reales, procesarlos
    if (!useMockData) {
      const map = new Map<number, CustomerInfo>();

      listSales.forEach((sale) => {
        if (!sale.client) return;

        const id = sale.client.id;
        const name = sale.client.name;
        const type = sale.client.type ?? "Minorista";
        const amount = sale.total ?? 0;
        const date = sale.createdAt ?? sale.date ?? new Date().toISOString();

        if (!map.has(id)) {
          map.set(id, {
            id,
            name,
            type,
            purchases: 0,
            totalSpent: 0,
            lastPurchase: date,
            frequency: "Baja",
          });
        }

        const c = map.get(id)!;
        c.purchases++;
        c.totalSpent += amount;

        if (new Date(date) > new Date(c.lastPurchase)) {
          c.lastPurchase = date;
        }
      });

      map.forEach((c) => {
        if (c.purchases >= 20) c.frequency = "Alta";
        else if (c.purchases >= 10) c.frequency = "Media";
        else c.frequency = "Baja";
      });

      return Array.from(map.values()).sort((a, b) => b.purchases - a.purchases);
    }
    
    // Usar datos mock directamente
    const mockCustomersData = MOCK_CUSTOMERS.map(customer => ({
      ...customer,
      lastPurchase: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      frequency: customer.purchases >= 20 ? "Alta" as const : 
                 customer.purchases >= 10 ? "Media" as const : "Baja" as const,
    }));
    
    return mockCustomersData.sort((a, b) => b.purchases - a.purchases);
  }, [listSales, useMockData]);

  // Estadísticas
  const totalClientes = customers.length;
  const totalCompras = customers.reduce((acc, c) => acc + c.purchases, 0);
  const totalIngresos = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const promedio = totalCompras / (totalClientes || 1);

  const clienteMasValioso = [...customers].sort(
    (a, b) => b.totalSpent - a.totalSpent
  )[0];

  const frecuenciaAlta = customers.filter((c) => c.frequency === "Alta").length;
  const frecuenciaMedia = customers.filter(
    (c) => c.frequency === "Media"
  ).length;
  const frecuenciaBaja = customers.filter((c) => c.frequency === "Baja").length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          {/* Header mejorado con gradiente sutil */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.95
              )} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
              color: "white",
              padding: { xs: 4, md: 5 },
              paddingBottom: { xs: 5, md: 6 },
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 20% 80%, ${alpha(
                    theme.palette.secondary.main,
                    0.15
                  )} 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, ${alpha(
                    theme.palette.info.main,
                    0.1
                  )} 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, ${alpha(
                    theme.palette.warning.main,
                    0.05
                  )} 0%, transparent 50%)
                `,
              },
            }}
          >
            <Box position="relative" zIndex={1}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Chip
                  label="Análisis de Clientes"
                  sx={{
                    backgroundColor: alpha("#ffffff", 0.2),
                    color: "white",
                    fontWeight: 600,
                    mb: 2,
                    backdropFilter: "blur(10px)",
                  }}
                />
                {useMockData && (
                  <Chip
                    label="Datos de demostración"
                    color="warning"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="h2"
                fontWeight="800"
                gutterBottom
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Clientes Frecuentes
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  fontWeight: 400,
                  maxWidth: "600px",
                  lineHeight: 1.5,
                }}
              >
                Análisis detallado sobre el comportamiento y valor de tu base de
                clientes
              </Typography>
            </Box>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ padding: { xs: 3, md: 4 } }}>
            {/* Métricas principales mejoradas */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                {
                  value: totalClientes,
                  label: "Clientes Totales",
                  color: "primary",
                  icon: "👥",
                },
                {
                  value: totalCompras,
                  label: "Compras Totales",
                  color: "success",
                  icon: "🛒",
                },
                {
                  value: promedio.toFixed(1),
                  label: "Promedio por Cliente",
                  color: "warning",
                  icon: "📊",
                },
                {
                  value: `$${(totalIngresos / 1000).toFixed(0)}K`,
                  label: "Ingresos Totales",
                  color: "info",
                  icon: "💰",
                },
              ].map((metric, index) => (
                <Grid item xs={6} md={3} key={metric.label}>
                  <Box
                    sx={{
                      padding: 3,
                      background: "white",
                      borderRadius: 3,
                      textAlign: "center",
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      },
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
                        opacity: 0.05,
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight="800"
                      color={`${metric.color}.main`}
                      sx={{ mb: 1 }}
                    >
                      {metric.value}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="600"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {metric.label}
                      </Typography>
                      {useMockData && index === 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          15 clientes de prueba
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={4}>
              {/* Tabla */}
              <Grid item xs={12} lg={8}>
                <Box
                  sx={{
                    mb: 3,
                    padding: 3,
                    background: "white",
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h5" fontWeight="700" gutterBottom>
                        Ranking de Clientes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lista ordenada por frecuencia de compras
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
                  <FrequentCustomersTableReport customers={customers} />
                </Box>
              </Grid>

              {/* Sidebar de métricas */}
              <Grid item xs={12} lg={4}>
                <Box display="flex" flexDirection="column" gap={4}>
                  {/* Cliente Más Valioso */}
                  {clienteMasValioso && (
                    <Box
                      sx={{
                        padding: 4,
                        background: `linear-gradient(135deg, ${alpha(
                          "#FFD700",
                          0.08
                        )} 0%, ${alpha("#FFA500", 0.08)} 100%)`,
                        borderRadius: 3,
                        border: `2px solid ${alpha("#FFD700", 0.2)}`,
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(255, 215, 0, 0.15)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -25,
                          right: -25,
                          fontSize: "6rem",
                          opacity: 0.1,
                        }}
                      >
                        🏆
                      </Box>
                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Chip
                            label="Cliente Más Valioso"
                            size="small"
                            sx={{
                              backgroundColor: alpha("#FFD700", 0.2),
                              color: "#B8860B",
                              fontWeight: 700,
                            }}
                          />
                          {useMockData && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Ejemplo
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          gutterBottom
                          sx={{ mt: 1 }}
                        >
                          {clienteMasValioso.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          gutterBottom
                        >
                          ${clienteMasValioso.totalSpent.toLocaleString()} en{" "}
                          {clienteMasValioso.purchases} compras
                        </Typography>
                        <Chip
                          label={clienteMasValioso.type}
                          size="small"
                          sx={{
                            mt: 1,
                            backgroundColor:
                              TYPE_COLORS[clienteMasValioso.type] + "20",
                            color: TYPE_COLORS[clienteMasValioso.type],
                            fontWeight: 700,
                            border: `1px solid ${
                              TYPE_COLORS[clienteMasValioso.type]
                            }30`,
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Frecuencia de compras */}
                  <Box
                    sx={{
                      padding: 3,
                      background: "white",
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        gutterBottom
                      >
                        Frecuencia de Compras
                      </Typography>
                      {useMockData && (
                        <Typography variant="caption" color="text.secondary">
                          Análisis simulado
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {[
                        ["Alta", frecuenciaAlta, FREQUENCY_COLORS.Alta, "📈"],
                        [
                          "Media",
                          frecuenciaMedia,
                          FREQUENCY_COLORS.Media,
                          "📊",
                        ],
                        ["Baja", frecuenciaBaja, FREQUENCY_COLORS.Baja, "📉"],
                      ].map(([label, value, color, icon]) => (
                        <Box
                          key={label}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            padding: 2,
                            borderRadius: 2,
                            background: alpha(color as string, 0.03),
                            border: `1px solid ${alpha(color as string, 0.1)}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: alpha(color as string, 0.08),
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography sx={{ fontSize: "1.25rem" }}>
                              {icon}
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {label}
                            </Typography>
                          </Box>
                          <Chip
                            label={value}
                            size="small"
                            sx={{
                              backgroundColor: color + "20",
                              color: color,
                              fontWeight: 700,
                              minWidth: 60,
                              border: `1px solid ${color}30`,
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Resumen adicional */}
                  <Box
                    sx={{
                      padding: 3,
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.02
                      )} 0%, ${alpha(
                        theme.palette.secondary.main,
                        0.02
                      )} 100%)`,
                      borderRadius: 3,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        gutterBottom
                      >
                        Resumen de Performance
                      </Typography>
                      {useMockData && (
                        <Typography variant="caption" color="text.secondary">
                          Datos de prueba
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Tasa de Fidelidad Alta:
                        </Typography>
                        <Typography variant="body2" fontWeight="700">
                          {(
                            (frecuenciaAlta / totalClientes) * 100 || 0
                          ).toFixed(1)}
                          %
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Valor Promedio por Compra:
                        </Typography>
                        <Typography variant="body2" fontWeight="700">
                          ${(totalIngresos / totalCompras || 0).toFixed(0)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Clientes Activos:
                        </Typography>
                        <Typography variant="body2" fontWeight="700">
                          {totalClientes}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FrequentCustomersReport;