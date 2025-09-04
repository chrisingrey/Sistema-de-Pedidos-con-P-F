import FilterResult from "../filters/filter-result";
import Order from "../models/order.model";

export default interface PipelineResult {
  success: boolean;
  finalOrder: Order;
  filterResults: FilterResult[];
  executionTime: number;
  failedAt?: string;
}
