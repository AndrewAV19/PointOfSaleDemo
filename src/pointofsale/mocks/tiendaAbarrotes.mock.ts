import type { DailyExpenseDTO, MonthlyExpenseDTO, YearlyExpenseDTO } from "../interfaces/expense.interface";
import type { DailyIncomeDTO, MonthlyIncomeDTO, YearlyIncomeDTO } from "../interfaces/icome.interface";
import type { 
  Categories, 
  Clients, 
  ClientDebtDTO, 
  DataPointOfSale,
  Product,
  ProductRequest,
  CartProduct,
  Sale,
  SaleRequest,
  SaleProductRequest,
  Role,
  RoleRequest,
  Shopping,
  ShoppingRequest,
  ShoppingProductRequest,
  Supplier,
  Users,
  UserRequest
} from "../interfaces/index";

export const mockCategories: Categories[] = [
  {
    id: 1,
    name: "Lácteos y Huevos",
    description: "Leche, queso, yogur, mantequilla y huevos"
  },
  {
    id: 2,
    name: "Abarrotes",
    description: "Arroz, frijoles, pastas y alimentos enlatados"
  },
  {
    id: 3,
    name: "Bebidas",
    description: "Refrescos, jugos, agua y bebidas alcohólicas"
  },
  {
    id: 4,
    name: "Frutas y Verduras",
    description: "Productos frescos de temporada"
  },
  {
    id: 5,
    name: "Carnes y Embutidos",
    description: "Carne de res, pollo, cerdo y embutidos"
  },
  {
    id: 6,
    name: "Limpieza del Hogar",
    description: "Detergentes, desinfectantes y productos de limpieza"
  },
  {
    id: 7,
    name: "Cuidado Personal",
    description: "Jabones, shampoo, pasta dental y productos de higiene"
  },
  {
    id: 8,
    name: "Panadería y Tortillería",
    description: "Pan, tortillas y productos de panadería"
  }
];

export const mockClients: Clients[] = [
  {
    id: 1,
    name: "María González Rodríguez",
    email: "maria.gonzalez@email.com",
    phone: "555-1234-567",
    address: "Calle Primavera #123",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: 12345,
    country: "México"
  },
  {
    id: 2,
    name: "Juan Pérez Martínez",
    email: "juan.perez@email.com",
    phone: "555-2345-678",
    address: "Avenida Reforma #456",
    city: "Guadalajara",
    state: "Jalisco",
    zipCode: 45678,
    country: "México"
  },
  {
    id: 3,
    name: "Ana López García",
    email: "ana.lopez@email.com",
    phone: "555-3456-789",
    address: "Calle Independencia #789",
    city: "Monterrey",
    state: "Nuevo León",
    zipCode: 78901,
    country: "México"
  },
  {
    id: 4,
    name: "Carlos Ramírez Sánchez",
    email: "carlos.ramirez@email.com",
    phone: "555-4567-890",
    address: "Boulevard de los Héroes #234",
    city: "Puebla",
    state: "Puebla",
    zipCode: 56789,
    country: "México"
  },
  {
    id: 5,
    name: "Doña Rosa Martínez",
    email: "rosa.martinez@email.com",
    phone: "555-5678-901",
    address: "Calle del Sol #567",
    city: "Oaxaca",
    state: "Oaxaca",
    zipCode: 67890,
    country: "México"
  }
];

export const mockClientDebts: ClientDebtDTO[] = [
  {
    client: {
      id: 1,
      name: "María González Rodríguez",
      email: "maria@correo.com",
      phone: "23424",
      address: "San Juan bosco, NL"
    },
    products: [
      {
        id: 101,
        name: "Aceite de oliva 1L",
        price: 120.50,
        stock: 50,
        costPrice: 85.00,
        quantity: 2
      },
      {
        id: 102,
        name: "Arroz extra 1kg",
        price: 28.75,
        stock: 150,
        costPrice: 18.50,
        quantity: 5
      },
      {
        id: 103,
        name: "Detergente líquido 3L",
        price: 89.90,
        stock: 30,
        costPrice: 62.00,
        quantity: 1
      }
    ],
    totalAmount: 472.65,
    paidAmount: 200.00,
    remainingBalance: 272.65,
    state: "PENDIENTE"
  },
  {
    client: {
      id: 5,
      name: "Doña Rosa Martínez",
      email: "rosa@correo.com",
      phone: "23434234224",
      address: "San Jose, QRO"
    },
    products: [
      {
        id: 104,
        name: "Leche entera 1L",
        price: 24.50,
        stock: 100,
        costPrice: 16.00,
        quantity: 4
      },
      {
        id: 105,
        name: "Huevos blancos 18pz",
        price: 52.00,
        stock: 80,
        costPrice: 38.00,
        quantity: 2
      },
      {
        id: 106,
        name: "Pan blanco grande",
        price: 35.00,
        stock: 40,
        costPrice: 22.00,
        quantity: 3
      }
    ],
    totalAmount: 274.00,
    paidAmount: 274.00,
    remainingBalance: 0,
    state: "PAGADO"
  }
];

export const mockPointsOfSale: DataPointOfSale[] = [
  {
    id: 1,
    name: "Mi Tienda de abarrotes",
    address: "Av. Principal #100, Local A",
    phone: "555-1000-001",
    printTicket: true
  },
  {
    id: 2,
    name: "Caja Rápida",
    address: "Av. Principal #100, Local A",
    phone: "555-1000-002",
    printTicket: false
  },
  {
    id: 3,
    name: "Caja de Abarrotes",
    address: "Av. Principal #100, Local A",
    phone: "555-1000-003",
    printTicket: true
  }
];

// Mocks para Shopping que serán usados en los DTOs de gastos
const mockShoppingTransactions = [
  {
    id: 1,
    createdAt: "2024-01-15T10:30:00Z",
    amount: 2450.75,
    total: 2450.75,
    supplier: { id: 1, name: "Distribuidora Alimenticia S.A." }
  },
  {
    id: 2,
    createdAt: "2024-01-15T14:45:00Z",
    amount: 1789.50,
    total: 1789.50,
    supplier: { id: 2, name: "Lácteos Frescos del Norte" }
  },
  {
    id: 3,
    createdAt: "2024-01-15T16:20:00Z",
    amount: 3200.00,
    total: 3200.00,
    supplier: { id: 3, name: "Bebidas y Refrescos México" }
  }
];

export const mockDailyExpense: DailyExpenseDTO = {
  totalExpense: 7450.25,
  numberOfTransactions: 15,
  averageTicket: 496.68,
  expenseByHour: {
    8: 1200.50,
    9: 850.75,
    10: 2450.75,
    11: 980.25,
    12: 560.00,
    13: 320.50,
    14: 1789.50,
    15: 650.00,
    16: 3200.00,
    17: 1450.00,
    18: 890.50,
    19: 620.75
  },
  lastFiveTransactions: mockShoppingTransactions as any[]
};

export const mockMonthlyExpense: MonthlyExpenseDTO = {
  totalExpense: 125450.75,
  numberOfTransactions: 320,
  averageTicket: 392.03,
  expenseByDay: {
    1: 4560.50,
    2: 5230.75,
    3: 4890.25,
    4: 5120.00,
    5: 4780.50,
    6: 5320.75,
    7: 4560.00,
    8: 4890.25,
    9: 5120.50,
    10: 4980.75,
    11: 5230.00,
    12: 4560.25,
    13: 4890.50,
    14: 5120.75,
    15: 7450.25,
    16: 4980.00,
    17: 5230.25,
    18: 4560.50,
    19: 4890.75,
    20: 5120.00,
    21: 4780.25,
    22: 5320.50,
    23: 4560.75,
    24: 4890.00,
    25: 5120.25,
    26: 4980.50,
    27: 5230.75,
    28: 4560.00,
    29: 4890.25,
    30: 5120.50,
    31: 4980.75
  },
  lastFiveTransactions: mockShoppingTransactions as any[]
};

