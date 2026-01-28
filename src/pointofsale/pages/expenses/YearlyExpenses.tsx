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
  CalendarToday,
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
import { mockYearlyExpense } from "../../mocks/tiendaAbarrotes.mock";

const YearlyExpense: React.FC = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(null);
  //const { yearlyExpense, getYearlyExpense } = useExpenseStore();

  // useEffect(() => {
  //   getYearlyExpense(selectedYear);
  // }, [selectedYear, getYearlyExpense]);

  const data = mockYearlyExpense;

  const getMonthName = useCallback((month: number) => {
    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];
    return monthNames[month - 1];
  }, []);

  const changeYear = useCallback((direction: "prev" | "next") => {
    setSelectedYear(prev => direction === "prev" ? prev - 1 : prev + 1);
  }, []);

  const handleCalendarOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchor(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const handleYearSelect = (newDate: Date | null) => {
    if (newDate) {
      setSelectedYear(newDate.getFullYear());
      setCalendarAnchor(null);
    }
  };

  const expenseByMonthArray = useMemo(() => {
    const generateAllMonths = (expenseByMonth: { [key: string]: number }) => {
      const months = [];
      for (let i = 1; i <= 12; i++) {
        months.push({
          month: `${getMonthName(i)}`,
          Egreso: expenseByMonth[i] || 0,
          mesNumero: i,
        });
      }
      return months;
    };

    return generateAllMonths(data?.expenseByMonth ?? []);
  }, [data?.expenseByMonth, getMonthName]);

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

  const getBarColor = useCallback((value: number) => {
    if (value === 0) return alpha(theme.palette.error.main, 0.3);
    if (value < 10000) return theme.palette.error.light;
    if (value < 50000) return theme.palette.error.main;
    return theme.palette.error.dark;
  }, [theme]);

  const getPerformanceIndicator = useCallback((totalExpense: number) => {
    if (totalExpense > 500000) return { label: "Alto", color: "error" as const };
    if (totalExpense > 250000) return { label: "Moderado", color: "warning" as const };
    if (totalExpense > 100000) return { label: "Controlado", color: "info" as const };
    return { label: "Bajo", color: "success" as const };
  }, []);

  const performance = useMemo(() => 
    getPerformanceIndicator(data?.totalExpense || 0),
    [data?.totalExpense, getPerformanceIndicator]
  );

  const isCurrentYear = useMemo(() => {
    return selectedYear === new Date().getFullYear();
  }, [selectedYear]);

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
            Análisis de Egresos Anuales
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Visión completa de los desembolsos y gastos del año
          </Typography>
        </Box>

        {/* Year Selector */}
        <Card className="mb-8 shadow-lg rounded-2xl">
          <CardContent className="p-4">
            <Box className="flex items-center justify-between">
              <IconButton
                onClick={() => changeYear("prev")}
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
                  <CalendarToday />
                </IconButton>
                <Box 
                  className="text-center cursor-pointer"
                  onClick={handleCalendarOpen}
                >
                  <Typography 
                    variant="h5" 
                    className="font-semibold text-gray-800"
                  >
                    {selectedYear}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Año fiscal
                  </Typography>
                </Box>
                
                <Box className="flex gap-2">
                  {isCurrentYear && (
                    <Chip 
                      label="Año Actual" 
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
                onClick={() => changeYear("next")}
                className="text-gray-600 hover:bg-gray-100 transition-colors"
                size="large"
              >
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Calendario Popover para selección de año */}
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
                  value={new Date(selectedYear, 0, 1)}
                  onChange={handleYearSelect}
                  views={["year"]}
                  openTo="year"
                  sx={{
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
                  Egresos acumulados del año
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
                  Total de operaciones anuales
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

        {/* Monthly Expense Chart */}
        <Card className="mb-8 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <Box className="flex items-center justify-between mb-6">
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-800"
              >
                Distribución de Egresos por Mes
              </Typography>
              <Chip 
                label={`${expenseByMonthArray.length} meses`}
                size="small"
                variant="outlined"
                color="error"
              />
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={expenseByMonthArray}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.6)}
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
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
                      return `Mes: ${label} ${selectedYear}`;
                    }
                    return `Mes: ${label}`;
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
                  name="Egresos Mensuales"
                  radius={[4, 4, 0, 0]}
                >
                  {expenseByMonthArray.map((entry, index) => (
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

export default YearlyExpense;