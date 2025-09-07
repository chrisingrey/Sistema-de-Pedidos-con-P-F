import Order from "../../models/order.model";
import { CustomerRepository } from "../../repositories/customer.repository";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";
import FilterResult from "../filter-result";

export class CustomerValidationFilter implements OrderFilter {
  name = "CustomerValidationFilter";

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    const customer = CustomerRepository.findById(order.customerId);
    const errors: string[] = [];

    if (!customer) {
      errors.push(`Customer with ID ${order.customerId} does not exist.`);
    } else {
      if (!customer.isActive)
        errors.push(`Customer with ID ${order.customerId} is not active.`);
    }
    if (errors.length == 0) {
      context.customer = customer;
    }
    return {
      success: errors.length === 0,
      order,
      errors,
      warnings: [],
    };
  }
}
