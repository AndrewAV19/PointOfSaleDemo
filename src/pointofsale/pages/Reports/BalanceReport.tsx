import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Skeleton,
  alpha,
  Paper,
  IconButton,
  Popover,
  Fade,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { TooltipProps } from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from "@mui/icons-material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import BalanceTableReport from "../../tables/BalanceTableReport";
import { useIncomeStore } from "../../../stores/income.store";
import { useExpenseStore } from "../../../stores/expenses.store";

// Interfaces para tipado
interface BalanceItem {
  id: number;
  type: "Venta" | "Compra";
  amount: number;
  client: string;
  date: string;
  description?: string;
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

// Paleta de colores profesional mejorada
const COLORS = {
  primary: {
    main: "#6366F1",
    light: "#C7D2FE",
    dark: "#4338CA",
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  },
  success: {
    main: "#10B981",
    light: "#A7F3D0",
    dark: "#047857",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  },
  error: {
    main: "#EF4444",
    light: "#FECACA",
    dark: "#B91C1C",
    gradient: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
  },
  warning: {
    main: "#F59E0B",
    light: "#FDE68A",
    dark: "#D97706",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  },
  info: {
    main: "#3B82F6",
    light: "#DBEAFE",
    dark: "#1D4ED8",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
  },
  background: {
    light: "#F8FAFC",
    paper: "#FFFFFF",
    dark: "#0F172A",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    muted: "#94A3B8",
  },
};

// Mock data para ingresos y egresos
const MOCK_INCOME_TRANSACTIONS = [
  { id: 1, total: 12500, clientName: "Cliente A", saleDate: "2024-01-15T10:30:00Z" },
  { id: 2, total: 8500, clientName: "Cliente B", saleDate: "2024-01-16T14:45:00Z" },
  { id: 3, total: 16200, clientName: "Cliente C", saleDate: "2024-01-17T09:15:00Z" },
  { id: 4, total: 7200, clientName: "Cliente D", saleDate: "2024-01-18T11:20:00Z" },
  { id: 5, total: 15300, clientName: "Cliente E", saleDate: "2024-01-19T16:30:00Z" },
  { id: 6, total: 9400, clientName: "Cliente F", saleDate: "2024-01-20T13:15:00Z" },
  { id: 7, total: 11800, clientName: "Cliente G", saleDate: "2024-01-21T10:00:00Z" },
  { id: 8, total: 6200, clientName: "Cliente H", saleDate: "2024-01-22T15:45:00Z" },
  { id: 9, total: 13400, clientName: "Cliente I", saleDate: "2024-01-23T12:30:00Z" },
  { id: 10, total: 7800, clientName: "Cliente J", saleDate: "2024-01-24T09:45:00Z" },
];

const MOCK_EXPENSE_TRANSACTIONS = [
  { id: 1, total: 4500, providerName: "Proveedor X", shoppingDate: "2024-01-15T08:30:00Z" },
  { id: 2, total: 3200, providerName: "Proveedor Y", shoppingDate: "2024-01-16T12:15:00Z" },
  { id: 3, total: 7800, providerName: "Proveedor Z", shoppingDate: "2024-01-17T14:20:00Z" },
  { id: 4, total: 2100, providerName: "Proveedor W", shoppingDate: "2024-01-18T10:00:00Z" },
  { id: 5, total: 5600, providerName: "Proveedor V", shoppingDate: "2024-01-19T16:45:00Z" },
  { id: 6, total: 3900, providerName: "Proveedor U", shoppingDate: "2024-01-20T11:30:00Z" },
  { id: 7, total: 6700, providerName: "Proveedor T", shoppingDate: "2024-01-21T13:15:00Z" },
  { id: 8, total: 2400, providerName: "Proveedor S", shoppingDate: "2024-01-22T09:00:00Z" },
  { id: 9, total: 5100, providerName: "Proveedor R", shoppingDate: "2024-01-23T15:30:00Z" },
  { id: 10, total: 4300, providerName: "Proveedor Q", shoppingDate: "2024-01-24T14:00:00Z" },
];

// Mock data para estadísticas mensuales
const MOCK_MONTHLY_INCOME = {
  totalIncome: 98300,
  numberOfTransactions: 10,
  lastFiveTransactions: MOCK_INCOME_TRANSACTIONS,
};

const MOCK_MONTHLY_EXPENSE = {
  totalExpense: 45600,
  numberOfTransactions: 10,
  lastFiveTransactions: MOCK_EXPENSE_TRANSACTIONS,
};

// Estilos mejorados con más refinamiento
const cardStyles = {
  borderRadius: "24px",
  boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.08)",
  backgroundColor: COLORS.background.paper,
  border: "1px solid rgba(99, 102, 241, 0.08)",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "&:hover": {
    boxShadow: "0px 16px 48px rgba(99, 102, 241, 0.12)",
    transform: "translateY(-2px)",
  },
};

