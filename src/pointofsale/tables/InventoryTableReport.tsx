// src/tables/InventoryTableReport.tsx
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

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  status: string;
}

interface InventoryTableReportProps {
  inventoryData: InventoryItem[];
}

const InventoryTableReport: React.FC<InventoryTableReportProps> = ({
  inventoryData,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell align="right">{item.stock}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTableReport;