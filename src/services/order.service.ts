import { v4 as uuidv4 } from "uuid";
import OrderPipeline from "../pipelines/order-pipeline";
import Order from "../models/order.model";
import PipelineResult from "../pipelines/pipeline-result";
import { PipelineService } from "./pipeline.service";
import { OrderRepository } from "../repositories/order.repository";

export class OrderService {
  private validationPipeline: OrderPipeline;
  private pricingPipeline: OrderPipeline;

  constructor(
    validationPipeline: OrderPipeline,
    pricingPipeline: OrderPipeline
  ) {
    this.validationPipeline = validationPipeline;
    this.pricingPipeline = pricingPipeline;
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

    let result: PipelineResult;

    const validationResult = await this.validationPipeline.process(
      order,
      PipelineService.getPipelineConfig()
    );

    if (!validationResult.success) {
      result = validationResult;
    } else {
      const pricingResult = await this.pricingPipeline.process(
        validationResult.finalOrder,
        PipelineService.getPipelineConfig()
      );
      result = pricingResult;
    }

    if (result.success) {
      result.finalOrder.status = "completed";
      // Guarda la orden final en el repositorio.
      OrderRepository.create(result.finalOrder);
    } else {
      result.finalOrder.status = "rejected";
      // Guarda la orden final en el repositorio.
      OrderRepository.create(result.finalOrder);
    }

    return result;
  }
}
