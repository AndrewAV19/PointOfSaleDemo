// src/tables/BalanceTableReport.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";

interface BalanceItem {
  id: number;
  type: string;
  amount: number;
  client: string;
  date: string;
}

interface BalanceTableReportProps {
  balanceData: BalanceItem[];
}

const BalanceTableReport: React.FC<BalanceTableReportProps> = ({
  balanceData,
}) => {
  return (
    <Box>
      {/* Título "Últimas 10 ventas" */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Últimas ventas y compras
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Cliente/Proveedor</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balanceData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BalanceTableReport;