export const mockYearlyExpense: YearlyExpenseDTO = {
  totalExpense: 1456320.50,
  numberOfTransactions: 3840,
  averageTicket: 379.25,
  expenseByMonth: {
    1: 125450.75,
    2: 118920.50,
    3: 132450.25,
    4: 127890.75,
    5: 135620.50,
    6: 129870.25,
    7: 142560.75,
    8: 138920.50,
    9: 126450.25,
    10: 132890.75,
    11: 128620.50,
    12: 142870.25
  },
  lastFiveTransactions: mockShoppingTransactions as any[]
};

// Mocks para Sale que serán usados en los DTOs de ingresos
const mockSaleTransactions = [
  {
    id: 1,
    createdAt: "2024-01-15T09:15:00Z",
    amount: 345.75,
    total: 345.75,
    client: { id: 1, name: "María González Rodríguez" }
  },
  {
    id: 2,
    createdAt: "2024-01-15T11:30:00Z",
    amount: 128.50,
    total: 128.50,
    client: { id: 2, name: "Juan Pérez Martínez" }
  },
  {
    id: 3,
    createdAt: "2024-01-15T13:45:00Z",
    amount: 456.25,
    total: 456.25,
    client: { id: 3, name: "Ana López García" }
  },
  {
    id: 4,
    createdAt: "2024-01-15T16:20:00Z",
    amount: 234.90,
    total: 234.90,
    client: { id: 4, name: "Carlos Ramírez Sánchez" }
  },
  {
    id: 5,
    createdAt: "2024-01-15T18:35:00Z",
    amount: 567.30,
    total: 567.30,
    client: { id: 5, name: "Doña Rosa Martínez" }
  }
];

export const mockDailyIncome: DailyIncomeDTO = {
  totalIncome: 12345.75,
  numberOfTransactions: 85,
  averageTicket: 145.24,
  incomeByHour: {
    7: 560.50,
    8: 1240.75,
    9: 2345.25,
    10: 1890.50,
    11: 2560.75,
    12: 3120.25,
    13: 2780.50,
    14: 2345.75,
    15: 1890.25,
    16: 2560.50,
    17: 3120.75,
    18: 2780.25,
    19: 2345.50,
    20: 1890.75,
    21: 1560.25
  },
  lastFiveTransactions: mockSaleTransactions as any[]
};

export const mockMonthlyIncome: MonthlyIncomeDTO = {
  totalIncome: 345678.50,
  numberOfTransactions: 2550,
  averageTicket: 135.56,
  incomeByDay: {
    1: 12345.75,
    2: 11230.50,
    3: 13450.25,
    4: 11890.75,
    5: 12650.50,
    6: 14230.25,
    7: 11890.75,
    8: 12650.50,
    9: 13450.25,
    10: 11890.75,
    11: 14230.50,
    12: 12650.25,
    13: 13450.75,
    14: 11890.50,
    15: 12345.75,
    16: 12650.25,
    17: 13450.75,
    18: 11890.50,
    19: 14230.25,
    20: 12650.75,
    21: 13450.50,
    22: 11890.25,
    23: 14230.75,
    24: 12650.50,
    25: 13450.25,
    26: 11890.75,
    27: 14230.50,
    28: 12650.25,
    29: 13450.75,
    30: 11890.50,
    31: 14230.25
  },
  lastFiveTransactions: mockSaleTransactions as any[]
};

export const mockYearlyIncome: YearlyIncomeDTO = {
  totalIncome: 4123456.75,
  numberOfTransactions: 30600,
  averageTicket: 134.75,
  incomeByMonth: {
    1: 345678.50,
    2: 312450.75,
    3: 356890.25,
    4: 342120.50,
    5: 367890.75,
    6: 352340.25,
    7: 378910.50,
    8: 365430.75,
    9: 342120.25,
    10: 356890.50,
    11: 367890.75,
    12: 412340.25
  },
  lastFiveTransactions: mockSaleTransactions as any[]
};

