import express from "express";
import dotenv from "dotenv";
import orderRoutes from "./src/routes/orders.routes";
import pipelineRoutes from "./src/routes/pipeline.routes";
import { OrderService } from "./src/services/order.service";
import { OrderProcessingPipeline } from "./src/pipelines/order-processing-pipeline";
import { CustomerValidationFilter } from "./src/filters/validation/customer-validation.filter";
import { DataIntegrityFilter } from "./src/filters/validation/data-integrity.filter";
import { ProductValidationFilter } from "./src/filters/validation/product-validation.filter";
import { MembershipDiscountFilter } from "./src/filters/pricing/membership-calculation.filter";
import { PriceCalculationFilter } from "./src/filters/pricing/price-calculation.filter";
import { TaxCalculationFilter } from "./src/filters/pricing/tax-calculation.filter";
import { VolumeDiscountFilter } from "./src/filters/pricing/volume-discount.filter";
import errorHandler from "./src/middleware/error-handler";
dotenv.config();
const port = process.env.PORT || 3000;

const validationPipeline = new OrderProcessingPipeline();
validationPipeline.addFilter(new CustomerValidationFilter());
validationPipeline.addFilter(new DataIntegrityFilter());
validationPipeline.addFilter(new ProductValidationFilter());

const pricingPipeline = new OrderProcessingPipeline();
pricingPipeline.addFilter(new MembershipDiscountFilter());
pricingPipeline.addFilter(new PriceCalculationFilter());
pricingPipeline.addFilter(new TaxCalculationFilter());
pricingPipeline.addFilter(new VolumeDiscountFilter());

const orderService = new OrderService(validationPipeline, pricingPipeline);

const app = express();
app.use(express.json());

app.use("/orders", orderRoutes(orderService));
app.use("/pipeline", pipelineRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server listening on port 3000");
});
