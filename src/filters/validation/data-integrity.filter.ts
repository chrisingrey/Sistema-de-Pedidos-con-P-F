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

    if (order.items.length == 0)
      errors.push("Order must have at leat one item.");

    for (const item of order.items) {
      if (!item.productId)
        errors.push(`Item: ${JSON.stringify(item)} must contain product id`);

      if (typeof item.quantity !== "number")
        errors.push(`Item: ${JSON.stringify(item)} quantity must be a number`);

      if (item.quantity <= 0)
        errors.push(
          `Item: ${JSON.stringify(item)} quantity must be greater than 0`
        );
    }

    return {
      success: errors.length === 0,
      order,
      errors,
      warnings: [],
    };
  }
}
