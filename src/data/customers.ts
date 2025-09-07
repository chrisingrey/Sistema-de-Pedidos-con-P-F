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
];
