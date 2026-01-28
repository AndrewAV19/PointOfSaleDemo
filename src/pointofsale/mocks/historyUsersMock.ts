import { Users } from "../interfaces/users.interface";

export const users: Users[] = [
    {
        id: 1,
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "+1234567890",
        address: "Calle Falsa 123",
        city: "Ciudad de México",
        state: "CDMX",
        zipCode: 12345,
        country: "México",
        roles: [
            { id: 1, name: "Administrador" },
            { id: 2, name: "Editor" }
        ],
        enabled: true
    },
    {
        id: 2,
        name: "María Gómez",
        email: "maria.gomez@example.com",
        phone: "+1987654321",
        address: "Avenida Siempre Viva 456",
        city: "Guadalajara",
        state: "Jalisco",
        zipCode: 67890,
        country: "México",
        roles: [
            { id: 2, name: "Editor" }
        ],
        enabled: true
    },
    {
        id: 3,
        name: "Carlos López",
        email: "carlos.lopez@example.com",
        phone: "+1122334455",
        address: "Plaza de la Libertad 789",
        city: "Monterrey",
        state: "Nuevo León",
        zipCode: 11223,
        country: "México",
        roles: [
            { id: 3, name: "Usuario" }
        ],
        enabled: false
    }
];
