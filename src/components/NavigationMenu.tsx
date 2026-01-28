import {
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  LocalShipping as LocalShippingIcon,
  ExitToApp as ExitToAppIcon,
  Add as AddIcon,
  History as HistoryIcon,
  List as ListIcon,
  Person as PersonIcon,
  AssignmentInd as AssignmentIndIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

export const useNavigationMenu = () => {
  const { canAccess } = useAuth();

  const getUserId = () => {
    return localStorage.getItem("id_usuario") || "0";
  };

  const menuStructure = [
    {
      id: "sales",
      text: "Ventas",
      isHeader: false,
      icon: <StoreIcon />,
      requiredPermissions: ["SALES_CREATE", "SALES_READ"],
      subItems: [
        {
          text: "Crear Venta",
          path: "/",
          icon: <AddIcon />,
          requiredPermissions: ["SALES_CREATE"],
        },
        {
          text: "Historial de ventas",
          path: "/ventas/historial",
          icon: <HistoryIcon />,
          requiredPermissions: ["SALES_READ"],
        },
      ],
    },
    {
      id: "purchases",
      text: "Compras",
      isHeader: false,
      icon: <ShoppingCartIcon />,
      requiredPermissions: ["PURCHASES_CREATE", "PURCHASES_READ"],
      subItems: [
        {
          text: "Crear Compra",
          path: "/compras",
          icon: <AddIcon />,
          requiredPermissions: ["PURCHASES_CREATE"],
        },
        {
          text: "Historial de compras",
          path: "/compras/historial",
          icon: <HistoryIcon />,
          requiredPermissions: ["PURCHASES_READ"],
        },
      ],
    },
    {
      id: "inventory",
      text: "Inventario",
      isHeader: false,
      icon: <InventoryIcon />,
      requiredPermissions: [
        "PRODUCTS_CREATE",
        "PRODUCTS_READ",
        "CATEGORIES_CREATE",
        "CATEGORIES_READ",
      ],
      subItems: [
        {
          text: "Agregar Producto",
          path: "/inventario/productos/agregar",
          icon: <AddIcon />,
          requiredPermissions: ["PRODUCTS_CREATE"],
        },
        {
          text: "Ver Productos",
          path: "/inventario/productos/historial",
          icon: <ListIcon />,
          requiredPermissions: ["PRODUCTS_READ"],
        },
        {
          text: "Crear Categoría",
          path: "/inventario/categorias/agregar",
          icon: <AddIcon />,
          requiredPermissions: ["CATEGORIES_CREATE"],
        },
        {
          text: "Ver Categorías",
          path: "/inventario/categorias/historial",
          icon: <ListIcon />,
          requiredPermissions: ["CATEGORIES_READ"],
        },
      ],
    },
    {
      id: "customers",
      text: "Clientes",
      isHeader: false,
      icon: <PeopleIcon />,
      requiredPermissions: [
        "CUSTOMERS_CREATE",
        "CUSTOMERS_READ",
        "CUSTOMERS_PAYMENTS",
      ],
      subItems: [
        {
          text: "Agregar Cliente",
          path: "/clientes/agregar",
          icon: <AddIcon />,
          requiredPermissions: ["CUSTOMERS_CREATE"],
        },
        {
          text: "Historial de Clientes",
          path: "/clientes/historial",
          icon: <HistoryIcon />,
          requiredPermissions: ["CUSTOMERS_READ"],
        },
        {
          text: "Pagos Pendientes",
          path: "/clientes/pagos-pendientes",
          icon: <CreditCardIcon />,
          requiredPermissions: ["CUSTOMERS_PAYMENTS"],
        },
      ],
    },
    {
      id: "suppliers",
      text: "Proveedores",
      isHeader: false,
      icon: <LocalShippingIcon />,
      requiredPermissions: ["SUPPLIERS_CREATE", "SUPPLIERS_READ"],
      subItems: [
        {
          text: "Agregar Proveedor",
          path: "/proveedores/agregar",
          icon: <AddIcon />,
          requiredPermissions: ["SUPPLIERS_CREATE"],
        },
        {
          text: "Historial de Proveedores",
          path: "/proveedores/historial",
          icon: <HistoryIcon />,
          requiredPermissions: ["SUPPLIERS_READ"],
        },
      ],
    },
    // Menú de Usuarios (solo gestión básica de usuarios)
    {
      id: "users",
      text: "Usuarios",
      isHeader: false,
      icon: <PeopleIcon />,
      requiredPermissions: ["USERS_CREATE", "USERS_READ"],
      subItems: [
        {
          text: "Crear Usuario",
          path: "/usuarios/agregar",
          icon: <AddIcon />,
          requiredPermissions: ["USERS_CREATE"],
        },
        {
          text: "Historial de Usuarios",
          path: "/usuarios/historial",
          icon: <HistoryIcon />,
          requiredPermissions: ["USERS_READ"],
        },
      ],
    },
    // Nuevo menú separado para Roles y Permisos
    {
      id: "roles-permissions",
      text: "Roles y Permisos",
      isHeader: false,
      icon: <AdminPanelSettingsIcon />,
      requiredPermissions: [
        "ROLES_CREATE",
        "ROLES_READ",
        "PERMISSIONS_CREATE",
        "PERMISSIONS_READ",
      ],
      subItems: [
        {
          text: "Crear Rol",
          path: "/roles/crear",
          icon: <AssignmentIndIcon />,
          requiredPermissions: ["ROLES_CREATE"],
        },
        {
          text: "Gestión de Roles",
          path: "/roles/historial",
          icon: <ListIcon />,
          requiredPermissions: ["ROLES_READ"],
        },
        // {
        //   text: "Crear Permiso",
        //   path: "/permisos/crear",
        //   icon: <PolicyIcon />,
        //   requiredPermissions: ["PERMISSIONS_CREATE"],
        // },
        // {
        //   text: "Historial de Permisos",
        //   path: "/permisos/historial",
        //   icon: <ListIcon />,
        //   requiredPermissions: ["PERMISSIONS_READ"],
        // },
      ],
    },
    // Mostrar "Mi Perfil" para todos los usuarios
    {
      id: "my-profile",
      text: "Mi Perfil",
      isHeader: false,
      icon: <PersonIcon />,
      requiredPermissions: ["PROFILE_READ", "PROFILE_UPDATE"],
      subItems: [
        {
          text: "Editar Mi Perfil",
          path: `/usuarios/editar?id=${getUserId()}`,
          icon: <PersonIcon />,
          requiredPermissions: ["PROFILE_UPDATE"],
        },
      ],
    },
    {
      id: "income",
      text: "Ingresos",
      isHeader: false,
      icon: <AttachMoneyIcon />,
      requiredPermissions: ["INCOME_READ"],
      subItems: [
        {
          text: "Ingresos del Día",
          path: "/ingresos/dia",
          icon: <BarChartIcon />,
          requiredPermissions: ["INCOME_READ"],
        },
        {
          text: "Ingresos por Mes",
          path: "/ingresos/mes",
          icon: <BarChartIcon />,
          requiredPermissions: ["INCOME_READ"],
        },
        {
          text: "Ingresos por Año",
          path: "/ingresos/anio",
          icon: <BarChartIcon />,
          requiredPermissions: ["INCOME_READ"],
        },
      ],
    },
    {
      id: "expenses",
      text: "Egresos",
      isHeader: false,
      icon: <CreditCardIcon />,
      requiredPermissions: ["EXPENSES_READ"],
      subItems: [
        {
          text: "Egresos del Día",
          path: "/egresos/dia",
          icon: <BarChartIcon />,
          requiredPermissions: ["EXPENSES_READ"],
        },
        {
          text: "Egresos por Mes",
          path: "/egresos/mes",
          icon: <BarChartIcon />,
          requiredPermissions: ["EXPENSES_READ"],
        },
        {
          text: "Egresos por Año",
          path: "/egresos/anio",
          icon: <BarChartIcon />,
          requiredPermissions: ["EXPENSES_READ"],
        },
      ],
    },
    {
      id: "reports",
      text: "Informes",
      isHeader: false,
      icon: <BarChartIcon />,
      requiredPermissions: ["REPORTS_READ"],
      subItems: [
        {
          text: "Ventas por Producto",
          path: "/informes/ventas-producto",
          icon: <ListIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
         {
          text: "Empleados con Más Ventas",
          path: "/informes/empleados-mas-ventas",
          icon: <ListIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
        // {
        //   text: "Ventas por Categoría",
        //   path: "/informes/ventas-categoria",
        //   icon: <ListIcon />,
        //   requiredPermissions: ["REPORTS_READ"],
        // },
        {
          text: "Balance General",
          path: "/informes/balance",
          icon: <BarChartIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
        {
          text: "Informe de Inventario",
          path: "/informes/inventario",
          icon: <ListIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
        {
          text: "Clientes Frecuentes",
          path: "/informes/clientes",
          icon: <PeopleIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
        {
          text: "Proveedores con Más Compras",
          path: "/informes/proveedores",
          icon: <LocalShippingIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
        {
          text: "Informe de Cancelaciones",
          path: "/informes/cancelaciones",
          icon: <HistoryIcon />,
          requiredPermissions: ["REPORTS_READ"],
        },
      ],
    },
    {
      id: "about",
      text: "Acerca de",
      icon: <PeopleIcon />,
      path: "/acerca-de",
      requiredPermissions: [],
      isHeader: false,
    },
    {
      id: "settings",
      text: "Configuraciones",
      icon: <SettingsIcon />,
      path: "/configuraciones",
      requiredPermissions: ["SETTINGS_READ"],
      isHeader: false,
    },
    {
      id: "logout",
      text: "Cerrar sesión",
      icon: <ExitToAppIcon />,
      path: "/auth/login",
      requiredPermissions: [],
      isHeader: false,
    },
  ];

  const filteredMenu = menuStructure
    .map((item) => {
      if (!item.subItems) {
        return item.requiredPermissions.length === 0 ||
          canAccess(item.requiredPermissions)
          ? item
          : null;
      }

      const filteredSubItems = item.subItems.filter((subItem) =>
        canAccess(subItem.requiredPermissions)
      );

      if (filteredSubItems.length > 0) {
        return {
          ...item,
          subItems: filteredSubItems,
        };
      }

      if (canAccess(item.requiredPermissions)) {
        return {
          ...item,
          subItems: [],
        };
      }

      return null;
    })
    .filter((item) => item !== null);

  return filteredMenu;
};
