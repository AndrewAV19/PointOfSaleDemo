import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Chip,
  alpha,
  Popover,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  EmojiEvents,
  TrendingUp,
  CalendarToday,
  Person,
  AttachMoney,
  Receipt,
} from "@mui/icons-material";
import { useIncomeStore } from "../../../stores/income.store";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";

interface PieChartData {
  name: string;
  value: number;
  sales: number;
  fullName: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

const COLORS = [
  "#2E86AB",
  "#A23B72",
  "#F18F01",
  "#C73E1D",
  "#3B1F2B",
  "#1B5E20",
  "#4A148C",
  "#E65100",
  "#006064",
  "#BF360C",
];

// Mock data para empleados y transacciones
const MOCK_EMPLOYEES = [
  { id: 1, name: "Ana García López", email: "ana@empresa.com" },
  { id: 2, name: "Carlos Rodríguez", email: "carlos@empresa.com" },
  { id: 3, name: "María Fernández", email: "maria@empresa.com" },
  { id: 4, name: "José Martínez", email: "jose@empresa.com" },
  { id: 5, name: "Laura Sánchez", email: "laura@empresa.com" },
  { id: 6, name: "Miguel Torres", email: "miguel@empresa.com" },
  { id: 7, name: "Sofía Ramírez", email: "sofia@empresa.com" },
  { id: 8, name: "David González", email: "david@empresa.com" },
  { id: 9, name: "Elena Castro", email: "elena@empresa.com" },
  { id: 10, name: "Roberto Díaz", email: "roberto@empresa.com" },
];

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    total: 12500,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[0],
  },
  {
    id: 2,
    total: 8500,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[1],
  },
  {
    id: 3,
    total: 16200,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[0],
  },
  {
    id: 4,
    total: 7200,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[2],
  },
  {
    id: 5,
    total: 15300,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[3],
  },
  {
    id: 6,
    total: 9400,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[1],
  },
  {
    id: 7,
    total: 11800,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[4],
  },
  {
    id: 8,
    total: 6200,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[2],
  },
  {
    id: 9,
    total: 13400,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[5],
  },
  {
    id: 10,
    total: 7800,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[3],
  },
  {
    id: 11,
    total: 11200,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[6],
  },
  {
    id: 12,
    total: 8900,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[7],
  },
  {
    id: 13,
    total: 14500,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[8],
  },
  {
    id: 14,
    total: 6800,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[9],
  },
  {
    id: 15,
    total: 12300,
    createdAt: new Date().toISOString(),
    user: MOCK_EMPLOYEES[0],
  },
];

const cardStyles = {
  borderRadius: "20px",
  boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.12)",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.15)",
  },
};

const headerStyles = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: { xs: "20px", md: "28px" },
  margin: { xs: "-12px -12px 20px -12px", md: "-16px -16px 24px -16px" },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
  },
};

const titleStyles = {
  fontSize: { xs: "1.25rem", md: "1.75rem" },
  fontWeight: "800",
  letterSpacing: "-0.5px",
  marginBottom: "4px",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const subtitleStyles = {
  fontSize: { xs: "0.75rem", md: "0.875rem" },
  fontWeight: "400",
  opacity: 0.95,
  letterSpacing: "0.3px",
};

const chartContainerStyles = {
  width: "100%",
  height: { xs: "300px", md: "400px" },
  position: "relative",
  background: "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)",
  borderRadius: "16px",
  padding: "16px",
};

const customTooltipStyles = {
  backgroundColor: "white",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.15)",
  padding: "16px 20px",
  backdropFilter: "blur(10px)",
};

const statCardStyles = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "16px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid rgba(0,0,0,0.03)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box sx={customTooltipStyles}>
        <Typography
          variant="subtitle2"
          fontWeight="700"
          color="#1a1a1a"
          gutterBottom
        >
          {data.fullName}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoney sx={{ fontSize: 16, color: "#667eea" }} />
          <Typography variant="body2" fontWeight="600" color="#667eea">
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(data.sales)}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

