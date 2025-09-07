import Discount from "../../models/discount.model";
import Order from "../../models/order.model";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";
import FilterResult from "../filter-result";

export class VolumeDiscountFilter implements OrderFilter {
  name = "VolumeDiscountFilter";

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    let updatedOrder = { ...order };
    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const discounts: Discount[] = updatedOrder.discounts || [];
    const subtotal = updatedOrder.subtotal || 0;

    // Descuento por cantidad de ítems
    if (totalItems > 50) {
      discounts.push({
        type: "volume",
        value: subtotal * 0.1,
        description: "Volume discount (>50 items)",
      });
    } else if (totalItems > 10) {
      discounts.push({
        type: "volume",
        value: subtotal * 0.05,
        description: "Volume discount (>10 items)",
      });
    }

    // Descuento por monto total
    if (subtotal > 5000) {
      discounts.push({
        type: "volume",
        value: subtotal * 0.1,
        description: "High-value order discount (>$5000)",
      });
    } else if (subtotal > 1000) {
      discounts.push({
        type: "volume",
        value: subtotal * 0.05,
        description: "High-value order discount (>$1000)",
      });
    }

    updatedOrder.discounts = discounts;
    return {
      success: true,
      order: updatedOrder,
      errors: [],
      warnings: [],
    };
  }
}
