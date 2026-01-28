import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import CanceledSalesTableReport from "../../tables/CanceledSalesTableReport";
import { storeSales } from "../../../stores/sales.store";

// Types
interface CanceledSale {
  id: number;
  orderId: string;
  amount: number;
  customer: string;
  date: string;
}

interface PieChartData {
  name: string;
  value: number;
  amount: number;
  color: string;
  customer: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

// Constants
const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
];

// Mock data para ventas canceladas
const MOCK_CANCELED_SALES = [
  { id: 1, orderId: "001", amount: 12500, customer: "Restaurante La Tradición", date: "2024-01-20" },
  { id: 2, orderId: "002", amount: 8500, customer: "Supermercado El Ahorro", date: "2024-01-19" },
  { id: 3, orderId: "003", amount: 16200, customer: "Cafetería Aromas", date: "2024-01-18" },
  { id: 4, orderId: "004", amount: 7200, customer: "Distribuidora Norte S.A.", date: "2024-01-17" },
  { id: 5, orderId: "005", amount: 15300, customer: "Tienda 24/7 Centro", date: "2024-01-16" },
  { id: 6, orderId: "006", amount: 9400, customer: "Familia Rodríguez", date: "2024-01-15" },
  { id: 7, orderId: "007", amount: 11800, customer: "Comedor Comunitario", date: "2024-01-14" },
  { id: 8, orderId: "008", amount: 6200, customer: "Cafetería Express", date: "2024-01-13" },
  { id: 9, orderId: "009", amount: 13400, customer: "Mini Market", date: "2024-01-12" },
  { id: 10, orderId: "010", amount: 7800, customer: "Distribuidora Sur", date: "2024-01-11" },
  { id: 11, orderId: "011", amount: 8900, customer: "Familia García", date: "2024-01-10" },
  { id: 12, orderId: "012", amount: 10500, customer: "Tienda Esquina", date: "2024-01-09" },
  { id: 13, orderId: "013", amount: 4300, customer: "Restaurante El Fogón", date: "2024-01-08" },
  { id: 14, orderId: "014", amount: 11200, customer: "Cafetería Delicias", date: "2024-01-07" },
  { id: 15, orderId: "015", amount: 6900, customer: "Super Tienda", date: "2024-01-06" },
];

// Styles
const styles = {
  card: {
    borderRadius: "20px",
    boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.08)",
    background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
    border: "1px solid rgba(0, 0, 0, 0.03)",
    overflow: "hidden",
    minHeight: "600px",
  },
  header: {
    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    color: "white",
    padding: { xs: "20px", md: "32px" },
    margin: { xs: "-16px -16px 24px -16px", md: "-24px -24px 32px -24px" },
    position: "relative" as const,
    overflow: "hidden",
  },
  headerDecoration: {
    position: "absolute" as const,
    top: "-50px",
    right: "-50px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: { xs: "1.5rem", md: "2rem" },
    fontWeight: "800",
    letterSpacing: "-0.5px",
    marginBottom: "8px",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: { xs: "0.875rem", md: "1rem" },
    fontWeight: "400",
    opacity: 0.9,
    letterSpacing: "0.2px",
    maxWidth: "600px",
  },
  chartContainer: {
    width: "100%",
    height: "400px",
    position: "relative" as const,
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
    borderRadius: "16px",
    background: "white",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
    },
  },
  highlightCard: {
    padding: "24px",
    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    borderRadius: "16px",
    color: "white",
    textAlign: "center" as const,
    boxShadow: "0px 8px 32px rgba(239, 68, 68, 0.3)",
    position: "relative" as const,
    overflow: "hidden",
  },
  legend: {
    paddingTop: "20px",
    fontSize: "12px",
    ".recharts-legend-item": {
      marginBottom: "8px",
    },
  },
  emptyState: {
    padding: "60px 24px",
    textAlign: "center" as const,
    color: "text.secondary",
  },
};

