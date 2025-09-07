import { Router } from "express";
import { process } from "../controllers/orders.controller";
import { OrderService } from "../services/order.service";

const router = Router();

export default (orderService: OrderService) => {
  router.post("/process", process(orderService));
  return router;
};
