import Order from "../../models/order.model";
import Product from "../../models/product.model";
import FilterResult from "../filter-result";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";

export class ProductValidationFilter implements OrderFilter {
  name = "ProductValidationFilter";

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    const errors: string[] = [];
    const products = context.products;
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) errors.push(`Product with ID ${item.productId} does not exist.`);
      else if (product.stock < item.quantity) errors.push(`Insufficient stock for product ${item.productId}.`);
    });
    return {
      success: errors.length === 0,
      order,
      errors,
      warnings: [],
    };
  }
}