export const mockProducts: Product[] = [
  {
    id: 101,
    name: "Leche Entera LALA 1L",
    barCode: "7501006554012",
    description: "Leche entera pasteurizada 1 litro",
    price: 24.50,
    stock: 150,
    costPrice: 16.00,
    discount: 0,
    taxRate: 0.16,
    category: mockCategories[0],
    image: "https://example.com/images/leche-lala.jpg"
  },
  {
    id: 102,
    name: "Arroz Extra Moreno 1kg",
    barCode: "7501001234567",
    description: "Arroz de grano largo 1 kilogramo",
    price: 28.75,
    stock: 200,
    costPrice: 18.50,
    discount: 5,
    taxRate: 0.16,
    category: mockCategories[1],
    image: "https://example.com/images/arroz-moreno.jpg"
  },
  {
    id: 103,
    name: "Aceite de Oliva Carbonell 1L",
    barCode: "8410028001234",
    description: "Aceite de oliva virgen extra 1 litro",
    price: 120.50,
    stock: 75,
    costPrice: 85.00,
    discount: 10,
    taxRate: 0.16,
    category: mockCategories[1],
    image: "https://example.com/images/aceite-carbonell.jpg"
  },
  {
    id: 104,
    name: "Coca-Cola 2L",
    barCode: "7501055301049",
    description: "Refresco de cola 2 litros",
    price: 35.00,
    stock: 120,
    costPrice: 22.50,
    discount: 0,
    taxRate: 0.16,
    category: mockCategories[2],
    image: "https://example.com/images/cocacola-2l.jpg"
  },
  {
    id: 105,
    name: "Jabón Zote Grande",
    barCode: "7501006554321",
    description: "Jabón de lavandería 650 gramos",
    price: 18.50,
    stock: 80,
    costPrice: 12.00,
    discount: 0,
    taxRate: 0.16,
    category: mockCategories[6],
    image: "https://example.com/images/zote.jpg"
  },
  {
    id: 106,
    name: "Huevo San Juan 18 piezas",
    barCode: "7501006554123",
    description: "Huevo blanco grado AA 18 piezas",
    price: 52.00,
    stock: 60,
    costPrice: 38.00,
    discount: 3,
    taxRate: 0,
    category: mockCategories[0],
    image: "https://example.com/images/huevos-san-juan.jpg"
  },
  {
    id: 107,
    name: "Detergente Ariel 3kg",
    barCode: "7501006554789",
    description: "Detergente en polvo para ropa 3 kilogramos",
    price: 189.90,
    stock: 45,
    costPrice: 145.00,
    discount: 15,
    taxRate: 0.16,
    category: mockCategories[5],
    image: "https://example.com/images/ariel-3kg.jpg"
  },
  {
    id: 108,
    name: "Pan Bimbo Grande",
    barCode: "7501006554965",
    description: "Pan de caja blanco grande 680 gramos",
    price: 35.00,
    stock: 90,
    costPrice: 22.00,
    discount: 0,
    taxRate: 0,
    category: mockCategories[7],
    image: "https://example.com/images/pan-bimbo.jpg"
  }
];

export const mockProductRequest: ProductRequest = {
  name: "Atún Dolores en Agua 140g",
  description: "Atún en agua 140 gramos",
  price: 22.50,
  stock: 100,
  costPrice: 15.00,
  discount: 5,
  taxRate: 0.16,
  category: { id: 2 },
  suppliers: [{ id: 1 }],
  barCode: "7501006554456",
  image: "https://example.com/images/atun-dolores.jpg"
};

export const mockCartProducts: CartProduct[] = [
  {
    ...mockProducts[0],
    quantity: 2,
    discountedPrice: 24.50,
    total: 49.00
  },
  {
    ...mockProducts[1],
    quantity: 1,
    discountedPrice: 27.31, // 28.75 con 5% descuento
    total: 27.31
  },
  {
    ...mockProducts[3],
    quantity: 3,
    discountedPrice: 35.00,
    total: 105.00
  }
];

