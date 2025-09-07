// src/repositories/pipeline-config.repository.ts
import { MembershipDiscountFilter } from "../filters/pricing/membership-calculation.filter";
import { PriceCalculationFilter } from "../filters/pricing/price-calculation.filter";
import { TaxCalculationFilter } from "../filters/pricing/tax-calculation.filter";
import { VolumeDiscountFilter } from "../filters/pricing/volume-discount.filter";
import { CustomerValidationFilter } from "../filters/validation/customer-validation.filter";
import { DataIntegrityFilter } from "../filters/validation/data-integrity.filter";
import { ProductValidationFilter } from "../filters/validation/product-validation.filter";
import PipelineConfig from "../pipelines/pipeline-config";

// A simple in-memory store for demonstration
var config: PipelineConfig = {
  enabledFilters: [
    new CustomerValidationFilter().name,
    new DataIntegrityFilter().name,
    new ProductValidationFilter().name,
    // new PriceCalculationFilter().name,
    // new MembershipDiscountFilter().name,
    // new VolumeDiscountFilter().name,
    // new TaxCalculationFilter().name,
  ],
};

export const PipelineConfigRepository = {
  get(): PipelineConfig {
    // In a real app, this would fetch from a database or file
    return config;
  },

  update(newConfig: PipelineConfig): void {
    // Aquí se corrige el problema: solo se actualiza la propiedad enabledFilters
    if (newConfig.enabledFilters) {
      config.enabledFilters = newConfig.enabledFilters;
    }
  },
};