const headerStyles = {
  background: COLORS.primary.gradient,
  color: "white",
  padding: { xs: "24px", md: "40px" },
  margin: { xs: "-16px -16px 32px -16px", md: "-24px -24px 40px -24px" },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "200px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
    transform: "translate(30%, -30%)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -50,
    left: -50,
    width: "120px",
    height: "120px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
  },
};

const titleStyles = {
  fontSize: { xs: "1.75rem", md: "2.5rem" },
  fontWeight: "800",
  letterSpacing: "-0.02em",
  marginBottom: "8px",
  position: "relative",
  background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const subtitleStyles = {
  fontSize: { xs: "0.9rem", md: "1.1rem" },
  fontWeight: "400",
  opacity: 0.95,
  letterSpacing: "0.02em",
  position: "relative",
  color: "rgba(255, 255, 255, 0.9)",
};

const chartContainerStyles = {
  width: "100%",
  height: "340px",
  position: "relative",
};

const customTooltipStyles = {
  backgroundColor: alpha(COLORS.background.paper, 0.95),
  border: "none",
  borderRadius: "16px",
  boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.15)",
  padding: "20px",
  backdropFilter: "blur(12px)",
  border: `1px solid ${alpha(COLORS.primary.main, 0.1)}`,
};

const statCardStyles = {
  padding: { xs: "20px", md: "28px" },
  borderRadius: "20px",
  border: "1px solid rgba(99, 102, 241, 0.08)",
  backgroundColor: COLORS.background.paper,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 8px 32px rgba(99, 102, 241, 0.12)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: COLORS.primary.gradient,
  },
};

