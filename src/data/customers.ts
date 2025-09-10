import Customer from "../models/customer.model";

export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "Alice Johnson",
    email: "alice@example.com",
    membership: "gold",
    address: {
      street: "123 Oak St",
      city: "Springfield",
      country: "USA",
      state: "CA",
      zipCode: "12345",
    },
    isActive: true,
  },
  {
    id: "cust-002",
    name: "Bob Williams",
    email: "bob@example.com",
    membership: "silver",
    address: {
      street: "456 Pine Ave",
      city: "Springfield",
      country: "USA",
      state: "FL",
      zipCode: "12345",
    },
    isActive: false,
  },
  // Cliente sin membresía válida (para test de descuento por membresía)
  {
    id: "cust-nomem",
    name: "Cliente sin membresía",
    email: "nomem@example.com",
    membership: "bronze",
    address: {
      street: "789 Maple Rd",
      city: "Springfield",
      country: "USA",
      state: "TX",
      zipCode: "54321",
    },
    isActive: true,
  },
  // Cliente con dirección incompleta y membresía válida (para test de cálculo de impuestos)
  {
    id: "cust-tax-invalido",
    name: "Cliente con dirección inválida para taxes",
    email: "taxinvalido@example.com",
    membership: "gold",
    address: {
      street: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
    },
    isActive: true,
  },
  // Cliente con dirección válida y membresía válida (para control)
  {
    id: "cust-sindir",
    name: "Cliente sin dirección",
    email: "sindir@example.com",
    membership: "gold",
    address: {
      street: "123 Calle Falsa",
      city: "Ciudad",
      country: "Pais",
      state: "ST",
      zipCode: "00000",
    },
    isActive: true,
  },
];