export const mockSales: Sale[] = [
  {
    id: 1001,
    client: mockClients[0],
    user: {
      id: 1,
      name: "Roberto Sánchez",
      email: "roberto@tienda.com",
      phone: "555-1000-001",
      address: "Calle Trabajo #10",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: 12345,
      country: "México",
      roles: [{ id: 2, name: "Vendedor", description: "Empleado de ventas" }],
      enabled: true
    },
    saleProducts: [
      {
        id: 1,
        product: mockProducts[0],
        quantity: 2,
        discount: 0
      },
      {
        id: 2,
        product: mockProducts[1],
        quantity: 1,
        discount: 5
      },
      {
        id: 3,
        product: mockProducts[3],
        quantity: 3,
        discount: 0
      }
    ],
    amount: 181.25,
    state: "COMPLETADA",
    total: 210.25, // Incluye IVA
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 1002,
    client: mockClients[1],
    user: {
      id: 2,
      name: "Laura Mendoza",
      email: "laura@tienda.com",
      phone: "555-1000-002",
      address: "Av. Central #25",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: 12345,
      country: "México",
      roles: [{ id: 2, name: "Vendedor", description: "Empleado de ventas" }],
      enabled: true
    },
    saleProducts: [
      {
        id: 4,
        product: mockProducts[2],
        quantity: 1,
        discount: 10
      },
      {
        id: 5,
        product: mockProducts[5],
        quantity: 1,
        discount: 3
      }
    ],
    amount: 165.50,
    state: "COMPLETADA",
    total: 191.98,
    createdAt: "2024-01-15T14:45:00Z",
    updatedAt: "2024-01-15T14:45:00Z"
  }
];

export const mockSaleRequest: SaleRequest = {
  client: { id: 3 },
  user: { id: 1 },
  saleProducts: [
    {
      product: { id: 101 },
      quantity: 2,
      discount: 0
    },
    {
      product: { id: 104 },
      quantity: 1,
      discount: 5
    }
  ]
};

export const mockSaleProductRequest: SaleProductRequest = {
  product: { id: 101 },
  quantity: 2,
  discount: 0
};

export const mockRoles: Role[] = [
  {
    id: 1,
    name: "Administrador",
    description: "Acceso completo al sistema",
    users: [],
    permissions: [
      { id: 1, name: "VIEW_ALL_SALES", description: "Ver todas las ventas" },
      { id: 2, name: "CREATE_PRODUCT", description: "Crear productos" },
      { id: 3, name: "EDIT_PRODUCT", description: "Editar productos" }
    ]
  },
  {
    id: 2,
    name: "Vendedor",
    description: "Puede realizar ventas y consultar productos",
    users: [],
    permissions: [
      { id: 1, name: "VIEW_ALL_SALES", description: "Ver todas las ventas" },
      { id: 4, name: "CREATE_SALE", description: "Crear ventas" }
    ]
  },
  {
    id: 3,
    name: "Almacenista",
    description: "Gestiona inventario y compras",
    users: [],
    permissions: [
      { id: 2, name: "CREATE_PRODUCT", description: "Crear productos" },
      { id: 3, name: "EDIT_PRODUCT", description: "Editar productos" },
      { id: 5, name: "CREATE_SHOPPING", description: "Crear compras" }
    ]
  }
];


export const mockRolesStore = {
  getState: () => ({
    listRoles: [
      {
        id: 1,
        name: "Administrador",
        description: "Acceso completo al sistema",
        users: [],
        permissions: [
          { id: 1, name: "VIEW_ALL_SALES", description: "Ver todas las ventas" },
          { id: 2, name: "CREATE_PRODUCT", description: "Crear productos" },
          { id: 3, name: "EDIT_PRODUCT", description: "Editar productos" }
        ]
      },
      {
        id: 2,
        name: "Vendedor",
        description: "Puede realizar ventas y consultar productos",
        users: [],
        permissions: [
          { id: 1, name: "VIEW_ALL_SALES", description: "Ver todas las ventas" },
          { id: 4, name: "CREATE_SALE", description: "Crear ventas" }
        ]
      },
      {
        id: 3,
        name: "Almacenista",
        description: "Gestiona inventario y compras",
        users: [],
        permissions: [
          { id: 2, name: "CREATE_PRODUCT", description: "Crear productos" },
          { id: 3, name: "EDIT_PRODUCT", description: "Editar productos" },
          { id: 5, name: "CREATE_SHOPPING", description: "Crear compras" }
        ]
      }
    ]
  })
};

