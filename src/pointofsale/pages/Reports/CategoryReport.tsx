import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
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
import CategoryTableReport from "../../tables/CategoryTableReport";

// Interfaces para tipado
interface Category {
  id: number;
  name: string;
  sales: number;
  revenue: number;
}

interface PieChartData {
  name: string;
  value: number;
  revenue: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

// Datos reales de categorías de abarrotes
const categories: Category[] = [
  { id: 1, name: "Bebidas y Refrescos", sales: 850, revenue: 4250.0 },
  { id: 2, name: "Lácteos y Huevos", sales: 720, revenue: 3600.0 },
  { id: 3, name: "Abarrotes Secos", sales: 680, revenue: 3400.0 },
  { id: 4, name: "Panadería y Pastelería", sales: 550, revenue: 2750.0 },
  { id: 5, name: "Carnes y Embutidos", sales: 480, revenue: 3840.0 },
  { id: 6, name: "Frutas y Verduras", sales: 420, revenue: 2100.0 },
  { id: 7, name: "Limpieza del Hogar", sales: 390, revenue: 1950.0 },
  { id: 8, name: "Cuidado Personal", sales: 350, revenue: 1750.0 },
  { id: 9, name: "Snacks y Dulces", sales: 320, revenue: 1280.0 },
  { id: 10, name: "Congelados", sales: 280, revenue: 1680.0 },
  { id: 11, name: "Conservas y Enlatados", sales: 250, revenue: 1250.0 },
  { id: 12, name: "Aceites y Condimentos", sales: 220, revenue: 1100.0 }
];

// Paleta de colores profesional
const COLORS = [
  "#2E86AB", // Azul profesional
  "#A23B72", // Magenta elegante
  "#F18F01", // Naranja corporativo
  "#C73E1D", // Rojo terroso
  "#3B1F2B", // Borgoña oscuro
  "#1B5E20", // Verde oscuro
  "#4A148C", // Púrpura oscuro
  "#E65100", // Naranja oscuro
  "#006064", // Cyan oscuro
  "#BF360C", // Rojo oscuro
  "#5D4037", // Marrón
  "#37474F", // Gris azulado
];

// Estilos mejorados
const cardStyles = {
  borderRadius: "16px",
  boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
};

const headerStyles = {
  background: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
  color: "white",
  padding: "24px",
  margin: "-16px -16px 24px -16px",
};

const titleStyles = {
  fontSize: { xs: "1.5rem", md: "1.75rem" },
  fontWeight: "700",
  letterSpacing: "-0.5px",
  marginBottom: "8px",
};

const subtitleStyles = {
  fontSize: "0.875rem",
  fontWeight: "400",
  opacity: 0.9,
  letterSpacing: "0.2px",
};

const chartContainerStyles = {
  width: "100%",
  height: "400px",
  position: "relative",
};

const customTooltipStyles = {
  backgroundColor: "white",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
  padding: "12px 16px",
};

const legendStyles = {
  paddingTop: "20px",
  fontSize: "12px",
};

const CategoryReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Obtener las 10 categorías con más ventas
  const top10Categories = [...categories]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const pieChartData: PieChartData[] = top10Categories.map((category) => ({
    name: category.name,
    value: category.sales,
    revenue: category.revenue,
  }));

  // Tooltip personalizado
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={customTooltipStyles}>
          <Typography variant="subtitle2" fontWeight="600" color="#333">
            {data.name}
          </Typography>
          <Typography variant="body2" color="#666">
            Ventas: {data.value} unidades
          </Typography>
          <Typography variant="body2" color="#666">
            Ingresos: ${data.revenue?.toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Calcular estadísticas (usando todas las categorías)
  const totalSales = categories.reduce((sum, category) => sum + category.sales, 0);
  const totalRevenue = categories.reduce(
    (sum, category) => sum + category.revenue,
    0
  );

  return (
    <Card sx={cardStyles}>
      <CardContent sx={{ padding: 0 }}>
        {/* Header con gradiente */}
        <Box sx={headerStyles}>
          <Typography variant="h1" sx={titleStyles}>
            Informe de Ventas por Categoría
          </Typography>
          <Typography variant="subtitle1" sx={subtitleStyles}>
            Top 10 categorías con más ventas | Análisis del desempeño por categoría
          </Typography>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ padding: "0 24px 24px 24px" }}>
          <Grid container spacing={4}>
            {/* Tabla de categorías - mostrar todas las categorías */}
            <Grid item xs={12}>
              <Box
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  marginBottom: "24px",
                }}
              >
                <CategoryTableReport categories={categories} />
              </Box>
            </Grid>

            {/* Gráfica de pastel - mostrar solo top 10 */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  ...chartContainerStyles,
                  marginBottom: "24px"
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 70}
                      outerRadius={isMobile ? 90 : 120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={legendStyles}
                      formatter={(value: string) => (
                        <span style={{ color: "#333", fontSize: "12px" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Estadísticas resumen */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "24px",
                  padding: "16px",
                  backgroundColor: "rgba(0, 176, 155, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 176, 155, 0.1)",
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="700" color="#00b09b">
                    {totalSales.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="#666">
                    Total Ventas
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="700" color="#96c93d">
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="#666">
                    Ingresos Totales
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="700" color="#2E86AB">
                    {categories.length}
                  </Typography>
                  <Typography variant="caption" color="#666">
                    Categorías
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="700" color="#A23B72">
                    {top10Categories.length}
                  </Typography>
                  <Typography variant="caption" color="#666">
                    Top Categorías
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryReport;