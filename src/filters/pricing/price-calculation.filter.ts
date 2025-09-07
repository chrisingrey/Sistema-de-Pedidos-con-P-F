import Order from "../../models/order.model";
import Product from "../../models/product.model";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";
import FilterResult from "../filter-result";

export class PriceCalculationFilter implements OrderFilter {
  name = "PriceCalculationFilter";

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    let subtotal = 0;
    const products = context.products as Product[];

    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        item.unitPrice = product.price;
        item.totalPrice = item.unitPrice * item.quantity;
        subtotal += item.totalPrice;
      }
    }

    const updatedOrder = { ...order, subtotal: subtotal };

    return {
      success: true,
      order: updatedOrder,
      errors: [],
      warnings: [],
    };
  }
}