export const mockRoleRequest: RoleRequest = {
  name: "Supervisor",
  description: "Supervisa ventas y inventario",
  permissionIds: [1, 4, 5]
};

export const mockShopping: Shopping[] = [
  {
    id: 5001,
    supplier: {
      id: 1,
      name: "Distribuidora Alimenticia S.A.",
      contactName: "Jorge Hernández",
      email: "ventas@distribuidora.com",
      phone: "555-2000-001",
      address: "Av. Industria #500",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: 54321,
      country: "México",
      taxId: "DAS850101ABC"
    },
    user: {
      id: 3,
      name: "Carlos Ruiz",
      email: "carlos@tienda.com",
      phone: "555-1000-003",
      address: "Calle Almacén #5",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: 12345,
      country: "México",
      roles: [{ id: 3, name: "Almacenista", description: "Gestiona inventario" }],
      enabled: true
    },
    shoppingProducts: [
      {
        id: 1,
        product: mockProducts[0],
        quantity: 50
      },
      {
        id: 2,
        product: mockProducts[1],
        quantity: 100
      },
      {
        id: 3,
        product: mockProducts[3],
        quantity: 60
      }
    ],
    amount: 2450.75,
    total: 2842.87,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 5002,
    supplier: {
      id: 2,
      name: "Lácteos Frescos del Norte",
      contactName: "Ana Torres",
      email: "ana@lacteosnorte.com",
      phone: "555-2000-002",
      address: "Carretera Norte Km 12.5",
      city: "Querétaro",
      state: "Querétaro",
      zipCode: 67890,
      country: "México",
      taxId: "LFQ950202DEF"
    },
    user: {
      id: 3,
      name: "Carlos Ruiz",
      email: "carlos@tienda.com",
      phone: "555-1000-003",
      address: "Calle Almacén #5",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: 12345,
      country: "México",
      roles: [{ id: 3, name: "Almacenista", description: "Gestiona inventario" }],
      enabled: true
    },
    shoppingProducts: [
      {
        id: 4,
        product: mockProducts[5],
        quantity: 30
      },
      {
        id: 5,
        product: mockProducts[7],
        quantity: 40
      }
    ],
    amount: 1789.50,
    total: 2075.82,
    createdAt: "2024-01-15T14:45:00Z",
    updatedAt: "2024-01-15T14:45:00Z"
  }
];

export const mockShoppingRequest: ShoppingRequest = {
  supplier: { id: 1 },
  user: { id: 3 },
  shoppingProducts: [
    {
      product: { id: 101 },
      quantity: 50
    },
    {
      product: { id: 102 },
      quantity: 100
    }
  ]
};

export const mockShoppingProductRequest: ShoppingProductRequest = {
  product: { id: 101 },
  quantity: 50
};

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Distribuidora Alimenticia S.A.",
    contactName: "Jorge Hernández",
    email: "ventas@distribuidora.com",
    phone: "555-2000-001",
    address: "Av. Industria #500",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: 54321,
    country: "México",
    taxId: "DAS850101ABC",
    website: "www.distribuidora-alimenticia.com"
  },
  {
    id: 2,
    name: "Lácteos Frescos del Norte",
    contactName: "Ana Torres",
    email: "ana@lacteosnorte.com",
    phone: "555-2000-002",
    address: "Carretera Norte Km 12.5",
    city: "Querétaro",
    state: "Querétaro",
    zipCode: 67890,
    country: "México",
    taxId: "LFQ950202DEF",
    website: "www.lacteosnorte.com"
  },
  {
    id: 3,
    name: "Bebidas y Refrescos México",
    contactName: "Roberto Mendoza",
    email: "roberto@bebidas.com",
    phone: "555-2000-003",
    address: "Boulevard Industrial #789",
    city: "Toluca",
    state: "Estado de México",
    zipCode: 34567,
    country: "México",
    taxId: "BRM750303GHI",
    website: "www.bebidas-mexico.com"
  },
  {
    id: 4,
    name: "Abarrotes y Conservas del Sureste",
    contactName: "María de los Ángeles",
    email: "maria@abarrotes.com",
    phone: "555-2000-004",
    address: "Calle Comercio #123",
    city: "Villahermosa",
    state: "Tabasco",
    zipCode: 45678,
    country: "México",
    taxId: "ACS800404JKL"
  }
];

