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
  AttachMoney,
  TrendingUp,
  Receipt,
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  Analytics,
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
//import { useIncomeStore } from "../../../stores/income.store";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { mockYearlyIncome } from "../../mocks/tiendaAbarrotes.mock";

const YearlyIncome: React.FC = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(null);
  // const { yearlyIncome, getYearlyIncome } = useIncomeStore();

  // useEffect(() => {
  //   getYearlyIncome(selectedYear);
  // }, [selectedYear, getYearlyIncome]);

  const data = mockYearlyIncome;

  const getMonthName = useCallback((month: number) => {
    return new Date(selectedYear, month - 1).toLocaleDateString("es-MX", { 
      month: "short" 
    });
  }, [selectedYear]);

  const getFullMonthName = useCallback((month: number) => {
    return new Date(selectedYear, month - 1).toLocaleDateString("es-MX", { 
      month: "long" 
    });
  }, [selectedYear]);

  const changeYear = useCallback((direction: "prev" | "next") => {
    setSelectedYear(prev => direction === "prev" ? prev - 1 : prev + 1);
  }, []);

  const handleCalendarOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchor(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const handleDateSelect = (newDate: Date | null) => {
    if (newDate) {
      setSelectedYear(newDate.getFullYear());
      setCalendarAnchor(null);
    }
  };

  const isCurrentYear = useMemo(() => {
    return selectedYear === new Date().getFullYear();
  }, [selectedYear]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  const formatCompactCurrency = useCallback((value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const incomeByMonthArray = useMemo(() => {
    const generateAllMonths = (incomeByMonth: { [key: string]: number }) => {
      const months = [];
      for (let i = 1; i <= 12; i++) {
        months.push({
          month: i,
          label: getMonthName(i),
          fullName: getFullMonthName(i),
          Ingreso: incomeByMonth[i] || 0,
          year: selectedYear,
        });
      }
      return months;
    };

    return generateAllMonths(data?.incomeByMonth ?? []);
  }, [data?.incomeByMonth, selectedYear, getMonthName, getFullMonthName]);

  const getBarColor = useCallback((value: number) => {
    if (value === 0) return alpha(theme.palette.primary.main, 0.3);
    if (value < 50000) return theme.palette.primary.light;
    if (value < 200000) return theme.palette.primary.main;
    return theme.palette.primary.dark;
  }, [theme]);

  // Función corregida para usar solo colores válidos de MUI
  const getPerformanceIndicator = useCallback((totalIncome: number) => {
    if (totalIncome > 1000000) return { label: "Excepcional", color: "success" as const };
    if (totalIncome > 500000) return { label: "Excelente", color: "success" as const };
    if (totalIncome > 250000) return { label: "Bueno", color: "primary" as const };
    if (totalIncome > 100000) return { label: "Regular", color: "warning" as const };
    return { label: "En desarrollo", color: "error" as const };
  }, []);

  const performance = useMemo(() => 
    getPerformanceIndicator(data?.totalIncome || 0),
    [data?.totalIncome, getPerformanceIndicator]
  );

  const getTopPerformingMonth = useMemo(() => {
    if (!incomeByMonthArray.length) return null;
    return incomeByMonthArray.reduce((prev, current) => 
      prev.Ingreso > current.Ingreso ? prev : current
    );
  }, [incomeByMonthArray]);

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
            Análisis de Ingresos Anuales
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Visión estratégica del desempeño financiero anual
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
                    variant="h4" 
                    className="font-bold text-gray-800"
                  >
                    {selectedYear}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Año Fiscal
                  </Typography>
                </Box>
                
                <Box className="flex gap-2">
                  {isCurrentYear && (
                    <Chip 
                      label="Año Actual" 
                      size="small" 
                      color="primary" 
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
                disabled={isCurrentYear}
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
                  value={new Date(selectedYear, 0, 1)} // 1 de enero del año seleccionado
                  onChange={handleDateSelect}
                  views={["year"]}
                  openTo="year"
                  sx={{
                    "& .MuiPickersDay-root": {
                      borderRadius: "8px",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                    "& .MuiPickersYear-root": {
                      borderRadius: "8px",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      },
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
          <Grid item xs={12} md={3}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Ingresos Totales
                  </Typography>
                  <Box className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <AttachMoney className="text-2xl" />
                  </Box>
                </Box>
                <Typography variant="h4" className="font-bold mb-2">
                  {formatCurrency(data?.totalIncome || 0)}
                </Typography>
                <Typography variant="body2" className="text-blue-100">
                  Ingresos anuales consolidados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
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
                <Typography variant="body2" className="text-green-100">
                  Operaciones anuales
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Ticket Promedio
                  </Typography>
                  <Box className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <TrendingUp className="text-2xl" />
                  </Box>
                </Box>
                <Typography variant="h4" className="font-bold mb-2">
                  {formatCurrency(data?.averageTicket || 0)}
                </Typography>
                <Typography variant="body2" className="text-purple-100">
                  Valor promedio por transacción
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <Box className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Mejor Mes
                  </Typography>
                  <Box className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Analytics className="text-2xl" />
                  </Box>
                </Box>
                <Typography variant="h4" className="font-bold mb-2">
                  {getTopPerformingMonth?.fullName || "N/A"}
                </Typography>
                <Typography variant="body2" className="text-orange-100">
                  {getTopPerformingMonth ? 
                    formatCurrency(getTopPerformingMonth.Ingreso) : "Sin datos"
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Monthly Income Chart */}
        <Card className="mb-8 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <Box className="flex items-center justify-between mb-6">
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-800"
              >
                Distribución de Ingresos por Mes
              </Typography>
              <Box className="flex gap-2">
                <Chip 
                  label={`Año ${selectedYear}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
                <Chip 
                  label="12 meses"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={incomeByMonthArray}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={alpha(theme.palette.divider, 0.6)}
                  vertical={false}
                />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactCurrency(value)}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Ingreso']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.fullName} ${selectedYear}`;
                    }
                    return `${label} ${selectedYear}`;
                  }}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="Ingreso" 
                  name="Ingresos Mensuales"
                  radius={[4, 4, 0, 0]}
                >
                  {incomeByMonthArray.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.Ingreso)}
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
                Transacciones Recientes del Año
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
                      <TableCell className="font-semibold text-gray-900">
                        {formatCurrency(tx.total)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={tx.user?.name || "No asignado"} 
                          size="small"
                          variant="outlined"
                          color="primary"
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

export default YearlyIncome;