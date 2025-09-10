import { v4 as uuidv4 } from "uuid";
import OrderPipeline from "../pipelines/order-pipeline";
import Order from "../models/order.model";
import PipelineResult from "../pipelines/pipeline-result";
import { PipelineService } from "./pipeline.service";
import { OrderRepository } from "../repositories/order.repository";
import { NotFoundError } from "../errors/errors";
import FilterResult from "../filters/filter-result";

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

    const validationResult = await this.validationPipeline.process(
      order,
      PipelineService.getPipelineConfig()
    );

    let pricingResult: PipelineResult | null = null;
    let allFilterResults: FilterResult[] = [...validationResult.filterResults];
    let finalOrder = validationResult.finalOrder;
    let success = validationResult.success;
    let failedAt = validationResult.failedAt;
    let executionTime = validationResult.executionTime;

    // Si la validación fue exitosa, ejecutar pricing, pero siempre devolver todos los resultados
    if (validationResult.success) {
      pricingResult = await this.pricingPipeline.process(
        validationResult.finalOrder,
        PipelineService.getPipelineConfig()
      );
      allFilterResults = [
        ...validationResult.filterResults,
        ...pricingResult.filterResults,
      ];
      finalOrder = pricingResult.finalOrder;
      success = pricingResult.success;
      failedAt = pricingResult.failedAt;
      executionTime += pricingResult.executionTime;
    }

    finalOrder.status = success ? "completed" : "rejected";
    OrderRepository.create({
      ...finalOrder,
      metadata: {
        ...finalOrder.metadata,
        filterResults: allFilterResults,
      },
    });

    return {
      success,
      finalOrder,
      filterResults: allFilterResults,
      executionTime,
      failedAt,
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
