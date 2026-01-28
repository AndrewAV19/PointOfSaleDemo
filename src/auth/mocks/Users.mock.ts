export const MOCK_USERS = [
  {
    email: "admin@correo.com",
    password: "123",
    id: 1,
    nombre: "Administrador",
    roles: ["admin"],
    permissions: [
      // Ventas
      "SALES_CREATE",
      "SALES_READ",
      
      // Compras
      "PURCHASES_CREATE",
      "PURCHASES_READ",
      
      // Productos
      "PRODUCTS_CREATE",
      "PRODUCTS_READ",
      
      // Categorías
      "CATEGORIES_CREATE",
      "CATEGORIES_READ",
      
      // Clientes
      "CUSTOMERS_CREATE",
      "CUSTOMERS_READ",
      "CUSTOMERS_PAYMENTS",
      
      // Proveedores
      "SUPPLIERS_CREATE",
      "SUPPLIERS_READ",
      
      // Usuarios
      "USERS_READ",
      
      
      // Ingresos
      "INCOME_READ",
      
      // Egresos
      "EXPENSES_READ",
      
      // Reportes
      "REPORTS_READ",
      
      // Configuraciones
      "SETTINGS_READ",
    ],
  },
  {
    email: "empleado@correo.com",
    password: "123",
    id: 2,
    nombre: "Empleado",
    roles: ["empleado"],
    permissions: [
      "SALES_CREATE",
      "SALES_READ",
      "PRODUCTS_READ",
      "CUSTOMERS_CREATE",
      "CUSTOMERS_READ",
      "PROFILE_READ",
      "PROFILE_UPDATE"
    ],
  },
];