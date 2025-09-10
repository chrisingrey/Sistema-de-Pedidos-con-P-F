import { Router } from "express";
import { getOrderStatus, process } from "../controllers/orders.controller";
import { OrderService } from "../services/order.service";

const router = Router();

export default (orderService: OrderService) => {
  router.post("/process", process(orderService));
  router.get("/:id/status", getOrderStatus(orderService));
  return router;
};
