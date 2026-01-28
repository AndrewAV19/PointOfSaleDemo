// src/tables/FrequentSuppliersTableReport.tsx
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

interface Supplier {
  id: number;
  name: string;
  deliveries: number;
  totalTransactions: number;
}

interface FrequentSuppliersTableReportProps {
  suppliers: Supplier[];
}

const FrequentSuppliersTableReport: React.FC<FrequentSuppliersTableReportProps> = ({
  suppliers,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Proveedor</TableCell>
            <TableCell align="right">Entregas</TableCell>
            <TableCell align="right">Total Transacciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell align="right">{supplier.deliveries}</TableCell>
              <TableCell align="right">${supplier.totalTransactions.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FrequentSuppliersTableReport;