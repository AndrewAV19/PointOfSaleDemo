// mocks/mockPendingPayments.ts

export const pendingPayments = [
    {
      client: { id: 1, name: "Juan Pérez" },
      products: [
        {
          id: 1,
          name: "Sabritas Naturales",
          price: 15.0,
          stock: 44,
          costPrice: 10.0,
          quantity: 1,
        },
        {
          id: 2,
          name: "Sabritas Jalapeño",
          price: 15.0,
          stock: 47,
          costPrice: 10.0,
          quantity: 1,
        },
        {
          id: 6,
          name: "Lala 80ml",
          price: 25.0,
          stock: 50,
          costPrice: 20.0,
          quantity: 2,
        },
      ],
      totalAmount: 70.0,
      paidAmount: 10.0,
      remainingBalance: 45.0,
      state: "pendiente",
    },
  ];