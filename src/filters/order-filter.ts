import Order from "../models/order.model";
import FilterResult from "./filter-result";
import ProcessingContext from "./processing-context";

export default interface OrderFilter {
  name: string;
  process(order: Order, context: ProcessingContext): Promise<FilterResult>;
}