import Customer from "../../models/customer.model";
import Discount from "../../models/discount.model";
import Order from "../../models/order.model";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";
import FilterResult from "../filter-result";

export class MembershipDiscountFilter implements OrderFilter {
  name = "MembershipDiscountFilter";
  private rates = {
    bronze: 0.05,
    silver: 0.1,
    gold: 0.15,
    platinum: 0.2,
  };

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    const customer = context.customer as Customer;
    let updatedOrder = { ...order };

    if (customer && updatedOrder.subtotal) {
      const rate = this.rates[customer.membership] || 0;
      if (rate > 0) {
        const discountValue = updatedOrder.subtotal * rate;
        const discount: Discount = {
          type: "membership",
          value: discountValue,
          description: `Membership discount (${rate * 100}%)`,
        };
        updatedOrder.discounts = [...(updatedOrder.discounts || []), discount];
      }
    }

    return {
      success: true,
      order: updatedOrder,
      errors: [],
      warnings: [],
    };
  }
}