// Custom Components
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box sx={styles.customTooltip}>
        <Typography
          variant="subtitle2"
          fontWeight="700"
          color="#1F2937"
          gutterBottom
        >
          🛑 Pedido {data.name}
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="#6B7280" display="block">
            Cliente: <strong>{data.customer}</strong>
          </Typography>
          <Typography variant="caption" color="#6B7280" display="block">
            Monto perdido: <strong>${data.amount?.toLocaleString()}</strong>
          </Typography>
        </Stack>
      </Box>
    );
  }
  return null;
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
  isMock?: boolean;
}> = ({ title, value, subtitle, color = "#6B7280", icon, isMock = false }) => (
  <Box sx={styles.statCard}>
    <Stack spacing={1}>
      <Typography
        variant="body2"
        fontWeight="600"
        color={color}
        sx={{ opacity: 0.8 }}
      >
        {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="800" color="#1F2937">
        {value}
      </Typography>
      <Box>
        {subtitle && (
          <Typography variant="caption" color="#6B7280">
            {subtitle}
          </Typography>
        )}
        {isMock && (
          <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
            Datos de demostración
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

const CanceledSalesReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { listSales } = storeSales();
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setUseMockData(true);
    }, 500);
  }, []);

  // Data transformation
  const canceledSalesData: CanceledSale[] = useMockData 
    ? MOCK_CANCELED_SALES
    : listSales
        .filter((sale) => sale.state === "cancelada")
        .map((sale) => ({
          id: sale.id || 0,
          orderId: `${String(sale.id).padStart(3, "0")}`,
          amount: sale.total || 0,
          customer: sale.client?.name || "Cliente no disponible",
          date: sale.createdAt
            ? new Date(sale.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }));

  const top10CanceledSales = [...canceledSalesData]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const pieChartData: PieChartData[] = top10CanceledSales.map(
    (sale, index) => ({
      name: sale.orderId,
      value: sale.amount,
      amount: sale.amount,
      customer: sale.customer,
      color: COLORS[index % COLORS.length],
    })
  );

  // Statistics
  const totalVentasCanceladas = canceledSalesData.length;
  const totalMontoCancelado = canceledSalesData.reduce(
    (sum, sale) => sum + sale.amount,
    0
  );
  const promedioMontoCancelado =
    totalVentasCanceladas > 0 ? totalMontoCancelado / totalVentasCanceladas : 0;
  const ventaMasGrande =
    canceledSalesData.length > 0
      ? [...canceledSalesData].sort((a, b) => b.amount - a.amount)[0]
      : null;

  // Empty state
  if (canceledSalesData.length === 0) {
    return (
      <Card sx={styles.card}>
        <CardContent sx={{ padding: 0 }}>
          <Box sx={styles.header}>
            <Box sx={styles.headerDecoration} />
            <Typography variant="h1" sx={styles.title}>
              Informe de Ventas Canceladas
            </Typography>
            <Typography variant="subtitle1" sx={styles.subtitle}>
              Análisis detallado de cancelaciones y pérdidas
            </Typography>
          </Box>
          <Box sx={styles.emptyState}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              🎉 No hay ventas canceladas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Excelente trabajo manteniendo las ventas activas
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={styles.card}>
      <CardContent sx={{ padding: 0 }}>
        {/* Enhanced Header */}
        <Box sx={styles.header}>
          <Box sx={styles.headerDecoration} />
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h1" sx={styles.title}>
                Informe de Ventas Canceladas
              </Typography>
              <Typography variant="subtitle1" sx={styles.subtitle}>
                Análisis de cancelaciones por monto | Top 10 pedidos cancelados
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip
                  label={`${totalVentasCanceladas} Cancelaciones`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`Total: $${totalMontoCancelado.toLocaleString()}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>
            {useMockData && (
              <Chip
                label="Datos de demostración"
                color="warning"
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              />
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ padding: { xs: "20px", md: "0 32px 32px 32px" } }}>
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Total Cancelaciones"
                    value={totalVentasCanceladas}
                    subtitle="Ventas canceladas"
                    color="#EF4444"
                    icon="📊"
                    isMock={useMockData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Monto Total Perdido"
                    value={`$${totalMontoCancelado.toLocaleString()}`}
                    subtitle="Pérdida total"
                    color="#DC2626"
                    icon="💰"
                    isMock={useMockData}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Promedio por Cancelación"
                    value={`$${promedioMontoCancelado.toFixed(2)}`}
                    subtitle="Pérdida promedio"
                    color="#F59E0B"
                    icon="📉"
                    isMock={useMockData}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Chart Section */}
            <Grid item xs={12} lg={8}>
              <Box sx={styles.chartContainer}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Distribución de Ventas Canceladas por Monto
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
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 50 : 80}
                      outerRadius={isMobile ? 100 : 130}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ percent }: { name: string; percent: number }) =>
                        `${(percent * 100).toFixed(0)}%`
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
                    <Legend wrapperStyle={styles.legend} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            {/* Highlight Card */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {ventaMasGrande && (
                  <Box sx={styles.highlightCard}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" fontWeight="700" gutterBottom>
                        🏆 Venta Cancelada Más Grande
                      </Typography>
                      {useMockData && (
                        <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                          Ejemplo
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                      {ventaMasGrande.orderId}
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body1" fontWeight="600">
                        ${ventaMasGrande.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {ventaMasGrande.customer}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {ventaMasGrande.date}
                      </Typography>
                    </Stack>
                  </Box>
                )}

                {/* Additional Insights */}
                <StatCard
                  title="Tasa de Cancelación"
                  value={`${useMockData ? '8.7' : (
                    (totalVentasCanceladas / (listSales.length || 1)) *
                    100
                  ).toFixed(1)}%`}
                  subtitle="Del total de ventas"
                  color="#8B5CF6"
                  icon="📈"
                  isMock={useMockData}
                />
              </Stack>
            </Grid>

            {/* Data Table */}
            <Grid item xs={12}>
              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.06)",
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Lista de Ventas Canceladas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detalle completo de todas las cancelaciones
                    </Typography>
                  </Box>
                  {useMockData && (
                    <Typography variant="caption" color="text.secondary">
                      Mostrando {canceledSalesData.length} ventas canceladas de prueba
                    </Typography>
                  )}
                </Box>
                <CanceledSalesTableReport sales={canceledSalesData} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CanceledSalesReport;