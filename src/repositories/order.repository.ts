import Order from "../models/order.model";

const orders = new Map<string, Order>();

export const OrderRepository = {
  create: (order: Order): Order => {
    orders.set(order.id, order);
    return order;
  },

  findById: (id: string): Order | undefined => {
    return orders.get(id);
  },
};
