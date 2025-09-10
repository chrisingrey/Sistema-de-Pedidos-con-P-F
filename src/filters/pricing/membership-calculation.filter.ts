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
    const errors: string[] = [];

    if (!customer) {
      return {
        success: false,
        order: updatedOrder,
        errors: ["Customer not found for membership discount calculation."],
        warnings: [],
      };
    }

    if (updatedOrder.subtotal === undefined) {
      return {
        success: false,
        order: updatedOrder,
        errors: ["Order subtotal is required for membership discount calculation."],
        warnings: [],
      };
    }

    const validMemberships = ["silver", "gold", "platinum"];
    if (!validMemberships.includes(customer.membership)) {
      return {
        success: false,
        order: updatedOrder,
        errors: [
          `Customer ${customer.id} does not have a valid membership for discount (found: ${customer.membership}).`
        ],
        warnings: [],
      };
    }

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

    // Si la membresía es válida, aunque la dirección esté incompleta, el filtro debe pasar
    return {
      success: true,
      order: updatedOrder,
      errors: [],
      warnings: [],
    };
  }
}
