import Order from "../models/order.model";

export default interface FilterResult {
  success: boolean;
  order: Order;
  errors: string[];
  warnings: string[];
}
