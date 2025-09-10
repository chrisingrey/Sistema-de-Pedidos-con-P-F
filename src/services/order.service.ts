import { v4 as uuidv4 } from "uuid";
import OrderPipeline from "../pipelines/order-pipeline";
import Order from "../models/order.model";
import PipelineResult from "../pipelines/pipeline-result";
import { PipelineService } from "./pipeline.service";
import { OrderRepository } from "../repositories/order.repository";
import { NotFoundError } from "../errors/errors";
import FilterResult from "../filters/filter-result";


export class OrderService {
  private pipeline: OrderPipeline;

  constructor(pipeline: OrderPipeline) {
    this.pipeline = pipeline;
  }


  async processOrder(
    orderData: Omit<
      Order,
      | "id"
      | "status"
      | "createdAt"
      | "subtotal"
      | "taxes"
      | "total"
      | "discounts"
    >
  ): Promise<PipelineResult> {
    const order: Order = {
      id: uuidv4(),
      status: "pending",
      createdAt: new Date(),
      items: orderData.items,
      customerId: orderData.customerId,
    };

    const pipelineResult = await this.pipeline.process(
      order,
      PipelineService.getPipelineConfig()
    );

    const finalOrder = pipelineResult.finalOrder;
    finalOrder.status = pipelineResult.success ? "completed" : "rejected";
    OrderRepository.create({
      ...finalOrder,
      metadata: {
        ...finalOrder.metadata,
        filterResults: pipelineResult.filterResults,
      },
    });

    return {
      success: pipelineResult.success,
      finalOrder,
      filterResults: pipelineResult.filterResults,
      executionTime: pipelineResult.executionTime,
      failedAt: pipelineResult.failedAt,
    };
  }

  getOrderStatus(orderId: string): {
    order: Order;
    filterResults: FilterResult[];
  } {
    const order = OrderRepository.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");
    return { order, filterResults: order.metadata?.filterResults };
  }
}
