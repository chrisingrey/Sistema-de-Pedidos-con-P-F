import Order from "../../models/order.model";
import FilterResult from "../filter-result";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";

export class DataIntegrityFilter implements OrderFilter {
  name = "DataIntegrityFilter";

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    const errors: string[] = [];
    if (!order.customerId) errors.push("Order must have a customer ID.");
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      errors.push("Order must have at least one item.");
    } else {
      order.items.forEach((item) => {
        if (!item.productId) errors.push("Order item must have a product id.");
        if (typeof item.quantity !== "number") errors.push("Order item quantity must be a number.");
        else if (item.quantity <= 0) errors.push("Order item quantity must be greater than 0.");
      });
    }
    return {
      success: errors.length === 0,
      order,
      errors,
      warnings: [],
    };
  }
}
