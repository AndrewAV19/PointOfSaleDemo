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
import { mockDailyExpense } from "../../mocks/tiendaAbarrotes.mock";

const DailyExpense: React.FC = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(
    null
  );
  // const { dailyExpense, getDailyExpense } = useExpenseStore();

  // useEffect(() => {
  //   const year = selectedDate.getFullYear();
  //   const month = selectedDate.getMonth() + 1;
  //   const day = selectedDate.getDate();

  //   getDailyExpense(year, month, day);
  // }, [selectedDate, getDailyExpense]);

  const data = mockDailyExpense;

  const changeDate = useCallback((direction: "prev" | "next") => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1));
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
      setSelectedDate(newDate);
      setCalendarAnchor(null);
    }
  };

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const expenseByHourArray = useMemo(() => {
    const generateAllHours = (expenseByHour: { [key: string]: number }) => {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push({
          hour: `${i}:00`,
          Egreso: expenseByHour[i] || 0,
        });
      }
      return hours;
    };

    return generateAllHours(data?.expenseByHour ?? []);
  }, [data?.expenseByHour]);

  const formatXAxis = useCallback((tickItem: string) => {
    const hour = parseInt(tickItem.split(":")[0], 10);
    return hour % 2 === 0 ? tickItem : "";
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  const formatCompactCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const getBarColor = useCallback(
    (value: number) => {
      if (value === 0) return alpha(theme.palette.error.main, 0.3);
      if (value < 1000) return theme.palette.error.light;
      if (value < 5000) return theme.palette.error.main;
      return theme.palette.error.dark;
    },
    [theme]
  );

  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

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
            Análisis de Egresos Diarios
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Monitoreo detallado de gastos y desembolsos operativos
          </Typography>
        </Box>

        {/* Date Selector */}
        <Card className="mb-8 shadow-lg rounded-2xl">
          <CardContent className="p-4">
            <Box className="flex items-center justify-between">
              <IconButton
                onClick={() => changeDate("prev")}
                className="text-gray-600 hover:bg-gray-100 transition-colors"
                size="large"
              >
                <ChevronLeft />
              </IconButton>

              <Box className="flex items-center gap-3">
                <IconButton
                  onClick={handleCalendarOpen}
                  className="text-gray-500 hover:bg-gray-100 transition-colors"
                  size="medium"
                >
                  <CalendarToday />
                </IconButton>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 capitalize cursor-pointer"
                  onClick={handleCalendarOpen}
                >
                  {formatDate(selectedDate)}
                </Typography>
                {isToday && (
                  <Chip
                    label="Hoy"
                    size="small"
                    color="error"
                    variant="filled"
                  />
                )}
              </Box>

              <IconButton
                onClick={() => changeDate("next")}
                className="text-gray-600 hover:bg-gray-100 transition-colors"
                size="large"
                disabled={isToday}
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
                  value={selectedDate}
                  onChange={handleDateSelect}
                  views={["year", "month", "day"]}
                  sx={{
                    "& .MuiPickersDay-root": {
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
                <Typography variant="h4" className="font-bold mb-2">
                  {formatCurrency(data?.totalExpense || 0)}
                </Typography>
                <Typography variant="body2" className="text-red-100">
                  Desembolsos totales del día
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
                <Typography variant="h4" className="font-bold mb-2">
                  {data?.numberOfTransactions || 0}
                </Typography>
                <Typography variant="body2" className="text-amber-100">
                  Operaciones de gasto procesadas
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
                <Typography variant="h4" className="font-bold mb-2">
                  {formatCurrency(data?.averageTicket || 0)}
                </Typography>
                <Typography variant="body2" className="text-orange-100">
                  Valor promedio por transacción
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Hourly Expense Chart */}
        <Card className="mb-8 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <Typography
              variant="h6"
              className="font-semibold mb-6 text-gray-800"
            >
              Distribución de Egresos por Hora
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={expenseByHourArray}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha(theme.palette.divider, 0.6)}
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
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
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Egreso",
                  ]}
                  labelFormatter={(label) => `Hora: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Egreso"
                  name="Egresos por Hora"
                  radius={[4, 4, 0, 0]}
                >
                  {expenseByHourArray.map((entry, index) => (
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
            <Typography
              variant="h6"
              className="font-semibold mb-6 text-gray-800"
            >
              Historial de Transacciones
            </Typography>
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
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
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

export default DailyExpense;