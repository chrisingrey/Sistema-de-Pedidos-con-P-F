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
    const context: ProcessingContext = { products: ProductRepository.getAll() };
    try {
      for (const filter of this.filters) {
        if (config.enabledFilters.includes(filter.name)) {
          const result: FilterResult = await filter.process(
            currentOrder,
            context
          );
          filterResults.push({ name: filter.name, ...result });

          if (!result.success) {
            currentOrder.status = "rejected";
            return {
              success: false,
              finalOrder: currentOrder,
              filterResults,
              executionTime: Date.now() - startTime,
              failedAt: filter.name,
            };
          }
          currentOrder = result.order;
        }
      }
      currentOrder.status = "completed";
      return {
        success: true,
        finalOrder: currentOrder,
        filterResults,
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      currentOrder.status = "rejected";
      return {
        success: false,
        finalOrder: currentOrder,
        filterResults,
        executionTime: Date.now() - startTime,
        failedAt: error.message,
      };
    }
  }
}
