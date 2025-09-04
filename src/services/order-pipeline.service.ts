import OrderItem from "../models/order-item.model";
import Order from "../models/order.model";
import { v4 as uuidv4 } from "uuid";

export const OrderService = {
  createOrder(customerId: string, itemIds: string[]): Order {
    const items = this.getItems(itemIds);
    const newOrder = {
      id: uuidv4(),
      customerId: customerId,
      items: items,
      /*
          subtotal?: number;
          discounts?: Discount[];
          taxes?: number;
          shipping?: number;
          total?: number;
          metadata?: Record<string, any>;
          */
      status: "pending" as "pending",
      createdAt: new Date(),
    };

    return newOrder;
  },

  getItems(itemIds: string[]): OrderItem[] {
    return [];
  },
};
