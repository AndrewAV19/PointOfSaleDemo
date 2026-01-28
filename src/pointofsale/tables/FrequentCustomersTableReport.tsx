// src/tables/FrequentCustomersTableReport.tsx
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

interface Customer {
  id: number;
  name: string;
  purchases: number;
  totalSpent: number;
}

interface FrequentCustomersTableReportProps {
  customers: Customer[];
}

const FrequentCustomersTableReport: React.FC<FrequentCustomersTableReportProps> = ({
  customers,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell align="right">Compras</TableCell>
            <TableCell align="right">Total Gastado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell align="right">{customer.purchases}</TableCell>
              <TableCell align="right">${customer.totalSpent.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FrequentCustomersTableReport;