// Función para formatear fecha en formato "26 nov 11:40 am"
const formatDateToDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;

    return `${day} ${month} ${formattedHours}:${minutes} ${ampm}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "Fecha inválida";
  }
};

const BalanceReport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Stores para datos reales
  const {
    monthlyIncome,
    getMonthlyIncome,
    loading: incomeLoading,
  } = useIncomeStore();

  const {
    monthlyExpense,
    getMonthlyExpense,
    loading: expenseLoading,
  } = useExpenseStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [isHovered, setIsHovered] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Cargar datos al montar el componente o cuando cambia la fecha
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usar datos mock en lugar de la API real
        setUseMockData(true);
        
        // Si quieres simular una llamada real, descomenta esto:
        // const year = currentDate.getFullYear();
        // const month = currentDate.getMonth() + 1;
        // await Promise.all([
        //   getMonthlyIncome(year, month),
        //   getMonthlyExpense(year, month),
        // ]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    loadData();
  }, [getMonthlyIncome, getMonthlyExpense, currentDate]);

  // Funciones para el calendario
  const getMonthName = useCallback((date: Date) => {
    return date.toLocaleDateString("es-ES", { month: "long" });
  }, []);

  const formatDate = useCallback(
    (date: Date) => {
      const monthName = getMonthName(date);
      return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${date.getFullYear()}`;
    },
    [getMonthName],
  );

  const changeMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
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

  const handleDateSelect = (newDate: Date | null) => {
    if (newDate) {
      setCurrentDate(newDate);
      setCalendarAnchor(null);
    }
  };

  const isCurrentMonth = useMemo(() => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }, [currentDate]);

  const calendarOpen = Boolean(calendarAnchor);

  // Calcular totales desde los datos mock
  const totalIngresos = useMockData ? MOCK_MONTHLY_INCOME.totalIncome : (monthlyIncome?.totalIncome || 0);
  const totalEgresos = useMockData ? MOCK_MONTHLY_EXPENSE.totalExpense : (monthlyExpense?.totalExpense || 0);
  const balanceNeto = totalIngresos - totalEgresos;
  const margen = totalIngresos > 0 ? (balanceNeto / totalIngresos) * 100 : 0;

  // Preparar datos para la gráfica
  const pieChartData: PieChartData[] = [
    {
      name: "Ingresos",
      value: totalIngresos,
      color: COLORS.success.main,
    },
    {
      name: "Egresos",
      value: totalEgresos,
      color: COLORS.error.main,
    },
  ];

  const balanceData: BalanceItem[] = React.useMemo(() => {
    // Usar datos mock si está activado
    const incomeTransactions = useMockData 
      ? MOCK_INCOME_TRANSACTIONS 
      : monthlyIncome?.lastFiveTransactions || [];
      
    const expenseTransactions = useMockData
      ? MOCK_EXPENSE_TRANSACTIONS
      : monthlyExpense?.lastFiveTransactions || [];

    const salesData: BalanceItem[] = incomeTransactions.map((sale, index) => ({
      id: sale.id || index + 1,
      type: "Venta" as const,
      amount: sale.total || sale.totalAmount || 0,
      client: sale.clientName || sale.client?.name || `Cliente ${String.fromCharCode(65 + index)}`,
      date: formatDateToDisplay(
        sale.saleDate || sale.createdAt || new Date().toISOString(),
      ),
      description: `Venta #${sale.id || index + 1}`,
    }));

    const expensesData: BalanceItem[] = expenseTransactions.map((expense, index) => ({
      id: expense.id || salesData.length + index + 1,
      type: "Compra" as const,
      amount: expense.total || expense.totalAmount || 0,
      client: expense.providerName || expense.provider?.name || `Proveedor ${String.fromCharCode(65 + index)}`,
      date: formatDateToDisplay(
        expense.shoppingDate || expense.createdAt || new Date().toISOString(),
      ),
      description: `Compra #${expense.id || index + 1}`,
    }));

    return [...salesData, ...expensesData]
      .sort((a, b) => {
        const getTimestamp = (dateStr: string) => {
          try {
            const date = new Date(
              dateStr.replace(
                /(\d+) (\w+) (\d+):(\d+) (am|pm)/,
                (_, day, month, hours, minutes, ampm) => {
                  const monthNames = [
                    "ene", "feb", "mar", "abr", "may", "jun",
                    "jul", "ago", "sep", "oct", "nov", "dic"
                  ];
                  const monthIndex = monthNames.findIndex((m) =>
                    m.includes(month.toLowerCase()),
                  );
                  let hour = parseInt(hours);
                  if (ampm === "pm" && hour < 12) hour += 12;
                  if (ampm === "am" && hour === 12) hour = 0;
                  return `${currentDate.getFullYear()}-${monthIndex + 1}-${day} ${hour}:${minutes}`;
                },
              ),
            );
            return date.getTime();
          } catch (error) {
            console.error("Error parseando fecha:", error);
          }
          return 0;
        };

        return getTimestamp(b.date) - getTimestamp(a.date);
      })
      .slice(0, 10);
  }, [monthlyIncome, monthlyExpense, currentDate, useMockData]);

  // Tooltip personalizado mejorado
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = (
        (data.value / (totalIngresos + totalEgresos)) *
        100
      ).toFixed(1);

      return (
        <Paper sx={customTooltipStyles} elevation={0}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "4px",
                backgroundColor: data.color,
                boxShadow: `0 2px 8px ${alpha(data.color, 0.3)}`,
              }}
            />
            <Typography
              variant="subtitle1"
              fontWeight="700"
              color="text.primary"
            >
              {data.name}
            </Typography>
          </Box>
          <Typography
            variant="h5"
            fontWeight="800"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            ${data.value?.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="600">
            {percentage}% del total
          </Typography>
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

  const loading = incomeLoading || expenseLoading;

  // Componente de skeleton para loading mejorado
  const StatSkeleton = () => (
    <Box sx={statCardStyles}>
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Skeleton
        variant="text"
        width="70%"
        height={32}
        sx={{ mx: "auto", mb: 1 }}
      />
      <Skeleton variant="text" width="50%" height={20} sx={{ mx: "auto" }} />
    </Box>
  );

  if (loading) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Card sx={cardStyles}>
          <CardContent sx={{ padding: 0 }}>
            <Box sx={headerStyles}>
              <Typography variant="h1" sx={titleStyles}>
                Balance General
              </Typography>
              <Typography variant="subtitle1" sx={subtitleStyles}>
                Cargando datos financieros...
              </Typography>
            </Box>
            <Box sx={{ padding: "32px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Skeleton
                    variant="rectangular"
                    height={340}
                    sx={{
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${alpha(COLORS.primary.main, 0.1)} 25%, ${alpha(COLORS.primary.main, 0.2)} 50%, ${alpha(COLORS.primary.main, 0.1)} 75%)`,
                      backgroundSize: "200% 100%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <StatSkeleton />
                    <StatSkeleton />
                    <StatSkeleton />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4 }}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Card
        sx={cardStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent sx={{ padding: 0 }}>
          {/* Header con gradiente mejorado */}
          <Box sx={headerStyles}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h1" sx={titleStyles}>
                    Balance General
                  </Typography>
                  <Typography variant="subtitle1" sx={subtitleStyles}>
                    Resumen financiero completo | {formatDate(currentDate)}
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

              {/* Selector de fecha profesional mejorado */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 4,
                  gap: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={() => changeMonth("prev")}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    size="medium"
                  >
                    <ChevronLeft />
                  </IconButton>

                  <Fade in={true} timeout={500}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                        padding: "12px 20px",
                        borderRadius: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease-in-out",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          transform: "translateY(-1px)",
                        },
                      }}
                      onClick={handleCalendarOpen}
                    >
                      <CalendarMonth
                        sx={{ color: "white", fontSize: "1.5rem" }}
                      />
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "700",
                            color: "white",
                            fontSize: { xs: "1.1rem", sm: "1.5rem" },
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {formatDate(currentDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>

                  <IconButton
                    onClick={() => changeMonth("next")}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                    size="medium"
                    disabled={isCurrentMonth}
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {isCurrentMonth && (
                    <Chip
                      label="Mes Actual"
                      size="medium"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: "700",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Calendario Popover mejorado */}
              <Popover
                open={calendarOpen}
                anchorEl={calendarAnchor}
                onClose={handleCalendarClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: {
                    borderRadius: "20px",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    marginTop: 2,
                    border: `1px solid ${alpha(COLORS.primary.main, 0.1)}`,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                  },
                }}
                TransitionComponent={Fade}
              >
                <Box sx={{ p: 3 }}>
                  <DateCalendar
                    value={currentDate}
                    onChange={handleDateSelect}
                    views={["year", "month"]}
                    openTo="month"
                    sx={{
                      "& .MuiPickersDay-root": {
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        "&.Mui-selected": {
                          backgroundColor: COLORS.primary.main,
                          color: "white",
                          boxShadow: `0 4px 12px ${alpha(COLORS.primary.main, 0.3)}`,
                        },
                        "&:hover": {
                          backgroundColor: alpha(COLORS.primary.main, 0.1),
                        },
                      },
                      "& .MuiPickersMonth-root": {
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        "&.Mui-selected": {
                          backgroundColor: COLORS.primary.main,
                          color: "white",
                          boxShadow: `0 4px 12px ${alpha(COLORS.primary.main, 0.3)}`,
                        },
                        "&:hover": {
                          backgroundColor: alpha(COLORS.primary.main, 0.1),
                        },
                      },
                      "& .MuiPickersYear-root": {
                        borderRadius: "10px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        "&.Mui-selected": {
                          backgroundColor: COLORS.primary.main,
                          color: "white",
                          boxShadow: `0 4px 12px ${alpha(COLORS.primary.main, 0.3)}`,
                        },
                        "&:hover": {
                          backgroundColor: alpha(COLORS.primary.main, 0.1),
                        },
                      },
                    }}
                  />
                </Box>
              </Popover>
            </Box>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ padding: { xs: "24px", md: "0 32px 32px 32px" } }}>
            {/* Sección superior: Estadísticas y Gráfica */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Panel de estadísticas */}
              <Grid item xs={12} md={6} lg={4}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Total Ingresos */}
                  <Box
                    sx={{
                      ...statCardStyles,
                      backgroundColor: alpha(COLORS.success.main, 0.03),
                      border: `1px solid ${alpha(COLORS.success.main, 0.1)}`,
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                      <TrendingUp
                        sx={{ color: COLORS.success.main, fontSize: 28 }}
                      />
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight="800"
                      color={COLORS.success.dark}
                      sx={{ mb: 1 }}
                    >
                      ${totalIngresos.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight="600"
                      sx={{ mb: 2 }}
                    >
                      Total Ingresos
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Chip
                        label={`${useMockData ? MOCK_MONTHLY_INCOME.numberOfTransactions : (monthlyIncome?.numberOfTransactions || 0)} ventas`}
                        size="medium"
                        variant="filled"
                        sx={{
                          backgroundColor: alpha(COLORS.success.main, 0.1),
                          color: COLORS.success.dark,
                          fontWeight: "700",
                          border: "none",
                        }}
                      />
                      {useMockData && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          (mock)
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Total Egresos */}
                  <Box
                    sx={{
                      ...statCardStyles,
                      backgroundColor: alpha(COLORS.error.main, 0.03),
                      border: `1px solid ${alpha(COLORS.error.main, 0.1)}`,
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                      <TrendingDown
                        sx={{ color: COLORS.error.main, fontSize: 28 }}
                      />
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight="800"
                      color={COLORS.error.dark}
                      sx={{ mb: 1 }}
                    >
                      ${totalEgresos.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight="600"
                      sx={{ mb: 2 }}
                    >
                      Total Egresos
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Chip
                        label={`${useMockData ? MOCK_MONTHLY_EXPENSE.numberOfTransactions : (monthlyExpense?.numberOfTransactions || 0)} compras`}
                        size="medium"
                        variant="filled"
                        sx={{
                          backgroundColor: alpha(COLORS.error.main, 0.1),
                          color: COLORS.error.dark,
                          fontWeight: "700",
                          border: "none",
                        }}
                      />
                      {useMockData && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          (mock)
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Balance Neto */}
                  <Box
                    sx={{
                      ...statCardStyles,
                      backgroundColor:
                        balanceNeto >= 0
                          ? alpha(COLORS.info.main, 0.03)
                          : alpha(COLORS.warning.main, 0.03),
                      border: `1px solid ${
                        balanceNeto >= 0
                          ? alpha(COLORS.info.main, 0.1)
                          : alpha(COLORS.warning.main, 0.1)
                      }`,
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                      <AccountBalance
                        sx={{
                          color:
                            balanceNeto >= 0
                              ? COLORS.info.main
                              : COLORS.warning.main,
                          fontSize: 28,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight="800"
                      color={
                        balanceNeto >= 0
                          ? COLORS.info.dark
                          : COLORS.warning.dark
                      }
                      sx={{ mb: 1 }}
                    >
                      ${Math.abs(balanceNeto).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight="600"
                      sx={{ mb: 2 }}
                    >
                      {balanceNeto >= 0 ? "Utilidad Neta" : "Pérdida Neta"}
                    </Typography>
                    <Chip
                      label={`Margen: ${margen.toFixed(1)}%`}
                      size="medium"
                      variant="filled"
                      sx={{
                        backgroundColor:
                          balanceNeto >= 0
                            ? alpha(COLORS.info.main, 0.1)
                            : alpha(COLORS.warning.main, 0.1),
                        color:
                          balanceNeto >= 0
                            ? COLORS.info.dark
                            : COLORS.warning.dark,
                        fontWeight: "700",
                        border: "none",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Gráfica de pastel mejorada */}
              <Grid item xs={12} md={6} lg={8}>
                <Paper
                  sx={{
                    ...chartContainerStyles,
                    padding: 4,
                    borderRadius: 3,
                    backgroundColor: alpha(COLORS.primary.main, 0.02),
                    border: `1px solid ${alpha(COLORS.primary.main, 0.08)}`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{
                        textAlign: "center",
                        color: COLORS.text.primary,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Distribución Financiera - {formatDate(currentDate)}
                    </Typography>
                    {useMockData && (
                      <Chip
                        label="Datos de prueba"
                        color="warning"
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 60 : 80}
                        outerRadius={isMobile ? 100 : 120}
                        paddingAngle={3}
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
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={4}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Sección inferior: Movimientos Recientes */}
            <Paper
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${alpha(COLORS.primary.main, 0.08)}`,
                boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0px 8px 32px rgba(99, 102, 241, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  p: 4,
                  backgroundColor: alpha(COLORS.primary.main, 0.02),
                  borderBottom: `1px solid ${alpha(COLORS.primary.main, 0.08)}`,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                      Movimientos Recientes - {formatDate(currentDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Últimas 10 transacciones registradas
                    </Typography>
                  </Box>
                  {useMockData && (
                    <Typography variant="caption" color="text.secondary">
                      Mostrando datos de demostración
                    </Typography>
                  )}
                </Box>
              </Box>
              <BalanceTableReport balanceData={balanceData} />
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default BalanceReport;