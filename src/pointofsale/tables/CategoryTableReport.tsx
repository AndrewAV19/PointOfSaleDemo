// src/tables/CategoryTableReport.tsx
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

interface Category {
  id: number;
  name: string;
  sales: number;
  revenue: number;
}

interface CategoryTableReportProps {
  categories: Category[];
}

const CategoryTableReport: React.FC<CategoryTableReportProps> = ({
  categories,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Categoría</TableCell>
            <TableCell align="right">Ventas</TableCell>
            <TableCell align="right">Ingresos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell align="right">{category.sales}</TableCell>
              <TableCell align="right">${category.revenue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTableReport;