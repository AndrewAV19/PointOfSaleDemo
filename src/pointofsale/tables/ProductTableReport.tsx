import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Product {
  id: number;
  name: string;
  sales: number;
  revenue: number;
}

interface ProductTableProps {
  products: Product[];
}

const ProductTableReport: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <TableContainer component={Paper} className="shadow-lg rounded-lg">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">Producto</TableCell>
            <TableCell className="font-bold" align="right">Ventas</TableCell>
            <TableCell className="font-bold" align="right">Ingresos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell align="right">{product.sales}</TableCell>
              <TableCell align="right">${product.revenue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTableReport;