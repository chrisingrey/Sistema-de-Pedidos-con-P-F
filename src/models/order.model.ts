import Discount from "./discount.model";
import OrderItem from "./order-item.model";

export default interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal?: number;
  discounts?: Discount[];
  taxes?: number;
  shipping?: number;
  total?: number;
  status: "pending" | "processing" | "completed" | "rejected";
  metadata?: Record<string, any>;
  createdAt: Date;
}
