import OrderFilter from "../filters/order.filter";
import { MembershipDiscountFilter } from "../filters/pricing/membership-calculation.filter";
import { PriceCalculationFilter } from "../filters/pricing/price-calculation.filter";
import { TaxCalculationFilter } from "../filters/pricing/tax-calculation.filter";
import { VolumeDiscountFilter } from "../filters/pricing/volume-discount.filter";
import { CustomerValidationFilter } from "../filters/validation/customer-validation.filter";
import { DataIntegrityFilter } from "../filters/validation/data-integrity.filter";
import { ProductValidationFilter } from "../filters/validation/product-validation.filter";

const filters: OrderFilter[] = [
  new CustomerValidationFilter(),
  new DataIntegrityFilter(),
  new ProductValidationFilter(),
  new PriceCalculationFilter(),
  new MembershipDiscountFilter(),
  new VolumeDiscountFilter(),
  new TaxCalculationFilter(),
];

export const PipelineFiltersRepository = {
  get(): OrderFilter[] {
    // In a real app, this would fetch from a database or file
    return filters;
  },
  exists(filterName: string): boolean {
    return filters.some((f) => f.name == filterName);
  },
};
