import OrderFilter from "../filters/order.filter";
import Order from "../models/order.model";
import PipelineConfig from "./pipeline-config";
import PipelineResult from "./pipeline-result";

export default interface OrderPipeline {
  filters: OrderFilter[];
  addFilter(filter: OrderFilter): void;
  removeFilter(filterName: string): void;
  process(order: Order, config: PipelineConfig): Promise<PipelineResult>;
}
