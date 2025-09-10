import PipelineConfig from "./pipeline-config";
import PipelineResult from "./pipeline-result";
import OrderPipeline from "./order-pipeline";
import Order from "../models/order.model";
import ProcessingContext from "../filters/processing-context";
import FilterResult from "../filters/filter-result";
import OrderFilter from "../filters/order.filter";
import { ProductRepository } from "../repositories/product.repository";

export class OrderProcessingPipeline implements OrderPipeline {
  private _filters: OrderFilter[];

  constructor(filters: OrderFilter[] = []) {
    this._filters = filters;
  }

  get filters(): OrderFilter[] {
    return this._filters;
  }

  addFilter(filter: OrderFilter): void {
    if (!this._filters.some((f) => f.name === filter.name)) {
      this._filters.push(filter);
    }
  }

  removeFilter(filterName: string): void {
    this._filters = this._filters.filter((f) => f.name !== filterName);
  }

  async process(order: Order, config: PipelineConfig): Promise<PipelineResult> {
    const startTime = Date.now();
    const filterResults = [];
    let currentOrder = { ...order };
    let failedAt: string | undefined = undefined;
    let success = true;
  const context: ProcessingContext = {
    products: ProductRepository.getAll(),
  };
  if (order.customerId) {
    const { CustomerRepository } = await import("../repositories/customer.repository");
    const customer = CustomerRepository.findById(order.customerId);
    if (customer) context.customer = customer;
  }
    for (const filter of this.filters) {
      if (config.enabledFilters.includes(filter.name)) {
        const result: FilterResult = await filter.process(
          currentOrder,
          context
        );
        filterResults.push({ name: filter.name, ...result });
        if (!result.success) {
          failedAt = filter.name;
          success = false;
          currentOrder = result.order;
          break;
        }
        currentOrder = result.order;
      }
    }
    currentOrder.status = success ? "completed" : "rejected";
    return {
      success,
      finalOrder: currentOrder,
      filterResults,
      executionTime: Date.now() - startTime,
      failedAt,
    };
  }
}