const TopEmployees: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const [calendarAnchor, setCalendarAnchor] = useState<HTMLElement | null>(
    null
  );
  const { monthlyIncome, getMonthlyIncome } = useIncomeStore();
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usar datos mock en lugar de la API real
        setUseMockData(true);
        
        // Si quieres simular una llamada real, descomenta esto:
        // if (currentDate) {
        //   const year = currentDate.getFullYear();
        //   const month = currentDate.getMonth() + 1;
        //   getMonthlyIncome(year, month);
        // }
      } catch (err) {
        console.error("Error fetching income data:", err);
      }
    };

    fetchData();
  }, [currentDate, getMonthlyIncome]);

  const employeeSalesData = useMemo(() => {
    // Usar datos mock si está activado
    const transactions = useMockData 
      ? MOCK_TRANSACTIONS 
      : monthlyIncome?.lastFiveTransactions || [];

    const employeeMap = new Map();

    transactions.forEach((transaction) => {
      const employee = transaction.user;
      if (!employee) return;

      const employeeId = employee.id;
      const saleAmount = transaction.total || 0;

      if (employeeMap.has(employeeId)) {
        const existing = employeeMap.get(employeeId);
        employeeMap.set(employeeId, {
          ...existing,
          sales: existing.sales + saleAmount,
          transactions: existing.transactions + 1,
        });
      } else {
        employeeMap.set(employeeId, {
          id: employeeId,
          name: employee.name || "Sin nombre",
          avatar: employee.name
            ? employee.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            : "NN",
          sales: saleAmount,
          transactions: 1,
          performance: 0,
        });
      }
    });

    const employees = Array.from(employeeMap.values());

    if (employees.length > 0) {
      const maxSales = Math.max(...employees.map((emp) => emp.sales));
      employees.forEach((emp) => {
        emp.performance = Math.round((emp.sales / maxSales) * 100);
      });
    }

    return employees.sort((a, b) => b.sales - b.sales).slice(0, 10);
  }, [monthlyIncome?.lastFiveTransactions, useMockData]);

  const getMonthName = useCallback((date: Date) => {
    return date.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  }, []);

  const formatDate = useCallback(
    (date: Date | null) => {
      if (!date) return "Seleccionar fecha";
      const monthName = getMonthName(date);
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    },
    [getMonthName]
  );

  const changeMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      if (!prev) return new Date();
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const handleCalendarOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchor(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const handleDateChange = (newDate: Date | null) => {
    setCurrentDate(newDate);
    setCalendarAnchor(null);
  };

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const pieChartData: PieChartData[] = useMemo(() => {
    return employeeSalesData.map((employee) => ({
      name: employee.name.split(" ")[0],
      value: employee.sales,
      sales: employee.sales,
      fullName: employee.name,
    }));
  }, [employeeSalesData]);

  const getRankIcon = useCallback((rank: number) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: "#FFD700", fontSize: 20 }} />;
      case 2:
        return <EmojiEvents sx={{ color: "#C0C0C0", fontSize: 20 }} />;
      case 3:
        return <EmojiEvents sx={{ color: "#CD7F32", fontSize: 20 }} />;
      default:
        return <TrendingUp sx={{ fontSize: 18, color: "#667eea" }} />;
    }
  }, []);

  const getRankColor = useCallback((rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return "#667eea";
    }
  }, []);

  const totalSales = useMemo(
    () => employeeSalesData.reduce((sum, emp) => sum + emp.sales, 0),
    [employeeSalesData]
  );

  const totalTransactions = useMemo(
    () => employeeSalesData.reduce((sum, emp) => sum + emp.transactions, 0),
    [employeeSalesData]
  );

  const calendarOpen = Boolean(calendarAnchor);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Card sx={cardStyles}>
        <CardContent sx={{ padding: 0 }}>
          {/* Header con gradiente */}
          <Box sx={headerStyles}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", md: "flex-start" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h1" sx={titleStyles}>
                    Ranking de Ventas por Empleado
                  </Typography>
                  <Typography variant="subtitle1" sx={subtitleStyles}>
                    Top 10 empleados con más ventas | Análisis detallado del
                    desempeño del equipo
                  </Typography>
                </Box>

                {/* Indicador de datos mock */}
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

                {/* Selector de fecha mejorado */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={() => changeMonth("prev")}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                    size="small"
                  >
                    <ChevronLeft />
                  </IconButton>

                  <Box sx={{ position: "relative" }}>
                    <Chip
                      icon={<CalendarToday sx={{ fontSize: 16 }} />}
                      label={formatDate(currentDate)}
                      onClick={handleCalendarOpen}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        fontWeight: 600,
                        padding: "8px 16px",
                        height: "auto",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.25)",
                        },
                        cursor: "pointer",
                        minWidth: "160px",
                        justifyContent: "flex-start",
                      }}
                    />

                    {/* Popover para el DatePicker */}
                    <Popover
                      open={calendarOpen}
                      anchorEl={calendarAnchor}
                      onClose={handleCalendarClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      sx={{
                        "& .MuiPopover-paper": {
                          borderRadius: "12px",
                          boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.15)",
                          overflow: "hidden",
                        },
                      }}
                    >
                      <DatePicker
                        value={currentDate}
                        onChange={handleDateChange}
                        views={["year", "month"]}
                        openTo="month"
                        disableFuture
                        reduceAnimations
                        sx={{
                          "& .MuiDatePicker-root": {
                            border: "none",
                          },
                          "& .MuiPickersCalendarHeader-root": {
                            padding: "16px",
                          },
                          "& .MuiPickersMonth-monthButton": {
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiPickersYear-yearButton": {
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: "rgba(102, 126, 234, 0.1)",
                            },
                          },
                        }}
                      />
                    </Popover>
                  </Box>

                  <IconButton
                    onClick={() => changeMonth("next")}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                    size="small"
                    disabled={
                      currentDate
                        ? currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear()
                        : false
                    }
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              {/* Estadísticas rápidas mejoradas */}
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={statCardStyles}>
                    <AttachMoney
                      sx={{ fontSize: 32, color: "#667eea", mb: 1 }}
                    />
                    <Typography variant="h5" fontWeight="800" color="#2D3748">
                      {formatCurrency(totalSales)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#718096", fontWeight: 600 }}
                    >
                      VENTAS TOTALES
                    </Typography>
                    {useMockData && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                        Datos de prueba
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={statCardStyles}>
                    <Person sx={{ fontSize: 32, color: "#667eea", mb: 1 }} />
                    <Typography variant="h5" fontWeight="800" color="#2D3748">
                      {employeeSalesData.length}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#718096", fontWeight: 600 }}
                    >
                      EMPLEADOS ACTIVOS
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={statCardStyles}>
                    <Receipt sx={{ fontSize: 32, color: "#667eea", mb: 1 }} />
                    <Typography variant="h5" fontWeight="800" color="#2D3748">
                      {totalTransactions}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#718096", fontWeight: 600 }}
                    >
                      TRANSACCIONES
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ padding: { xs: "16px", md: "24px" } }}>
            {employeeSalesData.length > 0 ? (
              <Grid container spacing={3}>
                {/* Gráfica de pastel */}
                <Grid item xs={12} lg={6}>
                  <Box sx={chartContainerStyles}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#2D3748",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <TrendingUp sx={{ color: "#667eea" }} />
                        Distribución de Ventas - Top 10
                      </Typography>
                      {useMockData && (
                        <Chip
                          label="Mock data"
                          size="small"
                          color="warning"
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
                          paddingAngle={1}
                          dataKey="value"
                          label={({
                            name,
                            percent,
                          }: {
                            name: string;
                            percent: number;
                          }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {pieChartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="white"
                              strokeWidth={3}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "12px",
                          }}
                          formatter={(value: string) => (
                            <span
                              style={{
                                color: "#4A5568",
                                fontSize: "11px",
                                fontWeight: 600,
                              }}
                            >
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {/* Lista de empleados */}
                <Grid item xs={12} lg={6}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#2D3748",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <EmojiEvents sx={{ color: "#667eea" }} />
                        Ranking de Desempeño
                      </Typography>
                      {useMockData && (
                        <Typography variant="caption" color="text.secondary">
                          {employeeSalesData.length} empleados de prueba
                        </Typography>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      {employeeSalesData.map((employee, index) => (
                        <Grid item xs={12} key={employee.id}>
                          <Card
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              border: `2px solid ${alpha(
                                getRankColor(index + 1),
                                0.2
                              )}`,
                              backgroundColor: alpha(
                                getRankColor(index + 1),
                                0.05
                              ),
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateX(8px)",
                                boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ position: "relative" }}>
                                <Avatar
                                  sx={{
                                    bgcolor: getRankColor(index + 1),
                                    width: 48,
                                    height: 48,
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {employee.avatar}
                                </Avatar>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: -4,
                                    right: -4,
                                    backgroundColor: getRankColor(index + 1),
                                    color: "white",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    fontWeight: "800",
                                  }}
                                >
                                  {index + 1}
                                </Box>
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="700"
                                    noWrap
                                  >
                                    {employee.name}
                                  </Typography>
                                  {getRankIcon(index + 1)}
                                </Box>

                                <Typography
                                  variant="h6"
                                  fontWeight="800"
                                  color="#2D3748"
                                  sx={{ mb: 1 }}
                                >
                                  {formatCurrency(employee.sales)}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Chip
                                    label={`${employee.transactions} transacciones`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                  />
                                  <Chip
                                    label={`${employee.performance}% rendimiento`}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha("#48BB78", 0.1),
                                      color: "#48BB78",
                                      fontWeight: "700",
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay datos de ventas para el período seleccionado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intenta seleccionar otro mes o verifica la información de
                  transacciones
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default TopEmployees;