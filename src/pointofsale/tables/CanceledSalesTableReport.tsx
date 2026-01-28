// src/tables/CanceledSalesTableReport.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface CanceledSale {
  id: number;
  orderId: string;
  amount: number;
  customer: string;
  date: string;
}

interface CanceledSalesTableReportProps {
  sales: CanceledSale[];
}

const CanceledSalesTableReport: React.FC<CanceledSalesTableReportProps> = ({
  sales,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID del Pedido</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell align="right">Monto Cancelado</TableCell>
            <TableCell>Fecha de Cancelación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.orderId}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell align="right">${sale.amount.toFixed(2)}</TableCell>
              <TableCell>{sale.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CanceledSalesTableReport;