export const mockUsers: Users[] = [
  {
    id: 1,
    name: "Roberto Sánchez",
    email: "roberto@tienda.com",
    password: "hashed_password_123",
    phone: "555-1000-001",
    address: "Calle Trabajo #10",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: 12345,
    country: "México",
    roles: [mockRoles[0]],
    roleNames: ["Administrador"],
    enabled: true
  },
  {
    id: 2,
    name: "Laura Mendoza",
    email: "laura@tienda.com",
    password: "hashed_password_456",
    phone: "555-1000-002",
    address: "Av. Central #25",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: 12345,
    country: "México",
    roles: [mockRoles[1]],
    roleNames: ["Vendedor"],
    enabled: true
  },
  {
    id: 3,
    name: "Carlos Ruiz",
    email: "carlos@tienda.com",
    password: "hashed_password_789",
    phone: "555-1000-003",
    address: "Calle Almacén #5",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: 12345,
    country: "México",
    roles: [mockRoles[2]],
    roleNames: ["Almacenista"],
    enabled: true
  },
  {
    id: 4,
    name: "Sofía Ramírez",
    email: "sofia@tienda.com",
    password: "hashed_password_101",
    phone: "555-1000-004",
    address: "Calle del Sol #15",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: 12345,
    country: "México",
    roles: [mockRoles[1]],
    roleNames: ["Vendedor"],
    enabled: false
  }
];

export const mockUserRequest: UserRequest = {
  name: "Nuevo Empleado",
  email: "nuevo@tienda.com",
  password: "Password123!",
  phone: "555-1000-005",
  address: "Calle Nueva #30",
  city: "Ciudad de México",
  state: "CDMX",
  zipCode: 12345,
  country: "México",
  roleIds: [2]
};

// Función para obtener datos aleatorios para pruebas
export function getRandomMockData() {
  return {
    randomCategory: mockCategories[Math.floor(Math.random() * mockCategories.length)],
    randomClient: mockClients[Math.floor(Math.random() * mockClients.length)],
    randomProduct: mockProducts[Math.floor(Math.random() * mockProducts.length)],
    randomUser: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    randomSupplier: mockSuppliers[Math.floor(Math.random() * mockSuppliers.length)],
    randomSale: mockSales[Math.floor(Math.random() * mockSales.length)]
  };
}

// Exportar todos los mocks en un objeto
export const groceryStoreMocks = {
  categories: mockCategories,
  clients: mockClients,
  clientDebts: mockClientDebts,
  pointsOfSale: mockPointsOfSale,
  dailyExpense: mockDailyExpense,
  monthlyExpense: mockMonthlyExpense,
  yearlyExpense: mockYearlyExpense,
  dailyIncome: mockDailyIncome,
  monthlyIncome: mockMonthlyIncome,
  yearlyIncome: mockYearlyIncome,
  products: mockProducts,
  productRequest: mockProductRequest,
  cartProducts: mockCartProducts,
  sales: mockSales,
  saleRequest: mockSaleRequest,
  saleProductRequest: mockSaleProductRequest,
  roles: mockRoles,
  roleRequest: mockRoleRequest,
  shopping: mockShopping,
  shoppingRequest: mockShoppingRequest,
  shoppingProductRequest: mockShoppingProductRequest,
  suppliers: mockSuppliers,
  users: mockUsers,
  userRequest: mockUserRequest,
  getRandomMockData
};