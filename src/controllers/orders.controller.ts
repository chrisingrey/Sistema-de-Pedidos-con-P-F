import { Request, Response } from "express";
import Order from "../models/order.model";
import { OrderService } from "../services/order.service";

export const process = (orderService: OrderService) => {
  return async (req: Request, res: Response) => {
    const order: Omit<
      Order,
      | "id"
      | "status"
      | "createdAt"
      | "subtotal"
      | "taxes"
      | "total"
      | "discounts"
    > = req.body;
    const result = await orderService.processOrder(order);
    res.status(200).json({
      result: {
        sucess: result.success,
        finalOrder: result.finalOrder,
        filterResults: result.filterResults.map((fr) => ({
          name: (fr as any).name,
          success: fr.success,
          errors: fr.errors,
          warning: fr.warnings,
        })),
        executionTime: result.executionTime,
        failedAt: result.failedAt,
      },
    });
  };
};
