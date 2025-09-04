import { Router } from "express";
import { process } from "../controllers/orders.controller";

const router = Router();

router.post("/process", process);
