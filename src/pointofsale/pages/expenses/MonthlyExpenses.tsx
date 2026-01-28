import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  alpha,
  useTheme,
  Popover,
} from "@mui/material";
import {
  MoneyOff,
  TrendingDown,
  Receipt,
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
//import { useExpenseStore } from "../../../stores/expenses.store";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { mockMonthlyExpense } from "../../mocks/tiendaAbarrotes.mock";

const MonthlyExpense: React.FC = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(null);
  // const { monthlyExpense, getMonthlyExpense } = useExpenseStore();

  // useEffect(() => {
  //   const year = currentDate.getFullYear();
  //   const month = currentDate.getMonth() + 1;

  //   getMonthlyExpense(year, month);
  // }, [currentDate, getMonthlyExpense]);

  const data = mockMonthlyExpense;

  const getMonthName = useCallback((date: Date) => {
    return date.toLocaleDateString("es-MX", { month: "long" });
  }, []);

  const getShortMonthName = useCallback((date: Date) => {
    return date.toLocaleDateString("es-MX", { month: "short" });
  }, []);

  const formatDate = useCallback((date: Date) => {
    const monthName = getMonthName(date);
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${date.getFullYear()}`;
  }, [getMonthName]);

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

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  const formatCompactCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const expenseByDayArray = useMemo(() => {
    const generateAllDays = (
      expenseByDay: { [key: string]: number },
      date: Date
    ) => {
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      const days = [];
      const shortMonthName = getShortMonthName(date);
      
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          day: i,
          label: `${i}/${shortMonthName}`,
          Egreso: expenseByDay[i] || 0,
          fullDate: `${i.toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
        });
      }
      return days;
    };

    return generateAllDays(data?.expenseByDay ?? [], currentDate);
  }, [data?.expenseByDay, currentDate, getShortMonthName]);

  const formatXAxis = useCallback((tickItem: string) => {
    const day = parseInt(tickItem.split("/")[0], 10);
    return day % 5 === 0 ? tickItem : "";
  }, []);

  const getBarColor = useCallback((value: number) => {
    if (value === 0) return alpha(theme.palette.error.main, 0.3);
    if (value < 5000) return theme.palette.error.light;
    if (value < 20000) return theme.palette.error.main;
    return theme.palette.error.dark;
  }, [theme]);

  const getPerformanceIndicator = useCallback((totalExpense: number) => {
    if (totalExpense > 50000) return { label: "Alto", color: "error" as const };
    if (totalExpense > 25000) return { label: "Moderado", color: "warning" as const };
    if (totalExpense > 10000) return { label: "Controlado", color: "info" as const };
    return { label: "Bajo", color: "success" as const };
  }, []);

  const performance = useMemo(() => 
    getPerformanceIndicator(data?.totalExpense || 0),
    [data?.totalExpense, getPerformanceIndicator]
  );

  const calendarOpen = Boolean(calendarAnchor);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header Section */}
        <Box className="mb-8">
          <Typography 
            variant="h4" 
            className="font-bold text-gray-900 mb-2"
            sx={{ fontWeight: 600 }}
          >
            Análisis de Egresos Mensuales
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Visión general de los desembolsos y gastos del mes
          </Typography>
        </Box>

        {/* Date Selector */}
        <Card className="mb-8 shadow-lg rounded-2xl">
          <CardContent className="p-4">
            <Box className="flex items-center justify-between">
              <IconButton
                onClick={() => changeMonth("prev")}
                className="text-gray-600 hover:bg-gray-100 transition-colors"
                size="large"
              >
                <ChevronLeft />
              </IconButton>
              
              <Box className="flex items-center gap-4">
                <IconButton
                  onClick={handleCalendarOpen}
                  className="text-gray-500 hover:bg-gray-100 transition-colors"
                  size="medium"
                >
                  <CalendarMonth />
                </IconButton>
                <Box 
                  className="text-center cursor-pointer"
                  onClick={handleCalendarOpen}
                >
                  <Typography 
                    variant="h5" 
                    className="font-semibold text-gray-800 capitalize"
                  >
                    {formatDate(currentDate)}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {currentDate.getFullYear()}
                  </Typography>
                </Box>
                
                <Box className="flex gap-2">
                  {isCurrentMonth && (
                    <Chip 
                      label="Mes Actual" 
                      size="small" 
                      color="error" 
                      variant="filled"
                    />
                  )}
                  <Chip 
                    label={performance.label}
                    size="small"
                    color={performance.color}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <IconButton
                onClick={() => changeMonth("next")}
                className="text-gray-600 hover:bg-gray-100 transition-colors"
                size="large"
                disabled={isCurrentMonth}
              >
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Calendario Popover */}
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
              PaperProps={{
                sx: {
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                },
              }}
            >
              <Box className="p-2">
                <DateCalendar
                  value={currentDate}
                  onChange={handleDateSelect}
                  views={["year", "month"]}
                  openTo="month"
                  sx={{
                    "& .MuiPickersDay-root": {
                      borderRadius: "8px",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.error.main,
                      },
                    },
                    "& .MuiPickersMonth-root": {
                      borderRadius: "8px",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.error.main,
                      },
                    },
                    "& .MuiPickersYear-root": {
                      borderRadius: "8px",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.error.main,
                      },
                    },
                  }}
                />
              </Box>
            </Popover>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} md={4}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Egresos Totales
                  </Typography>
                  <Box className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <MoneyOff className="text-2xl" />
                  </Box>
                </Box>
                <Typography variant="h3" className="font-bold mb-2">
                  {formatCurrency(data?.totalExpense || 0)}
                </Typography>
                <Typography variant="body2" className="text-red-100">
                  Egresos acumulados del mes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
               <CardContent className="p-6 bg-gradient-to-br from-green-600 to-green-700 text-white">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Transacciones
                  </Typography>
                  <Box className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Receipt className="text-2xl" />
                  </Box>
                </Box>
                <Typography variant="h3" className="font-bold mb-2">
                  {data?.numberOfTransactions || 0}
                </Typography>
                <Typography variant="body2" className="text-amber-100">
                  Total de operaciones mensuales
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Ticket Promedio
                  </Typography>
                  <Box className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <TrendingDown className="text-2xl" />
                  </Box>
                </Box>
                <Typography variant="h3" className="font-bold mb-2">
                  {formatCurrency(data?.averageTicket || 0)}
                </Typography>
                <Typography variant="body2" className="text-orange-100">
                  Valor promedio por transacción
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Daily Expense Chart */}
        <Card className="mb-8 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <Box className="flex items-center justify-between mb-6">
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-800"
              >
                Distribución de Egresos por Día
              </Typography>
              <Chip 
                label={`${expenseByDayArray.length} días`}
                size="small"
                variant="outlined"
                color="error"
              />
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={expenseByDayArray}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.6)}
                  vertical={false}
                />
                <XAxis 
                  dataKey="label" 
                  tickFormatter={formatXAxis}
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactCurrency(value)}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Egreso']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `Día: ${payload[0].payload.fullDate}`;
                    }
                    return `Día: ${label}`;
                  }}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="Egreso" 
                  name="Egresos Diarios"
                  radius={[4, 4, 0, 0]}
                >
                  {expenseByDayArray.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.Egreso)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions Table */}
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <Box className="flex items-center justify-between mb-6">
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-800"
              >
                Historial de Transacciones
              </Typography>
              <Chip 
                label={`${data?.lastFiveTransactions?.length || 0} transacciones`}
                size="small"
                variant="outlined"
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold text-gray-700">
                      Fecha y Hora
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700">
                      Monto
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700">
                      Atendido por
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.lastFiveTransactions?.map((tx, index) => (
                    <TableRow 
                      key={tx.id}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                      hover
                    >
                      <TableCell className="text-gray-600">
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleString("es-MX", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Fecha no disponible"}
                      </TableCell>
                      <TableCell className="font-semibold text-red-600">
                        {formatCurrency(tx.total)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={tx.user?.name || "No asignado"} 
                          size="small"
                          variant="outlined"
                          color="error"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthlyExpense;