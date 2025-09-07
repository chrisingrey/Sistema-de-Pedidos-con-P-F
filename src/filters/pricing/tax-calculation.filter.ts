import Order from "../../models/order.model";
import Product from "../../models/product.model";
import OrderFilter from "../order.filter";
import ProcessingContext from "../processing-context";
import FilterResult from "../filter-result";

export class TaxCalculationFilter implements OrderFilter {
  name = "TaxCalculationFilter";
  private taxRates = {
    electronics: 0.08, // Tasa de impuesto para electrónica
    other: 0.06, // Tasa de impuesto por defecto
  };

  async process(
    order: Order,
    context: ProcessingContext
  ): Promise<FilterResult> {
    const updatedOrder = { ...order };
    const products = context.products as Product[];
    let taxes = 0;

    const totalDiscounts =
      updatedOrder.discounts?.reduce((sum, d) => sum + d.value, 0) || 0;
    const taxableSubtotal = (updatedOrder.subtotal || 0) - totalDiscounts;

    // Lógica simplificada de impuestos basada en la categoría.
    // En un sistema real, el Product tendría una categoría.
    taxes = taxableSubtotal * this.taxRates.electronics;

    updatedOrder.taxes = taxes;

    // Finalizar el cálculo del total
    updatedOrder.total = taxableSubtotal + taxes;

    return {
      success: true,
      order: updatedOrder,
      errors: [],
      warnings: [],
    };
  }
}
