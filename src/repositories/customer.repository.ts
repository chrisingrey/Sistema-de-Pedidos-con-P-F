import { customers } from "../data/customers";
import Customer from "../models/customer.model";

export const CustomerRepository = {
  create: (customer: Customer): Customer => {
    customers.push(customer);
    return customer;
  },

  findById: (id: string): Customer | undefined => {
    return customers.find((c) => c.id == id);
  },
};
